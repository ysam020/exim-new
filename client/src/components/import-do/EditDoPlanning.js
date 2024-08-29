import * as React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { handleFileUpload } from "../../utils/awsFileUpload";
import { useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Row, Col } from "react-bootstrap";

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
      setData({
        ...res.data,
        shipping_line_invoice: res.data.shipping_line_invoice === "Yes",
        payment_made: res.data.payment_made === "Yes",
        do_processed: res.data.do_processed === "Yes",
        other_invoices: res.data.other_invoices === "Yes",
        security_deposit: res.data.security_deposit === "Yes",
      });
    }

    getData();
  }, [_id]);

  const formik = useFormik({
    initialValues: {
      security_deposit: false,
      security_amount: "",
      utr: [],
      other_invoices: false,
      payment_made: false,
      do_processed: false,
      do_documents: [],
      do_validity: "",
      do_copies: [],
      shipping_line_invoice: false,
      shipping_line_invoice_date: "",
      shipping_line_invoice_imgs: [],
      do_queries: [{ query: "", reply: "" }],
      do_completed: false,
    },

    onSubmit: async (values, { resetForm }) => {
      // Convert booleans back to "Yes" or "No"
      const data = {
        ...values,
        _id,
        shipping_line_invoice: values.shipping_line_invoice ? "Yes" : "No",
        payment_made: values.payment_made ? "Yes" : "No",
        do_processed: values.do_processed ? "Yes" : "No",
        do_completed: values.do_completed ? "Yes" : "No",
        other_invoices: values.other_invoices ? "Yes" : "No",
        security_deposit: values.security_deposit ? "Yes" : "No",
      };

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
      const updatedData = {
        ...data,
        do_queries: data.do_queries || [{ query: "", reply: "" }],
      };

      formik.setValues(updatedData);

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

  const handleAddField = () => {
    formik.setValues({
      ...formik.values,
      do_queries: [
        ...formik.values.do_queries,
        {
          query: "",
          reply: "",
        },
      ],
    });
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <h5>Job Number: {data?.job_no}</h5>
        <h5>Importer: {data?.importer}</h5>
        <strong>KYC Documents:&nbsp;</strong>
        <br />
        {kycData.kyc_documents?.map((doc, id) => (
          <div key={id}>
            <a href={doc}>View</a>
            <br />
          </div>
        ))}
        <strong>KYC Valid Upto:&nbsp;</strong>
        {kycData.kyc_valid_upto}
        <br />
        <strong>BL Status:&nbsp;</strong>
        {data?.obl_telex_bl}
        <br />

        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.shipping_line_invoice}
              onChange={(e) =>
                formik.setFieldValue("shipping_line_invoice", e.target.checked)
              }
              name="shipping_line_invoice"
              color="primary"
            />
          }
          label="Shipping line invoice"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.payment_made}
              onChange={(e) =>
                formik.setFieldValue("payment_made", e.target.checked)
              }
              name="payment_made"
              color="primary"
            />
          }
          label="Payment Made"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.do_processed}
              onChange={(e) =>
                formik.setFieldValue("do_processed", e.target.checked)
              }
              name="do_processed"
              color="primary"
            />
          }
          label="DO processed"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.other_invoices}
              onChange={(e) =>
                formik.setFieldValue("other_invoices", e.target.checked)
              }
              name="other_invoices"
              color="primary"
            />
          }
          label="Other invoices"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.security_deposit}
              onChange={(e) =>
                formik.setFieldValue("security_deposit", e.target.checked)
              }
              name="security_deposit"
              color="primary"
            />
          }
          label="Security Deposit"
        />

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

        <Row>
          <Col>
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
            <br />
            {formik.values.shipping_line_invoice_imgs?.map((file, index) => {
              return (
                <div key={index}>
                  <a href={file}>{file}</a>
                  <br />
                </div>
              );
            })}
          </Col>
          <Col>
            {/* Upload DO Processed Attachment */}
            <label htmlFor="do_documents" className="btn">
              DO Documents
            </label>
            <input
              type="file"
              multiple
              name="do_documents"
              id="do_documents"
              onChange={(e) =>
                handleFileUpload(
                  e,
                  "do_documentss",
                  "do_documents",
                  formik,
                  setFileSnackbar
                )
              }
              style={{ display: "none" }}
            />
            <br />
            <br />
            {formik.values.do_documents?.map((file, index) => {
              return (
                <div key={index}>
                  <a href={file}>{file}</a>
                  <br />
                </div>
              );
            })}
          </Col>
          <Col></Col>
        </Row>

        <br />
        {formik.values.security_deposit === "Yes" && (
          <TextField
            fullWidth
            size="small"
            margin="normal"
            variant="outlined"
            id="security_amount"
            name="security_amount"
            label="Security amount"
            value={formik.values.security_amount}
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
        <br />

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
        <br />
        {formik.values.do_copies?.map((file, index) => {
          return (
            <div key={index}>
              <a href={file}>{file}</a>
            </div>
          );
        })}

        <h5>DO Queries</h5>
        {formik.values.do_queries.map((item, id) => {
          return (
            <div key={id}>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                variant="outlined"
                id={`do_queries[${id}].query`}
                name={`do_queries[${id}].query`}
                label="Query"
                value={item.query}
                onChange={formik.handleChange}
              />
              {item.reply}
            </div>
          );
        })}
        <br />
        <button type="button" className="btn" onClick={handleAddField}>
          Add Query
        </button>
        <br />
        <br />
        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.do_completed}
              onChange={(e) =>
                formik.setFieldValue("do_completed", e.target.checked)
              }
              name="do_completed"
              color="primary"
            />
          }
          label="DO Completed"
        />
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
