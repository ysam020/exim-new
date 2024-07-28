import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CustomerKycForm from "./CustomerKycForm";
import ViewCustomerKyc from "./ViewCustomerKycList";
import useTabs from "../../customHooks/useTabs";
import ViewDrafts from "./ViewDrafts";

function CustomerKyc() {
  const [value, setValue] = React.useState(0);
  const { a11yProps, CustomTabPanel } = useTabs();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Customer KYC" {...a11yProps(0)} key={0} />,
            <Tab label="View Drafts" {...a11yProps(0)} key={1} />,
            <Tab label="View Customer KYC" {...a11yProps(1)} key={2} />,
          </Tabs>
        </Box>

        <Box>
          <CustomTabPanel value={value} index={0}>
            <CustomerKycForm />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <ViewDrafts />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <ViewCustomerKyc />
          </CustomTabPanel>
        </Box>
      </Box>
    </Box>
  );
}

export default React.memo(CustomerKyc);
