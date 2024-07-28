import express from "express";
import JobModel from "../../model/jobModel.mjs";

const router = express.Router();

router.post("/api/update-esanchit-job", async (req, res) => {
  const { job_no, year, cth_documents, documents } = req.body;

  try {
    const job = await JobModel.findOne({ job_no, year });

    if (!job) {
      // If job does not exist, create a new job document
      const newJob = new JobModel({
        job_no,
        year,
        cth_documents: cth_documents.map((doc) => ({
          cth: doc.cth,
          document_name: doc.document_name,
          url: doc.url,
          irn: doc.irn,
        })),
        documents: documents.map((doc) => ({
          document_name: doc.document_name,
          url: doc.url,
          irn: doc.irn,
        })),
      });

      await newJob.save();
      return res.send({
        message: "Job created and updated successfully",
        job: newJob,
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

    await job.save();
    res.send({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
