import React, { useEffect, useState } from "react";
import styles from "./AlertsTabs.module.scss";
import MedicationAlerts from "./MedicationAlerts";
import Alert from "../../hospital_staff/Alert/AlertTable";
import { useLocation, useSearchParams } from "react-router-dom";

const AlertsTabs: React.FC = () => {
  const location = useLocation();
  const isCustomerCare = location.pathname.includes("customerCare");
  const [searchParams] = useSearchParams();
  const initialActiveTab = isCustomerCare
    ? searchParams.get("activeTab") === "Hospital"
      ? "Hospital"
      : "Individual" 
    : "PatientsAlerts";

  const [activeTab, setActiveTab] = useState(initialActiveTab);

  useEffect(() => {
    if (isCustomerCare) {
      const tabFromParams = searchParams.get("activeTab");
      if (tabFromParams === "Individual" || tabFromParams === "Hospital") {
        setActiveTab(tabFromParams);
      }
    }
  }, [searchParams, isCustomerCare]);

  const renderContent = () => {
    if (isCustomerCare) {
      switch (activeTab) {
        case "Individual":
          return <Alert name='Individual'/>;
        case "Hospital":
          return <Alert name='Hospital'/>;
        default:
          return null;
      }
    } else {
      switch (activeTab) {
        case "PatientsAlerts":
          return <Alert />;
        case "MedicationMissedAlerts":
          return <MedicationAlerts name="MedicationMissedAlerts" />;
        case "MedicationAlerts":
          return <MedicationAlerts name="MedicationAlerts" />;
        default:
          return null;
      }
    }
  };

  return (
    <div style={{ marginTop: "2rem" }} className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        {isCustomerCare ? (
          <>
            <button
              className={activeTab === "Individual" ? styles.active : ""}
              onClick={() => setActiveTab("Individual")}
            >
              Individual
            </button>
            <button
              className={activeTab === "Hospital" ? styles.active : ""}
              onClick={() => setActiveTab("Hospital")}
            >
              Hospital
            </button>
          </>
        ) : (
          <>
            <button
              className={activeTab === "PatientsAlerts" ? styles.active : ""}
              onClick={() => setActiveTab("PatientsAlerts")}
            >
              Patients Alerts
            </button>
            <button
              className={
                activeTab === "MedicationMissedAlerts" ? styles.active : ""
              }
              onClick={() => setActiveTab("MedicationMissedAlerts")}
            >
              Medication Missed Alerts
            </button>
            <button
              className={activeTab === "MedicationAlerts" ? styles.active : ""}
              onClick={() => setActiveTab("MedicationAlerts")}
            >
              Medication Alerts
            </button>
          </>
        )}
      </div>
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  );
};

export default AlertsTabs;