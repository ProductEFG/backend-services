import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: [true, "Please enter a valid email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    avatar: {
      type: String,
      required: [true, "Please choose an avatar"],
    },
    role: {
      type: String,
      required: true,
      default: "Staff",
    },
    country: {
      type: String,
      required: true,
      default: "Egypt",
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
