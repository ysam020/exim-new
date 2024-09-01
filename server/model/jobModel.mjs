import mongoose from "mongoose";

const cthDocumentSchema = new mongoose.Schema({
  cth: { type: Number, trim: true },
  document_name: { type: String, trim: true },
  document_code: { type: String, trim: true },
  url: { type: String, trim: true },
  irn: { type: String, trim: true },
});

const documentSchema = new mongoose.Schema({
  document_name: { type: String, trim: true },
  document_code: { type: String, trim: true },
  url: { type: String, trim: true },
  irn: { type: String, trim: true },
});

const jobSchema = new mongoose.Schema({
  ////////////////////////////////////////////////// Excel sheet
  year: { type: String, trim: true },
  job_no: { type: String, trim: true },
  custom_house: { type: String, trim: true },
  job_date: { type: String, trim: true },
  importer: { type: String, trim: true },
  supplier_exporter: { type: String, trim: true },
  invoice_number: { type: String, trim: true },
  invoice_date: { type: String, trim: true },
  awb_bl_no: { type: String, trim: true },
  awb_bl_date: { type: String, trim: true },
  description: { type: String, trim: true },
  be_no: { type: String, trim: true },
  be_date: { type: String, trim: true },
  type_of_b_e: { type: String, trim: true },
  no_of_pkgs: { type: String, trim: true },
  unit: { type: String, trim: true },
  gross_weight: { type: String, trim: true },
  unit_1: { type: String, trim: true },
  gateway_igm: { type: String, trim: true },
  gateway_igm_date: { type: String, trim: true },
  igm_no: { type: String, trim: true },
  igm_date: { type: String, trim: true },
  loading_port: { type: String, trim: true },
  origin_country: { type: String, trim: true },
  port_of_reporting: { type: String, trim: true },
  shipping_line_airline: { type: String, trim: true },
  container_nos: [
    {
      container_number: { type: String, trim: true },
      arrival_date: { type: String, trim: true },
      detention_from: { type: String, trim: true },
      size: { type: String, trim: true },
      physical_weight: { type: String, trim: true },
      tare_weight: { type: String, trim: true },
      net_weight: { type: String, trim: true },
      actual_weight: { type: String, trim: true },
      transporter: { type: String, trim: true },
      vehicle_no: { type: String, trim: true },
      driver_name: { type: String, trim: true },
      driver_phone: { type: String, trim: true },
      seal_no: { type: String, trim: true },
      pre_weighment: { type: String, trim: true },
      post_weighment: { type: String, trim: true },
      weight_shortage: { type: String, trim: true },
      weight_excess: { type: String, trim: true },
      weighment_slip_images: [{ url: { type: String, trim: true } }],
      container_pre_damage_images: [{ url: { type: String, trim: true } }],
      container_images: [{ url: { type: String, trim: true } }],
      loose_material: [{ url: { type: String, trim: true } }],
      examination_videos: [{ url: { type: String, trim: true } }],
      do_revalidation_date: { type: String, trim: true },
      do_validity_upto_container_level: { type: String, trim: true },
      do_revalidation: [
        { do_revalidation_upto: { type: String }, remarks: { type: String } },
      ],
    },
  ],
  container_count: { type: String, trim: true },
  no_of_container: { type: String, trim: true },
  toi: { type: String, trim: true },
  unit_price: { type: String, trim: true },
  cif_amount: { type: String, trim: true },
  assbl_value: { type: String, trim: true },
  total_duty: { type: String, trim: true },
  out_of_charge: { type: String, trim: true },
  consignment_type: { type: String, trim: true },
  bill_no: { type: String, trim: true },
  bill_date: { type: String, trim: true },
  cth_no: { type: String, trim: true },
  exrate: { type: String, trim: true },
  inv_currency: { type: String, trim: true },
  vessel_berthing: {
    type: String,
    trim: true,
  },
  importer_address: { type: String },
  vessel_flight: { type: String },
  voyage_no: { type: String },
  job_owner: { type: String },

  ////////////////////////////////////////////////// DSR
  importerURL: { type: String, trim: true },
  checklist: [{ type: String }],
  checkedDocs: [{ type: String }],
  // *******
  status: { type: String, trim: true },
  detailed_status: { type: String, trim: true },
  // *******
  obl_telex_bl: { type: String },
  document_received_date: { type: String, trim: true },
  doPlanning: { type: Boolean },
  do_planning_date: { type: String, trim: true },
  do_validity_upto_job_level: { type: String, trim: true },
  do_revalidation_upto_job_level: { type: String, trim: true },
  do_revalidation: { type: Boolean },
  do_revalidation_date: { type: String },
  examinationPlanning: { type: Boolean },
  examination_planning_date: { type: String, trim: true },
  processed_be_attachment: [{ type: String }],
  ooc_copies: [{ type: String }],
  gate_pass_copies: [{ type: String }],
  // *******
  sims_reg_no: {
    type: String,
    trim: true,
  },
  pims_reg_no: {
    type: String,
    trim: true,
  },
  nfmims_reg_no: {
    type: String,
    trim: true,
  },
  sims_date: {
    type: String,
    trim: true,
  },
  pims_date: {
    type: String,
    trim: true,
  },
  nfmims_date: {
    type: String,
    trim: true,
  },
  // *******
  discharge_date: {
    type: String,
    trim: true,
  },
  assessment_date: {
    type: String,
    trim: true,
  },
  duty_paid_date: {
    type: String,
    trim: true,
  },
  do_validity: { type: String, trim: true },
  delivery_date: {
    type: String,
    trim: true,
  },
  containers_arrived_on_same_date: Boolean,
  // *******
  remarks: { type: String, trim: true },
  // *******
  free_time: { type: Number, trim: true },
  factory_weighment_slip: { type: String, trim: true },

  ////////////////////////////////////////////////// DO
  shipping_line_bond_completed: { type: String, trim: true },
  shipping_line_bond_completed_date: { type: String, trim: true },
  shipping_line_kyc_completed: { type: String, trim: true },
  shipping_line_kyc_completed_date: { type: String, trim: true },
  shipping_line_invoice_received: { type: String, trim: true },
  shipping_line_invoice_received_date: { type: String, trim: true },
  shipping_line_insurance: [{ type: String, trim: true }],
  // *******
  security_deposit: { type: String },
  security_amount: { type: String },
  utr: [
    {
      type: String,
      trim: true,
    },
  ],
  shipping_line_attachment: [
    {
      type: String,
      trim: true,
    },
  ],
  other_invoices: { type: String, trim: true },
  other_invoices_img: [{ type: String, trim: true }],
  other_invoices_date: { type: String, trim: true },
  payment_made: { type: String, trim: true },
  payment_made_date: { type: String, trim: true },
  do_processed: { type: String, trim: true },
  do_documents: [{ type: String, trim: true }],
  do_processed_date: { type: String, trim: true },
  do_copies: [{ type: String }],
  shipping_line_invoice: { type: String, trim: true },
  shipping_line_invoice_date: { type: String },
  shipping_line_invoice_imgs: [{ type: String, trim: true }],
  do_queries: [{ query: { type: String }, reply: { type: String } }],
  do_completed: { type: String, trim: true },
  // *******
  icd_cfs_invoice: { type: String, trim: true },
  icd_cfs_invoice_img: [{ type: String, trim: true }],
  icd_cfs_invoice_date: { type: String, trim: true },
  bill_document_sent_to_accounts: { type: String, trim: true },

  do_received: { type: String, trim: true },
  do_received_date: { type: String, trim: true },

  ////////////////////////////////////////////////// Operations
  pcv_date: { type: String },
  examination_date: {
    type: String,
    trim: true,
  },
  custodian_gate_pass: [{ type: String, trim: true }],

  ////////////////////////////////////////////////// LR
  pr_no: { type: String, trim: true },
  pr_date: { type: String, trim: true },
  consignor: { type: String },
  consignee: { type: String },
  type_of_vehicle: { type: String },
  description_srcc: { type: String },
  container_loading: { type: String },
  container_offloading: { type: String },
  instructions: { type: String },
  goods_pickup: { type: String },
  goods_delivery: { type: String },

  ////////////////////////////////////////////////// CTH Documents
  cth_documents: [cthDocumentSchema],
  eSachitQueries: [{ query: { type: String }, reply: { type: String } }],

  ////////////////////////////////////////////////////// Documents
  documents: [documentSchema],

  ////////////////////////////////////////////////////// Documentation
  document_entry_completed: { type: Boolean },
  documentationQueries: [
    {
      query: { type: String },
      reply: { type: String },
    },
  ],

  ////////////////////////////////////////////////////// Submission
  checklist_verified_on: { type: String },
  submission_date: { type: String },
  submissionQueries: [
    {
      query: { type: String },
      reply: { type: String },
    },
  ],
});

jobSchema.index({ importerURL: 1, year: 1, status: 1 });
jobSchema.index({ year: 1, job_no: 1 }, { unique: true });

const JobModel = new mongoose.model("Job", jobSchema);
export default JobModel;
