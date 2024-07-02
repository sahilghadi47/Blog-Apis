/*
Manages comments on blog posts, including adding, editing, and deleting comments.

- _addComment_
- _getCommentsByPostId_
- _updateComment_
- _deleteComment_
*/
import mongoose, { isValidObjectId } from "mongoose";
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

	const post = await Post.findById(new mongoose.Types.ObjectId(req.params));
	if (!post) throw new Error(404, "post not found");

	const { content } = req.body;
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
	const comments = await Comment.aggregate([
		{
			$match: {
				post: new mongoose.Types.ObjectId(req.params),
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "author",
				foreignField: "_id",
				as: "author",
				pipeline: [{ $project: { username: 1, avatar: 1 } }],
			},
		},
		{
			$project: {
				comment: 1,
				author: { $arrayElemAt: ["$author", 0] },
			},
		},
	]);

	if (!comments) throw new Error(404, "No comments found for this post");

	return res
		.status(200)
		.json(new Response(200, comments, "Comments fetched successfully"));
});

const updateComment = functionHandler(async (req, res) => {
	const user = await User.findById(req.user?._id);
	if (!user) throw new Error(404, "User not found");

	const { id, content } = req.body;

	const comment = await Comment.findById(id);
	if (!comment) throw new Error(404, "Comment not found");

	if (!content) throw new Error(400, "Enter valid comment");

	if (comment.author.toString() !== user._id.toString())
		throw new Error(
			400,
			"Unauthorised user request, you are not the author of this comment"
		);

	const updatedComment = await Comment.findByIdAndUpdate(
		comment._id,
		{ comment: content },
		{ new: true }
	);

	const post = await Post.aggregate([
		{ $match: { _id: comment?.post } },
		{
			$lookup: {
				from: "users",
				localField: "author",
				foreignField: "_id",
				as: "author",
				pipeline: [{ $project: { username: 1, avatar: 1 } }],
			},
		},
		{
			$lookup: {
				from: "comments",
				localField: "comments",
				foreignField: "_id",
				as: "comments",
				pipeline: [
					{
						$lookup: {
							from: "users",
							localField: "author",
							foreignField: "_id",
							as: "author",
							pipeline: [
								{ $project: { username: 1, avatar: 1 } },
							],
						},
					},
					{
						$project: {
							comment: 1,
							author: { $arrayElemAt: ["$author", 0] },
						},
					},
				],
			},
		},
		{
			$project: {
				comments: 1,
				author: 1,
				title: 1,
				assets: 1,
				likes: { $size: "$likes" },
			},
		},
	]);

	return res
		.status(200)
		.json(new Response(200, post, "Comment updated successfully"));
});

const deleteComment = functionHandler(async (req, res) => {
	const user = await User.findById(req.user?._id);
	if (!user) throw new Error(404, "User not found");
	const { id } = req.body;

	const comment = await Comment.findByIdAndDelete(
		new mongoose.Types.ObjectId(id)
	);
	if (!comment) throw new Error(404, "Comment not found");

	const updatedPost = await Post.findByIdAndUpdate(
		comment.post,
		{ $pull: { comments: comment._id } },
		{ new: true }
	);

	const post = await Post.aggregate([
		{
			$match: {
				_id: updatedPost._id,
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "author",
				foreignField: "_id",
				as: "author",
				pipeline: [{ $project: { username: 1, avatar: 1 } }],
			},
		},
		{
			$lookup: {
				from: "comments",
				localField: "comments",
				foreignField: "_id",
				as: "comments",
				pipeline: [
					{
						$lookup: {
							from: "users",
							localField: "author",
							foreignField: "_id",
							as: "author",
							pipeline: [
								{ $project: { username: 1, avatar: 1 } },
							],
						},
					},
					{
						$project: {
							comment: 1,
							author: { $arrayElemAt: ["$author", 0] },
						},
					},
				],
			},
		},
		{
			$project: {
				comments: 1,
				author: 1,
				title: 1,
				assets: 1,
				likes: { $size: "$likes" },
			},
		},
	]);

	return res
		.status(200)
		.json(new Response(200, post, "Comment deleted successfully"));
});

export { addComment, getCommentsByPostId, updateComment, deleteComment };
