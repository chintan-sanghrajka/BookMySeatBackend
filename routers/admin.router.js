import {
  getHomeData,
  getAllUsers,
  banUser,
  changeCategoryStatus,
  changeSubCategoryStatus,
  getAllEventsAdmin,
  changeEventStatus,
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
import { adminLogin } from "../controllers/user.controller.js";
import auth from "./../middleware/auth.middleware.js";
import express from "express";

const adminRouter = express.Router();

adminRouter.get("/get-home-data", auth, getHomeData);

adminRouter.get("/get-all-users", auth, getAllUsers);

adminRouter.put("/ban-user", auth, banUser);

adminRouter.get("/get-all-categories", auth, getAllCategories);

adminRouter.put("/change-category-status", auth, changeCategoryStatus);

adminRouter.post("/add-category", auth, addCategory);

adminRouter.put("/update-category", auth, updateCategory);

adminRouter.get("/get-all-sub-categories", auth, getAllSubCategories);

adminRouter.put("/change-subcategory-status", auth, changeSubCategoryStatus);

adminRouter.post("/add-sub-category", auth, addSubCategory);

adminRouter.put("/update-sub-category", auth, updateSubCategory);

adminRouter.get("/get-all-events-admin", auth, getAllEventsAdmin);

adminRouter.put("/change-event-status", auth, changeEventStatus);

adminRouter.post("/admin-login", adminLogin);

export default adminRouter;
