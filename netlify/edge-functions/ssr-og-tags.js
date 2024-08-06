// netlify/edge-functions/ssr-og-tags.js
export default async (request, context) => {
  const url = new URL(request.url);

  // Only intercept requests for blog post pages
  if (!url.pathname.startsWith("/post/")) {
    return context.next();
  }

  const postId = url.pathname.split("/")[2];

  try {
    // Fetch the post data from your API
    const r = await fetch(`${context.env.API_URL}/api/posts/${postId}`);

    if (!r.ok) {
      throw new Error(`API responded with status ${r.status}`);
    }

    const post = await r.json();

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    const ogImageUrl = `${context.env.API_URL}/og-image/${post.id}`;

    const ogTags = `
        <meta property="og:title" content="${escapeHtml(post.title)}" />
        <meta property="og:description" content="${escapeHtml(
          post.content.substring(0, 200)
        )}" />
        <meta property="og:image" content="${ogImageUrl}" />
        <meta property="og:url" content="${url.href}" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      `;

    const response = await context.next();
    const html = await response.text();

    const updatedHtml = html.replace("</head>", `${ogTags}</head>`);

    return new Response(updatedHtml, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Error in ssr-og-tags Edge Function:", error);
    return context.next();
  }
};

// Helper function to escape HTML special characters
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
