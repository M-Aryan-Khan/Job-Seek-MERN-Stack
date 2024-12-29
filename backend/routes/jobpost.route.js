import express from "express";
import isAuthenticated from "../middlewares/iaAuthenticated.js";
import {
  addNewPost,
  bookmarkPost,
  deletePost,
  getAllPost,
  getUserPost,
  appliedJobPost,
  editPost,
  getPost,
} from "../controllers/jobpost.controller.js";

const router = express.Router();

router.route("/post/addpost").post(isAuthenticated, addNewPost);
router.route("/post/all").get(isAuthenticated, getAllPost);
router.route("/post/userpost/all").get(isAuthenticated, getUserPost);
router.route("/post/delete/:id").delete(isAuthenticated, deletePost);
router.route("/post/:id/bookmark").get(isAuthenticated, bookmarkPost);
router.route("/post/:id/apliedPosts").get(isAuthenticated, appliedJobPost);
router.route("/post/edit/:id").put(isAuthenticated, editPost);
router.route("/post/:id").get(isAuthenticated, getPost);

export default router;
