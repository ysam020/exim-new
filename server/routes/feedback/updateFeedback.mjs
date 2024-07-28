import express from "express";
import FeedbackModel from "../../model/feedbackModel.mjs";

const router = express.Router();

router.post("/api/update-feedback", async (req, res) => {
  let { id, status } = req.body;

  id = parseInt(id, 10);

  try {
    await FeedbackModel.findOneAndUpdate({ id: id }, { status: status });

    res.send({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

export default router;
