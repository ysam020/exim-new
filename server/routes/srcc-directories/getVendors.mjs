import express from "express";
import Vendors from "../../model/srcc/vendors.mjs";

const router = express.Router();

router.get("/api/get-vendors", async (req, res) => {
  try {
    const vendors = await Vendors.find({});
    if (vendors.length === 0) {
      res.status(200).json({ message: "No vendors found" });
    }

    res.status(200).json(vendors);
  } catch (err) {
    console.log(err);
  }
});

export default router;
