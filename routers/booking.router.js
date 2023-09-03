import express from "express";
import {
  bookTickets,
  getTickets,
  cancelTickets,
} from "../controllers/booking.controller.js";
import auth from "./../middleware/auth.middleware.js";

const bookingRouter = express.Router();

bookingRouter.post("/book-tickets", auth, bookTickets);

bookingRouter.put("/cancel-tickets", auth, cancelTickets);

bookingRouter.put("/get-tickets", auth, getTickets);

export default bookingRouter;
