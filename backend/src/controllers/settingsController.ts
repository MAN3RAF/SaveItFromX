import { Request, Response } from 'express';
import { query } from '../services/db/client.js';
import { SiteSettings, AdSlotConfig } from '../types/index.js';

const defaultSettings: SiteSettings = {
  siteName: 'SaveItFromX',
  heroHeading: 'Twitter Video Downloader (X Downloader)',
  heroDescription:
    'Download X (Twitter) videos and MP3 audio in Full HD 1080p, 720p, and 320kbps. Free, fast, and works seamlessly across all devices.',
  announcementText: '',
  announcementEnabled: false,
  maintenanceMode: false,
  downloadsEnabled: true,
  footerText: '© 2018–2026 SaveItFromX. All rights reserved.',
};

const defaultAds: AdSlotConfig[] = [
  { position: 'homepage_top', enabled: false, provider: 'direct', responsive: true },
  { position: 'below_downloader', enabled: false, provider: 'direct', responsive: true },
  { position: 'download_result', enabled: false, provider: 'direct', responsive: true },
  { position: 'footer', enabled: false, provider: 'direct', responsive: true },
];

export async function handleGetPublicSettings(_req: Request, res: Response) {
  try {
    const settingsRows = await query<any>(`SELECT * FROM site_settings WHERE id = 'current' LIMIT 1`);
    const adRows = await query<any>(`SELECT position, enabled, provider, client_id, slot_id, responsive FROM ad_slots`);

    const settings = settingsRows.length > 0 ? {
      siteName: settingsRows[0].site_name,
      heroHeading: settingsRows[0].hero_heading,
      heroDescription: settingsRows[0].hero_description,
      announcementText: settingsRows[0].announcement_text || '',
      announcementEnabled: Boolean(settingsRows[0].announcement_enabled),
      maintenanceMode: Boolean(settingsRows[0].maintenance_mode),
      downloadsEnabled: Boolean(settingsRows[0].downloads_enabled),
      footerText: settingsRows[0].footer_text,
    } : defaultSettings;

    const ads = adRows.length > 0 ? adRows.map((r) => ({
      position: r.position,
      enabled: Boolean(r.enabled),
      provider: r.provider,
      clientId: r.client_id,
      slotId: r.slot_id,
      responsive: Boolean(r.responsive),
    })) : defaultAds;

    res.json({ settings, ads });
  } catch {
    res.json({ settings: defaultSettings, ads: defaultAds });
  }
}

export async function handleGetAdminSettings(_req: Request, res: Response) {
  try {
    const rows = await query<any>(`SELECT * FROM site_settings WHERE id = 'current' LIMIT 1`);
    if (rows.length > 0) {
      res.json({ success: true, settings: rows[0] });
    } else {
      res.json({ success: true, settings: defaultSettings });
    }
  } catch (err: any) {
    res.status(500).json({ error: { code: 'SETTINGS_ERROR', message: err?.message } });
  }
}

export async function handleUpdateAdminSettings(req: Request, res: Response) {
  const {
    siteName,
    heroHeading,
    heroDescription,
    announcementText,
    announcementEnabled,
    maintenanceMode,
    downloadsEnabled,
    footerText,
  } = req.body;

  try {
    await query(
      `INSERT INTO site_settings (
        id, site_name, hero_heading, hero_description, announcement_text,
        announcement_enabled, maintenance_mode, downloads_enabled, footer_text, updated_at
      ) VALUES ('current', $1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (id) DO UPDATE SET
        site_name = EXCLUDED.site_name,
        hero_heading = EXCLUDED.hero_heading,
        hero_description = EXCLUDED.hero_description,
        announcement_text = EXCLUDED.announcement_text,
        announcement_enabled = EXCLUDED.announcement_enabled,
        maintenance_mode = EXCLUDED.maintenance_mode,
        downloads_enabled = EXCLUDED.downloads_enabled,
        footer_text = EXCLUDED.footer_text,
        updated_at = NOW()`,
      [
        siteName || 'SaveItFromX',
        heroHeading,
        heroDescription,
        announcementText || '',
        Boolean(announcementEnabled),
        Boolean(maintenanceMode),
        Boolean(downloadsEnabled),
        footerText,
      ]
    );

    res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'UPDATE_FAILED', message: err?.message } });
  }
}

export async function handleGetAdminAds(_req: Request, res: Response) {
  try {
    const rows = await query<any>(`SELECT * FROM ad_slots ORDER BY position ASC`);
    res.json({ success: true, ads: rows.length > 0 ? rows : defaultAds });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'ADS_ERROR', message: err?.message } });
  }
}

export async function handleUpdateAdminAds(req: Request, res: Response) {
  const { ads } = req.body;
  if (!Array.isArray(ads)) {
    res.status(400).json({ error: { code: 'INVALID_PAYLOAD', message: 'ads array expected.' } });
    return;
  }

  try {
    for (const ad of ads) {
      await query(
        `INSERT INTO ad_slots (position, enabled, provider, client_id, slot_id, responsive, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (position) DO UPDATE SET
           enabled = EXCLUDED.enabled,
           provider = EXCLUDED.provider,
           client_id = EXCLUDED.client_id,
           slot_id = EXCLUDED.slot_id,
           responsive = EXCLUDED.responsive,
           updated_at = NOW()`,
        [ad.position, Boolean(ad.enabled), ad.provider || 'direct', ad.clientId || null, ad.slotId || null, Boolean(ad.responsive)]
      );
    }
    res.json({ success: true, message: 'Ad configurations updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'UPDATE_FAILED', message: err?.message } });
  }
}
