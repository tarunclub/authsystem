const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
      minlength: 2,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 15,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [5, "minimum 5 characters long"],
      maxlength: [15, "maximum 15 characters long"],
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
