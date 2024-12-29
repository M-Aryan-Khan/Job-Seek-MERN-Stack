import React, { useState, useRef, useEffect } from "react";
import Logo from "../../assests/logo.png";
import account from "../../assests/account.png";
import heart from "../../assests/heart.png";
import questions from "../../assests/question.png";
import edit from "../../assests/edit.png";
import logout from "../../assests/log-out.png";
import down from "../../assests/down.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function HrNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);
  const [talentsDropdownOpen, setTalentsDropdownOpen] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [showSavedTooltip, setShowSavedTooltip] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
        const res = await axios.get('http://localhost:8000/api/v1/user/hr/logout', { withCredentials: true });
        if (res.data.success) {
            navigate("/login");
            toast.success(res.data.message);
        }
    } catch (error) {
        toast.error(error.response.data.message);
    }
}

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="h-16 w-full flex items-center justify-center text-[#0f1137] fixed bg-[#ffffff] border-b-2 z-20">
      <div className="h-12 w-[95%] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="m-2 flex items-center justify-center cursor-default">
            <img src={Logo} alt="" className="w-10 self-center" />
            <span className="font-semibold text-xl">Job </span>
            <span className="font-semibold text-xl text-[#0187a4]">Seek</span>
          </button>

          <div
            className="relative flex items-center justify-center cursor-pointer gap-1"
            onMouseEnter={() => setJobsDropdownOpen(true)}
            onMouseLeave={() => setJobsDropdownOpen(false)}
          >
            <p className="py-2">Jobs</p>
            <img src={down} alt="down" className="w-4 h-4 mt-[0.15rem]" />
            {jobsDropdownOpen && (
              <div className="absolute top-10 bg-white text-gray-900 text-md rounded-md shadow-[0_4px_10px_rgba(0,0,0,0.25)] z-30 left-[-20%] w-32">
                <ul className="p-3">
                  <li className="py-1 my-1 hover:text-[#0187a4] cursor-pointer">
                    Post a Job
                  </li>
                  <hr className="w-[95%]"/>
                  <li className="py-1 my-1 hover:text-[#0187a4] cursor-pointer">
                    My Jobs
                  </li>
                  <hr className="w-[95%]"/>
                  <li className="py-1 my-1 hover:text-[#0187a4] cursor-pointer">
                    Saved Jobs
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div
            className="relative flex items-center justify-center cursor-pointer gap-1"
            onMouseEnter={() => setTalentsDropdownOpen(true)}
            onMouseLeave={() => setTalentsDropdownOpen(false)}
          >
            <p className="py-2">Talents</p>
            <img src={down} alt="down" className="w-4 h-4 mt-[0.15rem]" />
            {talentsDropdownOpen && (
              <div className="absolute top-10 bg-white text-gray-800 text-md rounded-md shadow-[0_4px_10px_rgba(0,0,0,0.25)] z-30 left-[-20%] w-32 ">
              <ul className="p-3">
                <li className="py-1 my-1 hover:text-[#0187a4] cursor-pointer">
                    Discover
                    </li>
                  <hr className="w-[95%]"/>
                  <li className="py-1 my-1 hover:text-[#0187a4] cursor-pointer">
                    Your Hires
                    </li>
                  <hr className="w-[95%]"/>
                  <li className="py-1 my-1 hover:text-[#0187a4] cursor-pointer">
                    Saved Talent
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="m-2 gap-7 flex font-semibold relative items-center">
          <div className="relative flex items-center">
            <img
              src={questions}
              alt="Help & Support"
              className="w-5 h-5 cursor-pointer"
              onMouseEnter={() => setShowHelpTooltip(true)}
              onMouseLeave={() => setShowHelpTooltip(false)}
            />
            {showHelpTooltip && (
              <div className="absolute top-8 left-[-30px] bg-white text-gray-800 text-md rounded-md h-10 py-1 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
                <p className="px-3 whitespace-nowrap">Help</p>
              </div>
            )}
          </div>

          <div className="relative flex items-center">
            <img
              src={heart}
              alt="Saved Talent"
              className="w-5 h-5 cursor-pointer"
              onMouseEnter={() => setShowSavedTooltip(true)}
              onMouseLeave={() => setShowSavedTooltip(false)}
            />
            {showSavedTooltip && (
              <div className="absolute top-8 left-[-70px] bg-white text-gray-800 text-md rounded-md h-10 py-1 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
                <p className="px-3 whitespace-nowrap">Saved Talent</p>
              </div>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <img
              src={account}
              alt="Account"
              className="w-7 h-7 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">
                <div className="my-6 flex items-center justify-center">
                  <p>M. Aryan Khan</p>
                </div>
                <ul className="pb-2 text-gray-700 flex flex-col items-center justify-center">
                  <hr className="w-[75%] m-auto" />
                  <li className="my-2 px-4 py-2 hover:text-[#0187a4] cursor-pointer flex justify-start items-center gap-4 w-[90%]">
                    <img src={account} className="w-6"></img>
                    <a>My Profile</a>
                  </li>
                  <hr className="w-[75%] m-auto" />
                  <li className="my-2 px-4 py-2 hover:text-[#0187a4] cursor-pointer flex justify-start items-center gap-4 w-[90%]">
                    <img src={edit} className="w-6"></img>
                    <a>Settings</a>
                  </li>
                  <hr className="w-[75%] m-auto" />
                  <li className="my-2 px-4 py-2 hover:text-[#0187a4] cursor-pointer flex justify-start items-center gap-4 w-[90%]" onClick={logoutHandler}>
                    <img src={logout} className="w-6"></img>
                    <a className="">Logout</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
