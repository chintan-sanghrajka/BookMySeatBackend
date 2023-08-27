import express from "express";
import {
  addEvent,
  getAllEvents,
  updateEvent,
  getHomeEvents,
  getEvent,
} from "../controllers/event.controller.js";

const eventRouter = express.Router();

eventRouter.post("/add-event", addEvent);

eventRouter.put("/get-events", getAllEvents);

eventRouter.put("/update-event", updateEvent);

eventRouter.put("/get-event", getEvent);

export default eventRouter;
