import React, { useEffect, useState } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import useTableConfig from "../../customHooks/useTableConfig";
import { Link } from "react-router-dom";

function List() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function getData() {
      const res = await axios(
        `${process.env.REACT_APP_API_STRING}/do-team-list-of-jobs`
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
      size: 200,
    },
    {
      accessorKey: "awb_bl_no",
      header: "BL Number",
      enableSorting: false,
      size: 200,
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
      size: 200,
    },
    {
      accessorKey: "obl_telex_bl",
      header: "OBL Telex BL",
      enableSorting: false,
      size: 200,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      size: 150,

      Cell: ({ cell }) => {
        return <Link to={`/edit-do-list/${cell.row.original._id}`}>Edit</Link>;
      },
    },
  ];

  const table = useTableConfig(rows, columns);

  return (
    <>
      <div style={{ height: "80%" }}>
        <MaterialReactTable table={table} />
      </div>
    </>
  );
}

export default React.memo(List);
