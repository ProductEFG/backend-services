import mongoose from "mongoose";

const stockHistorySchema = new mongoose.Schema(
  {
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
    visitors: {
      type: Number,
      required: true,
      min: 0,
    },
    shares_price: {
      type: Number,
      required: true,
      min: 0,
    },
    shares_return: {
      type: Number,
      required: true,
    },
    number_of_buys: {
      type: Number,
      required: true,
    },
    number_of_sells: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // optional, adds createdAt and updatedAt fields
  }
);

const StockHistory = mongoose.model("StockHistory", stockHistorySchema);
export default StockHistory;
