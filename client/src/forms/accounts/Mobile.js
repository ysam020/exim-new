import React from "react";
import { useFormik } from "formik";
import { TextField } from "@mui/material";
import axios from "axios";
import { validationSchema } from "../../schemas/accounts/mobile";

const Mobile = () => {
  const date = new Date();
  const convertedDate = date
    .toLocaleDateString()
    .split("/")
    .reverse()
    .join("-");

  const formik = useFormik({
    initialValues: {
      company_name: "",
      address: "",
      service_no: "",
      billing_date: convertedDate,
      due_date: convertedDate,
      remarks: "",
    },

    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const res = await axios.post(
        `${process.env.REACT_APP_API_STRING}/add-mobile`,
        values
      );
      resetForm();
      alert(res.data.message);
    },
  });

  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit} className="register-form">
        <h3>Mobile</h3>
        <TextField
          size="small"
          margin="dense"
          variant="outlined"
          fullWidth
          id="company_name"
          name="company_name"
          label="Comapny Name"
          value={formik.values.company_name}
          onChange={formik.handleChange}
          error={
            formik.touched.company_name && Boolean(formik.errors.company_name)
          }
          helperText={formik.touched.company_name && formik.errors.company_name}
        />

        <TextField
          size="small"
          margin="dense"
          variant="outlined"
          fullWidth
          id="address"
          name="address"
          label="Address"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />

        <TextField
          size="small"
          type="text"
          margin="dense"
          variant="outlined"
          fullWidth
          id="service_no"
          name="service_no"
          label="Service No"
          value={formik.values.service_no}
          onChange={formik.handleChange}
          error={formik.touched.service_no && Boolean(formik.errors.service_no)}
          helperText={formik.touched.service_no && formik.errors.service_no}
        />

        <TextField
          size="small"
          type="date"
          margin="dense"
          variant="outlined"
          fullWidth
          id="billing_date"
          name="billing_date"
          label="Billing Date"
          value={formik.values.billing_date}
          onChange={formik.handleChange}
          error={
            formik.touched.billing_date && Boolean(formik.errors.billing_date)
          }
          helperText={formik.touched.billing_date && formik.errors.billing_date}
        />

        <TextField
          size="small"
          type="date"
          margin="dense"
          variant="outlined"
          fullWidth
          id="due_date"
          name="due_date"
          label="Due Date"
          value={formik.values.due_date}
          onChange={formik.handleChange}
          error={formik.touched.due_date && Boolean(formik.errors.due_date)}
          helperText={formik.touched.due_date && formik.errors.due_date}
        />

        <TextField
          size="small"
          type="text"
          margin="dense"
          variant="outlined"
          fullWidth
          id="remarks"
          name="remarks"
          label="Remarks"
          value={formik.values.remarks}
          onChange={formik.handleChange}
          error={formik.touched.remarks && Boolean(formik.errors.remarks)}
          helperText={formik.touched.remarks && formik.errors.remarks}
        />

        <button type="submit" className="btn" aria-labelledby="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Mobile;
