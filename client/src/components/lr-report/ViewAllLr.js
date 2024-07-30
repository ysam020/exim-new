import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import useTableConfig from "../../customHooks/useTableConfig";
import { UserContext } from "../../contexts/UserContext";
import { TextField, MenuItem, IconButton } from "@mui/material";
import { lrDetailedStatus } from "../../assets/data/dsrDetailedStatus";
import SaveIcon from "@mui/icons-material/Save";

function ViewAllLr() {
  const [rows, setRows] = useState([]);
  const { user } = useContext(UserContext);

  const getData = useCallback(async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_STRING}/view-all-lr`
    );
    setRows(res.data);
  }, [user]);

  const handleStatus = useCallback(
    async (param, _id) => {
      await axios.post(`${process.env.REACT_APP_API_STRING}/handle-status`, {
        param,
        _id,
      });
      getData(); // Fetch updated data after the status change
    },
    [getData]
  );

  useEffect(() => {
    getData();
  }, [getData]);

  const columns = [
    {
      accessorKey: "tr_no",
      header: "LR No",
      enableSorting: false,
      size: 160,
    },
    {
      accessorKey: "container_number",
      header: "Container No",
      enableSorting: false,
      size: 150,
    },
    {
      accessorKey: "consignor",
      header: "Consignor",
      enableSorting: false,
      size: 250,
    },
    {
      accessorKey: "consignee",
      header: "Consignee",
      enableSorting: false,
      size: 250,
    },
    {
      accessorKey: "goods_delivery",
      header: "Goods Delivery",
      enableSorting: false,
      size: 150,
    },
    {
      accessorKey: "branch",
      header: "Branch",
      enableSorting: false,
      size: 120,
    },
    {
      accessorKey: "vehicle_no",
      header: "Vehicle No",
      enableSorting: false,
      size: 120,
    },
    {
      accessorKey: "driver_name",
      header: "Driver Name",
      enableSorting: false,
      size: 130,
    },
    {
      accessorKey: "driver_phone",
      header: "Driver Phone",
      enableSorting: false,
      size: 130,
    },
    {
      accessorKey: "shipping_line",
      header: "Shipping Line",
      enableSorting: false,
      size: 200,
    },
    {
      accessorKey: "container_offloading",
      header: "Container Offloading",
      enableSorting: false,
      size: 200,
    },
    {
      accessorKey: "do_validity",
      header: "DO Validity",
      enableSorting: false,
      size: 120,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      size: 300,
      Cell: ({ cell }) => (
        <TextField
          select
          fullWidth
          label="Status"
          size="small"
          value={cell.getValue()}
          onChange={(e) => handleStatus(e.target.value, cell.row.original._id)}
        >
          {lrDetailedStatus.map((item) => (
            <MenuItem value={item.label}>{item.label}</MenuItem>
          ))}
        </TextField>
      ),
    },
    {
      accessorKey: "action",
      header: "Save",
      enableSorting: false,
      size: 80,
      Cell: ({ cell, row }) => (
        <IconButton>
          <SaveIcon sx={{ color: "#015C4B" }} />
        </IconButton>
      ),
    },
  ];

  const table = useTableConfig(rows, columns);

  return (
    <div style={{ width: "100%" }}>
      <MaterialReactTable table={table} />
    </div>
  );
}

export default React.memo(ViewAllLr);
