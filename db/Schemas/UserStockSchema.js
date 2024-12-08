import mongoose from "mongoose";

const userStockSchema = new mongoose.Schema(
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    buy_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const UserStock = mongoose.model("UserStock", userStockSchema);
export default UserStock;
