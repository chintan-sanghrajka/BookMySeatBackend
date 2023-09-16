import EventModel from "./../models/event.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/events")) {
      cb(null, "./uploads/events");
    } else {
      fs.mkdirSync("./uploads/events", true);
      cb(null, "./uploads/events");
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

export const addEvent = (req, res) => {
  try {
    const uploadFile = upload.single("eventImage");

    uploadFile(req, res, async function (error) {
      if (error) return res.status(400).json({ message: error.message });

      let { eventData } = req.body;
      eventData = JSON.parse(eventData);

      const subCategory = await SubCategoryModel.findOne({
        name: eventData.subCategory,
      });

      let eventImage = "";
      if (req.file !== undefined) {
        eventImage = req.file.filename;
      }
      const newEventData = new EventModel({
        categoryId: subCategory.categoryId,
        subCategoryId: subCategory._id,
        name: eventData.name,
        description: eventData.description,
        venue: eventData.venue,
        eventImage: eventImage,
        date: eventData.date,
        time: eventData.time,
        ticketPrice: eventData.ticketPrice,
        rating: eventData.rating,
        availableTicket: eventData.availableTicket,
        status: 1,
        keys: eventData.keys,
        genre: eventData.subCategory,
        language: eventData.language,
      });
      newEventData.save();
      if (newEventData) {
        res.status(201).json({
          message: "Event Created Successfully",
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

export const getAllEvents = async (req, res) => {
  try {
    const { categoryId, keys, reqType, limit } = req.body;
    let eventList = [];
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(keys);

    const filterConfig = {
      status: 1,
      keys: { $regex: searchRgx, $options: "i" },
    };

    if (reqType === "cat") {
      eventList = await EventModel.find({
        status: 1,
        categoryId: categoryId,
      }).limit(limit);
    } else if (reqType === "keys") {
      eventList = await EventModel.find(filterConfig).limit(limit);
    }
    res.status(200).json({
      eventList: eventList,
      message: "Events fetched successfully.",
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const uploadFile = upload.single("eventImage");
    uploadFile(req, res, async function (error) {
      if (error) return res.status(400).json({ message: error.message });

      let { eventData, eventId } = req.body;

      eventData = JSON.parse(eventData);

      const eventOld = await EventModel.find({
        _id: eventId,
      });

      let eventImage = eventOld.eventImage;
      if (req.file !== undefined) {
        eventImage = req.file.filename;
        if (fs.existsSync("./uploads/events" + eventOld.eventImage)) {
          fs.unlinkSync("./uploads/events" + eventOld.eventImage);
        }
      }

      const subCategory = await SubCategoryModel.findOne({
        name: eventData.subCategory,
      });

      const eventNew = await EventModel.updateOne(
        { _id: eventId },
        {
          $set: {
            categoryId: subCategory.categoryId,
            subCategoryId: subCategory._id,
            name: eventData.name,
            description: eventData.description,
            venue: eventData.venue,
            eventImage: eventImage,
            date: eventData.date,
            time: eventData.time,
            ticketPrice: eventData.ticketPrice,
            rating: eventData.rating,
            availableTicket: eventData.availableTicket,
            status: 1,
            keys: eventData.keys,
            genre: eventData.subCategory,
            language: eventData.language,
          },
        }
      );
      if (eventNew.acknowledged) {
        return res.status(200).json({
          message: "Event Updated Successfully.",
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

export const getEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await EventModel.find({
      _id: eventId,
    });
    res.status(200).json({
      message: "Event Fetched Successfully",
      event: event,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};
