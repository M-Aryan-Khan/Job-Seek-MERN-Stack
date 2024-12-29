import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/employee.route.js";
import hrRoute from "./routes/hr.route.js"
import postRoute from "./routes/jobpost.route.js"

dotenv.config({});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "I am backend",
    success: true,
  });
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/user", hrRoute);
app.use("/api/v1/user", postRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
