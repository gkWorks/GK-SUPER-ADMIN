const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: {
       type: String,
    },
    resetTokenExpiration: {
      type: Date,
    }
  },
  {
    collection: "user-data",
  }
);

const User = mongoose.model("userData", UserSchema);

module.exports = User;
