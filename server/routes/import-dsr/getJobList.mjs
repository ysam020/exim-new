import express from "express";
import JobModel from "../../model/jobModel.mjs";

const router = express.Router();

router.get("/api/:year/jobs/:status/:detailedStatus", async (req, res) => {
  try {
    const { year, status, detailedStatus } = req.params;

    // Create a query object with year
    const query = {
      year,
      be_no: { $ne: "CANCELLED" },
    };

    // Filter by specific status
    query.status = status;

    // Match the detailed status stored in db
    if (detailedStatus !== "all") {
      if (detailedStatus === "estimated_time_of_arrival") {
        query.detailed_status = "Estimated Time of Arrival";
      } else if (detailedStatus === "discharged") {
        query.detailed_status = "Discharged";
      } else if (detailedStatus === "gateway_igm_filed") {
        query.detailed_status = "Gateway IGM Filed";
      } else if (detailedStatus === "be_noted_arrival_pending") {
        query.detailed_status = "BE Noted, Arrival Pending";
      } else if (detailedStatus === "be_noted_clearance_pending") {
        query.detailed_status = "BE Noted, Clearance Pending";
      } else if (detailedStatus === "custom_clearance_completed") {
        query.detailed_status = "Custom Clearance Completed";
      }
    }

    // Query the database and select relevant fields for sorting
    let jobs;

    if (detailedStatus === "all") {
      jobs = await JobModel.find(query).select(
        "job_no year importer custom_house awb_bl_no container_nos vessel_berthing detailed_status be_no be_date loading_port port_of_reporting"
      );
    } else if (detailedStatus === "estimated_time_of_arrival") {
      jobs = await JobModel.find(query).select(
        "job_no year importer custom_house awb_bl_no container_nos vessel_berthing detailed_status be_no be_date loading_port port_of_reporting"
      );
    } else if (detailedStatus === "discharged") {
      jobs = await JobModel.find(query).select(
        "job_no year importer custom_house awb_bl_no container_nos vessel_berthing discharge_date  detailed_status be_no be_date loading_port port_of_reporting"
      );
    } else if (detailedStatus === "gateway_igm_filed") {
      jobs = await JobModel.find(query).select(
        "job_no year importer custom_house awb_bl_no container_nos vessel_berthing detailed_status be_no be_date loading_port port_of_reporting"
      );
    } else if (detailedStatus === "be_noted_arrival_pending") {
      jobs = await JobModel.find(query).select(
        "job_no year importer custom_house be_no be_date container_nos vessel_berthing detailed_status be_no be_date loading_port port_of_reporting"
      );
    } else if (detailedStatus === "be_noted_clearance_pending") {
      jobs = await JobModel.find(query).select(
        "job_no year importer custom_house be_no be_date container_nos vessel_berthing detailed_status be_no be_date loading_port port_of_reporting"
      );
    } else if (detailedStatus === "custom_clearance_completed") {
      jobs = await JobModel.find(query).select(
        "job_no year importer custom_house be_no be_date container_nos vessel_berthing out_of_charge detailed_status be_no be_date loading_port port_of_reporting"
      );
    } else {
      jobs = await JobModel.find(query).select(
        "job_no year importer custom_house awb_bl_no container_nos vessel_berthing detailed_status be_no be_date "
      );
    }

    // Apply the provided sorting logic to the jobs array
    jobs.sort((a, b) => {
      // First priority: 'Custom Clearance Completed'
      if (a.detailed_status === "Custom Clearance Completed") return -1;
      if (b.detailed_status === "Custom Clearance Completed") return 1;

      // Second priority: if be_no is not available, sort by nearest vessel_berthing date to the current date
      const currentDate = new Date().toISOString().split("T")[0]; // Format to 'yyyy-mm-dd'

      if (!a.be_no && !b.be_no) {
        const dateA = new Date(a.vessel_berthing);
        const dateB = new Date(b.vessel_berthing);
        const currentDateObj = new Date(currentDate);

        // Calculate absolute difference from the current date
        const diffA = Math.abs(dateA - currentDateObj);
        const diffB = Math.abs(dateB - currentDateObj);

        // Sort by nearest vessel_berthing date
        return diffA - diffB;
      }

      // If only one has be_no missing, prioritize the one without be_no
      if (!a.be_no) return -1;
      if (!b.be_no) return 1;

      // Otherwise, maintain relative order
      return 0;
    });

    // Calculate the total count of matching documents
    const total = jobs.length;

    res.json({ data: jobs, total });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
