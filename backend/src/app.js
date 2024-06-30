import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: process.env.CORS,
		credentials: true,
	})
);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public/temp"));

//importing routes

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comments.route.js";

app.use("/Mern-Blog/api/v1/user", userRouter);

app.use("/Mern-Blog/api/v1/post", postRouter);

app.use("/Mern-Blog/api/v1/comment", commentRouter);

export default app;
