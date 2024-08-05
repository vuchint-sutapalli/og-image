import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

const PostView = () => {
  console.log("hereeeeeeeeeeeeeeeeeeeeeee");
  const [post, setPost] = useState(null);
  const { id } = useParams();

  console.log(useParams());

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.content.substring(0, 200)} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={window.location.hostname} />
        <meta
          property="twitter:url"
          content={`https://${window.location.hostname}/post/${post.id}`}
        />
        <meta name="twitter:title" content={post.title} />
        <meta
          name="twitter:description"
          content={post.content.substring(0, 200)}
        />
        <meta
          name="twitter:image"
          content={`http://localhost:3000${post.image}`}
        />

        <meta
          property="og:url"
          content={`https://${window.location.hostname}/post/${post.id}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.content.substring(0, 200)}
        />
        <meta
          property="og:image"
          content={`http://localhost:3000${post.image}`}
        />

        {/* <meta
          property="og:image"
          content={`http://localhost:3000${post.image}`}
        />
        <meta
          property="og:url"
          content={`https://${window.location.hostname}/post/${post.id}`}
        />
        <meta property="og:type" content="article" /> */}
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <img
        src={`http://localhost:3000${post.image}`}
        alt={post.title}
        className="mb-4 max-w-full h-auto"
      />
      <div className="prose">{post.content}</div>
    </div>
  );
};

export default PostView;
