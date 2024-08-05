import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CreatePost from "./pages/CreatePost";
import PostList from "./pages/PostList";
import PostView from "./pages/PostView";

const App = () => {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-blue-500 hover:text-blue-700">
                Home
              </Link>
            </li>
            <li>
              <Link to="/create" className="text-blue-500 hover:text-blue-700">
                Create Post
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
