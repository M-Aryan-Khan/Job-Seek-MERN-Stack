import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    aboutYou: { type: String, default: "" },
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
    hiredJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
  },
  { timestamps: true }
);


export const Employee = mongoose.model("Employee", employeeSchema);
