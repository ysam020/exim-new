import express from "express";
import FeedbackModel from "../../model/feedbackModel.mjs";

const router = express.Router();

router.get("/api/get-feedback", async (req, res) => {
  const data = await FeedbackModel.find({});
  res.send(data);
});

export default router;
