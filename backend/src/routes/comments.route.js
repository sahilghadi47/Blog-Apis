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

commentRouter.post("/addComment/:id", addComment);
commentRouter.get("/post/:id", getCommentsByPostId);
commentRouter.patch("/update-comment", updateComment);
commentRouter.delete("/delete-comment", deleteComment);

export default commentRouter;
