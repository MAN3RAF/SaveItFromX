import { seoService } from './seoService.js';

export const CHUNK_SIZE = 500;
export const BASE_URL = 'https://www.saveitfromx.com';

class SitemapService {
  private todayIsoDate: string;

  constructor() {
    this.todayIsoDate = new Date().toISOString().split('T')[0];
  }

  public getSubSitemapCount(): number {
    const totalSlugs = seoService.getTotalPagesCount();
    return Math.max(1, Math.ceil(totalSlugs / CHUNK_SIZE));
  }

  public generateSitemapIndexXml(): string {
    const totalCount = this.getSubSitemapCount();
    let sitemapNodes = '';

    for (let i = 1; i <= totalCount; i++) {
      sitemapNodes += `  <sitemap>
    <loc>${BASE_URL}/sitemap_${i}.xml</loc>
    <lastmod>${this.todayIsoDate}</lastmod>
  </sitemap>\n`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapNodes}</sitemapindex>`;
  }

  public generateSubSitemapXml(sitemapNumber: number): string {
    const allSlugs = seoService.getAllSlugs();
    const startIndex = (sitemapNumber - 1) * CHUNK_SIZE;
    const endIndex = Math.min(startIndex + CHUNK_SIZE, allSlugs.length);
    const chunkSlugs = allSlugs.slice(startIndex, endIndex);

    let urlsXml = '';
    if (sitemapNumber === 1) {
      urlsXml += `  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${this.todayIsoDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`;
    }

    urlsXml += chunkSlugs
      .map(
        (slug) => `  <url>
    <loc>${BASE_URL}/page/${slug}</loc>
    <lastmod>${this.todayIsoDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  }

  public generateRobotsTxt(): string {
    return `# Robots.txt for SaveItFromX
User-agent: *
Allow: /
Allow: /page/
Disallow: /api/admin/
Disallow: /secretadmin2026here

Sitemap: ${BASE_URL}/sitemap.xml
`;
  }
}

export const sitemapService = new SitemapService();
