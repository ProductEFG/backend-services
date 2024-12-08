import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      enum: ["Sell", "Buy"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    Profit: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, // optional, adds createdAt and updatedAt fields
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
