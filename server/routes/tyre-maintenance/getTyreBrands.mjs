import express from "express";
import TyreBrand from "../../model/srcc/tyreBrand.mjs";

const router = express.Router();

router.get("/api/get-tyre-brands", async (req, res) => {
  const existingTyreBrand = await TyreBrand.find({});

  if (existingTyreBrand) {
    res.status(200).json(existingTyreBrand);
  } else {
    res.status(200).json({ message: "No tyre brand found" });
  }
});

export default router;
