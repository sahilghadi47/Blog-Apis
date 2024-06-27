import app from "../app.js";
import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";

const userRouter = Router();
userRouter.get("/register", registerUser);

export default userRouter;
