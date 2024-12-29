import express from "express";
import { editProfile, getProfile, login, logout, register } from "../controllers/Employee.controller.js";
import isAuthenticated from "../middlewares/iaAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/emp/register').post(register);
router.route('/emp/login').post(login);
router.route('/emp/logout').get(logout);
router.route('/emp/:id/profile').get(isAuthenticated, getProfile);
router.route('/emp/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);

export default router;