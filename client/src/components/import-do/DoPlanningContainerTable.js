import React, { useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import axios from "axios";
import { TextField, IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

function DoPlanningContainerTable(props) {
  const [rows, setRows] = useState([]);
  const columns = [
    {
      accessorKey: "container_number",
      header: "Container No",
      enableSorting: false,
      size: 160,
    },
    {
      accessorKey: "size",
      header: "Size",
      enableSorting: false,
      size: 160,
    },
    {
      accessorKey: "do_validity_upto_container_level",
      header: "DO Validity Upto",
      enableSorting: false,
      size: 160,
      Cell: () => {
        return (
          <>
            <TextField size="small" type="date" />
          </>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Save",
      enableSorting: false,
      size: 100,
      Cell: ({ cell, row }) => (
        <IconButton>
          <SaveIcon sx={{ color: "#015C4B" }} />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    async function getData() {
      const res = await axios(
        `${process.env.REACT_APP_API_STRING}/get-job/${props.year}/${props.job_no}`
      );
      setRows(res.data.container_nos);
    }

    getData();
  }, []);

  const table = useMaterialReactTable({
    columns,
    data: rows,
    initialState: {
      density: "compact",
    }, // Set initial table density to compact
    enableColumnFilters: false,
    enableColumnActions: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
}

export default DoPlanningContainerTable;
