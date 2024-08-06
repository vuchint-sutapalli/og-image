// netlify/edge-functions/generate-og-image.js
export default async (request) => {
  const { searchParams, href } = new URL(request.url);
  const title = searchParams.get("title") || "Default Title";
  const description = searchParams.get("description") || "Default Description";
  const imageUrl =
    searchParams.get("imageUrl") || "https://example.com/default-image.png";

  const html = `
      <html>
        <head>
        <meta property="og:title" content="${escapeHtml(title)}" />
        <meta property="og:description" content="${escapeHtml(
          description.substring(0, 200)
        )}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${href}" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
          <style>
            body { font-family: Arial, sans-serif; width: 1200px; height: 630px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
            .title { font-size: 48px; font-weight: bold; }
            .description { font-size: 24px; margin-top: 20px; }
            .image { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="title">${title}</div>
          <div class="description">${description}</div>
          <div class="image"><img src="${imageUrl}" alt="OG Image" /></div>
        </body>
      </html>
    `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
};
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
