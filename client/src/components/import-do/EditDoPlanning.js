import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { handleFileUpload } from "../../utils/awsFileUpload";
import { useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";

function EditDoPlanning() {
  const [data, setData] = React.useState();
  const [kycData, setKycData] = React.useState("");
  const [fileSnackbar, setFileSnackbar] = React.useState(false);
  const { _id } = useParams();

  React.useEffect(() => {
    async function getData() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_STRING}/get-job-by-id/${_id}`
      );
      setData(res.data);
    }

    getData();
  }, [_id]);

  const formik = useFormik({
    initialValues: {
      security_deposit: "",
      shipping_line_amount: "",
      utr: [],
      shipping_line_attachment: [],
      other_invoices: "",
      other_invoices_img: [],
      payment_made: "",
      do_processed: "",
      do_processed_attachment: [],
      obl_telex_bl: "",
      do_validity: "",
      do_copies: [],
      shipping_line_invoice: "",
      shipping_line_invoice_date: "",
      shipping_line_invoice_imgs: [],
    },

    onSubmit: async (values, { resetForm }) => {
      const data = { ...values, _id };
      const res = await axios.post(
        `${process.env.REACT_APP_API_STRING}/update-do-planning`,
        data
      );
      alert(res.data.message);
      resetForm();
    },
  });

  React.useEffect(() => {
    if (data) {
      formik.setValues(data);

      async function getKycDocs() {
        const importer = data.importer;
        const shipping_line_airline = data.shipping_line_airline;
        const res = await axios.post(
          `${process.env.REACT_APP_API_STRING}/get-kyc-documents`,
          { importer, shipping_line_airline }
        );
        setKycData(res.data);
      }

      getKycDocs();
    }

    // eslint-disable-next-line
  }, [data]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <strong>KYC Documents:</strong>
        <br />
        {kycData.kyc_documents?.map((doc, id) => (
          <div key={id}>
            <a href={doc}>View</a>
            <br />
          </div>
        ))}
        <strong>KYC Valid Upto:</strong>
        {kycData.kyc_valid_upto}
        <TextField
          select
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          id="security_deposit"
          name="security_deposit"
          label="Security deposit"
          value={formik.values.security_deposit}
          onChange={formik.handleChange}
        >
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
        </TextField>
        {formik.values.security_deposit === "Yes" && (
          <TextField
            fullWidth
            size="small"
            margin="normal"
            variant="outlined"
            id="shipping_line_amount"
            name="shipping_line_amount"
            label="Shipping line amount"
            value={formik.values.shipping_line_amount}
            onChange={formik.handleChange}
          />
        )}
        <strong>UTR:&nbsp;</strong>
        {formik.values.utr?.map((file, index) => {
          return (
            <div key={index}>
              <a href={file}>{file}</a>
              <br />
            </div>
          );
        })}
        <br />
        {/* Upload Shipping Line Attachment */}
        <label htmlFor="shipping_line_attachment" className="btn">
          Upload Shipping Line Attachment
        </label>
        <input
          type="file"
          multiple
          name="shipping_line_attachment"
          id="shipping_line_attachment"
          onChange={(e) =>
            handleFileUpload(
              e,
              "shipping_line_attachments",
              "shipping_line_attachment",
              formik,
              setFileSnackbar
            )
          }
          style={{ display: "none" }}
        />
        {formik.values.shipping_line_attachment?.map((file, index) => {
          return (
            <div key={index}>
              <a href={file}>{file}</a>
              <br />
            </div>
          );
        })}
        <TextField
          select
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          id="other_invoices"
          name="other_invoices"
          label="Other invoices"
          value={formik.values.other_invoices}
          onChange={formik.handleChange}
        >
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
        </TextField>
        {/* Upload Other Invoices */}
        <label htmlFor="other_invoices_img" className="btn">
          Upload Other Invoices
        </label>
        <input
          type="file"
          multiple
          name="other_invoices_img"
          id="other_invoices_img"
          onChange={(e) =>
            handleFileUpload(
              e,
              "other_invoices_img",
              "other_invoices_img",
              formik,
              setFileSnackbar
            )
          }
          style={{ display: "none" }}
        />
        {formik.values.other_invoices_img?.map((file, index) => {
          return (
            <div key={index}>
              <a href={file}>{file}</a>
              <br />
            </div>
          );
        })}
        <TextField
          select
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          id="payment_made"
          name="payment_made"
          label="Payment made"
          value={formik.values.payment_made}
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
          id="do_processed"
          name="do_processed"
          label="DO processed"
          value={formik.values.do_processed}
          onChange={formik.handleChange}
        >
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
        </TextField>
        {/* Upload DO Processed Attachment */}
        <label htmlFor="do_processed_attachment" className="btn">
          DO Processed Attachment
        </label>
        <input
          type="file"
          multiple
          name="do_processed_attachment"
          id="do_processed_attachment"
          onChange={(e) =>
            handleFileUpload(
              e,
              "do_processed_attachments",
              "do_processed_attachment",
              formik,
              setFileSnackbar
            )
          }
          style={{ display: "none" }}
        />
        {formik.values.do_processed_attachment?.map((file, index) => {
          return (
            <div key={index}>
              <a href={file}>{file}</a>
              <br />
            </div>
          );
        })}
        <TextField
          select
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          id="obl_telex_bl"
          name="obl_telex_bl"
          label="BL Status"
          value={formik.values.obl_telex_bl}
          onChange={formik.handleChange}
        >
          <MenuItem value="OBL">OBL</MenuItem>
          <MenuItem value="Telex">Telex</MenuItem>
          <MenuItem value="Surrender BL">Surrender BL</MenuItem>
        </TextField>
        <TextField
          type="date"
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          id="do_validity"
          name="do_validity"
          label="DO Validity"
          value={formik.values.do_validity}
          onChange={formik.handleChange}
          InputLabelProps={{ shrink: true }}
        />
        {/* Upload DO Copies */}
        <label htmlFor="do_copies" className="btn">
          Upload DO Copies
        </label>
        <input
          type="file"
          multiple
          name="do_copies"
          id="do_copies"
          onChange={(e) =>
            handleFileUpload(
              e,
              "do_copies",
              "do_copies",
              formik,
              setFileSnackbar
            )
          }
          style={{ display: "none" }}
        />
        <br />
        {formik.values.do_copies?.map((file, index) => {
          return (
            <div key={index}>
              <a href={file}>{file}</a>
              <br />
            </div>
          );
        })}
        <TextField
          select
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          id="shipping_line_invoice"
          name="shipping_line_invoice"
          label="Shipping line invoice"
          value={formik.values.shipping_line_invoice}
          onChange={formik.handleChange}
        >
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
        </TextField>
        <TextField
          date
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          type="date"
          id="shipping_line_invoice_date"
          name="shipping_line_invoice_date"
          label="Shipping line invoice date"
          value={formik.values.shipping_line_invoice_date}
          onChange={formik.handleChange}
          InputLabelProps={{ shrink: true }}
        />
        {/* Upload Shipping Line Invoices */}
        <label htmlFor="shipping_line_invoice_imgs" className="btn">
          Upload Shipping Line Invoices
        </label>
        <input
          type="file"
          multiple
          name="shipping_line_invoice_imgs"
          id="shipping_line_invoice_imgs"
          onChange={(e) =>
            handleFileUpload(
              e,
              "shipping_line_invoice_imgs",
              "shipping_line_invoice_imgs",
              formik,
              setFileSnackbar
            )
          }
          style={{ display: "none" }}
        />
        <br />
        {formik.values.shipping_line_invoice_imgs?.map((file, index) => {
          return (
            <div key={index}>
              <a href={file}>{file}</a>
              <br />
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

export default React.memo(EditDoPlanning);
