import express from "express";
import FeedbackModel from "../../model/feedbackModel.mjs";

const router = express.Router();

router.post("/api/add-feedback", async (req, res) => {
  const { name, module, issue, image } = req.body;

  try {
    let lastDocument = await FeedbackModel.findOne({}).sort({ id: -1 });
    let lastId = lastDocument?.id || 0;

    // Create a new instance of FeedbackModel with the incremented ID
    const newFeedback = new FeedbackModel({
      id: lastId + 1,
      name,
      module,
      issue,
      image,
      status: "Raised",
    });

    // Save the new feedback to the database
    await newFeedback.save();
    res.status(201).json({ message: "Feedback saved successfully" });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
