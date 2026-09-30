import test from 'node:test';
import assert from 'node:assert';
import { sanitizeAndValidateTwitterUrl } from '../services/downloader/ytDlpService.js';

test('URL Validation - Valid X and Twitter status URLs', () => {
  const validUrls = [
    'https://x.com/SpaceX/status/1789456123456789012',
    'https://www.x.com/user/status/1234567890',
    'https://twitter.com/NASA/status/1890123456789012345',
    'https://mobile.twitter.com/handle_123/status/9999999999',
  ];

  for (const url of validUrls) {
    const result = sanitizeAndValidateTwitterUrl(url);
    assert.strictEqual(result.isValid, true, `Should accept valid URL: ${url}`);
    assert.ok(result.parsedUrl, `Should provide parsed URL for: ${url}`);
  }
});

test('URL Validation - Reject non-Twitter domains', () => {
  const invalidHosts = [
    'https://google.com/status/123456',
    'https://facebook.com/user/status/123456',
    'https://instagram.com/p/123456',
    'https://evil-x.com/user/status/123456',
    'https://notx.com/status/123456',
  ];

  for (const url of invalidHosts) {
    const result = sanitizeAndValidateTwitterUrl(url);
    assert.strictEqual(result.isValid, false, `Should reject unsupported domain: ${url}`);
    assert.ok(result.error?.includes('Host not supported'));
  }
});

test('URL Validation - SSRF protection (private IPs & localhost)', () => {
  const ssrfUrls = [
    'http://localhost/user/status/123456',
    'http://127.0.0.1/user/status/123456',
    'http://192.168.1.1/user/status/123456',
    'http://10.0.0.1/user/status/123456',
    'http://169.254.169.254/latest/meta-data',
  ];

  for (const url of ssrfUrls) {
    const result = sanitizeAndValidateTwitterUrl(url);
    assert.strictEqual(result.isValid, false, `Should reject SSRF target: ${url}`);
  }
});

test('URL Validation - Reject invalid schemes or malformed paths', () => {
  const malformed = [
    'ftp://x.com/user/status/123456',
    'file:///etc/passwd',
    'javascript:alert(1)',
    'https://x.com/',
    'https://x.com/home',
    '',
  ];

  for (const url of malformed) {
    const result = sanitizeAndValidateTwitterUrl(url);
    assert.strictEqual(result.isValid, false, `Should reject malformed input: ${url}`);
  }
});
