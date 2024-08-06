import express from "express";
import JobModel from "../../model/jobModel.mjs";

const router = express.Router();

router.get("/api/do-team-list-of-jobs", async (req, res) => {
  const jobs = await JobModel.find(
    {
      be_no: { $ne: "" },
      bill_date: "",
      $or: [
        { shipping_line_bond_completed_date: { $exists: false } },
        { shipping_line_bond_completed_date: "" },
        { shipping_line_bond_completed_date: { $ne: "" } },
      ],
      $or: [
        { shipping_line_kyc_completed_date: { $exists: false } },
        { shipping_line_kyc_completed_date: "" },
      ],
      $or: [
        { shipping_line_invoice_received_date: { $exists: false } },
        { shipping_line_invoice_received_date: "" },
      ],
    },
    "job_no awb_bl_no shipping_line_airline custom_house obl_telex_bl importer"
  );

  res.status(200).send(jobs);
});

export default router;
