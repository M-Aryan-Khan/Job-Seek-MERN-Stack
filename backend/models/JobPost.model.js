import mongoose from "mongoose";

const JobPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    jobType: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "HR" },
    appliedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    acceptedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    description: { type: String, required: true },
    requirements: { type: [String], required: true },
    salary: { type: String, default: "" },
    jobStatus: { type: String, default: 'open' }
  },
  { timestamps: true }
);

export const Post = mongoose.model("JobPost", JobPostSchema);