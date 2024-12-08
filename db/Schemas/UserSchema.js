import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      validate: {
        validator: (v) => {
          return /^[a-zA-Z\s'-]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid name!`,
      },
      required: [true, "Please enter your first name"],
    },
    last_name: {
      type: String,
      validate: {
        validator: (v) => {
          return /^[a-zA-Z\s'-]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid name!`,
      },
      required: [true, "Please enter your last name"],
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    username: {
      type: String,
      required: [true, "Please enter a username"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    avatar: {
      type: String,
      required: [true, "Please choose an avatar"],
    },
    wallet_balance: {
      type: Number,
      required: true,
      default: 15,
    },
    stock_balance: {
      type: Number,
      required: true,
      default: 0,
    },
    previous_balance: {
      type: Number,
      required: true,
      default: 0,
    },
    total_profit: {
      type: Number,
      required: true,
      default: 0,
    },
    number_of_assets: {
      type: Number,
      required: true,
      default: 0,
    },
    total_invested_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    number_of_trades: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model if needed
const User = mongoose.model("User", userSchema);
export default User;
