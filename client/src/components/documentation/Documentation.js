import * as React from "react";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  IconButton,
  Checkbox,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

function Documentation() {
  const [rows, setRows] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentRowIndex, setCurrentRowIndex] = React.useState(null);
  const [documentationRemarks, setDocumentationRemarks] = React.useState("");

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

  const handleOpenModal = (event, rowIndex) => {
    setCurrentRowIndex(rowIndex);
    setDocumentationRemarks(rows[rowIndex].documentationRemarks || "");
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === currentRowIndex
          ? {
              ...row,
              revision: true,
              documentationRemarks: documentationRemarks,
            }
          : row
      )
    );
    handleDialogClose();
  };

  const columns = [
    {
      accessorKey: "job_no",
      header: "Job No",
      enableSorting: false,
      size: 70,
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
      size: 110,
    },
    {
      accessorKey: "discharge_date",
      header: "Discharge Date/ IGM Date",
      enableSorting: false,
      size: 110,
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
      accessorKey: "documentationRemarks",
      header: "Remarks",
      enableSorting: false,
      size: 110,
      Cell: ({ row }) => (
        <IconButton onClick={(event) => handleOpenModal(event, row.index)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      accessorKey: "save",
      header: "Save",
      enableSorting: false,
      size: 100,
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton onClick={() => handleSave(row.original)}>
            <SaveIcon sx={{ color: "#015C4B" }} />
          </IconButton>
        </Box>
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
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            width: "500px",
          },
        }}
      >
        <DialogTitle>Add Remarks</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Remarks"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={documentationRemarks}
            onChange={(e) => setDocumentationRemarks(e.target.value)}
          />

          <button
            type="button"
            className="btn"
            aria-label="cancel-btn"
            style={{ marginBottom: "20px", marginRight: "10px" }}
            onClick={handleDialogClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn"
            aria-label="submit-btn"
            style={{ marginBottom: "20px" }}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default React.memo(Documentation);
