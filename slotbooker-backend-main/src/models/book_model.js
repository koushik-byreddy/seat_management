import { Schema, model } from "mongoose";

const BookSchema = new Schema(
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
    user_name: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Book", BookSchema);
