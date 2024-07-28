import React, { useContext, useState } from "react";
import "../../styles/job-list.scss";
import useJobColumns from "../../customHooks/useJobColumns";
import { getTableRowsClassname } from "../../utils/getTableRowsClassname";
import useFetchJobList from "../../customHooks/useFetchJobList";
import { detailedStatusOptions } from "../../assets/data/detailedStatusOptions";
import { SelectedYearContext } from "../../contexts/SelectedYearContext";
import { MenuItem, TextField, IconButton } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { convertToExcel } from "../../utils/convertToExcel";

function JobList(props) {
  const { selectedYear } = useContext(SelectedYearContext);
  const [detailedStatus, setDetailedStatus] = useState("all");
  const columns = useJobColumns(detailedStatus);
  const { rows } = useFetchJobList(detailedStatus, selectedYear, props.status);

  const handleReportDownload = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_STRING}/download-report/${selectedYear}/${props.status}`
    );

    convertToExcel(res.data, props.status, detailedStatus);
  };

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableDensityToggle: false, // Disable density toggle
    initialState: { density: "compact", columnPinning: { left: ["job_no"] } }, // Set initial table density to compact
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

    renderTopToolbarCustomActions: () => (
      <>
        <div
          gap={1}
          width="100%"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            flex: 1,
          }}
        >
          <TextField
            select
            size="small"
            sx={{ width: "300px" }}
            value={detailedStatus}
            onChange={(e) => {
              setDetailedStatus(e.target.value);
            }}
          >
            {detailedStatusOptions?.map((option) => (
              <MenuItem key={option.id} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <IconButton onClick={handleReportDownload}>
            <DownloadIcon />
          </IconButton>
        </div>
      </>
    ),
  });

  return (
    <div className="table-container">
      <MaterialReactTable table={table} />
    </div>
  );
}

export default React.memo(JobList);
