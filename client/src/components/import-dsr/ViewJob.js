import React, { useState, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { IconButton, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import "../../styles/job-details.scss";
import useFetchJobDetails from "../../customHooks/useFetchJobDetails";
import Checkbox from "@mui/material/Checkbox";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Snackbar from "@mui/material/Snackbar";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import AWS from "aws-sdk";
import { handleFileUpload } from "../../utils/awsFileUpload";
import { handleCopyContainerNumber } from "../../utils/handleCopyContainerNumber";
import JobDetailsStaticData from "./JobDetailsStaticData";
import JobDetailsRowHeading from "./JobDetailsRowHeading";
import FormGroup from "@mui/material/FormGroup";
import { TabValueContext } from "../../contexts/TabValueContext";
import { handleActualWeightChange } from "../../utils/handleActualWeightChange";
import { handleNetWeightChange } from "../../utils/handleNetWeightChange";
import { handleTareWeightChange } from "../../utils/handleTareWeightChange";
import { handlePhysicalWeightChange } from "../../utils/handlePhysicalWeightChange";

function JobDetails() {
  const params = useParams();
  const { setTabValue } = React.useContext(TabValueContext);
  const options = Array.from({ length: 25 }, (_, index) => index);
  const [checked, setChecked] = useState(false);
  const [selectedRegNo, setSelectedRegNo] = useState();
  const [snackbar, setSnackbar] = useState(false);
  const [fileSnackbar, setFileSnackbar] = useState(false);
  const bl_no_ref = useRef();
  const checklistRef = useRef();
  const processedBeAttachmentRef = useRef();
  const oocCopyRef = useRef();
  const gatePassCopyRef = useRef();
  const weighmentSlipRef = useRef();
  const container_number_ref = useRef([]);
  const today = new Date().toISOString().split("T")[0];
  const { data, detentionFrom, formik } = useFetchJobDetails(
    params,
    checked,
    setSelectedRegNo,
    setTabValue
  );

  const handleRadioChange = (event) => {
    if (event.target.value === "clear") {
      setSelectedRegNo("");
    } else {
      setSelectedRegNo(event.target.value);
    }
  };

  const handleWeighmentSlip = async (e, container_number) => {
    if (e.target.files.length === 0) {
      alert("No file selected");
      return;
    }

    try {
      const s3 = new AWS.S3({
        accessKeyId: process.env.REACT_APP_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
        region: "ap-south-1",
      });

      const updatedWeighmentSlips = await Promise.all(
        formik.values.container_nos?.map(async (container) => {
          if (container.container_number === container_number) {
            // Upload the new images
            const weighmentSlipUrls = [];

            for (let i = 0; i < e.target.files.length; i++) {
              const file = e.target.files[i];
              const params = {
                Bucket: "exim-images-sameer",
                Key: `weighment_slips/${container_number}/${file.name}`,
                Body: file,
              };

              // Upload the file to S3 and wait for the promise to resolve
              const data = await s3.upload(params).promise();

              // Store the S3 URL in the weighmentSlipUrls array
              weighmentSlipUrls.push({ url: data.Location, container_number });
            }

            // Update the container with the new images, replacing the old ones
            return {
              ...container,
              weighment_slip_images: weighmentSlipUrls,
            };
          }

          return container;
        })
      );

      // Update the formik values with the updated container images
      formik.setValues((values) => ({
        ...values,
        container_nos: updatedWeighmentSlips,
      }));

      setFileSnackbar(true);

      setTimeout(() => {
        setFileSnackbar(false);
      }, 3000);
    } catch (err) {
      console.error("Error uploading files:", err);
    }
  };

  const handleTransporterChange = (e, index) => {
    console.log(e.target.checked);
    if (e.target.checked === true) {
      formik.setFieldValue(`container_nos[${index}].transporter`, "SRCC");
    } else {
      formik.setFieldValue(`container_nos[${index}].transporter`, "");
    }
  };

  return (
    <>
      {data !== null && (
        <form onSubmit={formik.handleSubmit}>
          <JobDetailsStaticData
            data={data}
            params={params}
            bl_no_ref={bl_no_ref}
            setSnackbar={setSnackbar}
          />

          {/*************************** Row 8 ****************************/}
          <div className="job-details-container">
            <JobDetailsRowHeading heading="Description and Checklist" />
            <Row className="job-detail-row">
              <div className="job-detail-input-container">
                <strong>Description:&nbsp;</strong>
                <TextField
                  size="small"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <label htmlFor="checlist" className="btn">
                  Upload Checklist
                </label>
                <input
                  type="file"
                  multiple
                  name="checlist"
                  id="checlist"
                  onChange={(e) =>
                    handleFileUpload(
                      e,
                      "checklist",
                      "checklist",
                      formik,
                      setFileSnackbar
                    )
                  }
                  ref={checklistRef}
                  className="input-hidden"
                />

                {formik.values.checklist?.map((file, index) => {
                  return (
                    <div key={index}>
                      <br />
                      <a href={file}>{file}</a>
                    </div>
                  );
                })}
              </div>
            </Row>
          </div>
          {/*************************** Row 9 ****************************/}
          <div className="job-details-container">
            <JobDetailsRowHeading heading="Status" />
            <Row>
              <Col xs={12} lg={3}>
                <div className="job-detail-input-container">
                  <strong>Status:&nbsp;</strong>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    margin="normal"
                    variant="outlined"
                    id="status"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </TextField>
                </div>
              </Col>
              <Col xs={12} lg={4}>
                <div className="job-detail-input-container">
                  <strong>Detailed Status:&nbsp;</strong>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    margin="normal"
                    variant="outlined"
                    id="detailed_status"
                    name="detailed_status"
                    value={formik.values.detailed_status}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="Estimated Time of Arrival">
                      Estimated Time of Arrival
                    </MenuItem>
                    <MenuItem value="Gateway IGM Filed">
                      Gateway IGM Filed
                    </MenuItem>
                    <MenuItem value="Discharged">Discharged</MenuItem>
                    <MenuItem value="BE Noted, Arrival Pending">
                      BE Noted, Arrival Pending
                    </MenuItem>
                    <MenuItem value="BE Noted, Clearance Pending">
                      BE Noted, Clearance Pending
                    </MenuItem>
                    <MenuItem value="Custom Clearance Completed">
                      Custom Clearance Completed
                    </MenuItem>
                  </TextField>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={3}>
                <div
                  className="job-detail-input-container"
                  style={{ justifyContent: "flex-start" }}
                >
                  <strong>DO Planning:&nbsp;</strong>

                  <Checkbox
                    value={formik.values.doPlanning}
                    checked={formik.values.doPlanning}
                    onChange={(e) => {
                      const newValue = e.target.checked;
                      formik.setFieldValue("doPlanning", newValue);
                    }}
                  />
                </div>
              </Col>
              <Col xs={12} lg={4}>
                <div className="job-detail-input-container">
                  <strong>DO Planning Date:&nbsp;</strong>
                  <TextField
                    fullWidth={true}
                    size="small"
                    type="date"
                    margin="normal"
                    variant="outlined"
                    id="do_planning_date"
                    name="do_planning_date"
                    value={formik.values.do_planning_date}
                    onChange={formik.handleChange}
                    inputProps={{
                      min: data.do_planning_date
                        ? data.do_planning_date
                        : today,
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={3}>
                <div
                  className="job-detail-input-container"
                  style={{ justifyContent: "flex-start" }}
                >
                  <strong>DO Revalidation:&nbsp;</strong>
                  <Checkbox
                    value={formik.values.do_revalidation}
                    checked={formik.values.do_revalidation}
                    onChange={(e) => {
                      const newValue = e.target.checked;
                      formik.setFieldValue("do_revalidation", newValue);
                    }}
                  />
                </div>
              </Col>
              <Col xs={12} lg={4}>
                <div className="job-detail-input-container">
                  <strong>DO Revalidation Date:&nbsp;</strong>
                  <TextField
                    fullWidth={true}
                    size="small"
                    type="date"
                    margin="normal"
                    variant="outlined"
                    id="do_revalidation_date"
                    name="do_revalidation_date"
                    value={formik.values.do_revalidation_date}
                    onChange={formik.handleChange}
                    inputProps={{
                      min: data.do_revalidation_date
                        ? data.do_revalidation_date
                        : today,
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} lg={3}>
                <div
                  className="job-detail-input-container"
                  style={{ justifyContent: "flex-start" }}
                >
                  <strong>Examination Planning:&nbsp;</strong>

                  <Checkbox
                    value={formik.values.examinationPlanning}
                    checked={formik.values.examinationPlanning}
                    onChange={(e) => {
                      const newValue = e.target.checked;
                      formik.setFieldValue("examinationPlanning", newValue);
                    }}
                  />
                </div>
              </Col>
              <Col xs={12} lg={4}>
                <div className="job-detail-input-container">
                  <strong>Examination Planning Date:&nbsp;</strong>
                  <TextField
                    fullWidth={true}
                    size="small"
                    type="date"
                    margin="normal"
                    variant="outlined"
                    id="examination_planning_date"
                    name="examination_planning_date"
                    value={formik.values.examination_planning_date}
                    onChange={formik.handleChange}
                    inputProps={{
                      min: data.examination_planning_date
                        ? data.examination_planning_date
                        : today,
                    }}
                  />
                </div>
              </Col>
            </Row>
          </div>
          {/*************************** Row 10 ****************************/}
          <div className="job-details-container">
            <JobDetailsRowHeading heading="SIMS/PIMS/NFMIMS" />
            <Row>
              <Col xs={12} lg={4}>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={setSelectedRegNo}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      value="sims"
                      control={<Radio checked={selectedRegNo === "sims"} />}
                      label="SIMS"
                    />
                    <FormControlLabel
                      value="pims"
                      control={<Radio checked={selectedRegNo === "pims"} />}
                      label="PIMS"
                    />
                    <FormControlLabel
                      value="nfmims"
                      control={<Radio checked={selectedRegNo === "nfmims"} />}
                      label="NFMIMS"
                    />
                    <FormControlLabel
                      value="clear"
                      control={<Radio />}
                      label="Clear"
                    />
                  </RadioGroup>
                </FormControl>
              </Col>
              <Col xs={12} lg={4}>
                <div className="job-detail-input-container">
                  {selectedRegNo && (
                    <>
                      <strong>
                        {selectedRegNo === "sims"
                          ? "SIMS Reg"
                          : selectedRegNo === "pims"
                          ? "PIMS Reg"
                          : selectedRegNo === "nfmims"
                          ? "NFMIMS Reg"
                          : ""}
                        &nbsp;
                      </strong>
                      <TextField
                        id="outlined-start-adornment"
                        size="small"
                        fullWidth
                        sx={{ m: 1 }}
                        name={
                          selectedRegNo === "sims"
                            ? "sims_reg_no"
                            : selectedRegNo === "pims"
                            ? "pims_reg_no"
                            : selectedRegNo === "nfmims"
                            ? "nfmims_reg_no"
                            : ""
                        }
                        value={
                          selectedRegNo === "sims"
                            ? formik.values.sims_reg_no
                            : selectedRegNo === "pims"
                            ? formik.values.pims_reg_no
                            : selectedRegNo === "nfmims"
                            ? formik.values.nfmims_reg_no
                            : ""
                        }
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </div>
              </Col>
              <Col xs={12} lg={4}>
                {selectedRegNo && (
                  <div className="job-detail-input-container">
                    <strong>
                      {selectedRegNo === "sims"
                        ? "SIMS Date"
                        : selectedRegNo === "pims"
                        ? "PIMS Date"
                        : "NFMIMS Date"}
                      &nbsp;
                    </strong>
                    <TextField
                      fullWidth={true}
                      size="small"
                      type="date"
                      margin="normal"
                      variant="outlined"
                      id={
                        selectedRegNo === "sims"
                          ? "sims_date"
                          : selectedRegNo === "pims"
                          ? "pims_date"
                          : "nfmims_date"
                      }
                      name={
                        selectedRegNo === "sims"
                          ? "sims_date"
                          : selectedRegNo === "pims"
                          ? "pims_date"
                          : "nfmims_date"
                      }
                      value={
                        selectedRegNo === "sims"
                          ? formik.values.sims_date
                          : selectedRegNo === "pims"
                          ? formik.values.pims_date
                          : formik.values.nfmims_date
                      }
                      onChange={formik.handleChange}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </div>
          {/*************************** Row 11 ****************************/}
          <div className="job-details-container">
            <JobDetailsRowHeading heading="Dates" />
            <Row>
              <Col xs={12} lg={4}>
                <div className="job-detail-input-container">
                  <strong>ETA:&nbsp;</strong>
                  <TextField
                    fullWidth
                    size="small"
                    margin="normal"
                    variant="outlined"
                    type="date"
                    id="vessel_berthing"
                    name="vessel_berthing"
                    value={formik.values.vessel_berthing}
                    onChange={formik.handleChange}
                  />
                </div>
              </Col>
              <Col xs={12} lg={4}>
                <div className="job-detail-input-container">
                  <strong>Discharge Date:&nbsp;</strong>
                  <TextField
                    fullWidth
                    size="small"
                    margin="normal"
                    variant="outlined"
                    type="date"
                    id="discharge_date"
                    name="discharge_date"
                    value={formik.values.discharge_date}
                    onChange={formik.handleChange}
                  />
                </div>
              </Col>
              <Col xs={12} lg={4}>
                <div className="job-detail-input-container">
                  <strong>Assessment Date:&nbsp;</strong>
                  <TextField
                    fullWidth
                    size="small"
                    margin="normal"
                    variant="outlined"
                    type="date"
                    id="assessment_date"
                    name="assessment_date"
                    value={formik.values.assessment_date}
                    onChange={formik.handleChange}
                  />
                </div>
              </Col>
            </Row>
            {/*************************** Row 12 ****************************/}
            <Row>
              <Col xs={12} lg={4}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <strong>Examination Date:&nbsp;</strong>
                  {data.examination_date ? data.examination_date : ""}
                </div>
              </Col>
              <Col xs={12} lg={4}>
                <div className="job-detail-input-container">
                  <strong>Duty Paid Date:&nbsp;</strong>
                  <TextField
                    fullWidth
                    size="small"
                    margin="normal"
                    variant="outlined"
                    type="date"
                    id="duty_paid_date"
                    name="duty_paid_date"
                    value={formik.values.duty_paid_date}
                    onChange={formik.handleChange}
                  />
                </div>
              </Col>
              <Col xs={12} lg={4}>
                <div className="job-detail-input-container">
                  <strong>Delivery Date:&nbsp;</strong>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    margin="normal"
                    variant="outlined"
                    id="delivery_date"
                    name="delivery_date"
                    value={formik.values.delivery_date}
                    onChange={formik.handleChange}
                  />
                </div>
              </Col>
            </Row>

            {/*************************** Row 13 ****************************/}
            <Row>
              <Col xs={12} lg={4}>
                <div className="job-detail-input-container">
                  <Checkbox
                    value={checked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChecked(true);
                      } else {
                        setChecked(false);
                      }
                    }}
                  />

                  {!checked && (
                    <strong>All containers arrived at same date</strong>
                  )}

                  {checked && (
                    <>
                      <strong>Arrival Date:&nbsp;</strong>
                      <TextField
                        fullWidth
                        size="small"
                        margin="normal"
                        variant="outlined"
                        type="date"
                        id="arrival_date"
                        name="arrival_date"
                        value={formik.values.arrival_date}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </div>
              </Col>
              <Col xs={12} lg={4}></Col>
              <Col xs={12} lg={4}></Col>
            </Row>

            <br />
            <br />
            <Row>
              <Col xs={6}>
                <strong>DO Copies:&nbsp;</strong>

                <br />
                {formik.values.do_copies?.map((file, index) => {
                  return (
                    <div key={index}>
                      <br />
                      <a href={file}>View</a>
                    </div>
                  );
                })}
              </Col>
              <Col xs={6}>
                <label htmlFor="processed_be_attachment" className="btn">
                  Upload Processed BE Attachment
                </label>
                <input
                  type="file"
                  multiple
                  id="processed_be_attachment"
                  onChange={(e) =>
                    handleFileUpload(
                      e,
                      "processed_be_attachment",
                      "processed_be_attachment",
                      formik,
                      setFileSnackbar
                    )
                  }
                  className="input-hidden"
                  ref={processedBeAttachmentRef}
                />

                {formik.values.processed_be_attachment?.map((file, index) => {
                  return (
                    <div key={index}>
                      <br />
                      <a href={file}>View</a>
                    </div>
                  );
                })}
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <label htmlFor="ooc_copies" className="btn">
                  Upload OOC Copy
                </label>
                <input
                  type="file"
                  multiple
                  name="ooc_copies"
                  id="ooc_copies"
                  onChange={(e) =>
                    handleFileUpload(
                      e,
                      "ooc_copies",
                      "ooc_copies",
                      formik,
                      setFileSnackbar
                    )
                  }
                  ref={oocCopyRef}
                  className="input-hidden"
                />
                <br />
                {formik.values.ooc_copies?.map((file, index) => {
                  return (
                    <div key={index}>
                      <br />
                      <a href={file}>View</a>
                    </div>
                  );
                })}
              </Col>
              <Col xs={6}>
                <label htmlFor="gate_pass_copies" className="btn">
                  Upload e-Gate Pass Copy
                </label>
                <input
                  type="file"
                  multiple
                  id="gate_pass_copies"
                  onChange={(e) =>
                    handleFileUpload(
                      e,
                      "gate_pass_copies",
                      "gate_pass_copies",
                      formik,
                      setFileSnackbar
                    )
                  }
                  className="input-hidden"
                  ref={gatePassCopyRef}
                />

                {formik.values.gate_pass_copies?.map((file, index) => {
                  return (
                    <div key={index}>
                      <br />
                      <a href={file}>View</a>
                    </div>
                  );
                })}
              </Col>
            </Row>
          </div>

          {/*************************** Row 14 ****************************/}
          <div className="job-details-container">
            <JobDetailsRowHeading heading="Remarks" />
            <Row>
              <Col>
                <div className="job-detail-input-container">
                  <strong>Remarks:&nbsp;</strong>
                  <TextField
                    multiline
                    fullWidth
                    size="small"
                    margin="normal"
                    variant="outlined"
                    id="remarks"
                    name="remarks"
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                  />
                </div>
              </Col>
            </Row>
          </div>

          <div className="job-details-container">
            <JobDetailsRowHeading heading="Container Details" />
            {formik.values.status !== "" &&
              formik.values.container_nos?.map((container, index) => {
                return (
                  <div key={index}>
                    <div style={{ padding: "30px" }}>
                      <h6>
                        <strong>
                          {index + 1}. Container Number:&nbsp;
                          <span ref={container_number_ref[index]}>
                            {container.container_number}
                          </span>
                          <IconButton
                            onClick={() =>
                              handleCopyContainerNumber(
                                container.container_number,
                                setSnackbar
                              )
                            }
                            aria-label="copy-btn"
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </strong>
                      </h6>

                      <br />
                      <Row>
                        {!checked && (
                          <Col xs={12} lg={3}>
                            <div className="job-detail-input-container">
                              <strong>Arrival Date:&nbsp;</strong>
                              <TextField
                                fullWidth
                                key={index}
                                size="small"
                                margin="normal"
                                variant="outlined"
                                type="date"
                                id={`arrival_date_${index}`}
                                name={`container_nos[${index}].arrival_date`}
                                value={container.arrival_date}
                                onChange={formik.handleChange}
                              />
                            </div>
                          </Col>
                        )}
                        <Col xs={12} lg={3}>
                          <div className="job-detail-input-container">
                            <strong>Free Time:&nbsp;</strong>
                            <TextField
                              fullWidth
                              select
                              size="small"
                              margin="normal"
                              variant="outlined"
                              id="free_time"
                              name="free_time"
                              value={formik.values.free_time}
                              onChange={formik.handleChange}
                            >
                              {options?.map((option, id) => (
                                <MenuItem key={id} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </TextField>
                          </div>
                        </Col>

                        <Col xs={12} lg={3} className="flex-div">
                          <strong>Detention From:&nbsp;</strong>
                          {detentionFrom[index]}
                        </Col>
                        <Col xs={12} lg={3} className="flex-div">
                          <div className="job-detail-input-container">
                            <strong>Size:&nbsp;</strong>
                            <TextField
                              fullWidth
                              select
                              size="small"
                              margin="normal"
                              variant="outlined"
                              id={`size_${index}`}
                              name={`container_nos[${index}].size`}
                              value={container.size}
                              onChange={formik.handleChange}
                            >
                              <MenuItem value="20">20</MenuItem>
                              <MenuItem value="40">40</MenuItem>
                            </TextField>
                          </div>
                        </Col>
                        {checked && <Col></Col>}
                      </Row>

                      <Row className="job-detail-row">
                        <Col xs={12} lg={3}>
                          <div className="job-detail-input-container">
                            <strong>Physical Weight:&nbsp;</strong>
                            <TextField
                              fullWidth
                              key={index}
                              size="small"
                              margin="normal"
                              variant="outlined"
                              id={`physical_weight_${index}`}
                              name={`container_nos[${index}].physical_weight`}
                              value={container.physical_weight}
                              onChange={(e) =>
                                handlePhysicalWeightChange(e, index, formik)
                              }
                            />
                          </div>
                        </Col>
                        <Col xs={12} lg={3}>
                          <div className="job-detail-input-container">
                            <strong>Tare Weight:&nbsp;</strong>
                            <TextField
                              fullWidth
                              key={index}
                              size="small"
                              margin="normal"
                              variant="outlined"
                              id={`tare_weight_${index}`}
                              name={`container_nos[${index}].tare_weight`}
                              value={container.tare_weight}
                              onChange={(e) =>
                                handleTareWeightChange(e, index, formik)
                              }
                            />
                          </div>
                        </Col>

                        <Col xs={12} lg={3}>
                          <div className="job-detail-input-container">
                            <strong>Net Weight as per Document:&nbsp;</strong>
                            <TextField
                              fullWidth
                              key={index}
                              size="small"
                              margin="normal"
                              variant="outlined"
                              id={`net_weight_${index}`}
                              name={`container_nos[${index}].net_weight`}
                              value={container.net_weight}
                              onChange={(e) =>
                                handleNetWeightChange(e, index, formik)
                              }
                            />
                          </div>
                        </Col>

                        <Col xs={12} lg={3}>
                          <div className="job-detail-input-container">
                            <strong>Actual Weight:&nbsp;</strong>
                            <TextField
                              fullWidth
                              key={index}
                              size="small"
                              margin="normal"
                              variant="outlined"
                              id={`actual_weight_${index}`}
                              name={`container_nos[${index}].actual_weight`}
                              value={container.actual_weight}
                              onChange={(e) =>
                                handleActualWeightChange(e, index, formik)
                              }
                            />
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={12} lg={3}>
                          <div className="job-detail-input-container">
                            <strong>Weight Excess/Shortage:&nbsp;</strong>
                            <TextField
                              fullWidth
                              key={index}
                              size="small"
                              margin="normal"
                              variant="outlined"
                              id={`weight_shortage_${index}`}
                              name={`container_nos[${index}].weight_shortage`}
                              value={container.weight_shortage}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </Col>
                        <Col xs={12} lg={3}>
                          <div className="job-detail-input-container">
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={container.transporter === "SRCC"}
                                  />
                                }
                                label="Transporter: SRCC"
                                onChange={(e) =>
                                  handleTransporterChange(e, index)
                                }
                              />
                            </FormGroup>
                          </div>
                        </Col>
                        <Col>
                          {container.transporter !== "SRCC" && (
                            <div className="job-detail-input-container">
                              <strong>Transporter:&nbsp;</strong>
                              <TextField
                                fullWidth
                                key={index}
                                size="small"
                                margin="normal"
                                variant="outlined"
                                id={`transporter_${index}`}
                                name={`container_nos[${index}].transporter`}
                                value={container.transporter}
                                onChange={formik.handleChange}
                              />
                            </div>
                          )}
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <br />
                          <label
                            htmlFor={`weighmentSlip${index}`}
                            className="btn"
                          >
                            Upload Weighment Slip
                          </label>
                          <input
                            type="file"
                            multiple
                            id={`weighmentSlip${index}`}
                            onChange={(e) => {
                              handleWeighmentSlip(
                                e,
                                container.container_number
                              );
                            }}
                            className="input-hidden"
                            ref={weighmentSlipRef}
                          />
                          <br />
                          <br />
                          {container.weighment_slip_images?.map((image, id) => {
                            // eslint-disable-next-line
                            return <a href={image.url} key={id} />;
                          })}
                        </Col>
                      </Row>
                      <Row>
                        <div>
                          <strong>Weighment Slip Images:&nbsp;</strong>
                          {container.weighment_slip_images?.map((image, id) => {
                            return (
                              <a href={image.url} key={id}>
                                {image.url}
                              </a>
                            );
                          })}
                        </div>

                        <div>
                          <strong>Container Pre Damage Images:&nbsp;</strong>
                          {container.container_pre_damage_images?.map(
                            (image, id) => {
                              return (
                                <a href={image.url} key={id}>
                                  {image.url}
                                </a>
                              );
                            }
                          )}
                        </div>

                        <div>
                          <strong>Container Images:&nbsp;</strong>
                          {container.container_images?.map((image, id) => {
                            return (
                              <a href={image.url} key={id}>
                                {image.url}
                              </a>
                            );
                          })}
                        </div>

                        <div>
                          <strong>Loose Material Images:&nbsp;</strong>
                          {container.loose_material_photo?.map((image, id) => {
                            return (
                              <a href={image.url} key={id}>
                                {image.url}
                              </a>
                            );
                          })}
                        </div>
                      </Row>
                    </div>
                    <hr />
                  </div>
                );
              })}
          </div>
          <Row>
            <Col>
              <button
                className="btn"
                type="submit"
                style={{ float: "right", margin: "20px" }}
                aria-label="submit-btn"
              >
                Submit
              </button>
            </Col>
          </Row>
        </form>
      )}

      <Snackbar
        open={snackbar || fileSnackbar}
        message={
          snackbar ? "Copied to clipboard" : "File uploaded successfully!"
        }
        sx={{ left: "auto !important", right: "24px !important" }}
      />
    </>
  );
}

export default React.memo(JobDetails);
