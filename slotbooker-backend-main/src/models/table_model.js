import { Schema, model } from "mongoose";

const TableSchema = new Schema(
  {
    room_name: {
      type: String,
      required: true,
      unique: false,
    },
    table_name: {
      type: String,
      required: true,
    },
    seats_count: {
      type: Number,
      required: true,
    },
    available_seats: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Table", TableSchema);
