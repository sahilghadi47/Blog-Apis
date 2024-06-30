import User from "../models/user.model.js";
import functionHandler from "../utils/functionHandler.js";
import {
	ErrorHandler as Error,
	ResponseHandler as Response,
} from "../utils/reqResHandler.js";
import { uploadImage, deleteImage } from "../config/cloud.config.js";
import mongoose, { isValidObjectId } from "mongoose";

const cookiesOptions = {
	httpOnly: true,
	secure: true,
};

const getTokens = async (user) => {
	try {
		if (!user) throw new Error(404, "User not found");

		const accessToken = await user.getAccessToken();
		const refreshToken = await user.getRefreshToken();

		return { accessToken, refreshToken };
	} catch (error) {
		throw new Error(
			error.statusCode || 500,
			error.message || " Server Error :: token generation failed"
		);
	}
};

const registerUser = functionHandler(async (req, res) => {
	const { username, password, email } = req.body;

	if (!username || !password || !email)
		throw new Error(400, "All fields are required");

	const existedUser = await User.findOne({
		$or: [{ username }, { email }],
	});
	if (existedUser)
		throw new Error(409, "User with same username or email already exists");

	const user = await User.create({
		username,
		password,
		email,
	});
	const createdUser = await User.findById(user._id).select(
		" -password -refreshToken"
	);
	return res
		.status(200)
		.json(new Response(200, createdUser, "user created successfully"));
});

const loginUser = functionHandler(async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		throw new Error(400, "Username and password are required");

	const user = await User.findOne({ username });
	if (!user) throw new Error(404, "User does not exist");

	const isPasswordValid = await user.matchPassword(password);

	if (!isPasswordValid) throw new Error(401, "Invalid user credentials");

	const { accessToken, refreshToken } = await getTokens(user);

	user.refreshToken = refreshToken;
	user.save({ validateBeforeSave: false });

	return res
		.status(200)
		.cookie("refreshToken", refreshToken, cookiesOptions)
		.cookie("accessToken", accessToken, cookiesOptions)
		.json(
			new Response(
				200,
				{
					username: user.username,
					email: user.email,
					userId: user._id,
					avatar: user.avatar,
					bio: user.bio,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				},
				"User Login successful"
			)
		);
});

const logoutUser = functionHandler(async (req, res) => {
	await User.findByIdAndUpdate(req.user?._id, {
		$unset: {
			refreshToken: 1,
		},
	});
	res.status(200)
		.clearCookie("refreshToken", cookiesOptions)
		.clearCookie("accessToken", cookiesOptions)
		.json(new Response(200, {}, "User Logout successful"));
});

const getUser = functionHandler(async (req, res) => {
	res.status(200).json(
		new Response(200, req.user, "User fetched successfully")
	);
});

const updateUser = functionHandler(async (req, res) => {
	const { bio, username, email } = req.body;

	const user = await User.findById(req.user?._id);
	if (!user) throw new Error(404, "User not found");

	if (bio) user.bio = bio;
	if (username) user.username = username;
	if (email) user.email = email;

	await user.save();
	return res.status(200).json(
		new Response(
			200,
			{
				username: user.username,
				email: user.email,
				userId: user._id,
				avatar: user.avatar,
				bio: user.bio,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
			"User updated successfully"
		)
	);
});

const updateUserPassword = functionHandler(async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword)
		throw new Error(400, "All fields are required");

	const user = await User.findById(req.user?._id);
	if (!user) throw new Error(404, "User not found");

	const isPasswordValid = await user.matchPassword(oldPassword);
	if (!isPasswordValid) throw new Error(401, "Invalid user credentials");

	user.password = newPassword;
	await user.save();

	return res.status(200).json(
		new Response(
			200,
			{
				username: user.username,
				email: user.email,
				userId: user._id,
				avatar: user.avatar,
				bio: user.bio,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
			"User password updated successfully"
		)
	);
});

const updateProfilePicture = functionHandler(async (req, res) => {
	const user = await User.findById(req.user?._id);

	if (!user) throw new Error(404, "User not found");

	const oldAvatar = user.avatar?.public_id;

	const path = `users/${user.username}/avatar`;
	const avatar = await uploadImage(req.file?.path, path);

	if (!avatar) throw new Error(500, "Avatar upload failed");

	user.avatar = {
		url: avatar.url,
		public_id: avatar.public_id,
	};

	user.save({ validateBeforeSave: false });
	if (oldAvatar) await deleteImage(oldAvatar);

	return res
		.status(200)
		.json(new Response(200, user.avatar, "avatar updated successfully"));
});

const getUserById = functionHandler(async (req, res) => {
	const id = req.params.id;
	if (!isValidObjectId(id)) throw new Error(400, "Invalid user id");
	const user = await User.findById(id).select("-password -refreshToken");
	if (!user) throw new Error(404, "User not found");

	return res
		.status(200)
		.json(new Response(200, user, "User fetched successfully"));
});

const searchUserByUserName = functionHandler(async (req, res) => {
	const { username } = req.params;
	if (!username) throw new Error(404, "User not found");

	const user = await User.findOne({ username }).select(
		"-password -refreshToken"
	);

	if (!user)
		return res
			.status(404)
			.json(new Response(404, {}, "No such user found"));

	return res
		.status(200)
		.json(new Response(200, user, "User fetched successfully"));
});

export {
	registerUser,
	loginUser,
	logoutUser,
	getUser,
	updateUser,
	updateUserPassword,
	updateProfilePicture,
	getUserById,
	searchUserByUserName,
};
