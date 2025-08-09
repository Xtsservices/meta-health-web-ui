import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./OrdersTabs.module.scss";
import EmergencyOrderManagement from "./emergency/EmergencyOrderManagement";
import RejectedOrderManagement from "./rejected/RejectedOrderManagement";
import OpdOrderManagement from "./opd/OpdOrderManagement";
import IpdOrderManagement from "./ipd/IpdOrderManagement";

const OrdersTabs: React.FC = () => {
  const location = useLocation();
  const isRestricted = location.pathname.includes("radiology") || location.pathname.includes("pathology");

  const [activeTab, setActiveTab] = useState(isRestricted ? "IPD" : "IPD");

  const renderContent = () => {
    switch (activeTab) {
      case "Walk-In":
        return <EmergencyOrderManagement />;
      case "OPD":
        return <OpdOrderManagement />;
      case "IPD":
        return <IpdOrderManagement />;
      case "Rejected":
        return <RejectedOrderManagement />;
      default:
        return null;
    }
  };

  const availableTabs = isRestricted
    ? ["IPD", "OPD"]
    : ["IPD", "OPD", "Walk-In", "Rejected"];

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        {availableTabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? styles.active : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  );
};

export default OrdersTabs;
