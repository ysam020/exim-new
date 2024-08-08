import express from "express";
import JobModel from "../../model/jobModel.mjs";
import PrModel from "../../model/srcc/prModel.mjs";
import PrData from "../../model/srcc/pr.mjs";

const router = express.Router();

router.put("/api/update-job/:year/:jobNo", async (req, res) => {
  const { jobNo, year } = req.params;
  const {
    container_nos,
    arrival_date,
    free_time,
    checked,
    do_validity_upto_job_level,
    do_revalidation_upto_job_level,
  } = req.body;

  function addDaysToDate(dateString, days) {
    var date = new Date(dateString);
    date.setDate(date.getDate() + days);
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  try {
    // 1. Retrieve the matching job document
    const matchingJob = await JobModel.findOne({ year, job_no: jobNo });

    if (!matchingJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    // 2. Determine the branch_code based on the custom_house field
    let branch_code;
    switch (matchingJob.custom_house) {
      case "ICD SANAND":
        branch_code = "SND";
        break;
      case "ICD KHODIYAR":
        branch_code = "KHD";
        break;
      case "HAZIRA":
        branch_code = "HZR";
        break;
      case "MUNDRA PORT":
        branch_code = "MND";
        break;
      case "ICD SACHANA":
        branch_code = "SCH";
        break;
      case "BARODA":
        branch_code = "BRD";
        break;
      case "AIRPORT":
        branch_code = "AIR";
        break;
      default:
        break;
    }

    // 3. Check if the transporter is "SRCC" in the request body
    if (req.body.container_nos) {
      const transporterContainers = req.body.container_nos.filter(
        (container) => container.transporter === "SRCC"
      );

      if (transporterContainers.length > 0) {
        // 4. Fetch the last document from PrModel and generate a 5-digit number
        const lastPr = await PrModel.findOne().sort({ _id: -1 });

        let lastPrNo;
        if (lastPr) {
          lastPrNo = parseInt(lastPr.pr_no) + 1;
        } else {
          lastPrNo = 1;
        }
        const paddedNo = lastPrNo.toString().padStart(5, "0");
        const fiveDigitNo = "0".repeat(5 - paddedNo.length) + paddedNo;

        // 5. Update the job model
        matchingJob.pr_no = `PR/${branch_code}/${fiveDigitNo}/${matchingJob.year}`;

        // 6. Create a new document in PrData collection
        const newPrData = new PrData({
          pr_date: new Date().toLocaleDateString("en-GB"),
          pr_no: matchingJob.pr_no,
          branch: matchingJob.custom_house,
          consignor: matchingJob.importer,
          consignee: matchingJob.importer,
          container_type: "",
          container_count: transporterContainers.length,
          gross_weight: matchingJob.gross_weight,
          type_of_vehicle: "",
          description: "",
          shipping_line: matchingJob.shipping_line_airline,
          container_loading: "",
          container_offloading: "",
          do_validity: matchingJob.do_validity,
          document_no: matchingJob.be_no,
          document_date: matchingJob.be_date,
          goods_pickup: "",
          goods_delivery: "",
          containers: transporterContainers,
        });

        // Save the new PrData document to the database
        await newPrData.save();

        const newPr = new PrModel({
          pr_no: fiveDigitNo,
        });

        // Save the new PrModel document to the database
        await newPr.save();
      }
    }

    // Step 6: Add remaining fields from req.body to matching job
    if (req.body.arrival_date && req.body.container_nos) {
      // If arrival_date is not empty and container_nos array exists
      req.body.container_nos.forEach((container) => {
        // Apply arrival date to each document in the container_nos array
        container.arrival_date = req.body.arrival_date;
      });
    }

    // Convert examinatinPlanning and doPlanning to boolean values
    const { examinationPlanning, doPlanning, do_revalidation, ...rest } =
      req.body;

    const updatedFields = {
      ...rest,
      examinationPlanning:
        typeof examinationPlanning === "string"
          ? examinationPlanning === "true"
          : !!examinationPlanning,
      doPlanning:
        typeof doPlanning === "string" ? doPlanning === "true" : !!doPlanning,
      do_revalidation:
        typeof do_revalidation === "string"
          ? do_revalidation === "true"
          : !!do_revalidation,
      containers_arrived_on_same_date: checked,
    };

    Object.assign(matchingJob, updatedFields);

    if (checked) {
      matchingJob.container_nos = container_nos.map((container) => {
        return {
          ...container,
          arrival_date: arrival_date,
          detention_from:
            arrival_date === ""
              ? ""
              : addDaysToDate(arrival_date, parseInt(free_time)),
          do_validity_upto_container_level: do_validity_upto_job_level,
          do_revalidation_upto_container_level: do_revalidation_upto_job_level,
        };
      });
    } else {
      matchingJob.container_nos = container_nos.map((container) => {
        return {
          ...container,
          arrival_date: container.arrival_date,
          detention_from:
            container.arrival_date === ""
              ? ""
              : addDaysToDate(container.arrival_date, parseInt(free_time)),
          do_validity_upto_container_level: do_validity_upto_job_level,
          do_revalidation_upto_container_level: do_revalidation_upto_job_level,
        };
      });
    }

    // Step 8: Save the updated job document
    await matchingJob.save();

    res.status(200).json(matchingJob);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

export default router;
