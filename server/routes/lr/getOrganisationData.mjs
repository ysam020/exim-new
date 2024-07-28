import express from "express";
import OrganisationMaster from "../../model/srcc/OrganisationMaster.mjs";

const router = express.Router();

router.post("/api/get-organisation-data", async (req, res) => {
  
  const { name } = req.body;
  const data = await OrganisationMaster.findOne({ name });
  res.status(200).json(data);
});

export default router;
