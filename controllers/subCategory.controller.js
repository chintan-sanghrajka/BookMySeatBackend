import SubCategoryModel from "../models/subCategory.model.js";

export const addSubCategory = (req, res) => {
  try {
    const { name, description, categoryId, status } = req.body;
    const subCategoryData = new SubCategoryModel({
      categoryId: categoryId,
      name: name,
      description: description,
      status: status,
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
    const { name, description, status, _id, productId } = req.body;

    const subCategoryOld = await SubCategoryModel.find({
      _id: _id,
    });
    const subCategoryNew = await SubCategoryModel.updateOne(
      { _id: _id },
      {
        $set: {
          name: name,
          description: description,
          cover: cover,
          status: status,
          productId: productId,
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

export const getSubCategories = async (req, res) => {
  try {
    const subCategoryList = await SubCategoryModel.find();
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
