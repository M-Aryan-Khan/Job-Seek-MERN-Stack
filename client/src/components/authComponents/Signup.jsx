import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assests/logo.png";
import Freelancer from "../../assests/Freelancer.png";
import HR from "../../assests/HR.png";

const Signup = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); 

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const endpoint = selectedRole === "freelancer"
        ? "http://localhost:8000/api/v1/user/emp/register"
        : "http://localhost:8000/api/v1/user/hr/register";

      const res = await axios.post(endpoint, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      toast.success(res.data.message);
      setInput({
        username: "",
        email: "",
        password: "",
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-[#d6d7dd]">
      <div className="w-full flex justify-center items-center">
        <div className="h-[31rem] w-96 bg-[#ececef] p-8 flex flex-col justify-center items-center border-r-2 border-[#0187a4] gap-6">
          <p className="font-semibold">Join as a <b className="text-[#0187a4]">Client</b> or <b className="text-[#0187a4]">Freelancer</b></p>
          
          <div
            onClick={() => setSelectedRole("freelancer")}
            className={`flex flex-col justify-between items-center w-[90%] p-4 cursor-pointer border-2 
              ${selectedRole === "freelancer" ? "border-[#0187a4]" : "border-gray-300"}`}
          >
            <img src={Freelancer} alt="Freelancer" className="w-40 self-center" />
            <p className="font-semibold">Freelancer</p>
          </div>
          
          <div
            onClick={() => setSelectedRole("client")}
            className={`flex flex-col justify-between items-center w-[90%] p-4 cursor-pointer border-2 
              ${selectedRole === "client" ? "border-[#0187a4]" : "border-gray-300"}`}
          >
            <img src={HR} alt="Client" className="w-40 self-center" />
            <p className="font-semibold">Client</p>
          </div>
        </div>

        <form
          onSubmit={signupHandler}
          className="shadow-lg flex flex-col gap-5 p-8 sm:w-[25%] bg-[#ececef] border-l-2 border-[#0187a4]"
        >
          <div className="my-2 mb-2 flex flex-col items-center">
            <img src={Logo} alt="logo" className="w-12 self-center mb-2" />
            <p className="text-sm text-center">
              <b className="text-[#0187a4]">Signup Now</b> to start your <b className="text-[#0187a4]">Career</b> or hire <b className="text-[#0187a4]">Talent</b>
            </p>
          </div>

          <div className="flex flex-col">
            <span className="font-medium">Username</span>
            <input
              type="text"
              name="username"
              value={input.username}
              onChange={changeEventHandler}
              className="ring-1 rounded-sm ring-gray-300 h-7 my-1 pl-1"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-medium">Email</span>
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="ring-1 rounded-sm ring-gray-300 h-7 my-1 pl-1"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-medium">Password</span>
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              className="ring-1 rounded-sm ring-gray-300 h-7 my-1 pl-1"
            />
          </div>

          {loading ? (
            <button className="bg-[#0187a4] text-white h-9 rounded-md">
              Please wait...
            </button>
          ) : (
            <button
              type="submit"
              className="bg-[#0187a4] text-white h-9 rounded-md"
              disabled={!selectedRole} 
            >
              Signup
            </button>
          )}
          
          <span className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
