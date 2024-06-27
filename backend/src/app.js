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

export default app;
