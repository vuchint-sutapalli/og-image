import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  //   const history = useNavigate();
  const navigate = useNavigate();

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const resizedImage = await resizeImage(file);
      setImage(resizedImage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, image }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      navigate(`/post/${data.id}`);

      //   history.push(`/post/${data.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title"
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post content here..."
        className="w-full p-2 border rounded h-40"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full p-2 border rounded"
      />
      {image && (
        <img src={image} alt="Preview" className="mt-2 max-w-full h-auto" />
      )}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Post
      </button>
    </form>
  );
};

export default CreatePost;
