import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import functionHandler from "../utils/functionHandler.js";
import { ErrorHandler as Error } from "../utils/reqResHandler.js";

const verifyJwt = functionHandler(async (req, res, next) => {
	try {
		const token =
			req.cookies?.accessToken ||
			req.header("Authorization")?.replace("Bearer ", "");
		if (!token) throw new Error(400, "Unauthorized request");
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const user = await User.findById(decoded.id).select(
			" -password -refreshToken"
		);
		if (!user) throw new Error(404, "User not found");
		req.user = user;
		next();
	} catch (error) {
		throw new Error(400, error.message || "Invalid access token");
	}
});

export { verifyJwt };
