import express from "express";
import CustomerKycModel from "../../model/customerKycModel.mjs";

const router = express.Router();

router.get("/api/get-organisations", async (req, res) => {
  const data = await CustomerKycModel.find();
  res.status(200).json(data);
});

export default router;
