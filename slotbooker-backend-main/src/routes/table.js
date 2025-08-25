import express from "express";
import Table from "../models/table_model.js";
import authenticateJWT from "../middlewares/auth.js";

const tableRouter = express.Router();

tableRouter.post("/fetch", authenticateJWT, async (req, res) => {
  const room = req.body.room;
  try {
    const tables = await Table.find({ room_name: room });
    return res.status(200).json({ tables });
  } catch (err) {
    return res.status(400).json({
      code: "fetch_tables_failed",
      error: "Something went wrong. Please try again later",
    });
  }
});

tableRouter.post("/fetch_user", authenticateJWT, async (req, res) => {
  const user = req.body.user;
  try {
    const tables = await Table.find({ user_name: user });
    return res.status(200).json({ tables });
  } catch (err) {
    return res.status(400).json({
      code: "fetch_tables_failed",
      error: "Something went wrong. Please try again later",
    });
  }
});

tableRouter.post("/add", authenticateJWT, async (req, res) => {
  const role = req.role;
  const { room_name, table_name, seats_count } = req.body;

  if (role == "user") {
    return res.status(401).json({
      code: "adding_tables_failed",
      error: "Only admin can add tables",
    });
  }
  try {
    const test = await Table.findOne({ room_name, table_name });
    if (test) {
      return res.status(400).json({
        code: "adding_table_failed",
        error: "Table already exists, try with different name",
      });
    }
    const table = new Table({
      room_name,
      table_name,
      seats_count,
      available_seats: seats_count,
    });
    await table.save();
    return res.status(200).json({ table });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ code: "adding_table_failed", err });
  }
});

tableRouter.post("/update", authenticateJWT, async (req, res) => {
  const { room_name, table_name, user_name, available_count } = req.body;

  try {
    const filter = {
      room_name: room_name,
      table_name: table_name,
      user_name: user_name,
    };
    const update = {
      available_count: available_count,
    };
    const room = await Table.findOneAndUpdate(filter, update, {
      new: true,
    });
    return res.status(200).json({ room });
  } catch (err) {
    return res.status(400).json({ code: "update_table_failed", err });
  }
});

export default tableRouter;
