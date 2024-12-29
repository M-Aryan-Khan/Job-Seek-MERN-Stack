import React from "react";
import bin from "../../assests/delete.png";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1)
    return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1)
    return interval === 1 ? `${interval} month ago` : `${interval} months ago`;
  interval = Math.floor(seconds / 604800);
  if (interval >= 1)
    return interval === 1 ? `${interval} week ago` : `${interval} weeks ago`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1)
    return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1)
    return interval === 1 ? `${interval} hr ago` : `${interval} hrs ago`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return interval === 1 ? `${interval} min ago` : `${interval} mins ago`;
  return seconds === 1 ? `${seconds} sec ago` : `${seconds} secs ago`;
};

export default function HrPostDisplay({ post, onDelete }) {
  const navigate = useNavigate(); 

  const truncateTitle = (title) => {
    return title.length > 29 ? `${title.slice(0, 29)}...` : title;
  };

  const deleteHandler = async () => {
    console.log("Delete handler called");
    try {
      const token = localStorage.getItem("token"); 
      const res = await axios.delete(
        `http://localhost:8000/api/v1/user/post/delete/${post._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      if (res.data.success) {
        onDelete(post._id);
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong, please try again");
        console.error(error);
      }
    }
  };

  const handleUpdate = () => {
    navigate(`/hr/job/post`, { 
      state: { isEdit: true, jobId: post._id }
    });
  };
  

  return (
    <div className="w-80 h-72 flex justify-center items-center border-2 rounded-xl shadow-[0_5px_5px_rgba(0,0,0,0.25)]">
      <div className="w-[85%] h-[88%]">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <p className="font-bold text-lg">{post.companyName}</p>
            <p className="text-gray-500">{timeSince(post.createdAt)}</p>
          </div>
          <img
            src={bin}
            alt="Delete"
            className="cursor-pointer"
            onClick={deleteHandler}
          />
        </div>

        <div>
          <p className="mt-1 text-gray-800">{post.uploadedBy?.username}</p>
        </div>
        <div className="h-14">
          <p className="mt-3 font-bold text-2xl">{truncateTitle(post.title)}</p>
        </div>
        <div className="mt-3 bg-gray-300 inline-block rounded-lg">
          <p className="px-3 py-2 font-semibold">{post.jobType}</p>
        </div>
        <hr className="mt-7" />
        <div className="mt-2 flex justify-between items-center">
          <p className="px-3 py-2 font-semibold text-lg">{`$${post.salary}`}</p>
          <button
            className="px-3 py-2 border-2 hover:border-2 border-[#ffffff] hover:border-[#0187a4] hover:bg-[#ffffff] hover:text-[#0f1137] bg-[#0187a4] text-white rounded-lg transition-all duration-200 ease-in-out"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
