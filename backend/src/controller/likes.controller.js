// ## Like Controller: Manages the liking and unliking of blog posts by users

// - _likePost_
// - _unlikePost_
// - _getLikesByPostId_

import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import functionHandler from "../utils/functionHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import {
	ErrorHandler as Error,
	ResponseHandler as Response,
} from "../utils/reqResHandler.js";

const toggleLike = functionHandler(async (req, res) => {
	const { postId } = req.params;
	const user = req.user;
	if (!user) return new Error(401, "Unauthorized user ");
	if (!isValidObjectId(postId)) return new Error(400, "Invalid post id");

	const alreadyLiked = await Like.findOne({
		post: postId,
		user: user._id,
	});
	const post = await Post.findById(postId);
	if (!alreadyLiked) {
		const like = await Like.create({
			post: postId,
			user: user._id,
		});
		post.likes.push(like._id);
		await post.save();
		return res
			.status(200)
			.json(new Response(200, post, "Like added successfully"));
	}
	await Like.findByIdAndDelete(alreadyLiked._id);
	post.likes.pull(alreadyLiked._id);
	await post.save();
	return res
		.status(200)
		.json(new Response(200, post, "like removed successfully"));
});

const getLikesByPostId = functionHandler(async (req, res) => {
	const { postId } = req.params;
	if (!isValidObjectId(postId)) return new Error(400, "Invalid post id");
	const likes = await Like.aggregate([
		{
			$match: { post: new mongoose.Types.ObjectId(postId) },
		},
		{
			$lookup: {
				from: "users",
				localField: "user",
				foreignField: "_id",
				as: "user",
				pipeline: [
					{
						$project: {
							avatar: 1,
							username: 1,
						},
					},
				],
			},
		},

		{
			$unwind: "$user",
		},
		{
			$project: {
				avatar: "$user.avatar",
				username: "$user.username",
			},
		},
	]);
	return res
		.status(200)
		.json(new Response(200, likes, "Likes fetched successfully"));
});

export { getLikesByPostId, toggleLike };
