import { useEffect, useState } from "react";
import styles from "../../hospital_pharmacy/PharamacyAlerts/Alerts.module.scss";
import PatientOuterTable from "../../hospital_pharmacy/OrderManagement/OuterTable";
import { authFetch } from "../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { LabTestOrder } from "../../../utility/medicine";
import { Tabs, Tab, Box } from "@mui/material";

const LabsAlerts = () => {
  const user = useSelector(selectCurrentUser);
  const [opdOrders, setOpdOrders] = useState<LabTestOrder[]>([]);
  const [ipdEmergencyOrders, setIpdEmergencyOrders] = useState<LabTestOrder[]>(
    []
  );
  const [rejectedOrders, setRejectedOrders] = useState<LabTestOrder[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
  
      const getAlerts = async () => {
        const alertsData = await authFetch(
          `/test/${user.roleName}/${user.hospitalID}/getAlerts`,
          user.token
        );
    
      if (alertsData.message === "success") {
        const opdData = alertsData.alerts.filter(
          (order: LabTestOrder) => order.ptype !== 2 && order.ptype !== 3
        );
        const ipdEmergencyData = alertsData.alerts.filter(
          (order: LabTestOrder) =>
            order.ptype === 2 || order.ptype === 3
        );
        setOpdOrders(opdData);
        setIpdEmergencyOrders(ipdEmergencyData);
      }
    };

    if (user.hospitalID && user.token) {
      getAlerts();
    }
  }, [user.hospitalID, user.token]);


  useEffect(() => {
    const getRejectedOrders = async () => {
      try {
        const response = await authFetch(
          `/test/${user.roleName}/${user.hospitalID}/${"rejected"}/getBillingData`,
          user.token
        );

        if (response.message === "success") {
          setRejectedOrders(response.billingData);
        }
      } catch (error) {
        console.error("Error fetching rejected lab tests:", error);
      }
    };

    if (user.hospitalID && user.token && tabIndex === 1) {
      getRejectedOrders();
    }
  }, [user.hospitalID, user.token,tabIndex]);

  console.log(rejectedOrders);

  return (
    <div className={styles.container}>
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} sx={{ marginBottom: 2, borderBottom: "2px solid #cccccc","& .MuiTabs-indicator": { backgroundColor: "orange" },
              "& .MuiTab-root.Mui-selected": { fontWeight: "bold", color: "black" },"& .MuiTab-root": { textTransform: "none",fontSize:"16px" }, }}>
        <Tab label="Test Alerts" />
        <Tab label="Rejected Alerts" />
      </Tabs>

      {tabIndex === 0 && (
        <Box>
          <PatientOuterTable
            title="Alerts From OPD"
            data={opdOrders}
            isButton={true}
            alertFrom="Pharmacy"
          />
          <PatientOuterTable
            title="Alerts From IPD and Emergency"
            data={ipdEmergencyOrders}
            isButton={true}
            alertFrom="Pharmacy"
          />
        </Box>
      )}
      {tabIndex === 1 && (
        <Box>
          <PatientOuterTable
            title="Rejected Alerts"
            data={rejectedOrders}
            isButton={false}
            alertFrom="Pharmacy"
          />
        </Box>
      )}
    </div>
  );
};

export default LabsAlerts;
