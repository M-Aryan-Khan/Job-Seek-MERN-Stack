import mongoose from "mongoose";

const hrSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    about: { type: String, default: "" },
    Posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
  },
  { timestamps: true }
);

export const HR = mongoose.model("HR", hrSchema);
