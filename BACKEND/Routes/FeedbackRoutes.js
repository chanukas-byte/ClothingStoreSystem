// routes/FeedbackRoutes.js
const express = require("express");
const router = express.Router();
const Feedback = require("../models/FeedbackModel");

// POST route for submitting feedback (Create)
router.post("/", async (req, res) => {
  try {
    const { name, email, rating, comments } = req.body;

    // Validate input data
    if (!name || !email || !rating || !comments) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create new feedback entry
    const feedback = new Feedback({
      name,
      email,
      rating,
      comments,
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

// GET route for retrieving all feedback (Read)
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // Get most recent feedback first
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

// GET route for retrieving a specific feedback by ID (Read)
router.get("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error retrieving feedback by ID:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

// PUT route for updating feedback by ID (Update)
router.put("/:id", async (req, res) => {
  try {
    const { name, email, rating, comments } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Update feedback fields
    feedback.name = name || feedback.name;
    feedback.email = email || feedback.email;
    feedback.rating = rating || feedback.rating;
    feedback.comments = comments || feedback.comments;

    await feedback.save();
    res.status(200).json({ message: "Feedback updated successfully!" });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

// DELETE route for deleting feedback by ID (Delete)
router.delete("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback deleted successfully!" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

module.exports = router;
 