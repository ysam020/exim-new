import * as xlsx from "xlsx";
import axios from "axios";
import { useState } from "react";

function useFileUpload(inputRef, alt, setAlt) {
  const [snackbar, setSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = handleFileRead;
    reader.readAsBinaryString(file);
  };

  const handleFileRead = (event) => {
    const content = event.target.result;
    const workbook = xlsx.read(content, { type: "binary" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Format awb_bl_no column
    const columnToFormat = "H";

    // Loop through all cells in column H and format them as '0' to prevent scientific notation
    Object.keys(worksheet).forEach(function (cell) {
      if (cell.startsWith(columnToFormat)) {
        if (worksheet[cell].w) {
          delete worksheet[cell].w;
          worksheet[cell].z = "0";
        }
      }
    });

    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      range: 2,
    });

    const modifiedData = jsonData?.map((item) => {
      const modifiedItem = {};
      for (const key in item) {
        if (Object.hasOwnProperty.call(item, key)) {
          let modifiedKey = key
            .toLowerCase() // Convert to lower case
            .replace(/\s+/g, "_") // Replace spaces with underscores
            .replace(/[^\w\s]/gi, "_") // Replace special characters with underscores
            .replace(/\//g, "_") // Replace forward slashes with underscores
            .replace(/_+$/, ""); // Remove any trailing underscores

          // Specific transformation for date keys
          if (
            [
              "job_date",
              "invoice_date",
              "be_date",
              "igm_date",
              "gateway_igm_date",
              "out_of_charge",
              "awb_bl_date",
            ].includes(modifiedKey)
          ) {
            // Attempt to parse the date string
            const date = new Date(item[key]);
            if (!isNaN(date.getTime())) {
              // If parsing successful, format the date to yyyy-mm-dd
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              modifiedItem[modifiedKey] = `${year}-${month}-${day}`;
            } else {
              // If parsing unsuccessful, keep the original value
              modifiedItem[modifiedKey] = item[key];
            }
          } else if (modifiedKey === "job_no") {
            // Extract job number and year from job_no
            const match = item[key].split("/");
            modifiedItem.job_no = match[3]; // Save job number
            modifiedItem.year = match[4]; // Save year
          } else if (modifiedKey === "custom_house") {
            const customHouse = item[key].toLowerCase();
            if (customHouse.includes("sabarmati")) {
              modifiedItem[modifiedKey] = "ICD KHODIYAR";
            } else if (customHouse.includes("thar")) {
              modifiedItem[modifiedKey] = "ICD SANAND";
            } else if (customHouse.includes("mundra")) {
              modifiedItem[modifiedKey] = "MUNDRA PORT";
            } else {
              modifiedItem[modifiedKey] = item[key];
            }
          } else if (modifiedKey === "importer") {
            modifiedItem.importer = item[key];
            // Convert importerURL to small case, replace spaces with underscores, replace "-" with "_", and replace consecutive underscores with a single underscore
            modifiedItem.importerURL = item[key]
              .toLowerCase()
              .replace(/\s+/g, "_") // Replace spaces with underscores
              .replace(/[^\w]+/g, "") // Remove all special characters except underscores
              .replace(/_+/g, "_") // Replace multiple underscores with a single underscore
              .replace(/^_|_$/g, ""); // Remove leading and trailing underscores
          } else if (modifiedKey === "container_no") {
            // Rename key from "container_no" to "container_nos"
            modifiedItem.container_nos = item[key];
          } else if (modifiedKey === "awb_bl_no_") {
            // Rename key from "awb_bl_no_" to "awb_bl_no"
            modifiedItem.awb_bl_no = item[key];
          } else if (modifiedKey === "assbl__value") {
            // Rename key from "assbl__value" to "assbl_value"
            modifiedItem.assbl_value = item[key];
          } else if (modifiedKey === "ex_rate") {
            // Rename key from "ex_rate" to "exrate"
            modifiedItem.exrate = item[key];
          } else if (modifiedKey === "bill_no") {
            // Remove duplicate bill no
            modifiedItem.bill_no = item[key].split(",")[0];
          } else if (modifiedKey === "bill_date") {
            // Remove duplicate bill date
            modifiedItem.bill_date = item[key].split(",")[0];
          } else if (
            modifiedKey !== "noofconts" &&
            modifiedKey !== "noofcontsbytype"
          ) {
            // Exclude "noofconts", "noofcontsbytype", and "container_nos_" keys from the output
            modifiedItem[modifiedKey] = item[key];
          }
        }
      }
      return modifiedItem;
    });

    modifiedData.forEach((item) => {
      const containerNumbers = item.container_nos?.split(",");

      // Create an array of objects with container_number and seal_no
      const containers = containerNumbers?.map((container, index) => ({
        container_number: container.trim(),
      }));

      // Replace container_nos and seal_no with the array of objects
      item.container_nos = containers;
    });

    // Set file to null so that same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = null;
    }

    async function uploadExcelData() {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_STRING}/jobs/add-job`,
        modifiedData
      );
      if (res.status === 200) {
        setSnackbar(true);
      } else {
        alert("Something went wrong");
      }
      setLoading(false);
    }

    uploadExcelData().then(() => setAlt(!alt));
  };

  // Hide snackbar after 2 seconds
  setTimeout(() => {
    setSnackbar(false);
  }, 2000);

  return { handleFileUpload, snackbar, loading };
}

export default useFileUpload;
