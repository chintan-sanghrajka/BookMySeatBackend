import {
  getHomeData,
  getAllUsers,
  banUser,
  changeCategoryStatus,
  changeSubCategoryStatus,
} from "../controllers/admin.controller.js";
import {
  getAllCategories,
  addCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import {
  getAllSubCategories,
  addSubCategory,
  updateSubCategory,
} from "../controllers/subCategory.controller.js";
import express from "express";

const adminRouter = express.Router();

adminRouter.get("/get-home-data", getHomeData);

adminRouter.get("/get-all-users", getAllUsers);

adminRouter.put("/ban-user", banUser);

adminRouter.get("/get-all-categories", getAllCategories);

adminRouter.put("/change-category-status", changeCategoryStatus);

adminRouter.post("/add-category", addCategory);

adminRouter.put("/update-category", updateCategory);

adminRouter.get("/get-all-sub-categories", getAllSubCategories);

adminRouter.put("/change-subcategory-status", changeSubCategoryStatus);

adminRouter.post("/add-sub-category", addSubCategory);

adminRouter.put("/update-sub-category", updateSubCategory);

export default adminRouter;
