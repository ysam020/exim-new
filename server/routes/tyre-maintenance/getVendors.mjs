import express from "express";
import Vendors from "../../model/srcc/vendors.mjs";

const router = express.Router();

router.get("/api/get-vendors", async (req, res) => {
  try {
    const existingVendors = await Vendors.find({});
    if (existingVendors) {
      res.status(200).json(existingVendors);
    } else {
      res.status(200).json({ message: "No vendors found" });
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
