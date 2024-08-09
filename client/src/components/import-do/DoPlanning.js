import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Link } from "react-router-dom";
import DoPlanningContainerTable from "./DoPlanningContainerTable";

function DoPlanning() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function getData() {
      const res = await axios(
        `${process.env.REACT_APP_API_STRING}/get-do-module-jobs`
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
      size: 150,
    },
    {
      accessorKey: "importer",
      header: "Party",
      enableSorting: false,
      size: 300,
    },
    {
      accessorKey: "awb_bl_no",
      header: "BL Number",
      enableSorting: false,
      size: 150,
    },
    {
      accessorKey: "shipping_line_airline",
      header: "Shipping Line",
      enableSorting: false,
      size: 250,
    },
    {
      accessorKey: "custom_house",
      header: "Custom House",
      enableSorting: false,
      size: 250,
    },
    {
      accessorKey: "obl_telex_bl",
      header: "OBL Telex BL",
      enableSorting: false,
      size: 150,
    },
    {
      accessorKey: "payment_made_date",
      header: "Payment Made Date",
      enableSorting: false,
      size: 200,
    },
    {
      accessorKey: "actions",
      header: "Actions1234",
      enableSorting: false,
      size: 150,

      Cell: ({ cell }) => {
        return (
          <Link to={`/edit-do-planning/${cell.row.original._id}`}>Edit</Link>
        );
      },
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableDensityToggle: false, // Disable density toggle
    initialState: {
      density: "compact",
    }, // Set initial table density to compact
    enableGrouping: true, // Enable row grouping
    enableColumnFilters: false, // Disable column filters
    enableColumnActions: false,
    enableExpandAll: false,
    muiTableBodyRowProps: ({ row }) => ({
      className: getTableRowsClassname(row),
    }),
    renderDetailPanel: ({ row }) => {
      return (
        <div style={{ padding: "0 !important" }}>
          <DoPlanningContainerTable
            job_no={row.original.job_no}
            year={row.original.year}
          />
        </div>
      );
    },
  });

  const getTableRowsClassname = (params) => {
    const status = params.original.payment_made;
    if (status !== "No" && status !== undefined) {
      return "payment_made";
    } else {
      return "";
    }
  };

  return (
    <>
      <div style={{ height: "80%" }}>
        <MaterialReactTable table={table} />
      </div>
    </>
  );
}

export default React.memo(DoPlanning);
