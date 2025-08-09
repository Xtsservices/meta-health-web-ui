import React, { useEffect, useCallback } from "react";
import { AlertType } from "../../../types";
import { authFetch } from "../../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import styles from "./Alert.module.scss";
import { setLoading } from "../../../store/error/error.action";
import { authPatch } from "../../../axios/usePatch";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import WatchedAlerts from "./WatchedAlerts";
import AllAlerts from "./AllAlerts";
import { useAlertStore } from "../../../store/zustandstore";
import { useLocation } from "react-router-dom";
import { city, state } from "../../../utility/state";

// const alarmSound = new Audio('../../../../src/assets/notification.wav');
// const handleChangeStatus = async (id: number, _token: string) => {
//   // await authPatch(`alerts/${id}`, {}, token);
// };
// const columns: GridColDef[] = [
//   { field: "index", headerName: "S.No", flex: 1 },
//   { field: "patientName", headerName: "Patient Name", flex: 1 },
//   { field: "doctorName", headerName: "Doctor", flex: 1 },
//   {
//     field: "alertMessage",
//     headerName: "Message",
//     type: "string",
//     flex: 1,
//   },
//   {
//     field: "alertValue",
//     headerName: "Temperature (°C)",
//     description: "Temperature of the patient",
//     sortable: false,
//     flex: 1,
//   },
//   {
//     field: "addedOn",
//     headerName: "Date",
//     type: "Date",
//     flex: 2,
//   },
//   {
//     field: "button",
//     headerName: "Actions",
//     sortable: false,
//     flex: 1,
//     renderCell: (params: GridRenderCellParams) => {
//       return (
//         <Link to={`/hospital-dashboard/inpatient/list/${params.row.patientID}`}>
//           <button
//             className={styles.button}
//             onClick={() => handleChangeStatus(params.row.id, params.row.token)}
//           >
//             View Detail
//           </button>
//         </Link>
//       );
//     },
//   },
//   {
//     field: "seen",
//     headerName: "",
//     type: "number",
//     flex: 1,
//     align: "left",
//     renderCell: (params: GridRenderCellParams) => {
//       return (
//         <>
//           {!params.row.seen ? <div className={styles.circle_green}></div> : ""}
//         </>
//       );
//     },
//   },
// ];

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

interface Alerts {
  name?: "Individual" | "Hospital";
}

