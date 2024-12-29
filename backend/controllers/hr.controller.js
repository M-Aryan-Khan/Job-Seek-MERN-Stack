import {HR} from "../models/HR.model.js";
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
        const hr = await HR.findOne({ email });
        if (hr) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await HR.create({
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
        let hr = await HR.findOne({ email });
        if (!hr) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, hr.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: hr._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        const populatedPosts = (
            await Promise.all(
                hr.Posts.map(async (postId) => {
                    const post = await Post.findById(postId);
                    if (post && post.uploadedBy.equals(hr._id)) {
                        return post;
                    }
                    return null;
                })
            )
        ).filter(Boolean);
        
        
        hr = {
            _id: hr._id,
            username: hr.username,
            email: hr.email,
            profilePicture: hr.profilePicture,
            about: hr.about,
            appliedEmployees: hr.appliedEmployees,
            Posts: populatedPosts,
        }
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${hr.username}`,
            success: true,
            hr
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
        let hr = await HR.findById(userId).select('-password');;
        return res.status(200).json({
            hr,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { about } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const hr = await HR.findById(userId).select('-password');
        if (!hr) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (about) hr.about = about;
        if (profilePicture) hr.profilePicture = cloudResponse.secure_url;

        await hr.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            hr
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