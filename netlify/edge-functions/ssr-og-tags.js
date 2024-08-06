// netlify/edge-functions/ssr-og-tags.js
export default async (request, context) => {
  console.log("entered middleware");
  const url = new URL(request.url);

  // Only intercept requests for blog post pages
  if (!url.pathname.startsWith("/post/")) {
    console.log("not a post page");
    return context.next();
  }

  const postId = url.pathname.split("/")[2];

  console.log(`post id ${postId}`);

  try {
    // Fetch the post data from your API
    const r = await fetch(
      `${context.env?.API_URL || "http://localhost:3001"}/api/posts/${postId}`
    );

    if (!r.ok) {
      throw new Error(`API responded with status ${r.status}`);
    }

    const post = await r.json();

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    console.log("data fetched", post);

    const ogImageUrl = `${
      context.env?.API_URL || "http://localhost:3001"
    }/og-images/image-${post.id}.png`;

    //   const ogTags = `
    //   <title>{post.title}</title>
    //   <meta name="description" content={post.content.substring(0, 200)} />
    //   <meta name="twitter:card" content="summary_large_image" />
    //   <meta property="twitter:domain" content={url.href} />
    //   <meta name="twitter:title" content={post.title} />
    //   <meta
    //     name="twitter:description"
    //     content={post.content.substring(0, 200)}
    //   />
    //   <meta
    //     name="twitter:image"
    //     content={ogImageUrl}
    //   />
    //   <meta property="og:title" content="${escapeHtml(post.title)}" />
    //   <meta property="og:description" content="${escapeHtml(
    //     post.content.substring(0, 200)
    //   )}" />
    //   <meta property="og:image" content="${ogImageUrl}" />
    //   <meta property="og:url" content="${url.href}" />
    //   <meta property="og:type" content="article" />
    // `;

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

    console.log(html);

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
