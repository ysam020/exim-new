import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { useParams } from "react-router-dom";
import { handleFileUpload } from "../../utils/awsFileUpload";
import Snackbar from "@mui/material/Snackbar";

function EditDoList() {
  const { _id } = useParams();
  const [fileSnackbar, setFileSnackbar] = React.useState(false);
  const kycDocsRef = React.useRef();

  React.useEffect(() => {
    async function getData() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_STRING}/get-kyc-and-bond-status/${_id}`
      );
      const { shipping_line_kyc_completed, shipping_line_bond_completed } =
        res.data;
      formik.setValues({
        ...formik.values,
        shipping_line_kyc_completed: shipping_line_kyc_completed || "No",
        shipping_line_bond_completed: shipping_line_bond_completed || "No",
      });
    }

    getData();
    // eslint-disable-next-line
  }, [_id]);

  const formik = useFormik({
    initialValues: {
      shipping_line_bond_completed: "Yes",
      shipping_line_kyc_completed: "No",
      shipping_line_invoice_received: "No",
      kyc_documents: [],
      kyc_valid_upto: "",
      shipping_line_bond_valid_upto: "",
      shipping_line_bond_docs: [],
    },

    onSubmit: async (values, { resetForm }) => {
      const data = { ...values, _id };
      const res = await axios.post(
        `${process.env.REACT_APP_API_STRING}/update-do-list`,
        data
      );
      alert(res.data.message);
      resetForm();
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          select
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          id="shipping_line_bond_completed"
          name="shipping_line_bond_completed"
          label="Shipping line bond completed"
          value={formik.values.shipping_line_bond_completed}
          onChange={formik.handleChange}
        >
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          id="shipping_line_kyc_completed"
          name="shipping_line_kyc_completed"
          label="Shipping line KYC completed"
          value={formik.values.shipping_line_kyc_completed}
          onChange={formik.handleChange}
        >
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          id="shipping_line_invoice_received"
          name="shipping_line_invoice_received"
          label="Shipping line invoice received"
          value={formik.values.shipping_line_invoice_received}
          onChange={formik.handleChange}
        >
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
        </TextField>

        <TextField
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          type="date"
          id="kyc_valid_upto"
          name="kyc_valid_upto"
          label="KYC valid upto"
          value={formik.values.kyc_valid_upto}
          onChange={formik.handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <label htmlFor="kyc_documents" className="btn">
          Upload KYC Documents
        </label>
        <input
          type="file"
          multiple
          name="kyc_documents"
          id="kyc_documents"
          onChange={(e) =>
            handleFileUpload(
              e,
              "kyc_documents",
              "kyc_documents",
              formik,
              setFileSnackbar
            )
          }
          ref={kycDocsRef}
          className="input-hidden"
        />
        <br />
        {formik.values.kyc_documents?.map((file, index) => {
          return (
            <div key={index}>
              <br />
              <a href={file}>View</a>
            </div>
          );
        })}
        <br />

        <TextField
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          type="date"
          id="shipping_line_bond_valid_upto"
          name="shipping_line_bond_valid_upto"
          label="Shipping line bond valid upto"
          value={formik.values.shipping_line_bond_valid_upto}
          onChange={formik.handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <label htmlFor="shipping_line_bond_docs" className="btn">
          Upload Shipping Line Bond Documents
        </label>
        <input
          type="file"
          multiple
          name="shipping_line_bond_docs"
          id="shipping_line_bond_docs"
          onChange={(e) =>
            handleFileUpload(
              e,
              "shipping_line_bond_docs",
              "shipping_line_bond_docs",
              formik,
              setFileSnackbar
            )
          }
          ref={kycDocsRef}
          className="input-hidden"
        />
        <br />
        {formik.values.shipping_line_bond_docs?.map((file, index) => {
          return (
            <div key={index}>
              <br />
              <a href={file}>View</a>
            </div>
          );
        })}
        <br />
        <button type="submit" className="btn">
          Submit
        </button>
      </form>

      <Snackbar
        open={fileSnackbar}
        message={"File uploaded successfully!"}
        sx={{ left: "auto !important", right: "24px !important" }}
      />
    </div>
  );
}

export default React.memo(EditDoList);
