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

app.use(express.static("backend/public/temp"));

import userRouter from "./routes/user.route.js";

app.use("/api/v1/user", userRouter);
export default app;
