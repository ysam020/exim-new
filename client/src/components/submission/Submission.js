import * as React from "react";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  IconButton,
  Checkbox,
  Modal,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

function Submission() {
  const [rows, setRows] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [currentRowIndex, setCurrentRowIndex] = React.useState(null);
  const [queries, setQueries] = React.useState([]);

  React.useEffect(() => {
    async function getData() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_STRING}/get-esanchit-jobs`
      );
      setRows(res.data);
    }

    getData();
  }, []);

  const handleSave = async (row) => {
    console.log("Save row:", row);
    const res = await axios.post(
      `${process.env.REACT_APP_API_STRING}/update-submission-job`,
      row
    );
    alert(res.data.message);
  };

  const handleEditClick = (rowIndex) => {
    setCurrentRowIndex(rowIndex);
    setQueries(rows[rowIndex].queries || []);
    setOpenModal(true);
  };

  const handleDateChange = (event, rowIndex, field) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][field] = event.target.value;
    setRows(updatedRows);
  };

  const handleSubmissionDateChange = (event, rowIndex) => {
    const updatedRows = [...rows];
    if (event.target.checked) {
      updatedRows[rowIndex].submission_date = new Date()
        .toISOString()
        .split("T")[0];
    } else {
      updatedRows[rowIndex].submission_date = null;
    }
    setRows(updatedRows);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleAddQuery = () => {
    setQueries([...queries, { query: "", reply: "" }]);
  };

  const handleQueryChange = (index, field, value) => {
    const updatedQueries = [...queries];
    updatedQueries[index][field] = value;
    setQueries(updatedQueries);
  };

  const handleSubmitQueries = () => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === currentRowIndex ? { ...row, queries } : row
      )
    );
    setOpenModal(false);
  };

  const columns = [
    {
      accessorKey: "job_no",
      header: "Job No",
      enableSorting: false,
      size: 100,
    },
    {
      accessorKey: "importer",
      header: "Importer",
      enableSorting: false,
      size: 150,
    },
    {
      accessorKey: "custom_house",
      header: "Custom House",
      enableSorting: false,
      size: 150,
    },

    {
      accessorKey: "container_numbers",
      header: "Container Nos",
      enableSorting: false,
      size: 140,
      Cell: ({ cell }) =>
        cell.row.original.container_nos?.map((container, id) => (
          <React.Fragment key={id}>
            {container.container_number}
            <br />
          </React.Fragment>
        )),
      filterFn: "includes",
      accessorFn: (row) =>
        row.container_nos
          ?.map((container) => container.container_number)
          .join(", "),
    },
    {
      accessorKey: "gateway_igm_date",
      header: "Gateway IGM Date",
      enableSorting: false,
      size: 130,
    },
    {
      accessorKey: "discharge_date",
      header: "Discharge Date/ IGM Date",
      enableSorting: false,
      size: 130,
    },
    {
      accessorKey: "checklist_verified_on",
      header: "Checklist Verified On",
      enableSorting: false,
      size: 160,
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TextField
            type="date"
            size="small"
            value={row.original.checklist_verified_on || ""}
            onChange={(event) =>
              handleDateChange(event, row.index, "checklist_verified_on")
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      ),
    },
    {
      accessorKey: "submission_date",
      header: "Submission Date",
      enableSorting: false,
      size: 130,
      Cell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Checkbox
            checked={!!row.original.submission_date}
            onChange={(event) => handleSubmissionDateChange(event, row.index)}
          />
          {row.original.submission_date && (
            <Typography sx={{ ml: 2, mt: 3 }}>
              {new Date(row.original.submission_date).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      accessorKey: "queries",
      header: "Queries",
      enableSorting: false,
      size: 100,
      Cell: ({ row }) => (
        <IconButton onClick={() => handleEditClick(row.index)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      accessorKey: "save",
      header: "Save",
      enableSorting: false,
      size: 80,
      Cell: ({ row }) => (
        <IconButton onClick={() => handleSave(row.original)}>
          <SaveIcon sx={{ color: "#015C4B" }} />
        </IconButton>
      ),
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableDensityToggle: false,
    initialState: { density: "compact", pagination: { pageSize: 20 } },
    enableGrouping: true,
    enableColumnFilters: false,
    enableColumnActions: false,
    enableStickyHeader: true,
    enablePinning: true,
    muiTableContainerProps: {
      sx: { maxHeight: "650px", overflowY: "auto" },
    },
    muiTableHeadCellProps: {
      sx: {
        position: "sticky",
        top: 0,
        zIndex: 1,
      },
    },
  });

  return (
    <div className="table-container">
      <MaterialReactTable table={table} />
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            height: 600,
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
          }}
        >
          <div>
            {queries.map((item, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <TextField
                  label={`Query ${index + 1}`}
                  multiline
                  rows={2}
                  value={item.query}
                  fullWidth
                  margin="normal"
                  onChange={(e) =>
                    handleQueryChange(index, "query", e.target.value)
                  }
                />
                <TextField
                  label={`Reply ${index + 1}`}
                  multiline
                  rows={2}
                  value={item.reply}
                  fullWidth
                  margin="normal"
                  onChange={(e) =>
                    handleQueryChange(index, "reply", e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <button className="btn" onClick={handleAddQuery}>
            Add New Query
          </button>

          <div style={{ marginTop: "20px" }}>
            <button
              className="btn"
              onClick={handleSubmitQueries}
              style={{ marginRight: "10px" }}
            >
              Submit
            </button>
            <button className="btn" onClick={handleModalClose}>
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default React.memo(Submission);
