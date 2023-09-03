import {
  orderCreation,
  paymentVerification,
} from "../controllers/payment.controller";
import express from "express";

const paymentRouter = express.Router();

paymentRouter.post("/razorpay", orderCreation);

paymentRouter.post("/verification", paymentVerification);

export default paymentRouter;
