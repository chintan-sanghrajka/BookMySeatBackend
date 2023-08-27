import express from "express";
import {
  checkUser,
  addUser,
  getUser,
  getUserWithOTP,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/check-user", checkUser);

userRouter.post("/add-user", addUser);

userRouter.post("/login", getUser);

userRouter.post("/login-otp", getUserWithOTP);

export default userRouter;
