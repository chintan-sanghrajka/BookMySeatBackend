import BookingModel from "./../models/booking.model.js";
import EventModel from "../models/event.model.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import UserModel from "./../models/user.model.js";

export const bookTickets = async (req, res) => {
  try {
    const { userId, eventId, totalPrice, totalTickets, paymentId } = req.body;
    console.log(paymentId);
    const user = await UserModel.findOne({ _id: userId });
    const event = await EventModel.findOne({
      _id: eventId,
    });
    // const oldBooking = await BookingModel.find({
    //   userId: userId,
    //   eventId: eventId,
    //   status: 1,
    // });
    // if (oldBooking.length !== 0) {
    //   const booking = await BookingModel.updateOne(
    //     {
    //       userId: userId,
    //       eventId: eventId,
    //       status: 1,
    //     },
    //     {
    //       $set: {
    //         totalPrice: totalPrice + oldBooking[0].totalPrice,
    //         totalTickets: totalTickets + oldBooking[0].totalTickets,
    //       },
    //     }
    //   );
    //   console.log(booking.acknowledged);
    //   if (booking.acknowledged) {
    //     const newEvent = await EventModel.updateOne(
    //       {
    //         _id: eventId,
    //       },
    //       {
    //         $set: {
    //           availableTicket: event[0].availableTicket - totalTickets,
    //         },
    //       }
    //     );
    //     if (newEvent.acknowledged) {
    //       return res
    //         .status(200)
    //         .json({ message: "Tickets Booked Successfully.", status: true });
    //     } else {
    //       return res.status(500).json({
    //         message: "Server Busy, Please try after some time.",
    //         status: false,
    //       });
    //     }
    //   } else {
    //     return res.status(500).json({
    //       message: "Server Busy, Please try after some time.",
    //       status: false,
    //     });
    //   }
    // } else {
    const booking = new BookingModel({
      userId: userId,
      eventId: eventId,
      status: 1,
      totalPrice: totalPrice,
      totalTickets: totalTickets,
      paymentId: paymentId,
    });
    booking.save();
    if (booking) {
      const newEvent = await EventModel.updateOne(
        {
          _id: eventId,
        },
        {
          $set: {
            availableTicket: event.availableTicket - totalTickets,
          },
        }
      );
      if (newEvent.acknowledged) {
        sendConfirmationMail(
          user.userName,
          user.emailId,
          totalTickets,
          totalPrice,
          event.name,
          paymentId
        );
        return res.status(201).json({
          message: "Tickets Booked Successfully.",
          status: true,
        });
      } else {
        return res.status(500).json({
          message: "Server Busy, Please try after some time.",
          status: false,
        });
      }
    } else {
      return res.status(500).json({
        message: "Server Busy, Please try after some time.",
        status: false,
      });
    }
    // }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const cancelTickets = async (req, res) => {
  try {
    const { bookingId, totalTickets } = req.body;

    const oldBooking = await BookingModel.findOne({ _id: bookingId });

    const user = await UserModel.findOne({ _id: oldBooking.userId });

    const event = await EventModel.findOne({
      _id: oldBooking.eventId,
    });

    const booking = await BookingModel.updateOne(
      {
        _id: bookingId,
        status: 1,
      },
      {
        $set: {
          status: 9,
        },
      }
    );
    if (booking.acknowledged) {
      sendCancelationMail(
        user.userName,
        user.emailId,
        oldBooking.totalTickets,
        oldBooking.totalPrice,
        event.name
      );
      const newEvent = await EventModel.updateOne(
        {
          _id: oldBooking.eventId,
        },
        {
          $set: {
            availableTicket: event.availableTicket + totalTickets,
          },
        }
      );
      if (newEvent.acknowledged) {
        res.status(200).json({
          message: "Tickets Cancelled Successfully.",
          status: true,
        });
      } else {
        return res.status(500).json({
          message: "Server Busy, Please try after some time",
          status: false,
        });
      }
    } else {
      return res.status(500).json({
        message: "Server Busy, Please try after some time",
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

export const getTickets = async (req, res) => {
  let { userId } = req.body;
  try {
    const bookingList = await BookingModel.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: 1,
        },
      },
      {
        $project: {
          totalPrice: "$totalPrice",
          totalTickets: "$totalTickets",
          name: "$event.name",
          eventImage: "$event.eventImage",
          venue: "$event.venue",
          date: "$event.date",
          time: "$event.time",
        },
      },
    ]);

    res.status(200).json({
      bookingList: bookingList,
      message: "Bookings fetched Successfully.",
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

const sendConfirmationMail = async (
  userName,
  userEmail,
  totalTickets,
  totalPrice,
  name,
  paymentId
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sanghrajka.chintan@gmail.com",
      pass: "geccbbmvgckimbkz",
    },
  });
  try {
    let info = await transporter.sendMail({
      from: "BookMySeat",
      to: userEmail,
      subject: "Booking Confirmation.",
      html: `
          <div>
          <h2>Dear ${userName},</h2>
            <div style="padding-left: 20px">
            <p style="font-size: 18px">Your Tickets for ${name} has been booked successfully.</p>
            <p style="font-size: 18px">Tickets Booked: ${totalTickets}</p>
            <p style="font-size: 18px">Payment Done: ${totalPrice}</p>
            <p style="font-size: 18px">Payment Id: ${paymentId}</p>
            </div>
            <p style="font-size: 18px">Enjoy Your Show!!!</p>
          <h2>Thanks and Regards,</h2>
          <h2>Team BookMySeat</h2>
          </div>
          `,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const sendCancelationMail = async (
  userName,
  userEmail,
  totalTickets,
  totalPrice,
  name
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sanghrajka.chintan@gmail.com",
      pass: "geccbbmvgckimbkz",
    },
  });
  try {
    let info = await transporter.sendMail({
      from: "BookMySeat",
      to: userEmail,
      subject: "Booking Cancelation.",
      html: `
          <div>
          <h2>Dear ${userName},</h2>
            <div style="padding-left: 20px">
            <p  style="font-size: 18px">Your Tickets for ${name} has been cancelled successfully.</p>
            <p style="font-size: 18px">Tickets Cancelled: ${totalTickets}</p>
            <p style="font-size: 18px">Amount to be refunded: ${totalPrice}</p>
            </div>
            <p style="font-size: 18px">Amout will be refunded in your account within next 5 working days.</p>
          <h2>Thanks and Regards,</h2>
          <h2>Team BookMySeat</h2>
          </div>
          `,
    });
  } catch (error) {
    console.log(error.message);
  }
};
