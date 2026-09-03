<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Airport Runways Live sitemap</title>
        <style>
          body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #0a1f44; color: #f5f7fa; }
          .wrap { max-width: 920px; margin: 0 auto; padding: 32px 20px 64px; }
          h1 { font-size: 1.6rem; margin: 0 0 8px; }
          p { color: #8a97ab; }
          a { color: #e8a317; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid rgba(232,163,23,0.18); font-size: 0.95rem; }
          th { color: #8a97ab; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Airport Runways Live sitemap</h1>
          <xsl:choose>
            <xsl:when test="sm:sitemapindex">
              <p>Index of <xsl:value-of select="count(sm:sitemapindex/sm:sitemap)"/> sitemap file(s).</p>
              <table>
                <tr><th>Sitemap</th></tr>
                <xsl:for-each select="sm:sitemapindex/sm:sitemap">
                  <tr><td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td></tr>
                </xsl:for-each>
              </table>
            </xsl:when>
            <xsl:otherwise>
              <p><xsl:value-of select="count(sm:urlset/sm:url)"/> pages on the board.</p>
              <table>
                <tr><th>URL</th></tr>
                <xsl:for-each select="sm:urlset/sm:url">
                  <tr><td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td></tr>
                </xsl:for-each>
              </table>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
