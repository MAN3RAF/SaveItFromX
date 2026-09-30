import { Request, Response } from 'express';
import { sanitizeAndValidateTwitterUrl, extractMediaInfo, streamMediaDownload } from '../services/downloader/ytDlpService.js';
import { query } from '../services/db/client.js';

export async function handleGetMediaInfo(req: Request, res: Response) {
  const { url } = req.body;

  const validation = sanitizeAndValidateTwitterUrl(url);
  if (!validation.isValid || !validation.parsedUrl) {
    res.status(400).json({
      error: {
        code: 'INVALID_URL',
        message: validation.error || 'Invalid X post link.',
      },
    });
    return;
  }

  try {
    const details = await extractMediaInfo(validation.parsedUrl.toString());
    res.json({ success: true, data: details });
  } catch (err: any) {
    res.status(500).json({
      error: {
        code: 'EXTRACTION_FAILED',
        message: err?.message || 'Failed to extract video details.',
      },
    });
  }
}

export async function handleDownloadMedia(req: Request, res: Response) {
  const url = (req.query.url as string) || (req.body?.url as string);
  const format = (req.query.format as string) === 'mp3' ? 'mp3' : 'mp4';
  const quality = (req.query.quality as string) || '1080p';

  const validation = sanitizeAndValidateTwitterUrl(url);
  if (!validation.isValid || !validation.parsedUrl) {
    res.status(400).json({
      error: {
        code: 'INVALID_URL',
        message: validation.error || 'Invalid X post link.',
      },
    });
    return;
  }

  const startTime = Date.now();
  try {
    await streamMediaDownload(validation.parsedUrl.toString(), format, quality, res);

    // Record anonymous event
    const durationMs = Date.now() - startTime;
    const ua = req.headers['user-agent'] || '';
    const device = /iPhone|iPad/i.test(ua) ? 'ios' : /Android/i.test(ua) ? 'android' : 'desktop';

    try {
      await query(
        `INSERT INTO download_events (format, quality, duration_ms, device_category, status)
         VALUES ($1, $2, $3, $4, 'completed')`,
        [format, quality, durationMs, device]
      );
    } catch {
      // Non-blocking
    }
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({
        error: {
          code: 'DOWNLOAD_FAILED',
          message: err?.message || 'Could not stream download.',
        },
      });
    }
  }
}
