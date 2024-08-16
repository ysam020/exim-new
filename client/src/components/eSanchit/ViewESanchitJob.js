import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobDetailsStaticData from "../import-dsr/JobDetailsStaticData";
import Snackbar from "@mui/material/Snackbar";
import AWS from "aws-sdk";
import { Autocomplete, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Row, Col } from "react-bootstrap";

const handleSingleFileUpload = async (file, folderName, setFileSnackbar) => {
  try {
    const key = `${folderName}/${file.name}`;

    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
      region: "ap-south-1",
    });

    const params = {
      Bucket: "alvision-exim-images",
      Key: key,
      Body: file,
    };

    const data = await s3.upload(params).promise();
    const photoUrl = data.Location;

    setFileSnackbar(true);

    setTimeout(() => {
      setFileSnackbar(false);
    }, 3000);

    return photoUrl;
  } catch (err) {
    console.error("Error uploading file:", err);
  }
};

function ViewESanchitJob() {
  const [eSachitQueries, setESanchitQueries] = useState([
    { query: "", reply: "" },
  ]);
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [cthDocuments, setCthDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [snackbar, setSnackbar] = useState(false);
  const [fileSnackbar, setFileSnackbar] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const bl_no_ref = useRef();

  useEffect(() => {
    async function getData() {
      const res = await axios(
        `${process.env.REACT_APP_API_STRING}/get-esanchit-job/${params.job_no}/${params.year}`
      );
      setData(res.data);

      // Fetch eSanchit Queries
      if (res.data.eSachitQueries && res.data.eSachitQueries.length > 0) {
        setESanchitQueries(res.data.eSachitQueries);
      }

      // Fetch CTH documents based on CTH number
      if (res.data.cth_no) {
        const cthRes = await axios.get(
          `${process.env.REACT_APP_API_STRING}/get-cth-docs/${res.data.cth_no}`
        );

        const mergedCthDocuments = cthRes.data.map((cthDoc) => {
          const additionalData = res.data.cth_documents.find(
            (doc) => doc.cth === cthDoc.cth
          );

          return {
            ...cthDoc,
            url: additionalData ? additionalData.url : "",
            irn: additionalData ? additionalData.irn : "",
            urls: additionalData ? [additionalData.url] : [],
          };
        });

        setCthDocuments(mergedCthDocuments);
      }

      if (res.data.documents) {
        setSelectedDocuments(
          res.data.documents.map((doc) => {
            const documentParts = doc.document_name.match(/^(.+?) \((\d+)\)$/);
            return {
              document: {
                document_name: documentParts
                  ? documentParts[1]
                  : doc.document_name,
                document_code: documentParts ? documentParts[2] : "",
              },
              irn: doc.irn,
              urls: [doc.url],
            };
          })
        );
      }
    }

    getData();
  }, [params.job_no, params.year]);

  useEffect(() => {
    async function getDocuments() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_STRING}/get-docs`
      );
      setDocuments(res.data);
    }

    getDocuments();
  }, []);

  const handleFileChange = async (event, documentName, index, isCth) => {
    const files = event.target.files;
    if (!files) return;

    const formattedDocumentName = documentName
      .toLowerCase()
      .replace(/\[.*?\]|\(.*?\)/g, "")
      .replace(/[^\w\s]/g, "_")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");

    const urls = [];
    for (let file of files) {
      const photoUrl = await handleSingleFileUpload(
        file,
        formattedDocumentName,
        setFileSnackbar
      );
      urls.push(photoUrl);
    }

    if (isCth) {
      const updatedCthDocuments = [...cthDocuments];
      updatedCthDocuments[index].urls = urls;
      setCthDocuments(updatedCthDocuments);
    } else {
      const updatedSelectedDocuments = [...selectedDocuments];
      updatedSelectedDocuments[index].urls = urls;
      setSelectedDocuments(updatedSelectedDocuments);
    }
  };

  const handleAddDocument = () => {
    setSelectedDocuments([
      ...selectedDocuments,
      { document: null, irn: "", urls: [] },
    ]);
  };

  const handleRemoveDocument = (index) => {
    const newSelectedDocuments = [...selectedDocuments];
    newSelectedDocuments.splice(index, 1);
    setSelectedDocuments(newSelectedDocuments);
  };

  const handleDocumentChange = (index, newValue) => {
    const newSelectedDocuments = [...selectedDocuments];
    newSelectedDocuments[index].document = newValue;
    setSelectedDocuments(newSelectedDocuments);
  };

  const handleIrnChange = (index, newIrn, isCth) => {
    if (isCth) {
      const updatedCthDocuments = [...cthDocuments];
      updatedCthDocuments[index].irn = newIrn;
      setCthDocuments(updatedCthDocuments);
    } else {
      const newSelectedDocuments = [...selectedDocuments];
      newSelectedDocuments[index].irn = newIrn;
      setSelectedDocuments(newSelectedDocuments);
    }
  };

  const filterDocuments = (selectedDocuments, currentIndex) => {
    const restrictedDocs = new Set();

    selectedDocuments.forEach((doc, index) => {
      if (doc.document) {
        restrictedDocs.add(doc.document.document_code);
        if (doc.document.document_code === "380000") {
          restrictedDocs.add("331000");
        } else if (doc.document.document_code === "271000") {
          restrictedDocs.add("331000");
        } else if (doc.document.document_code === "331000") {
          restrictedDocs.add("380000");
          restrictedDocs.add("271000");
        }
      }
    });

    return documents.filter((doc) => !restrictedDocs.has(doc.document_code));
  };

  const handleSubmit = async () => {
    const formattedData = {
      cth_documents: [],
      documents: [],
      job_no: params.job_no,
      year: params.year,
      eSachitQueries: eSachitQueries,
    };

    cthDocuments.forEach(({ cth, document_name, urls, irn }) => {
      if (urls && urls.length > 0) {
        formattedData.cth_documents.push({
          cth,
          document_name,
          url: urls[0],
          irn: irn || "",
        });
      }
    });

    selectedDocuments.forEach(({ document, irn, urls }) => {
      if (document && urls.length > 0) {
        formattedData.documents.push({
          document_name: `${document.document_name} (${document.document_code})`,
          url: urls[0],
          irn: irn || "",
        });
      }
    });

    await axios.post(
      `${process.env.REACT_APP_API_STRING}/update-esanchit-job`,
      formattedData
    );
    navigate("/e-sanchit");
    console.log(formattedData);
  };

  const handleSignDocuments = async () => {
    try {
      const signRequests = selectedDocuments.map(({ urls }) =>
        axios.post(`${process.env.REACT_APP_API_STRING}/sign-document`, {
          documentUrl: urls[0],
        })
      );

      const signedDocuments = await Promise.all(signRequests);

      signedDocuments.forEach(({ data }, index) => {
        selectedDocuments[index].urls[0] = data.signedUrl;
      });

      setSelectedDocuments([...selectedDocuments]);
      setSnackbar(true);

      setTimeout(() => {
        setSnackbar(false);
      }, 3000);
    } catch (error) {
      console.error("Error signing documents:", error);
    }
  };

  const addQuery = () => {
    setESanchitQueries([...eSachitQueries, { query: "", reply: "" }]);
  };

  const handleQueryChange = (event, index) => {
    const newQueries = [...eSachitQueries];
    newQueries[index].query = event.target.value;
    setESanchitQueries(newQueries);
  };

  return (
    <>
      <div style={{ margin: "20px 0" }}>
        {data && (
          <>
            <JobDetailsStaticData
              data={data}
              params={params}
              bl_no_ref={bl_no_ref}
              setSnackbar={setSnackbar}
            />
            <div className="job-details-container">
              <h4>Documents</h4>
              {cthDocuments?.map((doc, index) => (
                <Row key={index} className="document-upload">
                  <Col xs={5}>
                    <strong>
                      {doc.document_name} ({doc.document_code})&nbsp;
                    </strong>
                  </Col>
                  <Col xs={3}>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        handleFileChange(e, doc.document_name, index, true)
                      }
                    />
                    {doc.urls &&
                      doc.urls.map((url, idx) => (
                        <div key={idx}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Document
                          </a>
                        </div>
                      ))}
                  </Col>
                  <Col>
                    <TextField
                      size="small"
                      label="IRN"
                      value={doc.irn || ""}
                      onChange={(e) =>
                        handleIrnChange(index, e.target.value, true)
                      }
                    />
                  </Col>
                  <br />
                  <br />
                </Row>
              ))}

              {selectedDocuments.map((selectedDocument, index) => (
                <Row key={index} style={{ marginTop: "20px" }}>
                  <Col xs={5}>
                    <Autocomplete
                      options={filterDocuments(selectedDocuments, index)}
                      getOptionLabel={(doc) =>
                        `${doc.document_name} (${doc.document_code})`
                      }
                      value={selectedDocument.document}
                      onChange={(event, newValue) => {
                        handleDocumentChange(index, newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Document"
                          size="small"
                          sx={{ width: 500 }}
                        />
                      )}
                    />
                  </Col>
                  <Col xs={3}>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          selectedDocument.document.document_name,
                          index,
                          false
                        )
                      }
                      disabled={!selectedDocument.document}
                    />
                    {selectedDocument.urls &&
                      selectedDocument.urls.map((url, idx) => (
                        <div key={idx}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Document
                          </a>
                        </div>
                      ))}
                  </Col>
                  <Col>
                    <TextField
                      size="small"
                      label="IRN"
                      value={selectedDocument.irn}
                      onChange={(e) =>
                        handleIrnChange(index, e.target.value, false)
                      }
                    />
                  </Col>
                  <Col>
                    <IconButton
                      onClick={() => handleRemoveDocument(index)}
                      sx={{ color: "#BE3838" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Col>
                </Row>
              ))}

              <button className="btn" onClick={handleAddDocument}>
                Add Document
              </button>
            </div>

            <div className="job-details-container">
              <Row>
                <Col>
                  <h4>Queries</h4>
                  {eSachitQueries.map((item, id) => {
                    return (
                      <div key={id}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          size="small"
                          label="Query"
                          value={item.query} // Set the current query value
                          onChange={(e) => handleQueryChange(e, id)} // Handle changes
                        />
                        {item.reply}
                        <br />
                        <br />
                      </div>
                    );
                  })}
                </Col>
              </Row>
              <button onClick={addQuery} className="btn">
                Add Query
              </button>
            </div>

            <button
              className="btn"
              style={{ float: "right", margin: "20px" }}
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="btn"
              style={{ float: "right", margin: "20px" }}
              onClick={handleSignDocuments}
            >
              Sign Documents
            </button>

            <br />
            <br />
            <Snackbar
              open={snackbar || fileSnackbar}
              message={
                snackbar ? "Copied to clipboard" : "File uploaded successfully!"
              }
              sx={{ left: "auto !important", right: "24px !important" }}
              onClose={() => {
                setSnackbar(false);
                setFileSnackbar(false);
              }}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ViewESanchitJob;
