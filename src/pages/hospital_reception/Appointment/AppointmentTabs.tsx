import React, { useState } from "react";
import styles from "../alerts/AlertsTabs.module.scss";
import BookAppointment from "./BookAppointment";
import ScheduledAppointments from "./ScheduledAppointments";


const AppointmentTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("BookAppointment");

  const callBackActiveTabFunction = (value:string)=>{
    setActiveTab(value)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "BookAppointment":
        return <BookAppointment />;
      case "ScheduledAppointment":
        return <ScheduledAppointments callBackActiveTabFunction={callBackActiveTabFunction}/>;
      
      default:
        return null;
    }
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        <button
          className={activeTab === "BookAppointment" ? styles.active : ""}
          onClick={() => setActiveTab("BookAppointment")}
        >
        Appointment
        </button>
        <button
          className={activeTab === "ScheduledAppointment" ? styles.active : ""}
          onClick={() => setActiveTab("ScheduledAppointment")}
        >
          Scheduled Appointment
        </button>
       
      </div>
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  );
};



export default AppointmentTabs
