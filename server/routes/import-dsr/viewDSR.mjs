import express from "express";
import JobModel from "../../model/jobModel.mjs";

const router = express.Router();

router.get("/api/dsr/:year", async (req, res) => {
  try {
    const { year } = req.params;
    const formattedStatus = "Pending";

    // Create a query object with year
    const query = {
      year,
      status: formattedStatus,
    };

    // Query the database based on the criteria in the query object
    const jobs = await JobModel.find(query).select(
      "job_no importer job_date supplier_exporter invoice_number invoice_date awb_bl_no awb_bl_date commodity no_of_pkgs net_weight loading_port free_time container_nos transporter remarks detailed_status"
    );

    // Sort jobs based on detailed_status priority or move empty detailed_status to the end
    jobs.sort((a, b) => {
      const statusPriority = {
        "Custom Clearance Completed": 1,
        "BE Noted, Clearance Pending": 2,
        "BE Noted, Arrival Pending": 3,
        Discharged: 4,
        "Gateway IGM Filed": 5,
        "Estimated Time of Arrival": 6,
      };

      const statusA = a.detailed_status;
      const statusB = b.detailed_status;

      // If detailed_status is empty, move job to the bottom
      if (!statusA && !statusB) {
        return 0;
      } else if (!statusA) {
        return 1;
      } else if (!statusB) {
        return -1;
      }

      // Compare based on priority if both have detailed_status
      const priorityDiff = statusPriority[statusA] - statusPriority[statusB];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // If priorities are the same, maintain relative order
      return 0;
    });

    res.send(jobs);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
