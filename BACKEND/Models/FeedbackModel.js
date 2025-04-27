// models/FeedbackModel.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comments: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // This will automatically add 'createdAt' and 'updatedAt' fields
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
