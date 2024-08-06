import { useState, useEffect } from "react";
import "./PostPage.css";

// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Image } from "lucide-react";

const PostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [ogImage, setOgImage] = useState("");

  useEffect(() => {
    // Generate OG image when title or content changes
    if (title && content && image) {
      generateOgImage();
    }
  }, [title, content, image]);

  const generateOgImage = async () => {
    try {
      const response = await fetch("http://localhost:3001/generate-og-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          imageUrl: image,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate OG image");
      }

      const data = await response.json();
      setOgImage(data.imageUrl);

      // Update meta tags
      updateMetaTags(data.imageUrl);
    } catch (error) {
      console.error("Error generating OG image:", error);
    }
  };

  //   const generateOgImage = () => {
  //     // This is a placeholder for the actual OG image generation
  //     // In a real implementation, this would call an API to generate the image
  //     const mockOgImage = `https://example.com/og-image/${encodeURIComponent(
  //       title
  //     )}.png`;
  //     setOgImage(mockOgImage);

  //     // Update meta tags
  //     updateMetaTags(mockOgImage);
  //   };

  const updateMetaTags = (imageUrl) => {
    // Update og:image meta tag
    let metaOgImage = document.querySelector('meta[property="og:image"]');
    if (!metaOgImage) {
      metaOgImage = document.createElement("meta");
      metaOgImage.setAttribute("property", "og:image");
      document.head.appendChild(metaOgImage);
    }
    metaOgImage.setAttribute("content", imageUrl);

    // Update other relevant meta tags
    updateMetaTag("og:title", title);
    updateMetaTag("og:description", content.substring(0, 200));
  };

  const updateMetaTag = (property, content) => {
    let metaTag = document.querySelector(`meta[property="${property}"]`);
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("property", property);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", content);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center p-8 bg-gray-100 min-h-screen">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
        <input
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Write your post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[200px] mb-4 p-2 border border-gray-300 rounded resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            id="imageUpload"
            className="hidden"
          />
          <label
            htmlFor="imageUpload"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition duration-200"
          >
            Upload Image
          </label>
        </div>
        {ogImage && (
          <img
            src={`http://localhost:3001${ogImage}`}
            alt="Uploaded"
            className="max-w-full h-auto mb-4 rounded"
          />
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            OG Image: {ogImage ? "Generated" : "Not generated"}
          </span>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">
            Publish Post
          </button>
        </div>
      </div>
    </div>
    // <Card className="w-full max-w-2xl mx-auto mt-8">
    //   <CardHeader>
    //     <Input
    //       type="text"
    //       placeholder="Enter post title"
    //       value={title}
    //       onChange={(e) => setTitle(e.target.value)}
    //       className="text-2xl font-bold mb-4"
    //     />
    //   </CardHeader>
    //   <CardContent>
    //     <Textarea
    //       placeholder="Write your post content here..."
    //       value={content}
    //       onChange={(e) => setContent(e.target.value)}
    //       className="min-h-[200px] mb-4"
    //     />
    //     <div className="flex items-center space-x-2">
    //       <Button
    //         onClick={() => document.getElementById("imageUpload").click()}
    //       >
    //         <Image className="mr-2 h-4 w-4" /> Upload Image
    //       </Button>
    //       <input
    //         id="imageUpload"
    //         type="file"
    //         accept="image/*"
    //         onChange={handleImageUpload}
    //         className="hidden"
    //       />
    //     </div>
    //     {image && (
    //       <img src={image} alt="Uploaded" className="mt-4 max-w-full h-auto" />
    //     )}
    //   </CardContent>
    //   <CardFooter className="flex justify-between">
    //     <span className="text-sm text-gray-500">
    //       OG Image: {ogImage ? "Generated" : "Not generated"}
    //     </span>
    //     <Button>Publish Post</Button>
    //   </CardFooter>
    // </Card>
  );
};

export default PostPage;
