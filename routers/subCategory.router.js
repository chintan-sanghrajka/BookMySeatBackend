import express from "express";
import {
  addSubCategory,
  updateSubCategory,
  getSubCategories,
  getSubCategory,
  getActiveSubCategories,
} from "../controllers/subCategory.controller.js";

const subCategoryRouter = express.Router();

subCategoryRouter.post("/add-sub-category", addSubCategory);

subCategoryRouter.put("/update-sub-category", updateSubCategory);

subCategoryRouter.get("/get-sub-categories", getActiveSubCategories);

subCategoryRouter.get("/get-all-sub-categories", getSubCategories);

subCategoryRouter.put("/get-sub-category", getSubCategory);

export default subCategoryRouter;
