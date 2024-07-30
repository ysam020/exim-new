import * as React from "react";
import "../../styles/import-dsr.scss";
import { MenuItem, TextField } from "@mui/material";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";

function ImportOperations() {
  const [years, setYears] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const { user } = React.useContext(UserContext);
  const currentDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = React.useState(currentDate);

  React.useEffect(() => {
    async function getYears() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_STRING}/get-years`
      );
      const filteredYears = res.data.filter((year) => year !== null);
      setYears(filteredYears);
      setSelectedYear(filteredYears[0]);
    }
    getYears();
  }, []);

  React.useEffect(() => {
    async function getRows() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_STRING}/get-operations-planning-jobs/${user.username}/${date}`
      );
      setRows(res.data);
    }
    getRows();
  }, [selectedYear, date, user]);

  const columns = [
    {
      accessorKey: "job_no",
      header: "Job No",
      enableSorting: false,
      size: 100,
      Cell: ({ cell }) => (
        <div style={{ textAlign: "center" }}>{cell.getValue()}</div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      size: 120,
      Cell: ({ cell }) => (
        <Link
          to={`/import-operations/view-job/${cell.row.original.job_no}/${cell.row.original.year}`}
        >
          View Job
        </Link>
      ),
    },
    {
      accessorKey: "be_no",
      header: "BE Number",
      enableSorting: false,
      size: 140,
      Cell: ({ cell }) => (
        <div style={{ textAlign: "center" }}>{cell.getValue()}</div>
      ),
    },
    {
      accessorKey: "be_date",
      header: "BE Date",
      enableSorting: false,
      size: 120,
      Cell: ({ cell }) => (
        <div style={{ textAlign: "center" }}>{cell.getValue()}</div>
      ),
    },
    {
      accessorKey: "examination_planning_date",
      header: "Examination Planning Date",
      enableSorting: false,
      size: 240,
      Cell: ({ cell }) => (
        <div style={{ textAlign: "center" }}>{cell.getValue()}</div>
      ),
    },
    {
      accessorKey: "pcv_date",
      header: "PCV Date",
      enableSorting: false,
      size: 120,
      Cell: ({ cell }) => (
        <div style={{ textAlign: "center" }}>{cell.getValue()}</div>
      ),
    },
    {
      accessorKey: "out_of_charge",
      header: "Out Of Charge",
      enableSorting: false,
      size: 150,
      Cell: ({ cell }) => (
        <div style={{ textAlign: "center" }}>{cell.getValue()}</div>
      ),
    },
    {
      accessorKey: "custom_house",
      header: "ICD Code",
      enableSorting: false,
      size: 150,
      Cell: ({ cell }) => (
        <div style={{ textAlign: "center" }}>{cell.getValue()}</div>
      ),
    },
    {
      accessorKey: "container_number",
      header: "Container Numbers",
      enableSorting: false,
      size: 180,
      Cell: ({ cell }) => (
        <div style={{ textAlign: "center" }}>
          {cell.row.original.container_nos?.map((container, id) => (
            <React.Fragment key={id}>
              {container.container_number}
              <br />
            </React.Fragment>
          ))}
        </div>
      ),
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableDensityToggle: false, // Disable density toggle
    initialState: { density: "compact" }, // Set initial table density to compact
    enableGrouping: true, // Enable row grouping
    enableColumnFilters: false, // Disable column filters
    enableColumnActions: false,
    enableStickyHeader: true, // Enable sticky header
    enablePinning: true, // Enable pinning for sticky columns
    muiTableContainerProps: {
      sx: { maxHeight: "450px", overflowY: "auto" },
    },
    muiTableBodyRowProps: ({ row }) => ({
      className: getTableRowsClassname(row),
    }),
    muiTableHeadCellProps: {
      sx: {
        position: "sticky",
        top: 0,
        zIndex: 1,
      },
    },
  });

  const getTableRowsClassname = (params) => {
    const pcv_date = params.original.pcv_date;
    if (pcv_date !== "" && pcv_date !== undefined) {
      return "custom-clearance-completed";
    } else {
      return "";
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TextField
          select
          size="small"
          margin="normal"
          variant="outlined"
          label="Select Year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          sx={{ width: "200px" }}
        >
          {years?.map((year) => {
            return (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            );
          })}
        </TextField>
        <TextField
          size="small"
          margin="normal"
          variant="outlined"
          type="date"
          value={date}
          label="Select Date"
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <MaterialReactTable table={table} />
    </>
  );
}

export default React.memo(ImportOperations);
