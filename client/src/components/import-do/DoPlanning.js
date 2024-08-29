import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import DoPlanningContainerTable from "./DoPlanningContainerTable";
import { useNavigate } from "react-router-dom";

function DoPlanning() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  
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
      header: "Job No",
      enableSorting: false,
      size: 100,
    },
    {
      accessorKey: "importer",
      header: "Party",
      enableSorting: false,
      size: 200,
    },
    {
      accessorKey: "importer_address",
      header: "Address",
      enableSorting: false,
      size: 250,
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
      size: 200,
    },
    {
      accessorKey: "custom_house",
      header: "Custom House",
      enableSorting: false,
      size: 150,
    },
    {
      accessorKey: "obl_telex_bl",
      header: "OBL Telex BL",
      enableSorting: false,
      size: 100,
    },
    {
      accessorKey: "payment_made_date",
      header: "Payment Made Date",
      enableSorting: false,
      size: 150,
    },
    {
      accessorKey: "vessel_flight",
      header: "Vessel",
      enableSorting: false,
      size: 100,
    },
    {
      accessorKey: "voyage_no",
      header: "Voyage No",
      enableSorting: false,
      size: 100,
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
    enablePagination: false,
    enableBottomToolbar: false,
    enableExpandAll: false,
    muiTableContainerProps: {
      sx: { maxHeight: "650px", overflowY: "auto" },
    },
    muiTableBodyRowProps: ({ row }) => ({
      className: getTableRowsClassname(row),
      onClick: () => navigate(`/edit-do-planning/${row.original._id}`), // Navigate on row click
      style: { cursor: "pointer" }, // Change cursor to pointer on hover
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
