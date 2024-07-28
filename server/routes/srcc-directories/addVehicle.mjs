import express from "express";
import Vehicles from "../../model/srcc/vehicleModel.mjs";

const router = express.Router();

router.post("/api/add-vehicle", async (req, res) => {
  const { truck_no, max_tyres, type_of_vehicle, units } = req.body;
  console.log(type_of_vehicle);
  try {
    const existingVehicle = await Vehicles.findOne({ truck_no });
    if (existingVehicle) {
      res.status(200).json({ message: "Vehicle already exists" });
    } else {
      const newVehicle = new Vehicles({
        truck_no,
        type_of_vehicle,
        max_tyres,
        units,
        _date: new Date().toLocaleDateString("en-GB"),
      });
      await newVehicle.save();
      res.status(200).json({ message: "Vehicle added successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
