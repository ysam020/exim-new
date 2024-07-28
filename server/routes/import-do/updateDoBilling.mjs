import express from "express";
import JobModel from "../../model/jobModel.mjs";
const router = express.Router();

router.post("/api/update-do-billing", async (req, res) => {
  const {
    icd_cfs_invoice,
    icd_cfs_invoice_img,
    bill_document_sent_to_accounts,
    _id,
  } = req.body;

  try {
    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Fetch the existing job document
    const existingJob = await JobModel.findOne({ _id });

    if (!existingJob) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    const updateFields = {};
    updateFields.icd_cfs_invoice = icd_cfs_invoice;
    updateFields.icd_cfs_invoice_img = icd_cfs_invoice_img;
    updateFields.icd_cfs_invoice_date = currentDate;
    updateFields.bill_document_sent_to_accounts =
      bill_document_sent_to_accounts;

    await JobModel.findOneAndUpdate(
      { _id },
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({ message: "Details submitted" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
