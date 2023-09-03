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

// const razorpay = new Razorpay({
//   key_id: "rzp_test_kqxw13RjPF3iB6",
//   key_secret: "NI5KpbgjLhsNyMA7MBQE1Jh2",
// });

app.use(paymentRouter);

// app.post("/verification", (req, res) => {
//   const secret = "12345678";

//   console.log(req.body);

//   const crypto = require("crypto");

//   const shasum = crypto.createHmac("sha256", secret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");

//   console.log(digest, req.headers["x-razorpay-signature"]);

//   if (digest === req.headers["x-razorpay-signature"]) {
//     console.log("request is legit");
//     require("fs").writeFileSync(
//       "payment1.json",
//       JSON.stringify(req.body, null, 4)
//     );
//   } else {
//   }
//   res.json({ status: "ok" });
// });

// app.post("/razorpay", async (req, res) => {
//   const { totalPrice } = req.body;
//   const payment_capture = true;
//   const amount = totalPrice;
//   const currency = "INR";

//   const options = {
//     amount: amount * 100,
//     currency,
//     receipt: "1234567890",
//     payment_capture,
//   };

//   try {
//     const response = await razorpay.orders.create(options);
//     res.json({
//       id: response.id,
//       currency: response.currency,
//       amount: response.amount,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
