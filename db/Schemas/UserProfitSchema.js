import mongoose from "mongoose";

const userProfitSchema = new mongoose.Schema(
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
    profit: {
      type: Number,
      required: true,
      default: 0,
    },
    investedAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    ROI: {
      type: Number,
      required: true,
      default: function () {
        return this.investedAmount
          ? (this.profit / this.investedAmount) * 100
          : 0;
      },
    },
  },
  {
    timestamps: true,
  }
);

userProfitSchema.pre("save", function (next) {
  if (this.isModified("profit") || this.isModified("investedAmount")) {
    this.ROI = this.investedAmount
      ? (this.profit / this.investedAmount) * 100
      : 0;
  }
  next();
});

const UserProfit = mongoose.model("UserProfit", userProfitSchema);
export default UserProfit;