export default function Alert({ name }: Alerts) {
  const location = useLocation();
  const isCustomerCare = location.pathname.includes("customerCare");
  const isNursePath = location.pathname.includes("nurse");
  const [, setRows] = React.useState<AlertType[]>([]);
  const [highPriority, setHighPriority] = React.useState<AlertType[]>([]);
  const [mediumPriority, setMediumPriority] = React.useState<AlertType[]>([]);
  const [lowPriority, setLowPriority] = React.useState<AlertType[]>([]);
  const [watchedhighPriority, setWatchedhighPriority] = React.useState<AlertType[]>([]);
  const [watchedMediumPriority, setWatchedMediumPriority] = React.useState<AlertType[]>([]);
  const [watchedLowPriority, setWatchedLowPriority] = React.useState<AlertType[]>([]);

  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { setAlertNumber } = useAlertStore();
  const [value, setValue] = React.useState(0);
  const [allcount, setAllCount] = React.useState(0);
  const [, setWatchedCount] = React.useState(0);
  const [selectedHospital, setSelectedHospital] = React.useState<string>("All");
  const [selectedState, setSelectedState] = React.useState<string>("All");
  const [selectedCity, setSelectedCity] = React.useState<string>("All");


  const hospitalList = [
    "All",
    "City General Hospital",
    "Sunrise Medical Center",
    "Hope Wellness Clinic",
  ];

  const getAlertData = useCallback(async () => {
    dispatch(setLoading(true));
    let apiUrl = `alerts/hospital/${user.hospitalID}`;

    if(isNursePath){
      apiUrl = `nurse/alerts/${user.hospitalID}/${user.role}`;
    }

    if (isCustomerCare) {
      if (name === "Individual") {
        apiUrl = `alerts/individualAlerts`;
      } else if (name === "Hospital") {
        apiUrl = `alerts/getAllVitalAlertsByhospitals`;
      }
    }

    const response = await authFetch(apiUrl, user.token);
    let alertsData = response;
  
    // Handle nested response structure for nurse path
    if (isNursePath && response.message === "success" && response.data) {
      alertsData = response.data; // Extract the nested data
    }

    if (alertsData.message === "success") {
      const processAlerts = (alerts: AlertType[]) =>
        alerts.map((el: AlertType, index: number) => ({
          ...el,
          index: index + 1,
          addedOn: new Intl.DateTimeFormat("en-GB", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(el.addedOn)),
          token: user.token,
          doctorName: el.doctorName
            ? el.doctorName[0]?.toUpperCase() + el.doctorName.slice(1)
            : "N/A",
        })) || [];
  
      const processedAlerts = processAlerts(alertsData?.alerts || []);

      const watchedhighPriorityData = processedAlerts?.filter((each:any)=> each.priority === "High" && each.seen ===1) || []
      const watchedMediumPriorityData = processedAlerts?.filter((each:any)=> each.priority === "Medium" && each.seen ===1) || []
      const watchedLowPriorityData = processedAlerts?.filter((each:any)=> each.priority === "Low" && each.seen ===1) || []

      setWatchedhighPriority(watchedhighPriorityData)
      setWatchedMediumPriority(watchedMediumPriorityData)
      setWatchedLowPriority(watchedLowPriorityData)


      // Validate selectedHospital
      if (name === "Hospital" && selectedHospital !== "All" && !hospitalList.includes(selectedHospital)) {
        setSelectedHospital("All");
      }

      // Validate selectedState and selectedCity
      if (name === "Individual") {
        if (selectedState !== "All" && !state.includes(selectedState)) {
          setSelectedState("All");
          setSelectedCity("All");
        } else if (
          selectedCity !== "All" &&
          selectedState !== "All" &&
          !city[state.indexOf(selectedState)]?.includes(selectedCity)
        ) {
          setSelectedCity("All");
        }
      }

      // Filter alerts
      const filteredAlerts = processedAlerts.filter((alert: AlertType) => {
        // if (name === "Hospital" && selectedHospital !== "All") {
        //   return (
        //     alert.hospitalName === selectedHospital ||
        //     (alert.hospitalName === undefined && selectedHospital === "Unknown")
        //   );
        // }
        if (name === "Individual") {
          const stateMatch = selectedState === "All" || alert.state === selectedState;
          const cityMatch =
            selectedCity === "All" ||
            (selectedState !== "All" && alert.city === selectedCity);
          return stateMatch && cityMatch;
        }
        return true;
      });

      setRows(filteredAlerts);

      // Apply same filtering to priority data
      const filterPriorityData = (data: AlertType[]) =>
        processAlerts(
          data.filter((alert: AlertType) => {
            // if (name === "Hospital" && selectedHospital !== "All") {
            //   return (
            //     alert.hospitalName === selectedHospital ||
            //     (alert.hospitalName === undefined && selectedHospital === "Unknown")
            //   );
            // }
            if (name === "Individual") {
              const stateMatch = selectedState === "All" || alert.state === selectedState;
              const cityMatch =
                selectedCity === "All" ||
                (selectedState !== "All" && alert.city === selectedCity);
              return stateMatch && cityMatch;
            }
            return true;
          })
        );

        const highPriorityData = isNursePath ? alertsData.HighPriorityData : response?.HighPriorityData;
        const mediumPriorityData = isNursePath ? alertsData.MediumPriorityData : response?.MediumPriorityData;
        const lowPriorityData = isNursePath ? alertsData.LowPriorityData : response?.LowPriorityData;

        setHighPriority(filterPriorityData(highPriorityData || []));
        setMediumPriority(filterPriorityData(mediumPriorityData || []));
        setLowPriority(filterPriorityData(lowPriorityData || []));

      interface PriorityData {
        seen: number;
      }

      const highPriorityCount =
        (response?.HighPriorityData || []).filter(
          (each: PriorityData | null) => each !== null && each.seen === 0
        ).length || 0;
      const mediumPriorityCount =
        (response?.MediumPriorityData || []).filter(
          (each: PriorityData | null) => each !== null && each.seen === 0
        ).length || 0;
      const lowPriorityCount =
        (response?.LowPriorityData || []).filter(
          (each: PriorityData | null) => each !== null && each.seen === 0
        ).length || 0;
      setAllCount(highPriorityCount + mediumPriorityCount + lowPriorityCount);

      const highPriorityCount1 =
        (response?.HighPriorityData || []).filter(
          (each: PriorityData | null) => each !== null && each.seen === 1
        ).length || 0;
      const mediumPriorityCount1 =
        (response?.MediumPriorityData || []).filter(
          (each: PriorityData | null) => each !== null && each.seen === 1
        ).length || 0;
      const lowPriorityCount1 =
        (response?.LowPriorityData || []).filter(
          (each: PriorityData | null) => each !== null && each.seen === 1
        ).length || 0;
      setWatchedCount(highPriorityCount1 + mediumPriorityCount1 + lowPriorityCount1);

      const totalAlertsCount = highPriorityCount + mediumPriorityCount + lowPriorityCount;
      setAlertNumber(totalAlertsCount);
    }

    dispatch(setLoading(false));
  }, [
    user.token,
    user.hospitalID,
    name,
    isCustomerCare,
    selectedHospital,
    selectedState,
    selectedCity,
    dispatch,
  ]);

  useEffect(() => {
    getAlertData();
  }, [getAlertData]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  const handleIsSeen = async (id: number) => {
    let endpoint;
    if (name === "Individual") {
      endpoint = `alerts/updateIndividualSeenAlerts/${id}`;
    } else {
      endpoint = `alerts/hospital/${id}`;
    }

    const response = await authPatch(endpoint, {}, user.token);
    if (response.message === "success") {
      getAlertData();
    }
  };

  return (
    <div className={styles.container}>
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
                    position: "relative",
                  }}
                >
                  All
                  {allcount > 0 && (
                    <span
                      style={{
                        marginLeft: "8px",
                        backgroundColor: "rgb(38, 241, 6)",
                        borderRadius: "50%",
                        color: "white",
                        padding: "4px 8px",
                        fontSize: "12px",
                        position: "absolute",
                        top: "3px",
                        right: "8px",
                      }}
                    >
                      {allcount}
                    </span>
                  )}
                </Button>
              )}
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
                    position: "relative",
                  }}
                >
                  Watched
                </Button>
              )}
              label="Watched"
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
          </Tabs>
        </Box>
        <div
          style={{
            maxHeight: "80rem",
            minHeight: "40rem",
            overflowY: "scroll",
          }}
        >
          <TabPanel value={value} index={0}>
            <AllAlerts
              HighPriorityData={highPriority}
              MediumPriorityData={mediumPriority}
              LowPriorityData={lowPriority}
              handleIsSeen={handleIsSeen}
              name={name}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <WatchedAlerts
              HighPriorityData={watchedhighPriority}
              MediumPriorityData={watchedMediumPriority}
              LowPriorityData={watchedLowPriority}
              handleIsSeen={handleIsSeen}
              name={name}
            />
          </TabPanel>
        </div>
      </Box>
    </div>
  );
}