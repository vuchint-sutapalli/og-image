import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border p-4 rounded">
            <Link
              to={`/post/${post.id}`}
              className="text-xl text-blue-500 hover:text-blue-700"
            >
              {post.title}
            </Link>
            <p className="text-gray-600 mt-2">
              {post.content.substring(0, 100)}...
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
