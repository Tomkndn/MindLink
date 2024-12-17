const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: { type: String, required: true, minlength: 8,select: false },
    profileUpdated: { type: Boolean, default: false },
    profileImage: {
      type: String,
      default: "",
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    meetings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting",
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    collegeOrSchool: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      trim: true,
      set: (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
