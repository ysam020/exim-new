import React, { useEffect, useState } from "react";
import { TextField, IconButton, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import SaveIcon from "@mui/icons-material/Save";
import Autocomplete from "@mui/material/Autocomplete";
import { handleSaveLr } from "../utils/handleSaveLr";
import { lrContainerPlanningStatus } from "../assets/data/dsrDetailedStatus";

function useLrColumns(props) {
  const [rows, setRows] = useState([]);
  const [filteredTruckNos, setFilteredTruckNos] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [truckNos, setTruckNos] = useState([]);

  useEffect(() => {
    async function getTruckNo() {
      const res = await axios(
        `${process.env.REACT_APP_API_STRING}/get-vehicles`
      );
      setTruckNos(res.data);
    }

    getTruckNo();
  }, []);

  async function getData() {
    const res = await axios.post(
      `${process.env.REACT_APP_API_STRING}/get-trs`,
      { pr_no: props.pr_no }
    );
    setRows(res.data);
  }

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [props.prData, props.pr_no]);

  const handleInputChange = (event, rowIndex, columnId) => {
    const { value } = event.target;

    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIndex][columnId] = value;

      // If the vehicle type is "Own" and type of vehicle is selected, filter the truck nos
      if (
        columnId === "type_of_vehicle" &&
        newRows[rowIndex].own_hired === "Own"
      ) {
        filterTruckNos(value);
      }

      // If the vehicle type is "Own" and vehicle no is selected, populate the driver details
      if (columnId === "vehicle_no" && newRows[rowIndex].own_hired === "Own") {
        populateDriverDetails(newRows, rowIndex, value);
      }
      return newRows;
    });
  };

  const handleDelete = async (tr_no, container_number) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this TR?"
    );

    if (confirmDelete) {
      // If user confirms deletion, proceed with deletion
      const res = await axios.post(
        `${process.env.REACT_APP_API_STRING}/delete-tr`,
        {
          pr_no: props.pr_no,
          tr_no,
          container_number,
        }
      );
      alert(res.data.message);
      getData();
    }
  };

  const handleCheckboxChange = (row) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(row)) {
        return prevSelectedRows.filter((selectedRow) => selectedRow !== row);
      } else {
        return [...prevSelectedRows, row];
      }
    });
  };

  const filterTruckNos = (vehicleType) => {
    const filtered = truckNos.filter(
      (truck) => truck.type_of_vehicle === vehicleType
    );
    setFilteredTruckNos(filtered);
  };

  const populateDriverDetails = (newRows, rowIndex, vehicleNo) => {
    const selectedTruck = truckNos.find(
      (truck) => truck.truck_no === vehicleNo
    );

    if (selectedTruck?.drivers?.length > 0) {
      const lastDriver =
        selectedTruck.drivers[selectedTruck.drivers?.length - 1];

      newRows[rowIndex].driver_name = lastDriver.driver_name;
      newRows[rowIndex].driver_phone = lastDriver.driver_phone;
    } else {
      newRows[rowIndex].driver_name = "";
      newRows[rowIndex].driver_phone = "";
    }
    setRows(newRows); // Update the state to reflect changes in the UI
  };

  const columns = [
    {
      accessorKey: "print",
      enableSorting: false,
      enableGrouping: false,
      size: 50,
      Cell: ({ row }) => (
        <Checkbox
          style={{ padding: 0 }}
          disabled={!row.original.tr_no} // Disable checkbox if tr_no is not present
          onChange={() => handleCheckboxChange(row.original)}
        />
      ),
    },
    {
      accessorKey: "delete",
      enableSorting: false,
      enableGrouping: false,
      size: 50,
      Cell: ({ row }) => (
        <IconButton
          onClick={() =>
            handleDelete(row.original.tr_no, row.original.container_number)
          }
        >
          <DeleteIcon
            sx={{ color: "#BE3838", cursor: "pointer", fontSize: "18px" }}
          />
        </IconButton>
      ),
    },
    {
      accessorKey: "tr_no",
      header: "TR No",
      enableSorting: false,
      size: 100,
    },
    {
      accessorKey: "container_number",
      header: "Container Number",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) => (
        <TextField
          sx={{ width: "100%" }}
          size="small"
          defaultValue={cell.getValue()}
          onBlur={(event) =>
            handleInputChange(event, row.index, cell.column.id)
          }
        />
      ),
    },
    {
      accessorKey: "seal_no",
      header: "Seal No",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) => (
        <TextField
          sx={{ width: "100%" }}
          size="small"
          defaultValue={cell.getValue()}
          onBlur={(event) =>
            handleInputChange(event, row.index, cell.column.id)
          }
        />
      ),
    },
    {
      accessorKey: "gross_weight",
      header: "Gross Weight",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) => (
        <TextField
          sx={{ width: "100%" }}
          size="small"
          defaultValue={cell.getValue()}
          onBlur={(event) =>
            handleInputChange(event, row.index, cell.column.id)
          }
        />
      ),
    },
    {
      accessorKey: "tare_weight",
      header: "Tare Weight",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) => (
        <TextField
          sx={{ width: "100%" }}
          size="small"
          defaultValue={cell.getValue()}
          onBlur={(event) =>
            handleInputChange(event, row.index, cell.column.id)
          }
        />
      ),
    },
    {
      accessorKey: "net_weight",
      header: "Net Weight",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) => (
        <TextField
          sx={{ width: "100%" }}
          size="small"
          defaultValue={cell.getValue()}
          onBlur={(event) =>
            handleInputChange(event, row.index, cell.column.id)
          }
        />
      ),
    },
    {
      accessorKey: "goods_pickup",
      header: "Goods Pickup",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) => (
        <Autocomplete
          fullWidth
          disablePortal={false}
          options={props.locations}
          getOptionLabel={(option) => option}
          value={rows[row.index]?.goods_pickup || null}
          onChange={(event, newValue) =>
            handleInputChange(
              { target: { value: newValue } },
              row.index,
              cell.column.id
            )
          }
          renderInput={(params) => <TextField {...params} size="small" />}
        />
      ),
    },
    {
      accessorKey: "goods_delivery",
      header: "Goods Delivery",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) => (
        <Autocomplete
          fullWidth
          disablePortal={false}
          options={props.locations}
          getOptionLabel={(option) => option}
          value={rows[row.index]?.goods_delivery || null}
          onChange={(event, newValue) =>
            handleInputChange(
              { target: { value: newValue } },
              row.index,
              cell.column.id
            )
          }
          renderInput={(params) => <TextField {...params} size="small" />}
        />
      ),
    },
    {
      accessorKey: "own_hired",
      header: "Own/ Hired",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) => (
        <TextField
          select
          sx={{ width: "100%" }}
          size="small"
          defaultValue={cell.getValue()}
          onBlur={(event) =>
            handleInputChange(event, row.index, cell.column.id)
          }
        >
          <MenuItem value="Own">Own</MenuItem>
          <MenuItem value="Hired">Hired</MenuItem>
        </TextField>
      ),
    },
    {
      accessorKey: "type_of_vehicle",
      header: "Type of Vehicle",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) => (
        <TextField
          select
          sx={{ width: "100%" }}
          size="small"
          defaultValue={cell.getValue()}
          onBlur={(event) =>
            handleInputChange(event, row.index, cell.column.id)
          }
        >
          {props.truckTypes?.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      ),
    },
    {
      accessorKey: "vehicle_no",
      header: "Vehicle No",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) =>
        // If it is our own truck, show the dropdown with truck nos
        row.original.own_hired === "Own" ? (
          <TextField
            select
            sx={{ width: "100%" }}
            size="small"
            defaultValue={cell.getValue()}
            onBlur={(event) =>
              handleInputChange(event, row.index, cell.column.id)
            }
          >
            {filteredTruckNos?.map((type) => (
              <MenuItem key={type.truck_no} value={type.truck_no}>
                {type.truck_no}
              </MenuItem>
            ))}
            {filteredTruckNos.length > 0
              ? filteredTruckNos?.map((type) => (
                  <MenuItem key={type.truck_no} value={type.truck_no}>
                    {type.truck_no}
                  </MenuItem>
                ))
              : truckNos?.map((type) => (
                  <MenuItem key={type.truck_no} value={type.truck_no}>
                    {type.truck_no}
                  </MenuItem>
                ))}
          </TextField>
        ) : (
          // If it is not our own truck, show the text field
          <TextField
            sx={{ width: "100%" }}
            size="small"
            defaultValue={cell.getValue()}
            onBlur={(event) =>
              handleInputChange(event, row.index, cell.column.id)
            }
          />
        ),
    },
    {
      accessorKey: "driver_name",
      header: "Driver Name",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) =>
        // If it is our own truck, update the driver name with data from selected truck no
        row.original.own_hired === "Own" ? (
          <TextField
            sx={{ width: "100%" }}
            size="small"
            value={rows[row.index]?.driver_name || ""}
            onBlur={(event) =>
              handleInputChange(event, row.index, cell.column.id)
            }
          />
        ) : (
          // If it is not our own truck, show the text field
          <TextField
            sx={{ width: "100%" }}
            size="small"
            defaultValue={cell.getValue()}
            onBlur={(event) =>
              handleInputChange(event, row.index, cell.column.id)
            }
          />
        ),
    },
    {
      accessorKey: "driver_phone",
      header: "Driver Phone",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) =>
        // If it is our own truck, update the driver phone with data from selected truck no
        row.original.own_hired === "Own" ? (
          <TextField
            sx={{ width: "100%" }}
            size="small"
            value={rows[row.index]?.driver_phone || ""}
            onBlur={(event) =>
              handleInputChange(event, row.index, cell.column.id)
            }
          />
        ) : (
          // If it is not our own truck, show the text field
          <TextField
            sx={{ width: "100%" }}
            size="small"
            defaultValue={cell.getValue()}
            onBlur={(event) =>
              handleInputChange(event, row.index, cell.column.id)
            }
          />
        ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      size: 200,
      Cell: ({ cell, row }) => {
        const currentValue = cell.getValue();
        const options = lrContainerPlanningStatus.includes(currentValue)
          ? lrContainerPlanningStatus
          : [currentValue, ...lrContainerPlanningStatus];

        return (
          <TextField
            select
            fullWidth
            label="Status"
            size="small"
            defaultValue={currentValue}
            onBlur={(event) =>
              handleInputChange(event, row.index, cell.column.id)
            }
          >
            {options.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Save",
      enableSorting: false,
      size: 100,
      Cell: ({ cell, row }) => (
        <IconButton onClick={() => handleSaveLr(row.original, props)}>
          <SaveIcon sx={{ color: "#015C4B" }} />
        </IconButton>
      ),
    },
  ];

  return { rows, setRows, columns, selectedRows };
}

export default useLrColumns;
