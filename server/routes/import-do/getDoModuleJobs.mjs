import express from "express";
import JobModel from "../../model/jobModel.mjs";

const router = express.Router();

router.get("/api/get-do-module-jobs", async (req, res) => {
  try {
    const jobs = await JobModel.find(
      {
        $and: [
          { $or: [{ out_of_charge: "" }] },
          {
            $or: [{ do_documents: { $exists: false } }, { do_documents: [] }],
          },
          { $or: [{ doPlanning: true }, { doPlanning: "true" }] },
        ],
      },
      "job_no year importer awb_bl_no shipping_line_airline custom_house obl_telex_bl payment_made"
    );

    res.status(200).send(jobs);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
