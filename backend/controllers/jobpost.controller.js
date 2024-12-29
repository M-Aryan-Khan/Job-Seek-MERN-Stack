import { Employee } from "../models/Employee.model.js";
import { HR } from "../models/HR.model.js";
import { Post } from "../models/JobPost.model.js";

export const addNewPost = async (req, res) => {
    try {
        const { title } = req.body;
        const { companyName } = req.body;
        const { jobType } = req.body;
        const { description } = req.body;
        const { requirements } = req.body;
        const { salary } = req.body;
        const { jobStatus } = req.body;
        const authorId = req.id;

        const post = await Post.create({
            title,
            companyName,
            jobType,
            description,
            requirements,
            salary,
            jobStatus,
            uploadedBy: authorId
        });

        const hr = await HR.findById(authorId);
        if (hr) {
            hr.Posts.push(post._id);
            await hr.save();
        }

        await post.populate({ path: 'uploadedBy', select: '-password' });

        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        })

    } catch (error) {
        console.log(error);
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'uploadedBy', select: 'username profilePicture' });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};


export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ uploadedBy: authorId }).sort({ createdAt: -1 }).populate({
            path: 'uploadedBy',
            select: 'username profilePicture'
        });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});

        if(post.uploadedBy.toString() !== authorId) return res.status(403).json({message:'Unauthorized'});

        await Post.findByIdAndDelete(postId);

        let hr = await HR.findById(authorId);
        hr.Posts = hr.Posts.filter(id => id.toString() !== postId);
        await hr.save();

        return res.status(200).json({
            success:true,
            message:'Post deleted'
        })

    } catch (error) {
        console.log(error);
    }
}

export const bookmarkPost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});
        
        const emp = await Employee.findById(authorId);
        if(emp.bookmarks.includes(post._id)){
            await emp.updateOne({$pull:{bookmarks:post._id}});
            await emp.save();
            return res.status(200).json({type:'unsaved', message:'Post removed from bookmark', success:true});

        }else{
            await emp.updateOne({$addToSet:{bookmarks:post._id}});
            await emp.save();
            return res.status(200).json({type:'saved', message:'Post bookmarked', success:true});
        }

    } catch (error) {
        console.log(error);
    }
}

export const appliedJobPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        const emp = await Employee.findById(authorId);
        let isUnsaved = false;

        if (emp.appliedJobs.includes(post._id)) {
            await emp.updateOne({ $pull: { appliedJobs: post._id } });
            isUnsaved = true;
        } else {
            await emp.updateOne({ $addToSet: { appliedJobs: post._id } });
        }
        await emp.save();

        if (isUnsaved) {
            await post.updateOne({ $pull: { appliedEmployees: emp._id } });
            return res.status(200).json({ type: 'unsaved', message: 'Removed from Jobs', success: true });
        } else {
            await post.updateOne({ $addToSet: { appliedEmployees: emp._id } });
            return res.status(200).json({ type: 'saved', message: 'Post Jobs', success: true });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id; 

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        if (post.uploadedBy.toString() !== authorId) {
            return res.status(403).json({ message: 'Unauthorized to edit this post', success: false });
        }

        const { title, companyName, jobType, description, requirements, salary, jobStatus } = req.body;

        if (title) post.title = title;
        if (companyName) post.companyName = companyName;
        if (jobType) post.jobType = jobType;
        if (description) post.description = description;
        if (requirements) post.requirements = requirements;
        if (salary) post.salary = salary;
        if (jobStatus) post.jobStatus = jobStatus;

        await post.save();

        return res.status(200).json({
            message: 'Post updated successfully',
            post,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

export const getPost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId).populate({ path: 'uploadedBy', select: '-password' });
        if (!post) {
            return res.status(404).json({ message: 'Post not found', success: false });
        }
        return res.status(200).json({ post, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};