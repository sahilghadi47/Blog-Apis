import { Router } from "express";
import {
	createPost,
	getAllPosts,
	getPostById,
	updatePost,
	deletePost,
	getPostsByUser,
} from "../controller/post.controller.js";
import fileupload from "../config/multer.config.js";
import { verifyJwt } from "../config/auth.config.js";
const router = Router();

router.use(verifyJwt);

router.post("/createPost", fileupload.single("file"), createPost);
router.get("/getAllPosts", getAllPosts);
router.get("/getPostById/:id", getPostById);
router.put("/updatePost/:id", updatePost);
router.delete("/deletePost/:id", deletePost);
router.get("/user/:id", getPostsByUser);

export default router;
