import React, { useState } from "react";
import styles from "../NurseAlerts/AlertsTabs.module.scss";
// import WardNurseAssignment from "./WardNurseAssignment";
import MySchedule from "./MySchedule";
import LeaveManagment from "./LeaveManagment";
import Nursemanagment from "./Nursemanagment";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";

const ManagmentTabs: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState(user?.role === 2002?"Nursemanagment":"MySchedule");

  const renderContent = () => {
    switch (activeTab) {
      case "Nursemanagment":
        return <Nursemanagment />;
      // case "WardNurseAssignment":
      //   return <WardNurseAssignment />;
      case "MySchedule":
        return <MySchedule />;
      case "LeaveManagment":
        return <LeaveManagment />;
      default:
        return null;
    }
  };
  

  return (
    <div style={{ marginTop: "2rem" }} className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        {user?.role === 2002 && (
          <>
            <button
              className={activeTab === "Nursemanagment" ? styles.active : ""}
              onClick={() => setActiveTab("Nursemanagment")}
            >
              Nurse Management
            </button>
            {/* <button
              className={
                activeTab === "WardNurseAssignment" ? styles.active : ""
              }
              onClick={() => setActiveTab("WardNurseAssignment")}
            >
              Ward Nurse Assignment
            </button> */}

            <button
              className={activeTab === "LeaveManagment" ? styles.active : ""}
              onClick={() => setActiveTab("LeaveManagment")}
            >
              Leave Management
            </button>
          </>
        )}

        <button
          className={activeTab === "MySchedule" ? styles.active : ""}
          onClick={() => setActiveTab("MySchedule")}
        >
          My Schedule
        </button>
      </div>
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  );
};

export default ManagmentTabs;
