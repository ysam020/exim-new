import express from "express";
import DocumentListModel from "../../model/cthDocumentsModel.mjs";

const router = express.Router();

router.get("/api/get-cth-docs/:cth_no", async (req, res) => {
  const { cth_no } = req.params;
  const data = await DocumentListModel.find({ cth: parseInt(cth_no) });

  if (!data) {
    return res.status(200).send("Data not found");
  }
  res.status(200).json(data);
});

export default router;
