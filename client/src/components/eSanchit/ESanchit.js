import * as React from "react";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Link } from "react-router-dom";

function ESanchit() {
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    async function getData() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_STRING}/get-esanchit-jobs`
      );
      setRows(res.data);
    }

    getData();
  }, []);

  const columns = [
    {
      accessorKey: "job_no",
      header: "Job Number",
      enableSorting: false,
      size: 130,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      size: 120,
      Cell: ({ cell }) => (
        <Link
          to={`/esanchit-job/${cell.row.original.job_no}/${cell.row.original.year}`}
        >
          View Job
        </Link>
      ),
    },
    {
      accessorKey: "custom_house",
      header: "Custom House",
      enableSorting: false,
      size: 200,
    },
    {
      accessorKey: "awb_bl_no",
      header: "BL Number",
      enableSorting: false,
      size: 200,
      Cell: ({ cell }) => cell?.getValue()?.toString(),
    },
    {
      accessorKey: "vessel_berthing",
      header: "ETA",
      enableSorting: false,
      size: 100,
    },
    {
      accessorKey: "discharge_date",
      header: "Discharge Date",
      enableSorting: false,
      size: 180,
    },
    {
      accessorKey: "arrival_date",
      header: "Arrival Date",
      enableSorting: false,
      size: 180,
      Cell: ({ cell }) =>
        cell.row.original.container_nos?.map((container, id) => (
          <React.Fragment key={id}>
            {container.arrival_date}
            <br />
          </React.Fragment>
        )),
      filterFn: "includes",
      accessorFn: (row) =>
        row.container_nos
          ?.map((container) => container.arrival_date)
          .join(", "),
    },
    {
      accessorKey: "container_numbers",
      header: "Container Numbers",
      enableSorting: false,
      size: 180,
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
      accessorKey: "be_no",
      header: "BE Number",
      enableSorting: false,
      size: 150,
    },
    {
      accessorKey: "be_date",
      header: "BE Date",
      enableSorting: false,
      size: 150,
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableDensityToggle: false, // Disable density toggle
    initialState: { density: "compact", pagination: { pageSize: 20 } }, // Set initial table density to compact
    enableGrouping: true, // Enable row grouping
    enableColumnFilters: false, // Disable column filters
    enableColumnActions: false,
    enableStickyHeader: true, // Enable sticky header
    enablePinning: true, // Enable pinning for sticky columns
    muiTableContainerProps: {
      sx: { maxHeight: "750px", overflowY: "auto" },
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
    </div>
  );
}

export default React.memo(ESanchit);
