import express from "express";
import OrganisationMaster from "../../model/srcc/OrganisationMaster.mjs";

const router = express.Router();

router.post("/api/add-organisation", async (req, res) => {
  try {
    const { name, branch, addresses } = req.body;

    // Find the document with the matching name
    const organisation = await OrganisationMaster.findOne({ name });

    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found" });
    }

    // Find the branch within the organisation
    const branchIndex = organisation.branches.findIndex(
      (b) => b.branch === branch
    );

    if (branchIndex === -1) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Update the addresses for the matching branch
    organisation.branches[branchIndex].addresses = addresses;

    // Save the updated document
    await organisation.save();

    res.status(200).json({ message: "Addresses updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
