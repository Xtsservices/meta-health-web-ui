import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SymptompsTab from "../../../component/PatientProfile/Tabs/SymptompsTab/SymptompsTab";
import VitalsTab from "../../../component/PatientProfile/Tabs/VitalsTab/VitalsTab";
import TreatmentTab from "../../../component/PatientProfile/Tabs/TreatmentTab/TreatmentTab";
import MedicalHistory from "../../../component/PatientProfile/Tabs/MedicalHistory/MedicalHistory";
import Reports from "../../../component/PatientProfile/Tabs/Reports/Reports";
// import DischargeHistory from "./DischargeHistory/DischargeHistory";
import PreviousHistory from "../../../component/PatientProfile/Tabs/Previous History/PreviousHistory";
import TestTab from "../../../component/PatientProfile/Tabs/TestsTab/TestTab";
import DoctorTab from "../../../component/PatientProfile/Tabs/DoctorTab/DoctorTab";
import { useLocation } from "react-router-dom";
import PreviousPrescriptions from '../../../component/PatientProfile/Tabs/PreviousPrescriptions/PreviousPrescriptions';
import Insurance from "../../../component/PatientProfile/Tabs/Insurance/Insurance";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Typography>{children}</Typography>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const location = useLocation();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event ? "" : "");
    setValue(newValue);
  };
  React.useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("/hospital-dashboard/inpatient/alerts")) {
      setValue(2);
    }
  }, []);

  return (
    <Box>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          overflowX: "auto",
          width: "100%",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            component={(props: any) => (
              <Button
                variant="contained"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="Symptoms"
            {...a11yProps(0)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />
          <Tab
            component={(props: any) => (
              <Button
                variant="contained"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="Tests"
            {...a11yProps(1)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />
          <Tab
            component={(props: any) => (
              <Button
                variant="contained"
                // color="primary"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="Vitals"
            {...a11yProps(2)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />
          <Tab
            component={(props: any) => (
              <Button
                variant="contained"
                // color="primary"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="Treatment Plan"
            {...a11yProps(3)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />
          <Tab
            component={(props: any) => (
              <Button
                variant="contained"
                // color="primary"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="Medical History"
            {...a11yProps(4)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />
          <Tab
            component={(props: any) => (
              <Button
                variant="contained"
                // color="primary"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="Reports"
            {...a11yProps(5)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />
          {/* <Tab
            component={(props: any) => (
              <Button
                variant="contained"
                // color="primary"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="Discharge History"
            {...a11yProps(5)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          /> */}
          <Tab
            component={(props: any) => (
              <Button
                variant="contained"
                // color="primary"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="Patient TimeLine"
            {...a11yProps(6)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />

          <Tab
            component={(props: any) => (
              <Button
                variant="contained"
                // color="primary"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="Treating Doctors"
            {...a11yProps(6)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />
{/* ;PreviousPrescriptions */}
<Tab
            component={(props: any) => (
              <Button
                variant="contained"
                // color="primary"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="Previous Prescriptions"
            {...a11yProps(7)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />
{/* =========insurance======== */}
<Tab
            component={(props: any) => (
              <Button
                variant="contained"
                // color="primary"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="Insurance"
            {...a11yProps(7)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />

        </Tabs>
      </Box>
      <div
        style={{ maxHeight: "80rem", minHeight: "40rem", overflowY: "scroll" }}
      >
        <TabPanel value={value} index={0}>
          <SymptompsTab />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TestTab navigateToReports={() => setValue(5)} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <VitalsTab />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <TreatmentTab />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <MedicalHistory />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Reports />
        </TabPanel>
        {/* <TabPanel value={value} index={5}>
          <DischargeHistory />
        </TabPanel> */}
        <TabPanel value={value} index={6}>
          <PreviousHistory />
        </TabPanel>
        <TabPanel value={value} index={7}>
          <DoctorTab />
        </TabPanel>
        <TabPanel value={value} index={8}>
          <PreviousPrescriptions />
        </TabPanel>
        <TabPanel value={value} index={9}>
          <Insurance />
        </TabPanel>
      </div>
    </Box>
  );
}
