import User from "../models/user.model.js";
import functionHandler from "../utils/functionHandler.js";
import {
	ErrorHandler as Error,
	ResponseHandler as Response,
} from "../utils/reqResHandler.js";

const registerUser = functionHandler(async (req, res) => {
	return res
		.status(200)
		.json(new Response(200, null, "Routes running successfully"));
});

const loginUser = functionHandler(async (req, res) => {});

const logoutUser = functionHandler(async (req, res) => {});

const getUser = functionHandler(async (req, res) => {});

const updateUser = functionHandler(async (req, res) => {});

const updateUserPassword = functionHandler(async (req, res) => {});

const updateProfilePicture = functionHandler(async (req, res) => {});

export {
	registerUser,
	loginUser,
	logoutUser,
	getUser,
	updateUser,
	updateUserPassword,
	updateProfilePicture,
};
