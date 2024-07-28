import React, { useEffect, useState } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import useTableConfig from "../../customHooks/useTableConfig";
import { Link } from "react-router-dom";

function ViewDrafts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_STRING}/view-customer-kyc-drafts`
      );
      setData(res.data);
    }
    getData();
  }, []);

  const columns = [
    {
      accessorKey: "name_of_individual",
      header: "Name of Individual",
      enableSorting: false,
      size: 350,
    },
    {
      accessorKey: "category",
      header: "Category",
      enableSorting: false,
      size: 160,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      size: 120,
    },
    {
      accessorKey: "iec_no",
      header: "IEC",
      enableSorting: false,
      size: 120,
    },
    {
      accessorKey: "action",
      header: "View",
      enableSorting: false,
      size: 120,

      Cell: ({ cell }) => (
        <Link to={`/view-customer-kyc-drafts/${cell.row.original._id}`}>
          View
        </Link>
      ),
    },
  ];

  const table = useTableConfig(data, columns);

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
}

export default React.memo(ViewDrafts);
