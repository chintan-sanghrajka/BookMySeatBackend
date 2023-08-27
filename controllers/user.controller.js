import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const checkUser = async (req, res) => {
  const { userName, emailId } = req.body;
  try {
    const oldUser = await UserModel.findOne({
      $and: [
        {
          userName: userName,
        },
        { status: 1 },
      ],
    });
    if (oldUser) {
      res.status(200).json({
        message: "User already exists.",
        status: false,
      });
    } else {
      const oldEmail = await UserModel.findOne({
        $and: [{ emailId: emailId }, { status: 1 }],
      });
      if (oldEmail) {
        res.status(200).json({
          message: "Email already exists.",
          status: false,
        });
      } else {
        res.status(200).json({
          message: "User not found.",
          status: true,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      emailId,
      password,
      contact,
      role,
      address,
    } = req.body;

    const newPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserModel({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      emailId: emailId,
      password: newPassword,
      status: 1,
      contact: contact,
      role: role,
      address: address,
    });
    newUser.save();
    if (newUser) {
      res.status(201).json({
        message: "User created successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  const { userName, password, action } = req.body;
  console.log(userName, password, action);
  try {
    const user = await UserModel.findOne({
      $and: [{ userName: userName }, { status: 1 }],
    });
    if (user) {
      if (action === "password") {
        const validPassword = bcrypt.compareSync(password, user.password);
        if (validPassword) {
          const token = jwt.sign(
            {
              userId: user._id,
              userName: user.userName,
              emailId: user.emailId,
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );
          res.status(200).json({
            message: "User Successfully logged in.",
            user: user,
            token: token,
            id: 4,
          });
        } else {
          res.status(200).json({
            message: "Invalid Password.",
            id: 2,
          });
        }
      } else if (action === "otp") {
        const userOTP = Math.floor(
          Math.random() * (999999 - 100000 + 1) + 100000
        );
        const userWithOTP = await UserModel.updateOne(
          { userName: userName, status: 1 },
          { $set: { otp: userOTP } }
        );
        if (userWithOTP.acknowledged) {
          sendEmailWithOTP(user.userName, user.emailId, userOTP);
          expireOTP(userName);
          res.status(200).json({
            message: "User found, OTP authentication pending.",
            // userOTP: userOTP,
            id: 4,
            user: user,
          });
        } else {
          res.status(500).json({
            message: "some error occured.",
          });
        }
        // expireOTP(userName);
      }
    } else {
      res.status(200).json({
        message: "User Not Found",
        id: 1,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const expireOTP = (userName) => {
  setTimeout(() => updateOTP(userName), 300000);
};

const updateOTP = async (userName) => {
  await UserModel.updateOne(
    { userName: userName, status: 1 },
    {
      $set: {
        otp: null,
      },
    }
  );
};

const sendEmailWithOTP = async (userName, userEmail, userOTP) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sanghrajka.chintan@gmail.com",
      pass: "geccbbmvgckimbkz",
    },
  });
  try {
    let info = await transporter.sendMail({
      from: "Sanghrajka Shop",
      to: userEmail,
      subject: "OTP for Login",
      html: `
        <div>
        <p>Dear ${userName},</p>
          <p>Please find below OTP to login into your account.</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${userOTP}</h1>
          <p>Note this OTP is valid only for 5 minute</p>
        <p>Thanks and Regards,</p>
        <p>Team SS</p>
        </div>
        `,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserWithOTP = async (req, res) => {
  const { userName, userOTP } = req.body;
  try {
    const user = await UserModel.findOne({ userName: userName, status: 1 });
    if (user.otp === Number(userOTP)) {
      const token = jwt.sign(
        { userId: user._id, userName: user.userName, emailId: user.emailId },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.cookie("user", user);
      res.status(200).json({
        user: user,
        message: "User authenticated Successfully",
        token: token,
        id: 4,
      });
    } else {
      res.status(200).json({
        message: "Invalid OTP.",
        id: 3,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
