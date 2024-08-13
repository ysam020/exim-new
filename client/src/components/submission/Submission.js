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
  Button,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

function Submission() {
  const [rows, setRows] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState(null);
  const [queries, setQueries] = React.useState([{ query: "", reply: "" }]);

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

  const handleEditClick = (row) => {
    setCurrentRow(row);
    setOpenModal(true);
  };

  const handleAddQuery = () => {
    setQueries([...queries, { query: "", reply: "" }]);
  };

  const handleQueryChange = (index, field, value) => {
    const newQueries = [...queries];
    newQueries[index][field] = value;
    setQueries(newQueries);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setQueries([{ query: "", reply: "" }]); // Reset queries on close
  };

  const handleSubmit = () => {
    // Implement submission logic for queries here
    console.log("Submitted queries:", queries);
    handleModalClose();
  };
  const handleCheckboxChange = (event, rowIndex) => {
    const newValue = event.target.checked;
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? { ...row, document_entry_completed: newValue }
          : row
      )
    );
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
            onChange={(event) => handleCheckboxChange(event, row.index)}
          />
        </Box>
      ),
    },
    {
      accessorKey: "query",
      header: "Queries",
      enableSorting: false,
      size: 130,
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton onClick={() => handleEditClick(row.original)}>
            <EditIcon />
          </IconButton>
        </Box>
      ),
    },
    {
      accessorKey: "save",
      header: "Save",
      enableSorting: false,
      size: 130,
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton onClick={() => handleSave(row.original)}>
            <SaveIcon />
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
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {queries.map((query, index) => (
            <div key={index} style={{ display: "flex" }}>
              <TextField
                label="Query"
                value={query.query}
                onChange={(e) =>
                  handleQueryChange(index, "query", e.target.value)
                }
                fullWidth
                margin="normal"
                style={{ marginRight: 10 }}
              />
              <TextField
                label="Reply"
                value={query.reply}
                onChange={(e) =>
                  handleQueryChange(index, "reply", e.target.value)
                }
                fullWidth
                margin="normal"
              />
            </div>
          ))}
          <Button onClick={handleAddQuery} variant="outlined" sx={{ mt: 2 }}>
            Add Queries
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ mt: 2, ml: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default React.memo(Submission);
