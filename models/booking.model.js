import mongoose, { Types } from "mongoose";
import UserModel from "./user.model.js";
import EventModel from "./event.model.js";

const Schema = mongoose.Schema;

const BookingModel = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: UserModel,
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: EventModel,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  totalTickets: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: new Date(),
  },
  paymentId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("bookings", BookingModel);
