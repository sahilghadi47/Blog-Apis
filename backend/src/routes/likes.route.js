import { Router } from "express";
import {
	toggleLike,
	getLikesByPostId,
} from "../controller/likes.controller.js";
import { verifyJwt } from "../config/auth.config.js";
const likeRouter = Router();

likeRouter.get("/post/:postId", getLikesByPostId);

likeRouter.patch("/toggleLike/:postId", verifyJwt, toggleLike);

export default likeRouter;
