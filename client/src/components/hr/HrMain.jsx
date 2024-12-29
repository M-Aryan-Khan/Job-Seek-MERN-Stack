import React, { useState, useEffect } from "react";
import axios from "axios";
import info from "../../assests/info.png";
import plus from "../../assests/plus.png";
import plusBlack from "../../assests/plus-black.png";
import HrPostDisplay from "./HrPostDisplay";
import { Link } from "react-router-dom";

export default function HrMain() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hover, setHover] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/v1/user/post/userpost/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }); 

        if (res.data.success) {
          setPosts(res.data.posts);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  return (
    <div className="pt-28 w-[70%] mx-auto">
      <div className="flex flex-col">
        <div className="flex gap-2 justify-between items-center">
          <div className="self-start flex items-center justify-center gap-2 relative">
            <h1 className="text-3xl font-semibold">Your Jobs</h1>
            <img
              src={info}
              alt="info"
              className="w-6 h-6 cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div
                className="absolute left-44 top-0 bg-white text-gray-800 text-md rounded-md py-1 px-3 shadow-[0_4px_10px_rgba(0,0,0,0.25)] whitespace-nowrap"
              >
                Manage your Posts
              </div>
            )}
          </div>
          <Link to="/hr/job/post">
            <button
              className="border-2 hover:border-2 border-[#ffffff] hover:border-[#0187a4] hover:bg-[#ffffff] text-xl hover:text-[#0f1137] bg-[#0187a4] text-white self-end flex gap-4 justify-center items-center py-2 px-4 rounded-xl transition-all duration-200 ease-in-out"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <img src={hover ? plusBlack : plus} alt="plus-icon" className="w-5 h-5" />
              Post Job
            </button>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap justify-around gap-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <HrPostDisplay key={post._id} post={post} onDelete={handleDelete} />
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
    </div>
  );
}
