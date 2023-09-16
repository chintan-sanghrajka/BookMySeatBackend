import UserModel from "./../models/user.model.js";
import CategoryModel from "./../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import EventModel from "../models/event.model.js";
import BookingModel from "../models/booking.model.js";

export const getHomeData = async (req, res) => {
  try {
    const activeUsersCount = await UserModel.find({
      status: 1,
      banned: false,
    });
    const bookingData = await BookingModel.aggregate([
      {
        $match: {
          status: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: "$totalTickets" },
          totalPrice: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalPrice = bookingData[0].totalPrice;
    const totalTickets = bookingData[0].totalTickets;

    const activeEvents = await EventModel.find({
      status: 1,
    });

    res.status(200).json({
      activeUsersCount: activeUsersCount.length,
      totalTickets: totalTickets,
      totalPrice: totalPrice,
      activeEvents: activeEvents.length,
      message: "Home Data Fetched Successfully.",
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userList = await UserModel.find();
    res.status(200).json({
      userList: userList,
      totalUsers: userList.length,
      message: "User Data Fetched Successfully.",
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const banUser = async (req, res) => {
  try {
    const { userId, ban } = req.body;
    const user = await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          banned: ban,
        },
      }
    );
    if (user.acknowledged) {
      return res.status(200).json({
        message: "User Updated Successfully.",
        status: true,
      });
    } else {
      res.status(500).json({
        message: "Some error occured.",
        status: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const changeCategoryStatus = async (req, res) => {
  try {
    const { categoryId, status } = req.body;
    const category = await CategoryModel.updateOne(
      {
        _id: categoryId,
      },
      {
        $set: {
          status: status === true ? 1 : 9,
        },
      }
    );
    if (category.acknowledged) {
      res.status(200).json({
        message: "Category Updated Successfully.",
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

export const changeSubCategoryStatus = async (req, res) => {
  try {
    const { subCategoryId, status } = req.body;
    const subCategory = await SubCategoryModel.updateOne(
      {
        _id: subCategoryId,
      },
      {
        $set: {
          status: status === true ? 1 : 9,
        },
      }
    );
    if (subCategory.acknowledged) {
      res.status(200).json({
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

export const getAllEventsAdmin = async (req, res) => {
  try {
    const eventList = await EventModel.find();
    res.status(200).json({
      eventList: eventList,
      message: "Events Fetched Successfully.",
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const changeEventStatus = async (req, res) => {
  try {
    const { eventId, status } = req.body;
    const newEvent = await EventModel.updateOne(
      {
        _id: eventId,
      },
      {
        $set: {
          status: status === true ? 1 : 9,
        },
      }
    );
    if (newEvent.acknowledged) {
      res.status(200).json({
        message: "Event Updated Successfully.",
        status: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
