import React, { useState, useEffect } from "react";
import HrNavbar from "./HrNavbar";
import bulb from "../../assests/bulb.png";
import star from "../../assests/star.png";
import clock from "../../assests/clock.png";
import priceTag from "../../assests/price-tag.png";
import JobPostStep from "./JobPostStep";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

export default function HrPostJob() {
  const location = useLocation();
  const { isEdit, jobId } = location.state || {};
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobType, setJobType] = useState("Part-time");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [priceType, setPriceType] = useState("hourly");
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  useEffect(() => {
    const fetchJobPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/post/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          const fetchedPost = res.data.post;
          setPost(fetchedPost);
          setTitle(fetchedPost.title);
          setCompanyName(fetchedPost.companyName);
          setJobType(fetchedPost.jobType);
          setDescription(fetchedPost.description);
          setSalary(fetchedPost.salary.replace(/\/hr$/, ""));
          setSkills(fetchedPost.requirements || []);
          setPriceType(fetchedPost.jobType === "part-time" ? "hourly" : "fixed");
        }
      } catch (error) {
        console.error("Error fetching job post:", error);
      }
    };

    if (isEdit && jobId) {
      fetchJobPost();
    }
  }, [isEdit, jobId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      setSkills([...skills, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const progressPercentage = (step / 5) * 100;

  const handlePriceTypeChange = (type) => {
    setPriceType(type);
    setJobType(type === "hourly" ? "Part-time" : "Full-time");
    setSalary("");
  };

  const handleSubmit = async () => {
    const jobData = {
      title,
      companyName,
      jobType,
      description,
      requirements: skills,
      salary: priceType === "hourly" ? `${salary}/hr` : salary,
      jobStatus: "open",
    };

    try {
      setLoading(true);

      if (isEdit) {
        const res = await axios.put(
          `http://localhost:8000/api/v1/user/post/edit/${jobId}`,
          jobData,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        toast.success(res.data.message);
      } else {
        const res = await axios.post(
          "http://localhost:8000/api/v1/user/post/addpost",
          jobData,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        toast.success(res.data.message);
      }

      navigate("/hr/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HrNavbar />
      <div className="w-[80%] h-24"></div>
      <div className="w-[80%] h-10 bg-gray-100 mx-auto flex items-center rounded-lg">
        <img src={bulb} alt="" className="ml-4" />
        <p className="ml-6">
          Just a reminder when publishing your job post, Think like a freelancer
          what details he needs
        </p>
      </div>
      <div className="pt-20 w-[65%] mx-auto mb-20">
        {step === 1 && (
          <div className="flex">
            <JobPostStep
              stepNumber="1/5"
              stepTitle={isEdit ? "Edit Job" : "Job Post"}
              mainTitle="Let's start with a strong title. Your Company name matters."
              descriptionText="This helps your job post stand out to the right candidates. It’s the first thing they’ll see, so make it count!"
            />
            <div className="w-[7%]"></div>
            <div className="flex flex-col w-[48%] mt-5">
              <p className="font-[500]">Write a title of your job post</p>
              <input
                className="block p-2 border mt-2 w-full rounded-lg"
                placeholder="Enter Job Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="font-[500] mt-4">Write your Company Name</p>
              <input
                className="block p-2 border mt-2 w-full rounded-lg"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <ul className="mt-3 ml-3 font-[500]">
                Example title:
                <li className="ml-3 font-normal">
                  Build responsive WordPress site with booking/payment
                  functionality
                </li>
              </ul>
              <ul className="mt-3 ml-3 font-[500]">
                Example Company names:
                <li className="ml-3 font-normal">Amazon, Google etc.</li>
              </ul>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex">
            <JobPostStep
              stepNumber="2/5"
              stepTitle={isEdit ? "Edit Job" : "Job Post"}
              mainTitle="Start the Description."
              descriptionText="Talent are looking for: Clear expectations about your task or deliverables, The skills required for your work, Good communication, Details about how you or your team like to work"
            />
            <div className="w-[7%]"></div>
            <div className="flex flex-col w-[48%] mt-5">
              <p className="font-[500]">Describe what you need?</p>
              <textarea
                className="block p-2 border mt-4 w-full rounded-lg"
                rows="8"
                placeholder="Enter Job Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="mt-6">Need Help?</p>
              <a
                href="https://support.upwork.com/hc/en-us/articles/211063408-Post-a-job#description"
                className="text-[#5cb5c7] font-semibold underline"
                target="_blank"
              >
                See examples from upwork
              </a>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex">
            <JobPostStep
              stepNumber="3/5"
              stepTitle={isEdit ? "Edit Job" : "Job Post"}
              mainTitle="What are the main skills required for your work?"
              descriptionText="This helps us filtering the search for better results."
            />
            <div className="w-[7%]"></div>
            <div className="flex flex-col w-[48%] mt-5">
              <p className="font-[500] text-lg">
                Type the skill below and hit Enter
              </p>
              <input
                className="block p-2 border mt-4 rounded-lg"
                placeholder="Add Skills"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="mt-3 flex gap-3 items-center">
                <img src={star} alt="" className="w-4 h-4" />
                <p className="font-[500] text-md">
                  For better results add at least 3
                </p>
              </div>

              <div className="flex gap-2 mt-4 flex-wrap">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 px-3 py-2 rounded-full flex items-center"
                  >
                    <span className="mr-2 ml-1 text-md">{skill}</span>
                    <button
                      className="text-black hover:text-gray-500 font-bold"
                      onClick={() => removeSkill(skill)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex">
            <JobPostStep
              stepNumber="4/5"
              stepTitle={isEdit ? "Edit Job" : "Job Post"}
              mainTitle="Tell us about your budget?"
              descriptionText="This will help us match you to talent within your range."
            />
            <div className="w-[7%]"></div>
            <div className="flex flex-col w-[48%] mt-5">
              <div className="flex justify-between items-center">
                <div
                  onClick={() => handlePriceTypeChange("hourly")}
                  className={`w-[48%] border-2 h-28 rounded-lg flex justify-center items-center cursor-pointer transition-all duration-200 ease-in-out ${
                    priceType === "hourly"
                      ? "border-[#5cb5c7] border-2 bg-[#f3f2f2]"
                      : ""
                  }`}
                >
                  <div className="w-[80%] h-[80%] ml-2 flex justify-between">
                    <div className="flex flex-col justify-between my-3">
                      <img src={clock} alt="" className="w-5 h-5" />
                      <p>Hourly Rate</p>
                    </div>
                    <div
                      className={`w-6 h-6 border-2 border-black rounded-[50%] transition-all duration-200 ease-in-out ${
                        priceType === "hourly" ? "bg-[#5cb5c7]" : ""
                      }`}
                    ></div>
                  </div>
                </div>
                <div
                  onClick={() => handlePriceTypeChange("fixed")}
                  className={`w-[48%] border-2 h-28 rounded-lg flex justify-center items-center cursor-pointer transition-all duration-200 ease-in-out ${
                    priceType === "fixed"
                      ? "border-[#5cb5c7] border-2 bg-[#f3f2f2]"
                      : ""
                  }`}
                >
                  <div className="w-[80%] h-[80%] ml-2 flex justify-between">
                    <div className="flex flex-col justify-between my-3">
                      <img src={priceTag} alt="" className="w-5 h-5" />
                      <p>Fixed Price</p>
                    </div>
                    <div
                      className={`w-6 h-6 border-2 border-black rounded-[50%] transition-all duration-200 ease-in-out ${
                        priceType === "fixed" ? "bg-[#5cb5c7]" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
              {priceType === "hourly" && (
                <p className="mt-8 font-semibold">
                  Enter the hourly rate price
                </p>
              )}
              {priceType === "fixed" && (
                <p className="mt-8 font-semibold">Enter the fixed price</p>
              )}
              <div className="flex items-center gap-2 mt-3 ">
                <input
                  className="block p-2 border w-[25%] rounded-lg"
                  placeholder="0"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
                {priceType === "hourly" && <span className="text-lg">/hr</span>}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Before setting rate make sure to check the rates online
              </p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex">
            <JobPostStep
              stepNumber="5/5"
              stepTitle={isEdit ? "Edit Job" : "Job Post"}
              mainTitle="Post Your Job."
              descriptionText="Post your job and hunt for best talents out there."
            />
            <div className="flex flex-col w-[48%] mt-8 self-start">
              {loading ? (
                <button
                  className="text-xl border-2 border-[#d6d7dd] bg-[#0187a4] text-white cursor-not-allowed p-4 "
                  disabled
                >
                  Please wait...
                </button>
              ) : (
                <button
                  className="text-xl border-2 hover:border-2 border-[#d6d7dd] hover:border-[#0187a4] hover:bg-[#ffffff] rounded-lg hover:text-[#0f1137] bg-[#0187a4] text-white transition-all duration-500 ease-in-out hover:bg-transparent p-4 "
                  onClick={handleSubmit}
                >
                  {isEdit ? "Update Job" : "Post Job"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg">
        <div className="relative pt-1">
          <div className="overflow-hidden h-1 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${progressPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#5cb5c7] transition-all duration-500"
            />
          </div>
        </div>

        <div className="flex justify-between p-4">
          {step === 1 ? (
            <button
              className="w-24 h-10 ml-5 rounded-lg border-2 border-[#0187a4] text-[#0f1137] hover:bg-[#0187a4] hover:text-white transition-all duration-500 ease-in-out"
              onClick={() => navigate("/hr/dashboard")}
            >
              Cancel
            </button>
          ) : (
            <button
              className={`w-24 h-10 ml-5 rounded-lg  ${
                step === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "border-2 border-[#0187a4] text-[#0f1137] hover:bg-[#0187a4] hover:text-white transition-all duration-500 ease-in-out"
              }`}
              onClick={prevStep}
              disabled={step === 1}
            >
              Back
            </button>
          )}
          <button
            className={`w-24 h-10 ml-5 rounded-lg  ${
              step === 5
                ? "bg-gray-300 cursor-not-allowed"
                : "border-2 hover:border-2 border-[#d6d7dd] hover:border-[#0187a4] hover:bg-[#ffffff] w-24 h-10 rounded-lg hover:text-[#0f1137] bg-[#0187a4] text-white transition-all duration-500 ease-in-out hover:bg-transparent"
            }`}
            onClick={nextStep}
            disabled={step === 5}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
