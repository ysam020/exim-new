import express from "express";
import CustomerKycModel from "../../model/customerKycModel.mjs";

const router = express.Router();

router.get("/api/view-customer-kyc", async (req, res) => {
  try {
    const data = await CustomerKycModel.find({ draft: "false" }).select(
      "_id name_of_individual category status iec_no approval approved_by remarks"
    );
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

export default router;
