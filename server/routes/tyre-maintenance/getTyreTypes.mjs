import express from "express";
import TyreTypes from "../../model/srcc/tyreTypes.mjs";

const router = express.Router();

router.get("/api/get-tyre-types", async (req, res) => {
  try {
    const existingTyreType = await TyreTypes.find({});
    if (existingTyreType) {
      res.status(200).json(existingTyreType);
    } else {
      res.status(200).json({ message: "No tyre type found" });
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
