const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    email: {
      type: String,
      max: 50,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [1024, "Password cannot exceed 1024 characters"],
      select: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "userType",
      },
    userType: {
      type: String,
      enum: ["admin", "customer"],
      required: true,
    },
    verificationCode: {
        type: String,
        select: false,
    },
    otpLastSentTime: {
        type: Number,
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    costEstimation: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "CostEstimation",
      default: [],
  }],
});

module.exports = mongoose.model("User", userSchema);