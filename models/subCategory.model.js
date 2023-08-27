import mongoose from "mongoose";
import CategoryModel from "./category.model.js";

const Schema = mongoose.Schema;

const SubCategoryModel = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: CategoryModel,
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
  status: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("subCategories", SubCategoryModel);
