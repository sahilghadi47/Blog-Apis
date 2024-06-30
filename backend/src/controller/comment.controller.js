/*
Manages comments on blog posts, including adding, editing, and deleting comments.

- _addComment_
- _getCommentsByPostId_
- _updateComment_
- _deleteComment_
*/
import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import functionHandler from "../utils/functionHandler.js";
import {
	ErrorHandler as Error,
	ResponseHandler as Response,
} from "../utils/reqResHandler.js";

const addComment = functionHandler(async (req, res) => {
	const user = await User.findById(req.user?._id);
	if (!user) throw new Error(404, "User not found");

	const post = await Post.findById(req.params);
	if (!post) throw new Error(404, "post not found");

	const content = req.body;
	if (!content) throw new Error(400, "Enter valid comment");

	const comment = await Comment.create({
		comment: content,
		author: user._id,
		post: post._id,
	});
	if (!comment) throw new Error(500, "commment creation failed");

	const newPost = await Post.findByIdAndUpdate(
		post._id,
		{ $push: { comments: comment._id } },
		{ new: true }
	);
	if (!newPost) throw new Error(500, "Post update failed");
	return res
		.status(201)
		.json(new Response(201, comment, "Comment added successfully"));
});

const getCommentsByPostId = functionHandler(async (req, res) => {
	const comments = await Comment.find({ post: req.params });
	if (!comments) throw new Error(404, "No comments found for this post");

	return res.status(200).json(new Response(200, comments, "Comments found"));
});

const updateComment = functionHandler(async (req, res) => {
	const user = await User.findById(req.user?._id);
	if (!user) throw new Error(404, "User not found");

	const comment = await Comment.findById(req.body);
	if (!comment) throw new Error(404, "Comment not found");

	if (comment.author.toString() !== user._id.toString())
		throw new Error(400, "Unauthorised user request");

	const content = req.body;
	if (!content) throw new Error(400, "Enter valid comment");

	const updatedComment = await Comment.findByIdAndUpdate(
		comment._id,
		{ comment: content },
		{ new: true }
	);
	if (!updatedComment) throw new Error(500, "Comment update failed");

	return res
		.status(200)
		.json(
			new Response(200, updatedComment, "Comment updated successfully")
		);
});

const deleteComment = functionHandler(async (req, res) => {
	const user = await User.findById(req.user?._id);
	if (!user) throw new Error(404, "User not found");

	const comment = await Comment.findById(req.body);
	if (!comment) throw new Error(404, "Comment not found");

	if (comment.author.toString() !== user._id.toString())
		throw new Error(400, "Unauthorised user request");

	const deletedComment = await Comment.findByIdAndDelete(comment._id);
	if (!deletedComment) throw new Error(500, "Comment deletion failed");

	Post.findByIdAndUpdate(
		comment.post,
		{ $pull: { comments: mongoose.Types.ObjectId(comment._id) } },
		{ new: true }
	);

	return res
		.status(200)
		.json(
			new Response(200, deletedComment, "Comment deleted successfully")
		);
});

export { addComment, getCommentsByPostId, updateComment, deleteComment };
