import express from "express";
import {
  addEvent,
  getAllEvents,
  updateEvent,
  getHomeEvents,
  getEvent,
} from "../controllers/event.controller.js";
import auth from "./../middleware/auth.middleware.js";

const eventRouter = express.Router();

eventRouter.post("/add-event", auth, addEvent);

eventRouter.put("/get-events", getAllEvents);

eventRouter.put("/update-event", auth, updateEvent);

eventRouter.put("/get-event", getEvent);

export default eventRouter;
