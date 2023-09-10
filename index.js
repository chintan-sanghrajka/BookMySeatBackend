import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import categoryRouter from "./routers/category.router.js";
import subCategoryRouter from "./routers/subCategory.router.js";
import eventRouter from "./routers/event.router.js";
import userRouter from "./routers/user.router.js";
import bookingRouter from "./routers/booking.router.js";
import paymentRouter from "./routers/payment.router.js";
import adminRouter from "./routers/admin.router.js";

const Razorpay = require("razorpay");

const PORT = process.env.PORT;
const DBLink = process.env.DBLink;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});

mongoose
  .connect(DBLink)
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(categoryRouter);

app.use(subCategoryRouter);

app.use(eventRouter);

app.use(userRouter);

app.use(bookingRouter);

app.use(paymentRouter);

app.use(adminRouter);
