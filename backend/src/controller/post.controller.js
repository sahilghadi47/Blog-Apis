import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {
	ErrorHandler as Error,
	ResponseHandler as Response,
} from "../utils/reqResHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { uploadImage, deleteImage } from "../config/cloud.config.js";
import functionHandler from "../utils/functionHandler.js";

/*
- _createPost_
- _getPosts (for retrieving all posts)_
- _getPostById_
- _updatePost_
- _deletePost_
- _getPostsByUser_
*/

// Function to create a new blog post
const createPost = functionHandler(async (req, res) => {
	// Find the user associated with the request
	const user = await User.findById(req.user?._id);
	if (!user) throw new Error(404, "User not found");

	// Validate the request body
	const { title, content } = req.body;
	if (!title || !content) throw new Error(400, "Please fill all the fields");

	// Validate the uploaded file
	const file = req.file;
	if (!file) throw new Error(400, "Please upload an FIle");

	// Upload the file to cloud storage
	const path = `users/${user.username.replace("_", "")}/posts`;
	const uploadedFile = await uploadImage(file?.path, String(path));
	if (!uploadedFile) throw new Error(400, "File not uploaded");

	// Create a new post document in the database
	const post = await Post.create({
		title,
		content,
		author: req.user?._id,
		assets: {
			public_id: uploadedFile.public_id,
			url: uploadedFile.secure_url,
		},
	});

	if (!post) throw new Error(400, "creating post failed");

	// Return a success response with the new post
	return res
		.status(201)
		.json(new Response(201, post, "new post created successfully"));
});

// Function to retrieve all blog posts
const getAllPosts = functionHandler(async (req, res) => {
	// Perform an aggregation pipeline to join posts with user data
	try {
		// Perform an aggregation pipeline to join posts with user data
		const posts = await Post.aggregate([
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
					],
				},
			},
			{
				$lookup: {
					from: "likes",
					localField: "likes",
					foreignField: "_id",
					as: "likes",
					pipeline: [
						{
							$lookup: {
								from: "users",
								localField: "user",
								foreignField: "_id",
								as: "user",
								pipeline: [{ $project: { username: 1 } }],
							},
						},
					],
				},
			},
			{
				$project: {
					title: 1,
					content: 1,
					assets: 1,
					author: { $arrayElemAt: ["$author", 0] },
					comments: 1,
					likes: { $size: "$likes" },
				},
			},
		]);

		// If no posts are found, return a 404 error
		if (!posts || posts.length === 0)
			return res
				.status(404)
				.json(new Response(404, {}, "Posts not found"));

		// Return a success response with the retrieved posts
		return res
			.status(200)
			.json(new Response(200, posts, "Posts retrieved successfully"));
	} catch (error) {
		// Handle any errors that occur
		return res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
});

// Function to retrieve a single blog post by ID
const getPostById = functionHandler(async (req, res) => {
	// Get the post ID from the request parameters
	try {
		const id = new mongoose.Types.ObjectId(req.params);

		// Validate the post ID
		if (!isValidObjectId(id)) throw new Error(400, "Invalid post id");

		// Find the post by ID
		// mongoose.Types.ObjectId(id)
		const post = await Post.aggregate([
			{ $match: { _id: id } },
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
				$lookup: {
					from: "likes",
					localField: "likes",
					foreignField: "_id",
					as: "likes",
					pipeline: [
						{
							$lookup: {
								from: "users",
								localField: "user",
								foreignField: "_id",
								as: "user",
								pipeline: [{ $project: { username: 1 } }],
							},
						},
					],
				},
			},
			{
				$project: {
					title: 1,
					content: 1,
					assets: 1,
					author: { $arrayElemAt: ["$author", 0] },
					comments: 1,
					likes: { $size: "$likes" },
				},
			},
		]);
		// Return a success response with the retrieved post
		return res
			.status(200)
			.json(new Response(200, post, "Post retrieved successfully"));
	} catch (error) {
		return res
			.status(error.staus || 500)
			.json(new Response(error.status || 500, {}, error.message));
	}
});

// Function to update an existing blog post
const updatePost = functionHandler(async (req, res) => {
	// Get the post ID from the request parameters
	try {
		const id = new mongoose.Types.ObjectId(req.params);

		// Validate the post ID
		if (!isValidObjectId(id)) throw new Error(400, "Invalid post id");

		// Find the post by ID
		const post = await Post.findById(id);

		// If the post is not found, throw a 404 error
		if (!post) throw new Error(404, "Post not found");

		// Check if the user is authorized to update the post
		if (post.author.toString() !== req.user?._id.toString())
			throw new Error(401, "Unauthorized user request");

		// Validate the request body
		const { title, content } = req.body;
		if (!title || !content) throw new Error(400, "All field are necessary");

		// Update the post with the new data
		const updatedPost = await Post.findByIdAndUpdate(
			id,
			{
				$set: {
					title,
					content,
				},
			},
			{ new: true }
		);

		// If the update fails, throw a 400 error
		if (!updatedPost) throw new Error(400, "Post update failed");

		// Return a success response with the updated post
		return res
			.status(200)
			.json(new Response(200, updatedPost, "Post updated successfully"));
	} catch (error) {
		return res
			.status(error.staus || 500)
			.json(new Response(error.status || 500, {}, error.message));
	}
});

// Function to delete a blog post
const deletePost = functionHandler(async (req, res) => {
	// Get the post ID from the request parameters
	try {
		const id = new mongoose.Types.ObjectId(req.params);

		// Validate the post ID
		if (!isValidObjectId(id)) throw new Error(400, "Invalid post id");

		// Find the post by ID
		const post = await Post.findById(id);

		// If the post is not found, throw a 404 error
		if (!post) throw new Error(404, "Post not found");

		// Check if the user is authorized to delete the post
		if (post.author.toString() !== req.user?._id.toString())
			throw new Error(401, "Unauthorized user request");

		// Delete the post from the database
		const deletedPost = await Post.findByIdAndDelete(id);

		// If the deletion fails, throw a 400 error
		if (!deletedPost) throw new Error(400, "Post deletion failed");

		// Delete the associated file from cloud storage
		await deleteImage(deletedPost.assets.public_id);

		// Return a success response with the deleted post
		return res
			.status(200)
			.json(new Response(200, deletedPost, "Post deleted successfully"));
	} catch (error) {
		return res
			.status(error.staus || 500)
			.json(new Response(error.status || 500, {}, error.message));
	}
});

// Function to retrieve all blog posts by a specific user
const getPostsByUser = functionHandler(async (req, res) => {
	// Get the username from the request parameters
	try {
		const { username } = req.params;
		console.log(username);
		// Find the user by username
		const user = await User.findOne({ username });
		// If the user is not found, throw a 404 error
		if (!user) throw new Error(404, "User not found");

		// Find all posts associated with the user's ID
		const author = user._id;
		const posts = await Post.find({ author: author })
			.sort({ createdAt: -1 })
			.exec();

		// If no posts are found, throw a 404 error
		if (!posts || posts.length === 0)
			throw new Error(404, "Posts not found");

		// Return a success response with the retrieved posts

		return res
			.status(200)
			.json(new Response(200, posts, "Posts retrieved successfully"));
	} catch (error) {
		return res
			.status(error.staus || 500)
			.json(new Response(error.status || 500, {}, error.message));
	}
});

export {
	createPost,
	getAllPosts,
	getPostById,
	updatePost,
	deletePost,
	getPostsByUser,
};
