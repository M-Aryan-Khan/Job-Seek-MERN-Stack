import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assests/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resEmp = await axios.post(
        "http://localhost:8000/api/v1/user/emp/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(resEmp.data.message);
      navigate("/dashboard");
      setInput({ email: "", password: "" });
    } catch (error) {
      console.log("Employee login failed, trying HR login...");
      try {
        const resHR = await axios.post(
          "http://localhost:8000/api/v1/user/hr/login",
          input,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        toast.success(resHR.data.message);
        navigate("/hr/dashboard");
        setInput({ email: "", password: "" });
      } catch (errorHR) {
        console.log(errorHR);
        if (errorHR.response && errorHR.response.data) {
          toast.error(errorHR.response.data.message);
        } else {
          toast.error("Login failed. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-[#d6d7dd]">
      <form
        onSubmit={loginHandler}
        className="shadow-[0_30px_30px_rgba(0,0,0,0.25)] flex flex-col gap-5 p-8 w-[25%] bg-[#ececef] rounded-xl"
      >
        <div className="my-2 mb-2 flex flex-col items-center">
          <img src={Logo} alt="logo" className="w-12 self-center mb-2" />
          <p className="text-sm text-center">
            <b className="text-[#0187a4]">Login Now</b> to start your{" "}
            <b className="text-[#0187a4]">Career</b> or hire{" "}
            <b className="text-[#0187a4]">Talent</b>
          </p>
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
          >
            Login
          </button>
        )}
        <span className="text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
