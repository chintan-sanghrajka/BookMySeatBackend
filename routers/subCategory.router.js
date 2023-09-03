import express from "express";
import {
  addSubCategory,
  updateSubCategory,
  getSubCategories,
  getSubCategory,
  getActiveSubCategories,
} from "../controllers/subCategory.controller.js";
import auth from "./../middleware/auth.middleware.js";

const subCategoryRouter = express.Router();

subCategoryRouter.post("/add-sub-category", auth, addSubCategory);

subCategoryRouter.put("/update-sub-category", auth, updateSubCategory);

subCategoryRouter.get("/get-sub-categories", getActiveSubCategories);

subCategoryRouter.get("/get-all-sub-categories", getSubCategories);

subCategoryRouter.put("/get-sub-category", getSubCategory);

export default subCategoryRouter;
