import mongoose from "mongoose";

const UserWithdrawSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    opening_balance: {
      type: Number,
      required: true,
    },
    closing_balance: {
      type: Number,
      required: true,
    },
    withdraw_amount: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true, // optional, adds createdAt and updatedAt fields
  }
);

const UserWithdraw = mongoose.model("UserWithdraw", UserWithdrawSchema);
export default UserWithdraw;
