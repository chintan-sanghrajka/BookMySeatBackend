import express from "express";
import {
  addCategory,
  getCategory,
  getCategories,
  updateCategory,
  getActiveCategories,
} from "../controllers/category.controller.js";
import auth from "./../middleware/auth.middleware.js";

const categoryRouter = express.Router();

categoryRouter.post("/add-category", auth, addCategory);

categoryRouter.get("/get-all-categories", getCategories);

categoryRouter.put("/get-category", getCategory);

categoryRouter.put("/update-category", auth, updateCategory);

categoryRouter.get("/get-categories", getActiveCategories);

export default categoryRouter;
