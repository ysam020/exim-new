import express from "express";
import JobModel from "../../model/jobModel.mjs";
import LastJobsDate from "../../model/jobsLastUpdatedOnModel.mjs";

const router = express.Router();

router.post("/api/jobs/add-job", async (req, res) => {
  const jsonData = req.body;

  try {
    const bulkOperations = [];

    for (const data of jsonData) {
      const {
        year,
        job_no,
        be_no,
        be_date,
        invoice_number,
        invoice_date,
        awb_bl_no,
        awb_bl_date,
        bill_no,
        bill_date,
        no_of_pkgs,
        gross_weight,
        exrate,
        cif_amount,
        unit_price,
      } = data;

      // Define the filter to find existing jobs
      const filter = { year, job_no };

      // Check if the job already exists in the database
      const existingJob = await JobModel.findOne(filter);
      if (existingJob) {
        // If Bl No is same, update only few fields
        if (existingJob.awb_bl_no === awb_bl_no) {
          // Preserve the existing container_nos if present
          if (existingJob.container_nos.length > 0) {
            data.container_nos = existingJob.container_nos;
          }
          // Preserve the existing vessel_berthing_date if present
          data.vessel_berthing_date = existingJob.vessel_berthing_date;

          // Define the update to set new data, including "container_nos", "be_no", and "be_date"
          const update = {
            $set: {
              ...data,
              status:
                existingJob && existingJob.status === "Completed"
                  ? existingJob.status
                  : computeStatus(data.bill_date),
              be_no, // Always update be_no
              be_date, // Always update be_date
              invoice_number,
              invoice_date,
              awb_bl_no,
              awb_bl_date,
              bill_no,
              bill_date,
              no_of_pkgs,
              gross_weight,
              exrate,
              cif_amount,
              unit_price,
            },
          };

          // Create the bulk update operation for upsert or update
          const bulkOperation = {
            updateOne: {
              filter,
              update,
              upsert: true, // Create if it doesn't exist
            },
          };

          bulkOperations.push(bulkOperation);
        } else {
          // Update everything
          const update = {
            $set: {
              ...data,
              status:
                existingJob && existingJob.status === "Completed"
                  ? existingJob.status
                  : computeStatus(data.bill_date),
            },
          };

          // Create the bulk update operation for upsert or update
          const bulkOperation = {
            updateOne: {
              filter,
              update,
              upsert: true, // Create if it doesn't exist
            },
          };

          bulkOperations.push(bulkOperation);
        }
      }

      // If job does not exists, add jobs
      const update = {
        $set: {
          ...data,
          status:
            existingJob && existingJob.status === "Completed"
              ? existingJob.status
              : computeStatus(data.bill_date),
          be_no,
          be_date,
          invoice_number,
          invoice_date,
          awb_bl_no,
          awb_bl_date,
          bill_no,
          bill_date,
          no_of_pkgs,
          gross_weight,
          exrate,
          cif_amount,
          unit_price,
        },
      };

      // Create the bulk update operation for upsert or update
      const bulkOperation = {
        updateOne: {
          filter,
          update,
          upsert: true, // Create if it doesn't exist
        },
      };

      bulkOperations.push(bulkOperation);
    }

    // Execute the bulkWrite operation to update or insert multiple jobs
    await JobModel.bulkWrite(bulkOperations);

    try {
      const existingDateDocument = await LastJobsDate.findOne();
      const date = new Date().toLocaleDateString();
      if (existingDateDocument) {
        // If a document exists, update its date field
        existingDateDocument.date = date;
        await existingDateDocument.save();
      } else {
        // If no document exists, create a new one and save it to the database
        const jobsLastUpdatedOn = new LastJobsDate({ date });
        await jobsLastUpdatedOn.save();
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while updating the date.");
    }

    res.status(200).json({ message: "Jobs added/updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

function computeStatus(billDate) {
  return billDate === "" || billDate === "--" ? "Pending" : "Completed";
}

export default router;
