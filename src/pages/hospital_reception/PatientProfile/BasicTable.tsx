import React from "react";
import { useLocation } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SymptompsTab from "./Tabs/SymptompsTab/SymptompsTab";
import VitalsTab from "./Tabs/VitalsTab/VitalsTab";
import MedicalHistory from "./Tabs/MedicalHistory/MedicalHistory";
import Reports from "./Tabs/Reports/Report";
import PreviousHistory from "./Tabs/PreviousHistory/PreviousHistory";
import DoctorTab from "./Tabs/DoctorTab/DoctorTab";
import PrescriptionTab from "./Tabs/PrescriptionTab/PrescriptionTab";

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
  }, [location.pathname]);

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
            label="Prescription"
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
            label="Previous History"
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
        </Tabs>
      </Box>
      <div
        style={{ maxHeight: "80rem", minHeight: "40rem", overflowY: "scroll" }}
      >
        <TabPanel value={value} index={0}>
          <SymptompsTab />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <VitalsTab />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <PrescriptionTab />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <MedicalHistory />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Reports />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <PreviousHistory />
        </TabPanel>

        {/* <TabPanel value={value} index={6}>
          </TabPanel> */}
        <TabPanel value={value} index={7}>
          <DoctorTab />
        </TabPanel>
      </div>
    </Box>
  );
}
