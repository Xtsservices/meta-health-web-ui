import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Hubs from "./Hubs";
import Devices from "./Devices";
import PurchaseList from "./PurchaseList";
import { AdminList } from "./AdminList";

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

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
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
            label="Admin List"
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
            label="No of Hubs"
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
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="No of devices"
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
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="purchase list"
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
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <br />
        <AdminList />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <br />
        <Hubs />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <br />
        <Devices />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <br />
        <PurchaseList />
      </TabPanel>
    </Box>
  );
}
