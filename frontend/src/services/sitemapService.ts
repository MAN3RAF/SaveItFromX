import { seoService } from './seoService';
import { SitemapSubIndex } from '../types';

export const CHUNK_SIZE = 500;
export const BASE_URL = 'https://www.saveitfromx.com';

class SitemapService {
  private todayIsoDate: string;

  constructor() {
    this.todayIsoDate = new Date().toISOString().split('T')[0];
  }

  public getSubSitemapCount(): number {
    const totalSlugs = seoService.getTotalPagesCount();
    return Math.ceil(totalSlugs / CHUNK_SIZE);
  }

  public getSubSitemapsMetadata(): SitemapSubIndex[] {
    const totalCount = this.getSubSitemapCount();
    const allSlugs = seoService.getAllSlugs();
    const result: SitemapSubIndex[] = [];

    for (let i = 1; i <= totalCount; i++) {
      const startIndex = (i - 1) * CHUNK_SIZE;
      const endIndex = Math.min(startIndex + CHUNK_SIZE, allSlugs.length);
      const chunkSlugs = allSlugs.slice(startIndex, endIndex);

      result.push({
        id: i,
        filename: `sitemap_${i}.xml`,
        url: `${BASE_URL}/sitemap_${i}.xml`,
        pageCount: chunkSlugs.length,
        sampleUrls: chunkSlugs.slice(0, 3).map((slug) => `${BASE_URL}/page/${slug}`),
        lastmod: this.todayIsoDate,
      });
    }

    return result;
  }

  public generateSitemapIndexXml(): string {
    const subMaps = this.getSubSitemapsMetadata();

    const sitemapNodes = subMaps
      .map(
        (sm) => `  <sitemap>
    <loc>${sm.url}</loc>
    <lastmod>${sm.lastmod}</lastmod>
  </sitemap>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- SaveItFromX pSEO Sitemap Index for Web Crawlers -->
${sitemapNodes}
</sitemapindex>`;
  }

  public generateSubSitemapXml(sitemapNumber: number): string {
    const allSlugs = seoService.getAllSlugs();
    const startIndex = (sitemapNumber - 1) * CHUNK_SIZE;

    if (startIndex < 0 || startIndex >= allSlugs.length) {
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Empty or out of range sub-sitemap -->
</urlset>`;
    }

    const endIndex = Math.min(startIndex + CHUNK_SIZE, allSlugs.length);
    const chunkSlugs = allSlugs.slice(startIndex, endIndex);

    // If it's sitemap_1, include the root homepage as highest priority
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
      .map((slug) => {
        return `  <url>
    <loc>${BASE_URL}/page/${slug}</loc>
    <lastmod>${this.todayIsoDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- SaveItFromX Sub-Sitemap ${sitemapNumber} of ${this.getSubSitemapCount()} (${chunkSlugs.length} URLs) -->
${urlsXml}
</urlset>`;
  }

  public generateRobotsTxt(): string {
    return `# Robots.txt for SaveItFromX (https://www.saveitfromx.com)
User-agent: *
Allow: /
Allow: /page/
Disallow: /secretadmin2026here
Disallow: /api/admin/

# Programmatic SEO Sitemap Index
Sitemap: ${BASE_URL}/sitemap.xml
`;
  }
}

export const sitemapService = new SitemapService();
