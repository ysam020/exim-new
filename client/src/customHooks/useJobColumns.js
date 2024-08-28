import React from "react";

function useJobColumns() {
  const columns = [
    {
      accessorKey: "job_no",
      header: "Job Number",
      size: 130,
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
      size: 120,
      Cell: ({ cell }) => {
        return cell?.getValue()?.toString();
      },
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
      accessorKey: "loading_port",
      header: "Loading Port",
      size: 150,
    },
    {
      accessorKey: "port_of_reporting",
      header: "Port of Discharge",
      size: 150,
    },
  ];

  return columns;
}

export default useJobColumns;
