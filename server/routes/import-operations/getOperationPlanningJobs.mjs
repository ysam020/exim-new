import express from "express";
import JobModel from "../../model/jobModel.mjs";
import User from "../../model/userModel.mjs";

const router = express.Router();

router.get(
  "/api/get-operations-planning-jobs/:username/:date",
  async (req, res) => {
    const { username, date } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(200).send({ message: "User not found" });
    }

    let additionalCondition = {
      examination_planning_date: { $eq: date },
    };

    let customHouseCondition = {};
    switch (username) {
      case "majhar_khan":
        customHouseCondition = {
          custom_house: { $in: ["ICD SANAND", "ICD SACHANA"] },
        };
        break;
      case "parasmal_marvadi":
        customHouseCondition = { custom_house: "AIR CARGO" };
        break;
      case "mahesh_patil":
      case "prakash_darji":
        customHouseCondition = { custom_house: "KHODIYAR" };
        break;
      case "gaurav_singh":
        customHouseCondition = { custom_house: { $in: ["HAZIRA", "BARODA"] } };
        break;
      case "akshay_rajput":
        customHouseCondition = { custom_house: "ICD VARNAMA" };
        break;
      default:
        customHouseCondition = {}; // No additional filter
        break;
    }

    const jobs = await JobModel.find(
      {
        $or: [{ examinationPlanning: true }, { examinationPlanning: "true" }],
        ...additionalCondition,
        ...customHouseCondition,
      },
      "job_no be_no be_date container_nos examination_planning_date examination_planning_time pcv_date custom_house out_of_charge year"
    ).sort({ examination_planning_date: 1 });

    res.status(200).send(jobs);
  }
);

export default router;
