import express from "express";
import {
  addCategory,
  getCategory,
  getCategories,
  updateCategory,
  getActiveCategories,
} from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.post("/add-category", addCategory);

categoryRouter.get("/get-all-categories", getCategories);

categoryRouter.put("/get-category", getCategory);

categoryRouter.put("/update-category", updateCategory);

categoryRouter.get("/get-categories", getActiveCategories);

export default categoryRouter;
