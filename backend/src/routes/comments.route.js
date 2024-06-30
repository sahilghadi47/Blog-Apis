import { verifyJwt } from "../config/auth.config.js";
import { Router } from "express";

import {
	addComment,
	getCommentsByPostId,
	updateComment,
	deleteComment,
} from "../controller/comment.controller.js";
const commentRouter = Router();
commentRouter.use(verifyJwt);

commentRouter.route("/addComment", addComment);
commentRouter.route("/u/:id", getCommentsByPostId);
commentRouter.route("/update-comment", updateComment);
commentRouter.route("/delete-comment", deleteComment);

export default commentRouter;
