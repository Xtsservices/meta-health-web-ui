import React, { useState } from "react";
import styles from "./RegistrationTabs.module.scss";
import OPDRegistration from "./OPD_Registration";
import IPDRegistration from "./IPD_Registration";

const RegistrationTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("General_Registration");

  const renderContent = () => {
    switch (activeTab) {
      case "General_Registration":
        return <div>GENERAL REGISTRATION</div>;
      case "OPD_Registration":
        return <OPDRegistration />;
      case "IPD_Registration":
        return <IPDRegistration />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        <button
          className={activeTab === "General_Registration" ? styles.active : ""}
          onClick={() => setActiveTab("General_Registration")}
        >
          General Registration
        </button>
        <button
          className={activeTab === "OPD_Registration" ? styles.active : ""}
          onClick={() => setActiveTab("OPD_Registration")}
        >
          OPD Registration
        </button>
        <button
          className={activeTab === "IPD_Registration" ? styles.active : ""}
          onClick={() => setActiveTab("IPD_Registration")}
        >
          IPD Registration
        </button>
      </div>
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  );
};

export default RegistrationTabs;
