import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import xlsx from "xlsx";
import axios from "axios";
import imaps from "imap-simple";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.set("strictQuery", true);

const MONGODB_URI =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_MONGODB_URI
    : process.env.NODE_ENV === "server"
    ? process.env.SERVER_MONGODB_URI
    : process.env.DEV_MONGODB_URI;

const BACKEND_API_URI =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_BACKEND_API_URI
    : process.env.NODE_ENV === "server"
    ? process.env.SERVER_BACKEND_API_URI
    : process.env.DEV_BACKEND_API_URI;

const IMAP_USER =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_IMAP_USER
    : process.env.NODE_ENV === "server"
    ? process.env.SERVER_IMAP_USER
    : process.env.DEV_IMAP_USER;

const IMAP_PASSWORD =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_IMAP_PASSWORD
    : process.env.NODE_ENV === "server"
    ? process.env.SERVER_IMAP_PASSWORD
    : process.env.DEV_IMAP_PASSWORD;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    minPoolSize: 10,
    maxPoolSize: 1000,
  })
  .then(() => {
    const imapConfig = {
      imap: {
        user: IMAP_USER,
        password: IMAP_PASSWORD,
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        connTimeout: 10000,
        authTimeout: 10000,
      },
    };

    const watchEmailAddresses = process.env.WATCH_EMAIL_ADDRESSES.split(",");

    const startMailListener = async () => {
      try {
        const connection = await imaps.connect(imapConfig);
        await connection.openBox("INBOX");

        const searchCriteria = ["UNSEEN"];
        const fetchOptions = {
          bodies: ["HEADER", "TEXT", ""],
          struct: true,
          markSeen: true,
        };

        const messages = await connection.search(searchCriteria, fetchOptions);

        console.log(`Found ${messages.length} new messages`);

        for (const message of messages) {
          const headers = message.parts.find(
            (part) => part.which === "HEADER"
          ).body;
          const fromAddress = headers.from[0];
          const email = fromAddress.substring(
            fromAddress.indexOf("<") + 1,
            fromAddress.indexOf(">")
          );

          if (!watchEmailAddresses.includes(email)) {
            console.log(`Email is not in the watch list.`);
            continue;
          }

          if (message.attributes && message.attributes.struct) {
            const parts = imaps.getParts(message.attributes.struct);
            const attachmentParts = parts.filter(
              (part) =>
                part.disposition &&
                part.disposition.type.toUpperCase() === "ATTACHMENT"
            );

            if (attachmentParts.length > 0) {
              console.log(`Found ${attachmentParts.length} attachments`);
              const jsonData1 = [];
              const jsonData2 = [];
              const mergedData = [];

              for (const attachmentPart of attachmentParts) {
                const attachment = await connection.getPartData(
                  message,
                  attachmentPart
                );
                if (
                  attachmentPart.subtype ===
                  "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ) {
                  try {
                    const workbook = xlsx.read(attachment, { type: "buffer" });
                    const sheetName = workbook.SheetNames[0];
                    let jsonData;
                    if (attachmentPart.params.name.includes("Register")) {
                      jsonData = xlsx.utils.sheet_to_json(
                        workbook.Sheets[sheetName],
                        { range: 2 }
                      );
                    } else if (
                      attachmentPart.params.name.includes("Containers")
                    ) {
                      jsonData = xlsx.utils.sheet_to_json(
                        workbook.Sheets[sheetName]
                      );
                    }

                    const modifiedData = jsonData.map((item) => {
                      const modifiedItem = {};
                      for (const key in item) {
                        if (Object.hasOwnProperty.call(item, key)) {
                          let modifiedKey = key
                            .toLowerCase()
                            .replace(/\s+/g, "_")
                            .replace(/[^\w\s]/gi, "_")
                            .replace(/\//g, "_");

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
                            const date = new Date(item[key]);
                            if (!isNaN(date.getTime())) {
                              const year = date.getFullYear();
                              const month = String(
                                date.getMonth() + 1
                              ).padStart(2, "0");
                              const day = String(date.getDate()).padStart(
                                2,
                                "0"
                              );
                              modifiedItem[
                                modifiedKey
                              ] = `${year}-${month}-${day}`;
                            } else {
                              modifiedItem[modifiedKey] = item[key];
                            }
                          } else if (modifiedKey === "job_no") {
                            const match = item[key].split("/");
                            modifiedItem.job_no = match[3];
                            modifiedItem.year = match[4];
                          } else if (modifiedKey === "custom_house") {
                            const customHouse = item[key].toLowerCase();
                            if (customHouse.includes("sabarmati")) {
                              modifiedItem[modifiedKey] = "KHODIYAR";
                            } else if (customHouse.includes("thar")) {
                              modifiedItem[modifiedKey] = "ICD SANAND";
                            } else if (customHouse.includes("mundra")) {
                              modifiedItem[modifiedKey] = "MUNDRA PORT";
                            } else {
                              modifiedItem[modifiedKey] = item[key];
                            }
                          } else if (modifiedKey === "importer") {
                            modifiedItem.importer = item[key];
                            modifiedItem.importerURL = item[key]
                              .toLowerCase()
                              .replace(/\s+/g, "_") // Replace spaces with underscores
                              .replace(/[^\w]+/g, "") // Remove all special characters except underscores
                              .replace(/_+/g, "_") // Replace multiple underscores with a single underscore
                              .replace(/^_|_$/g, ""); // Remove leading and trailing underscores
                          } else if (modifiedKey === "container_no") {
                            modifiedItem.container_nos = item[key];
                          } else if (modifiedKey === "awb_bl_no_") {
                            modifiedItem.awb_bl_no = item[key];
                          } else if (modifiedKey === "assbl__value") {
                            modifiedItem.assbl_value = item[key];
                          } else if (modifiedKey === "ex_rate") {
                            modifiedItem.exrate = item[key];
                          } else if (modifiedKey === "bill_no") {
                            modifiedItem.bill_no = item[key].split(",")[0];
                          } else if (modifiedKey === "bill_date") {
                            modifiedItem.bill_date = item[key].split(",")[0];
                          } else if (
                            modifiedKey !== "noofconts" &&
                            modifiedKey !== "noofcontsbytype" &&
                            modifiedKey !== "container_nos_"
                          ) {
                            modifiedItem[modifiedKey] = item[key];
                          }
                        }
                      }
                      return modifiedItem;
                    });

                    if (jsonData1.length === 0) {
                      jsonData1.push(...modifiedData);
                    } else {
                      jsonData2.push(...modifiedData);

                      const jobNos1 = new Set(
                        jsonData1.map((item) => item.job_no)
                      );
                      const jobNos2 = new Set(
                        jsonData2.map((item) => item.job_no)
                      );

                      const commonJobNos = [...jobNos1].filter((jobNo) =>
                        jobNos2.has(jobNo)
                      );

                      commonJobNos.forEach((jobNo) => {
                        const item1 = jsonData1.find(
                          (item) => item.job_no === jobNo
                        );
                        const item2 = jsonData2.find(
                          (item) => item.job_no === jobNo
                        );
                        const mergedItem = { ...item1, ...item2 };
                        mergedData.push(mergedItem);
                      });

                      const uniqueJobNos1 = [...jobNos1].filter(
                        (jobNo) => !jobNos2.has(jobNo)
                      );
                      uniqueJobNos1.forEach((jobNo) => {
                        const item = jsonData1.find(
                          (item) => item.job_no === jobNo
                        );
                        mergedData.push(item);
                      });

                      const uniqueJobNos2 = [...jobNos2].filter(
                        (jobNo) => !jobNos1.has(jobNo)
                      );
                      uniqueJobNos2.forEach((jobNo) => {
                        const item = jsonData2.find(
                          (item) => item.job_no === jobNo
                        );
                        mergedData.push(item);
                      });

                      mergedData.forEach((item) => {
                        if (item.container_nos) {
                          if (typeof item.container_nos === "string") {
                            item.container_nos = item.container_nos
                              .split(",")
                              .map((container) => ({
                                container_number: container.trim(),
                              }));
                          }
                        }
                      });

                      async function sendDataToAPI(mergedData) {
                        try {
                          const response = await axios.post(
                            `${BACKEND_API_URI}/api/jobs/add-job`,
                            mergedData
                          );
                          console.log("Response from API:", response.data);
                        } catch (error) {
                          console.error("Error sending data to API:", error);
                        }
                      }

                      sendDataToAPI(mergedData);
                    }
                  } catch (error) {
                    console.error(
                      "Excel file cannot be converted to JSON",
                      error
                    );
                  }
                }
              }
            } else {
              console.log("No attachments found in email");
            }
          } else {
            console.log("Email structure is not defined");
          }
        }
      } catch (error) {
        console.error("Error connecting to IMAP server:", error);
        setTimeout(startMailListener, 10000); // Retry after 10 seconds
      }
    };

    startMailListener();

    app.listen(8888, () => {
      console.log(`BE started at port 8888`);
    });
  })
  .catch((err) => console.log("Error connecting to MongoDB Atlas:", err));

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed due to app termination");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await mongoose.connection.close();
  console.log("Mongoose connection closed due to app termination");
  process.exit(0);
});
