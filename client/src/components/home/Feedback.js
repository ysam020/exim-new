import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MenuItem, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleSingleFileUpload } from "../../utils/awsSingleFileUpload";
import Snackbar from "@mui/material/Snackbar";

function Feedback() {
  const navigate = useNavigate();
  const [fileSnackbar, setFileSnackbar] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    module: Yup.string().required("Module is required"),
    issue: Yup.string().required("Issue is required"),
    image: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      module: "",
      issue: "",
      image: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const res = await axios.post(
        `${process.env.REACT_APP_API_STRING}/add-feedback`,
        values
      );
      alert(res.data.message);
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h4>Report a bug</h4>
      <TextField
        fullWidth
        size="small"
        margin="normal"
        variant="outlined"
        id="name"
        name="name"
        label="Enter your name"
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />
      <TextField
        select
        fullWidth
        size="small"
        margin="normal"
        variant="outlined"
        id="module"
        name="module"
        label="Module"
        value={formik.values.module}
        onChange={formik.handleChange}
        error={formik.touched.module && Boolean(formik.errors.module)}
        helperText={formik.touched.module && formik.errors.module}
      >
        <MenuItem value="Accounts">Accounts</MenuItem>
        <MenuItem value="Import - DSR">Import - DSR</MenuItem>
        <MenuItem value="Import - DO">Import - DO</MenuItem>
        <MenuItem value="Import - Operations">Import - Operations</MenuItem>
        <MenuItem value="Employee Onboarding">Employee Onboarding</MenuItem>
        <MenuItem value="Employee KYC">Employee KYC</MenuItem>
        <MenuItem value="Inward Register">Inward Register</MenuItem>
        <MenuItem value="Outward Register">Outward Register</MenuItem>
        <MenuItem value="Export">Export</MenuItem>
        <MenuItem value="SRCC">SRCC</MenuItem>
      </TextField>
      <TextField
        fullWidth
        size="small"
        margin="normal"
        variant="outlined"
        id="issue"
        name="issue"
        label="Issue"
        value={formik.values.issue}
        onChange={formik.handleChange}
        error={formik.touched.issue && Boolean(formik.errors.issue)}
        helperText={formik.touched.issue && formik.errors.issue}
      />
      <label>
        <strong>Upload Image:</strong>&nbsp;
      </label>
      <input
        type="file"
        onChange={(e) =>
          handleSingleFileUpload(
            e,
            "image",
            "feedback",
            formik,
            setFileSnackbar
          )
        }
      />
      <br />
      <br />

      <button type="submit" className="btn">
        Submit
      </button>
      <button
        className="btn"
        style={{ marginLeft: "10px" }}
        type="button"
        onClick={() => navigate("/view-bugs")}
      >
        View All Bugs
      </button>

      <Snackbar
        open={fileSnackbar}
        message="File uploaded successfully!"
        sx={{ left: "auto !important", right: "24px !important" }}
      />
    </form>
  );
}

export default React.memo(Feedback);
