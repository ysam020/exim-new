import mongoose from "mongoose";

const organisationMasterSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  gst: { type: String, trim: true },
  instructions: { type: String, trim: true },
  branches: [
    {
      branch: { type: String, trim: true },
      default: { type: Boolean, default: false },
      addresses: [
        {
          address_type: { type: String, trim: true },
          address: { type: String, trim: true },
          default: { type: Boolean, default: false },
        },
      ],
    },
  ],
  phone: { type: String, trim: true },
  website: { type: String, trim: true },
  email: { type: String, trim: true },
  pan: { type: String, trim: true },
  status: [{ type: String, trim: true }],
});

export default mongoose.model("OrganisationMaster", organisationMasterSchema);
