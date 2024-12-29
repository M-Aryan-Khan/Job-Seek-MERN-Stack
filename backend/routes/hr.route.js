import express from "express";
import { editProfile, getProfile, login, logout, register } from "../controllers/hr.controller.js";
import isAuthenticated from "../middlewares/iaAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/hr/register').post(register);
router.route('/hr/login').post(login);
router.route('/hr/logout').get(logout);
router.route('/hr/:id/profile').get(isAuthenticated, getProfile);
router.route('/hr/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);

export default router;