import { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { convertDateFormatForUI } from "../utils/convertDateFormatForUI";
import { useNavigate } from "react-router-dom";

function useFetchJobDetails(params, checked, setSelectedRegNo, setTabValue) {
  const [data, setData] = useState(null);
  const [detentionFrom, setDetentionFrom] = useState([]);
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([
    "Commercial Invoice",
    "Packing List",
    "Bill of Lading",
    "Certificate of Origin",
    "Contract",
    "Insurance",
  ]);

  const additionalDocs = [
    "Pre-Shipment Inspection Certificate",
    "Form 9 & Form 6",
    "Registration Document (SIMS/NFMIMS/PIMS)",
    "Certificate of Analysis",
  ];

  const commonCthCodes = [
    "72041000",
    "72042920",
    "72042990",
    "72043000",
    "72044900",
    "72042190",
    "74040012",
    "74040022",
    "74040024",
    "74040025",
    "75030010",
    "76020010",
    "78020010",
    "79020010",
    "80020010",
    "81042010",
  ];

  // Fetch CTH documents
  useEffect(() => {
    async function getCthDocument() {
      if (data && data.cth_no) {
        const res = await axios.get(
          `${process.env.REACT_APP_API_STRING}/get-cth-docs/${data.cth_no}`
        );
        const fetchedDocs = res.data.map((doc) => doc.document_name); // Extract document names

        setDocuments((currentDocs) => {
          // Filter out any documents that are already in the currentDocs
          let newDocs = fetchedDocs.filter((doc) => !currentDocs.includes(doc));

          // If cth_no is in commonCthCodes, append additionalDocs
          if (commonCthCodes.includes(data.cth_no)) {
            newDocs = [
              ...newDocs,
              ...additionalDocs.filter((doc) => !newDocs.includes(doc)),
            ];
          }

          // Combine currentDocs and newDocs, filtering out any duplicates
          const updatedDocs = [...currentDocs, ...newDocs].filter(
            (doc, index, self) => self.indexOf(doc) === index
          );

          return updatedDocs;
        });
      }
    }

    getCthDocument();
  }, [data]); // Dependency on data object

  // Fetch data
  useEffect(() => {
    async function getJobDetails() {
      const response = await axios.get(
        `${process.env.REACT_APP_API_STRING}/get-job/${params.selected_year}/${params.job_no}`
      );
      setData(response.data);
    }

    getJobDetails();
  }, [params.importer, params.job_no, params.selected_year]);

  // Formik
  const formik = useFormik({
    initialValues: {
      checkedDocs: [],
      container_nos: "",
      obl_telex_bl: "",
      document_received_date: "",
      vessel_berthing: "",
      gateway_igm_date: "",
      discharge_date: "",
      status: "",
      detailed_status: "",
      free_time: "",
      arrival_date: "",
      do_validity_upto_job_level: "",
      do_revalidation_upto_job_level: "",
      checklist: [],
      remarks: "",
      description: "",
      sims_reg_no: "",
      pims_reg_no: "",
      nfmims_reg_no: "",
      sims_date: "",
      pims_date: "",
      nfmims_date: "",
      delivery_date: "",
      assessment_date: "",
      examination_date: "",
      duty_paid_date: "",
      container_images: "",
      doPlanning: false,
      do_planning_date: "",
      examinationPlanning: false,
      examination_planning_date: "",
      do_copies: [],
      processed_be_attachment: [],
      ooc_copies: [],
      gate_pass_copies: [],
      do_revalidation: false,
      do_revalidation_date: "",
      out_of_charge: "",
      checked: false,
    },

    onSubmit: async (values, { resetForm }) => {
      await axios.put(
        `${process.env.REACT_APP_API_STRING}/update-job/${params.selected_year}/${params.job_no}`,
        {
          checkedDocs: values.checkedDocs,
          vessel_berthing: values.vessel_berthing,
          free_time: values.free_time,
          status: values.status,
          detailed_status: values.detailed_status,
          container_nos: values.container_nos,
          arrival_date: values.arrival_date,
          do_validity_upto_job_level: values.do_validity_upto_job_level,
          do_revalidation_upto_job_level: values.do_revalidation_upto_job_level,
          checklist: values.checklist,
          remarks: values.remarks,
          description: values.description,
          sims_reg_no: values.sims_reg_no,
          pims_reg_no: values.pims_reg_no,
          nfmims_reg_no: values.nfmims_reg_no,
          sims_date: values.sims_date,
          pims_date: values.pims_date,
          nfmims_date: values.nfmims_date,
          delivery_date: values.delivery_date,
          gateway_igm_date: values.gateway_igm_date,
          discharge_date: values.discharge_date,
          assessment_date: values.assessment_date,
          examination_date: values.examination_date,
          duty_paid_date: values.duty_paid_date,
          doPlanning: values.doPlanning,
          do_planning_date: values.do_planning_date,
          examinationPlanning: values.examinationPlanning,
          examination_planning_date: values.examination_planning_date,
          do_copies: values.do_copies,
          processed_be_attachment: values.processed_be_attachment,
          ooc_copies: values.ooc_copies,
          gate_pass_copies: values.gate_pass_copies,
          do_revalidation: values.do_revalidation,
          do_revalidation_date: values.do_revalidation_date,
          out_of_charge: values.out_of_charge,
          checked: values.checked,
          obl_telex_bl: values.obl_telex_bl,
          document_received_date: values.document_received_date,
        }
      );
      resetForm();
      localStorage.setItem("tab_value", 1);
      setTabValue(1);
      navigate("/import-dsr");
    },
  });

  // Update formik intial values when data is fetched from db
  useEffect(() => {
    if (data) {
      setSelectedRegNo(
        data.sims_reg_no
          ? "sims"
          : data.pims_reg_no
          ? "pims"
          : data.nfmims_reg_no
          ? "nfmims"
          : ""
      );

      const container_nos = data.container_nos?.map((container) => ({
        arrival_date:
          container.arrival_date === undefined
            ? ""
            : convertDateFormatForUI(container.arrival_date), // convert date to yyyy-mm-dd
        container_number: container.container_number,
        size: container.size === undefined ? "20" : container.size,
        weighment_slip_images:
          container.weighment_slip_images === undefined
            ? []
            : container.weighment_slip_images,
        container_images:
          container.container_images === undefined
            ? []
            : container.container_images,

        loose_material_photo:
          container.loose_material_photo === undefined
            ? []
            : container.loose_material_photo,

        container_pre_damage_images:
          container.container_pre_damage_images === undefined
            ? []
            : container.container_pre_damage_images,

        physical_weight:
          container.physical_weight === undefined
            ? ""
            : container.physical_weight,
        do_revalidation_date:
          container.do_revalidation_date === undefined
            ? ""
            : container.do_revalidation_date,
        do_validity_upto_container_level:
          container.do_validity_upto_container_level === undefined
            ? ""
            : container.do_validity_upto_container_level,
        do_revalidation_upto_container_level:
          container.do_revalidation_upto_container_level === undefined
            ? ""
            : container.do_revalidation_upto_container_level,
        tare_weight:
          container.tare_weight === undefined ? "" : container.tare_weight,
        actual_weight:
          container.actual_weight === undefined ? "" : container.actual_weight,
        net_weight:
          container.net_weight === undefined ? "" : container.net_weight,
        weight_shortage:
          container.weight_shortage === undefined
            ? ""
            : container.weight_shortage,
        weight_excess:
          container.weight_excess === undefined ? "" : container.weight_excess,
        transporter:
          container.transporter === undefined ? "" : container.transporter,
      }));

      formik.setValues({
        ...{ container_nos },
        checkedDocs: data.checkedDocs === undefined ? [] : data.checkedDocs,
        obl_telex_bl: data.obl_telex_bl ? data.obl_telex_bl : "",
        document_received_date: data.document_received_date
          ? data.document_received_date
          : "",
        arrival_date: container_nos[0]?.arrival_date,
        vessel_berthing:
          data.vessel_berthing === undefined
            ? ""
            : new Date(data.vessel_berthing)
                .toLocaleDateString("en-CA")
                .split("/")
                .reverse()
                .join("-"),
        free_time: data.free_time === undefined ? 14 : data.free_time,
        status: data.status,
        detailed_status:
          data.detailed_status === undefined
            ? "Estimated Time of Arrival"
            : data.detailed_status,
        doPlanning: data.doPlanning === undefined ? false : data.doPlanning,
        do_planning_date:
          data.do_planning_date === undefined ? "" : data.do_planning_date,
        examinationPlanning:
          data.examinationPlanning === undefined
            ? false
            : data.examinationPlanning,
        examination_planning_date:
          data.examination_planning_date === undefined
            ? ""
            : data.examination_planning_date,
        do_validity_upto_job_level:
          data.do_validity_upto_job_level === undefined
            ? ""
            : data.do_validity_upto_job_level,
        do_revalidation_upto_job_level:
          data.do_revalidation_upto_job_level === undefined
            ? ""
            : data.do_revalidation_upto_job_level,
        checklist: data.checklist === undefined ? [] : data.checklist,
        remarks: data.remarks === undefined ? "" : data.remarks,
        description: data.description === undefined ? "" : data.description,
        sims_reg_no: data.sims_reg_no === undefined ? "" : data.sims_reg_no,
        pims_reg_no: data.pims_reg_no === undefined ? "" : data.pims_reg_no,
        nfmims_reg_no:
          data.nfmims_reg_no === undefined ? "" : data.nfmims_reg_no,
        sims_date: data.sims_date === undefined ? "" : data.sims_date,
        pims_date: data.pims_date === undefined ? "" : data.pims_date,
        nfmims_date: data.nfmims_date === undefined ? "" : data.nfmims_date,
        delivery_date:
          data.delivery_date === undefined ? "" : data.delivery_date,
        gateway_igm_date:
          data.gateway_igm_date === undefined ? "" : data.gateway_igm_date,
        discharge_date:
          data.discharge_date === undefined ? "" : data.discharge_date,
        assessment_date:
          data.assessment_date === undefined ? "" : data.assessment_date,
        examination_date:
          data.examination_date === undefined ? "" : data.examination_date,
        duty_paid_date:
          data.duty_paid_date === undefined ? "" : data.duty_paid_date,

        do_copies: data.do_copies === undefined ? [] : data.do_copies,
        processed_be_attachment:
          data.processed_be_attachment === undefined
            ? []
            : data.processed_be_attachment,
        ooc_copies: data.ooc_copies === undefined ? [] : data.ooc_copies,
        gate_pass_copies:
          data.gate_pass_copies === undefined ? [] : data.gate_pass_copies,
        do_revalidation:
          data.do_revalidation === undefined ? false : data.do_revalidation,
        do_revalidation_date:
          data.do_revalidation_date === undefined
            ? ""
            : data.do_revalidation_date,
        out_of_charge:
          data.out_of_charge === undefined ? "" : data.out_of_charge,
        checked:
          data.containers_arrived_on_same_date === undefined
            ? false
            : data.containers_arrived_on_same_date,
      });
    }
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    function addDaysToDate(dateString, days) {
      var date = new Date(dateString);
      date.setDate(date.getDate() + days);
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, "0");
      var day = String(date.getDate()).padStart(2, "0");
      return year + "-" + month + "-" + day;
    }

    if (formik.values.container_nos !== "" && data !== null) {
      let updatedDate = [];

      // If all containers do not arrive at the same time, use the arrival date of individual container
      if (!checked) {
        updatedDate = formik.values.container_nos?.map((container) =>
          addDaysToDate(
            container.arrival_date,
            parseInt(formik.values.free_time)
          )
        );
      } else {
        // If all containers arrive at the same time, use the common arrival date
        updatedDate = formik.values.container_nos?.map((container) =>
          addDaysToDate(
            formik.values.arrival_date,
            parseInt(formik.values.free_time)
          )
        );
      }

      setDetentionFrom(updatedDate);

      // Find the earliest date from updatedDate
      const earliestDate = updatedDate.reduce((earliest, current) => {
        return current < earliest ? current : earliest;
      }, "9999-12-31"); // A far future date as the initial value
      console.log(earliestDate);

      // Set do_validity_upto_job_level to the earliest date
      formik.setFieldValue(
        "do_validity_upto_job_level",
        earliestDate === "9999-12-31" ? "" : earliestDate
      );
    }
    // eslint-disable-next-line
  }, [
    formik.values.arrival_date,
    formik.values.free_time,
    formik.values.container_nos,
    data,
    checked,
  ]);

  return {
    data,
    detentionFrom,
    formik,
    documents,
  };
}

export default useFetchJobDetails;
