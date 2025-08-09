import React, { useState } from "react";
import styles from "./AlertsTabs.module.scss";
import Alerts from "./Alerts";
import Approved from "./Approved";
import Rejected from "./Rejected";

const AlertsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Alerts");

  const renderContent = () => {
    switch (activeTab) {
      case "Alerts":
        return <Alerts />;
      case "Approved":
        return <Approved />;
      case "Rejected":
        return <Rejected />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        <button
          className={activeTab === "Alerts" ? styles.active : ""}
          onClick={() => setActiveTab("Alerts")}
        >
          Alerts
        </button>
        {/* <button
          className={activeTab === "Approved" ? styles.active : ""}
          onClick={() => setActiveTab("Approved")}
        >
          Approved
        </button> */}
        <button  className={activeTab === "Approved" ? styles.active : ""}
          onClick={() => setActiveTab("Approved")}>
          Approved
        </button>
        <button
          className={activeTab === "Rejected" ? styles.active : ""}
          onClick={() => setActiveTab("Rejected")}
        >
          Rejected
        </button>
      </div>
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  );
};

export default AlertsTabs;
