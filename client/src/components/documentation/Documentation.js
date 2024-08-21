import * as React from "react";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { IconButton, Checkbox, Modal, TextField, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

function Submission() {
  const [rows, setRows] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [currentRowIndex, setCurrentRowIndex] = React.useState(null);
  const [documentationQueries, setDocumentationQueries] = React.useState([]);

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
      `${process.env.REACT_APP_API_STRING}/update-documentation-job`,
      row
    );
    alert(res.data.message);
  };

  const handleCheckboxChange = async (event, rowIndex, field) => {
    const newValue = event.target.checked;

    // Update the state immediately for a responsive UI
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? { ...row, document_entry_completed: newValue }
          : row
      )
    );
  };

  const handleEditClick = (rowIndex) => {
    setCurrentRowIndex(rowIndex);
    setDocumentationQueries(rows[rowIndex].documentationQueries || []);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleAddQuery = () => {
    setDocumentationQueries([
      ...documentationQueries,
      { query: "", reply: "" },
    ]);
  };

  const handleQueryChange = (index, field, value) => {
    const updatedQueries = [...documentationQueries];
    updatedQueries[index][field] = value;
    setDocumentationQueries(updatedQueries);
  };

  const handleSubmitQueries = () => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === currentRowIndex ? { ...row, documentationQueries } : row
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
      accessorKey: "document_entry_completed",
      header: "Document Entry Completed",
      enableSorting: false,
      size: 130,
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Checkbox
            checked={row.original.document_entry_completed === true}
            onChange={(event) =>
              handleCheckboxChange(event, row.index, "document_entry_completed")
            }
          />
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
    enablePagination: false,
    enableBottomToolbar: false,
    initialState: { density: "compact", pagination: { pageSize: 20 } },
    enableGrouping: true,
    enableColumnFilters: false,
    enableColumnActions: false,
    enableStickyHeader: true,
    enablePinning: true,
    muiTableContainerProps: {
      sx: { maxHeight: "700px", overflowY: "auto" },
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
            {documentationQueries.map((item, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <TextField
                  label="Query"
                  multiline
                  rows={2}
                  value={item.query}
                  fullWidth
                  margin="normal"
                  onChange={(e) =>
                    handleQueryChange(index, "query", e.target.value)
                  }
                />
                {item.reply}
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
