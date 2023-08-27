import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategoryModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categoryImage: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("categories", CategoryModel);
