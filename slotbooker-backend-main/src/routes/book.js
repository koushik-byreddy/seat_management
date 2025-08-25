import express from "express";
import Book from "../models/book_model.js";
import User from "../models/user_model.js";
import authenticateJWT from "../middlewares/auth.js";
import nodemailer from "nodemailer";

const bookRouter = express.Router();
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  service: "Gmail",
  auth: {
    user: "slotbookers@gmail.com",
    pass: "qodvncfumcpuotyq",
  },
});

bookRouter.post("/add", authenticateJWT, async (req, res) => {
  const { room_name, table_name, user_name, email, count, date, slot } =
    req.body;
  if (count == 0) {
    try {
      const filter = {
        room_name: room_name,
        table_name: table_name,
        user_name: user_name,
        date: date,
        slot: slot,
      };
      const response = await Book.findOneAndDelete(filter);
      const mailOptions = {
        from: "slotbookers@gmail.com",
        to: email,
        subject: "Reservation",
        text: `You reservation is cancelled in ${room_name}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        console.log(error);
      });
      return res.status(200).json({ book: "deleted" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ code: "update_room_failed", err });
    }
  }
  try {
    const filter = {
      room_name: room_name,
      table_name: table_name,
      user_name: user_name,
      date: date,
      slot: slot,
    };
    const update = {
      room_name: room_name,
      table_name: table_name,
      user_name: user_name,
      count: count,
      date: date,
      slot: slot,
    };
    const book = await Book.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    });
    const mailOptions = {
      from: "slotbookers@gmail.com",
      to: email,
      subject: "Reservation",
      text: `You reserved  ${count} seat [s] in ${room_name} on ${date} @${slot}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      console.log(error);
    });
    return res.status(200).json({ book });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ code: "update_book_failed", err });
  }
});

bookRouter.get("/", async (req, res) => {
  try {
    const book = await Book.find();
    res.status(200).json({ book });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ code: "failed", err });
  }
});

export default bookRouter;
