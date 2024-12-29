import { Employee } from "../models/Employee.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {Post} from "../models/JobPost.model.js"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let employee = await Employee.findOne({ email });
        if (employee) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        employee = await Employee.findOne({ username });
        if (employee) {
            return res.status(401).json({
                message: "Username already taken",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await Employee.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, employee.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: employee._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // populate each post if in the posts array
        /*const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )*/
        employee = {
            _id: employee._id,
            username: employee.username,
            email: employee.email,
            profilePicture: employee.profilePicture,
            aboutYou: employee.aboutYou,
            appliedJobs: employee.appliedJobs,
            bookmarks: employee.bookmarks,
        }
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${employee.username}`,
            success: true,
            employee
        });

    } catch (error) {
        console.log(error);
    }
};

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let employee = await Employee.findById(userId).select('-password');;
        return res.status(200).json({
            employee,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { aboutYou } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const employee = await Employee.findById(userId).select('-password');
        if (!employee) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (aboutYou) employee.aboutYou = aboutYou;
        if (profilePicture) employee.profilePicture = cloudResponse.secure_url;

        await employee.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            employee
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
            success: false,
            error: error.message
        });
    }
    
};