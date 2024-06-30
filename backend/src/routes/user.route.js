import { Router } from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	getUser,
	updateUser,
	updateUserPassword,
	updateProfilePicture,
	getUserById,
	searchUserByUserName,
} from "../controller/user.controller.js";
import fileupload from "../config/multer.config.js";
import { verifyJwt } from "../config/auth.config.js";
const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", verifyJwt, logoutUser);
userRouter.get("/user-profile", verifyJwt, getUser);
userRouter.patch("/update-user", verifyJwt, updateUser);
userRouter.patch("/update-password", verifyJwt, updateUserPassword);
userRouter.put(
	"/update-profile-picture",
	verifyJwt,
	fileupload.single("avatar"),
	updateProfilePicture
);
userRouter.get("/u/:id", verifyJwt, getUserById);
userRouter.get("/u/:username", verifyJwt, searchUserByUserName);

export default userRouter;
