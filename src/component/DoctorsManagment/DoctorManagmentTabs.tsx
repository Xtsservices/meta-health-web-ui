import React, { useState } from "react";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import DoctorManagment from "./DoctorManagment/DoctorManagment";
import DoctorAssignment from "./DoctorAssignment/DoctorAssignment";
import LeaveManagment from "./LeaveManagment/LeaveManagment";
import MySchedule from "./MySchedule/MySchedule";
import styles from "../../pages/nurseDashboard/NurseAlerts/AlertsTabs.module.scss";
import logsStyles from "../../pages/nurseDashboard/dashboard.module.scss";
import MyTasks from "../../pages/nurseDashboard/MyTasks";
import report from "../../assets/nurse/carbon_report.png";

const DoctorManagmentTabs: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState(
    user?.role === 4000 ? "DoctorManagment" : "MySchedule"
  );

  const renderContent = () => {
    switch (activeTab) {
      case "DoctorManagment":
        return <DoctorManagment />;
      case "DoctorAssignment":
        return <DoctorAssignment />;
      case "LeaveManagment":
        return <LeaveManagment />;
      case "MySchedule":
        return <MySchedule />;
      case "MyNotes":
        return <MyTasks />;

      default:
        return null;
    }
  };

  return (
    <div style={{ marginTop: "2rem" }} className={styles.tabsContainer}>
       {user?.role === 4000 && (
            <div
              style={{ marginBottom: "5rem" }}
              className={logsStyles.container_cards}
            >
              <div
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #808BE5, #6A9CE4)",
                }}
                className={`${logsStyles.container_cards_item}`}
              >
                <p className={logsStyles.listitemdocLog}>Present Log</p>

                <ul className={logsStyles.ul}>
                  <li className={logsStyles.listitemcount}>
                    25
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "200",
                        paddingLeft: "3rem",
                      }}
                    >
                      Present
                    </span>
                  </li>
                  <li>
                    <img className={logsStyles.listimg} src={report} alt="report" />
                  </li>
                </ul>
              </div>

              <div
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #FAAD86, #FBB892)",
                }}
                className={`${logsStyles.container_cards_item}`}
              >
                <p className={logsStyles.listitemdocLog}>Absence Log</p>

                <ul className={logsStyles.ul}>
                  <li className={logsStyles.listitemcount}>
                    02
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "200",
                        paddingLeft: "3rem",
                      }}
                    >
                      Absent
                    </span>
                  </li>
                  <li>
                    <img className={logsStyles.listimg} src={report} alt="report" />
                  </li>
                </ul>
              </div>
            </div>
          )}

      <div className={styles.tabHeaders}>
        {user?.role === 4000 && (
          <>
            <button
              className={activeTab === "DoctorManagment" ? styles.active : ""}
              onClick={() => setActiveTab("DoctorManagment")}
            >
              Doctor Managment
            </button>
            <button
              className={activeTab === "DoctorAssignment" ? styles.active : ""}
              onClick={() => setActiveTab("DoctorAssignment")}
            >
              Doctor Assignment
            </button>

            <button
              className={activeTab === "LeaveManagment" ? styles.active : ""}
              onClick={() => setActiveTab("LeaveManagment")}
            >
              Leave Managment
            </button>
          </>
        )}

        <button
          className={activeTab === "MySchedule" ? styles.active : ""}
          onClick={() => setActiveTab("MySchedule")}
        >
          My Schedule
        </button>
        <button
          className={activeTab === "MyNotes" ? styles.active : ""}
          onClick={() => setActiveTab("MyNotes")}
        >
          My Notes
        </button>
      </div>
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  );
};

export default DoctorManagmentTabs;
