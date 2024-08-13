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

import SaveIcon from "@mui/icons-material/Save";

function Documentation() {
  const [rows, setRows] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentRowIndex, setCurrentRowIndex] = React.useState(null);
  const [remark, setRemark] = React.useState("");

  React.useEffect(() => {
    async function getData() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_STRING}/get-esanchit-jobs`
      );
      setRows(res.data);
    }

    getData();
  }, []);

  const handleSave = (row) => {
    // Implement save logic here
    console.log("Save row:", row);
  };

  const handleCheckboxChange = (event, rowIndex, field) => {
    const newValue = event.target.checked;
    if (field === "revision" && newValue) {
      setCurrentRowIndex(rowIndex);
      setOpenDialog(true);
    } else {
      setRows((prevRows) =>
        prevRows.map((row, index) =>
          index === rowIndex ? { ...row, [field]: newValue } : row
        )
      );
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setRemark("");
  };

  const handleSubmit = () => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === currentRowIndex
          ? { ...row, revision: true, remark: remark }
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
      size: 100,
    },
    {
      accessorKey: "importer",
      header: "Importer",
      enableSorting: false,
      size: 250,
    },
    {
      accessorKey: "custom_house",
      header: "Custom House",
      enableSorting: false,
      size: 150,
    },
    {
      accessorKey: "awb_bl_no",
      header: "BL Number",
      enableSorting: false,
      size: 200,
      Cell: ({ cell }) => cell?.getValue()?.toString(),
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
      size: 180,
    },
    {
      accessorKey: "discharge_date",
      header: "Discharge Date",
      enableSorting: false,
      size: 160,
    },
    {
      accessorKey: "igm_date",
      header: "IGM Date",
      enableSorting: false,
      size: 130,
    },
    {
      accessorKey: "document_entry_completed",
      header: "Document Entry Completed",
      enableSorting: false,
      size: 230,
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
      accessorKey: "revision",
      header: "Revise",
      enableSorting: false,
      size: 130,
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Checkbox
            checked={row.original.revision === true}
            onChange={(event) =>
              handleCheckboxChange(event, row.index, "revision")
            }
          />
        </Box>
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
            width: "500px", // Adjust this value to your desired width
          },
        }}
      >
        <DialogTitle>Add Remark</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Remark"
            type="text"
            fullWidth
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
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
