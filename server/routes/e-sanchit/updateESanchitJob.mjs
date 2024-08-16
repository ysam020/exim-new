import express from "express";
import JobModel from "../../model/jobModel.mjs";

const router = express.Router();

router.post("/api/update-esanchit-job", async (req, res) => {
  const { job_no, year, cth_documents, documents, eSachitQueries } = req.body;

  try {
    const job = await JobModel.findOne({ job_no, year });

    if (!job) {
      // Send a response indicating that the job does not exist
      return res.status(200).send({
        message: "Job not found",
      });
    }

    // Update cth_documents
    for (const cthDoc of cth_documents) {
      const index = job.cth_documents.findIndex(
        (doc) => doc.cth === cthDoc.cth
      );
      if (index !== -1) {
        // Update existing document
        job.cth_documents[index] = cthDoc;
      } else {
        // Add new document
        job.cth_documents.push(cthDoc);
      }
    }

    // Update documents
    for (const doc of documents) {
      const index = job.documents.findIndex(
        (d) => d.document_name === doc.document_name
      );
      if (index !== -1) {
        // Update existing document
        job.documents[index] = doc;
      } else {
        // Add new document
        job.documents.push(doc);
      }
    }

    // Update eSachitQueries
    job.eSachitQueries = eSachitQueries;

    await job.save();
    res.send({ message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
