import mongoose from "mongoose";

const companySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the company name"],
    },
    acronym: {
      type: String,
      required: false,
      unique: true,
      minlength: [2, "Acronyms must be at least 2 characters long"],
      maxlength: [5, "Acronyms must be at most 5 characters long"],
    },
    description: {
      type: String,
      required: [true, "Please enter a description for the company"],
    },
    establishment_type: {
      type: String,
      required: [true, "Please enter an establishment type for the company"],
    },
    logo: {
      type: String,
      required: [true, "Please upload a logo for the company"],
    },
    current_price: {
      type: Number,
      required: [true, "Every company must have a stock price"],
      default: 0,
    },
    current_change: {
      type: Number,
      required: true,
      default: 0,
    },
    current_visitors: {
      type: Number,
      required: true,
      default: 0,
    },
    number_of_buys: {
      type: Number,
      required: true,
      default: 0,
    },
    number_of_sells: {
      type: Number,
      required: true,
      default: 0,
    },
    number_of_trades: {
      type: Number,
      required: true,
      default: 0,
    },
    current_return: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
