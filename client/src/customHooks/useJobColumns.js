import React from "react";
import { Link } from "react-router-dom";

function useJobColumns(detailedStatus) {
  const allColumns = [
    {
      accessorKey: "job_no",
      header: "Job Number",
      size: 130,
      Cell: ({ cell }) => (
        <Link to={`/job/${cell.row.original.job_no}/${cell.row.original.year}`}>
          {cell.row.original.job_no}
        </Link>
      ),
    },

    {
      accessorKey: "importer",
      header: "Importer",
      size: 250,
    },
    {
      accessorKey: "custom_house",
      header: "Custom House",
      size: 150,
    },
    {
      accessorKey: "awb_bl_no",
      header: "BL Number",
      size: 200,
      Cell: ({ cell }) => cell?.getValue()?.toString(),
    },
    {
      accessorKey: "be_no",
      header: "BE Number",
      size: 150,
    },
    {
      accessorKey: "be_date",
      header: "BE Date",
      size: 150,
    },
    {
      accessorKey: "container_numbers",
      header: "Container Numbers",
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
      accessorKey: "vessel_berthing",
      header: "ETA",
      size: 100,
    },
    {
      accessorKey: "discharge_date",
      header: "Discharge Date",
      size: 180,
    },
    {
      accessorKey: "arrival_date",
      header: "Arrival Date",
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
      accessorKey: "out_of_charge",
      header: "OOC Date",
      size: 150,
    },
  ];

  const columns = allColumns.filter((column) => {
    if (
      column.accessorKey === "awb_bl_no" &&
      [
        "Estimated Time of Arrival",
        "Gateway IGM Filed",
        "Discharged",
        "all",
      ].includes(detailedStatus)
    ) {
      return false;
    }
    if (
      column.accessorKey === "discharge_date" &&
      detailedStatus !== "Discharged"
    ) {
      return false;
    }
    if (
      column.accessorKey === "arrival_date" &&
      detailedStatus !== "BE Noted, Clearance Pending"
    ) {
      return false;
    }
    if (
      column.accessorKey === "out_of_charge" &&
      detailedStatus !== "Custom Clearance Completed"
    ) {
      return false;
    }
    return true;
  });

  return columns;
}

export default useJobColumns;
