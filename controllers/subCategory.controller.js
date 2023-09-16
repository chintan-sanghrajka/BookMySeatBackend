import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";

export const addSubCategory = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const categoryDetails = await CategoryModel.findOne({
      name: category,
    });

    const subCategoryData = new SubCategoryModel({
      categoryId: categoryDetails._id,
      name: name,
      description: description,
      status: 1,
    });
    subCategoryData.save();
    if (subCategoryData) {
      res.status(201).json({
        message: "Sub-Category Created Successfully",
        status: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { name, description, _id, category } = req.body;

    const categoryDetails = await CategoryModel.findOne({
      name: category,
    });

    const subCategoryNew = await SubCategoryModel.updateOne(
      { _id: _id },
      {
        $set: {
          name: name,
          description: description,
          status: 1,
          categoryId: categoryDetails._id,
        },
      }
    );
    if (subCategoryNew.acknowledged) {
      return res.status(200).json({
        message: "Sub-Category Updated Successfully.",
        status: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getAllSubCategories = async (req, res) => {
  try {
    // const subCategoryList = await SubCategoryModel.find();

    const subCategoryList = await SubCategoryModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          description: "$description",
          status: "$status",
          categoryName: "$category.name",
        },
      },
    ]);

    res.status(200).json({
      subCategoryList: subCategoryList,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getSubCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const subCategory = await SubCategoryModel.findOne({
      name: name,
    });
    res.status(200).json({
      subCategory: subCategory,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getActiveSubCategories = async (req, res) => {
  try {
    const subCategoryList = await SubCategoryModel.find({
      status: 1,
    });
    res.status(200).json({
      subCategoryList: subCategoryList,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};
