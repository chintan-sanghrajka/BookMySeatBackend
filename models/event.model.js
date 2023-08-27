import mongoose from "mongoose";
import CategoryModel from "./category.model.js";
import SubCategoryModel from "./subCategory.model.js";

const Schema = mongoose.Schema;

const EventModel = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: CategoryModel,
    required: true,
  },
  subCategoryId: {
    type: Schema.Types.ObjectId,
    ref: SubCategoryModel,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  eventImage: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  availableTicket: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  keys: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
});

export default mongoose.model("events", EventModel);
