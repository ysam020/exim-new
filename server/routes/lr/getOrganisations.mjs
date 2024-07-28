import express from "express";
import OrganisationMaster from "../../model/srcc/OrganisationMaster.mjs";

const router = express.Router();

router.get("/api/get-organisations", async (req, res) => {
  const data = await OrganisationMaster.find();
  res.status(200).json(data);
});

export default router;
