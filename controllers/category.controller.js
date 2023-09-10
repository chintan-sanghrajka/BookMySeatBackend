import CategoryModel from "./../models/category.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/category")) {
      cb(null, "./uploads/category");
    } else {
      fs.mkdirSync("./uploads/category", true);
      cb(null, "./uploads/category");
    }
  },
  filename: function (req, file, cb) {
    const imgName = file.originalname;
    const imgArr = imgName.split(".");
    imgArr.pop();
    const imgExt = path.extname(imgName);
    const fname = imgArr.join(".") + "-" + Date.now() + imgExt;
    cb(null, fname);
  },
});

const upload = multer({ storage: storage });

export const addCategory = (req, res) => {
  try {
    const uploadFile = upload.single("categoryImage");

    uploadFile(req, res, function (error) {
      if (error) return res.status(400).json({ message: error.message });

      const { name, description } = req.body;
      console.log(name, description);
      let categoryImage = "";
      if (req.file !== undefined) {
        categoryImage = req.file.filename;
      }
      const categoryData = new CategoryModel({
        name: name,
        description: description,
        categoryImage: categoryImage,
        status: 1,
      });
      console.log();
      categoryData.save();
      if (categoryData) {
        res.status(201).json({
          message: "Category Created Successfully",
          status: true,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categoryList = await CategoryModel.find();
    res.status(200).json({
      message: "Categories Fetched Successfully.",
      status: true,
      categoryList: categoryList,
      categoriesCount: categoryList.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await CategoryModel.findOne({
      name: name,
    });
    res.status(200).json({
      category: category,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const updateCategory = (req, res) => {
  try {
    const uploadFile = upload.single("categoryImage");
    uploadFile(req, res, async function (error) {
      if (error) return res.status(400).json({ message: error.message });

      const { name, description, _id } = req.body;

      const categoryOld = await CategoryModel.find({
        _id: _id,
      });

      let categoryImage = categoryOld.categoryImage;
      if (req.file !== undefined) {
        categoryImage = req.file.filename;
        if (fs.existsSync("./uploads/category" + categoryOld.categoryImage)) {
          fs.unlinkSync("./uploads/category" + categoryOld.categoryImage);
        }
      }
      const categoryNew = await CategoryModel.updateOne(
        { _id: _id },
        {
          $set: {
            name: name,
            description: description,
            categoryImage: categoryImage,
            status: 1,
          },
        }
      );
      if (categoryNew.acknowledged) {
        return res.status(200).json({
          message: "Category Updated Successfully.",
          status: true,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getActiveCategories = async (req, res) => {
  try {
    const categoryList = await CategoryModel.find({
      // status: 1,
    });
    res.status(200).json({
      categoryList: categoryList,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};
