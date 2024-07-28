import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { useParams } from "react-router-dom";
import { handleFileUpload } from "../../utils/awsFileUpload";
import Snackbar from "@mui/material/Snackbar";

function EditBillingSheet() {
  const [data, setData] = React.useState();
  const [fileSnackbar, setFileSnackbar] = React.useState(false);
  const { _id } = useParams();
  function getCurrentDate() {
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
    var day = ("0" + currentDate.getDate()).slice(-2);

    var formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  }

  var currentDate = getCurrentDate();

  React.useEffect(() => {
    async function getData() {
      const res = await axios(
        `${process.env.REACT_APP_API_STRING}/get-job-by-id/${_id}`
      );
      setData(res.data);
    }

    getData();
  }, [_id]);

  const formik = useFormik({
    initialValues: {
      icd_cfs_invoice: "",
      icd_cfs_invoice_img: [],
      bill_document_sent_to_accounts: currentDate,
    },

    onSubmit: async (values, { resetForm }) => {
      const data = {
        icd_cfs_invoice: values.icd_cfs_invoice,
        bill_document_sent_to_accounts: values.bill_document_sent_to_accounts,
        _id,
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_STRING}/update-do-billing`,
        data
      );
      alert(res.data.message);
      resetForm();
    },
  });

  React.useEffect(() => {
    if (data) {
      formik.setValues(data);
    }
    // eslint-disable-next-line
  }, [data]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        {data && data?.custom_house === "ICD Sabarmati, Ahmedabad" ? (
          <TextField
            select
            fullWidth
            size="small"
            margin="normal"
            variant="outlined"
            id="icd_cfs_invoice"
            name="icd_cfs_invoice"
            label="ICD CFS invoice"
            value={formik.values.icd_cfs_invoice}
            onChange={formik.handleChange}
          >
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
          </TextField>
        ) : (
          ""
        )}

        <label htmlFor="utr" className="btn">
          Upload ICD CFS Invoices
        </label>
        <input
          type="file"
          multiple
          name="icd_cfs_invoice_img"
          id="icd_cfs_invoice_img"
          onChange={(e) =>
            handleFileUpload(
              e,
              "icd_cfs_invoice_img",
              "icd_cfs_invoice_img",
              formik,
              setFileSnackbar
            )
          }
          style={{ display: "none" }}
        />
        <br />
        {formik.values.icd_cfs_invoice_img?.map((file, index) => {
          return (
            <div key={index}>
              <a href={file}>{file}</a>
              <br />
            </div>
          );
        })}
        <br />

        <TextField
          type="date"
          fullWidth
          size="small"
          margin="normal"
          variant="outlined"
          id="bill_document_sent_to_accounts"
          name="bill_document_sent_to_accounts"
          label="Bill document sent to accounts team"
          value={formik.values.bill_document_sent_to_accounts}
          onChange={formik.handleChange}
          InputLabelProps={{ shrink: true }}
        />

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

export default React.memo(EditBillingSheet);
