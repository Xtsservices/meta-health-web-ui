import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.scss";
import nurse_styles from "./../../component/sidebar/admin_styles.module.scss";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MyTasks from "./MyTasks";
import NurseCommonHeader from "./NurseCommonHeader";
import activePatients from "../../assets/nurse/noun-patient-6621462 1.png";
import medicineAlerts from "../../assets/nurse/noun-medicine-7417579 1.png";
import dischargedPatients from "../../assets/nurse/noun-patient-4669192 1.png";
import followup from "../../assets/nurse/noun-follow-up-6368005 1.png";
import report from "../../assets/nurse/carbon_report.png";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { BiSun } from "react-icons/bi";
import { MdNightlightRound } from "react-icons/md";
import admin_styles from "./../../component/sidebar/admin_styles.module.scss";
import { authFetch } from "../../axios/useAuthFetch";
import { setError, setLoading } from "../../store/error/error.action";
import { capitalizeFirstLetter } from "../../utility/global";

type DashboardCount = {
  activePatients:number;
  dischargedPatients:number;
  followUpPatients:number;
  medicineAlerts:number;
}

function NurseDashboard() {
  const [, setCurrentTime] = React.useState<string>("");
  const user = useSelector(selectCurrentUser);
  const [attendanceLogs, setAttendanceLogs] = useState<any>(null);
  const [dashboardCounts, setDashboardCounts] = useState<DashboardCount>({
    activePatients: 0,
    dischargedPatients: 0,
    followUpPatients: 0,
    medicineAlerts: 0,
  });

  const getCurrentTime = (): string => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const currentTime = new Date().toLocaleTimeString(
      "en-US",
      options as Intl.DateTimeFormatOptions
    );
    return currentTime;
  };

    const today = new Date();
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dayName = days[today.getDay()];

    const date = today.getDate();
    const month = today.toLocaleString("default", { month: "short" }); 
  
    // Get year
    const year = today.getFullYear();
    const [time24hr, setTime24hr] = useState("");
    const [isDaytime, setIsDaytime] = useState(true);

      useEffect(() => {
        const updateTime = () => {
          const now = new Date();
          const hours = now.getHours(); // Keep as a number
          const minutes = now.getMinutes().toString().padStart(2, "0");
          setTime24hr(`${hours.toString().padStart(2, "0")}:${minutes}`);
    
          // Check if it's daytime (6 AM to 6 PM)
          setIsDaytime(hours >= 6 && hours < 18);
        };
        // Initial call to set time and icon
        updateTime();
    
        // Update time every minute
        const interval = setInterval(updateTime, 60000);
    
        return () => clearInterval(interval); // Cleanup interval on component unmount
      }, []);

  React.useEffect(() => {
    setCurrentTime(getCurrentTime());
    setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000 * 60);
  }, []);

  useEffect(() => {
    if (!user?.hospitalID) return;
  
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
  
        // Fetch dashboard counts
        const dashboardResponse = await authFetch(
          `nurse/getnursedashboardcounts/${user.hospitalID}/${user?.role}`,
          user.token
        );
  
        // Fetch attendance logs
        const attendanceResponse = await authFetch(
          `nurse/getattendancelogs/${user.hospitalID}/${user?.departmentID}`,
          user.token
        );
  
        console.log("Dashboard Data:", dashboardResponse.data);
        console.log("Attendance Logs:", attendanceResponse.data);
  
        setDashboardCounts(dashboardResponse.data);
        setAttendanceLogs(attendanceResponse.data); 
      } catch (err) {
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [user?.hospitalID]);
  

  // const getTodayDate = () => {
  //   const today = new Date();
  //   const options: Intl.DateTimeFormatOptions = {
  //     month: "short",
  //     day: "numeric",
  //     year: "numeric",
  //   };
  //   return today.toLocaleDateString("en-US", options);
  // };

  return (
    <>
      <NurseCommonHeader />

      <div className={nurse_styles.main_info_right}>
        <div className={styles.container}>
          {/* ===========name calender============= */}
          <div className={nurse_styles.adminwelcomecontainer}>
            <h1 style={{ paddingLeft: "0px" }}>
              Good Morning, {user?.firstName && capitalizeFirstLetter(user?.firstName)}
            </h1>
            {/* Calendar Section */}
            {/* <div className={styles.calendarSection}>
              <CalendarTodayIcon className={styles.calendarIcon} />
              <span className={styles.date}>{getTodayDate()}</span>
            </div> */}
            <div className={admin_styles.adminsidetimecontainer}>
          <div className={admin_styles.admintimecontainer}>
            <h1 className={admin_styles.time}>{time24hr}</h1>
            {isDaytime ? (
              <BiSun
                style={{
                  color: "white",
                  fontSize: "20px",
                  marginTop: "8px",
                  marginLeft: "2px"
                }}
              />
            ) : (
              <MdNightlightRound
                style={{
                  color: "white",
                  fontSize: "20px",
                  marginTop: "8px",
                  marginLeft: "2px"
                }}
              />
            )}
          </div>
          <ul className={admin_styles.ul}>
            <li>{dayName}</li>
            <li>{`${date} ${month}`}</li>
            <li>{year}</li>
          </ul>
        </div>
          </div>
          {/* =========cards container========== */}
          <div className={styles.container_cards}>
            <div
              style={{
                backgroundImage: "linear-gradient(to right, #EF7487, #FF827E)",
              }}
              className={`${styles.container_cards_item}`}
            >
              <ul className={styles.ul}>
                <li className={styles.listitemcount}>{dashboardCounts?.activePatients}</li>
                <li>
                  <img
                    className={styles.listimg}
                    src={activePatients}
                    alt="Appointment"
                  />
                </li>
              </ul>

              <p className={styles.listitemdoc}>Total Active Patients</p>
            </div>

            <div
              style={{
                backgroundImage: "linear-gradient(to right, #C5845F, #FBB892)",
              }}
              className={`${styles.container_cards_item}`}
            >
              <ul className={styles.ul}>
                <li className={styles.listitemcount}>{dashboardCounts?.medicineAlerts}</li>
                <li>
                  <img
                    className={styles.listimg}
                    src={medicineAlerts}
                    alt="medicineAlerts"
                  />
                </li>
              </ul>

              <p className={styles.listitemdoc}>Medicine Alerts</p>
            </div>

            <div
              style={{
                backgroundImage: "linear-gradient(to right, #8E78F0, #BCADFF)",
              }}
              className={`${styles.container_cards_item}`}
            >
              <ul className={styles.ul}>
                <li className={styles.listitemcount}>{dashboardCounts?.dischargedPatients}</li>
                <li>
                  <img
                    className={styles.listimg}
                    src={dischargedPatients}
                    alt="dischargedPatients"
                  />
                </li>
              </ul>

              <p className={styles.listitemdoc}>Discharged Patients</p>
            </div>

            <div
              style={{
                backgroundImage: "linear-gradient(to right, #51AECA, #98E6FD)",
              }}
              className={`${styles.container_cards_item}`}
            >
              <ul className={styles.ul}>
                <li className={styles.listitemcount}>{dashboardCounts?.followUpPatients}</li>
                <li>
                  <img
                    className={styles.listimg}
                    src={followup}
                    alt="followup"
                  />
                </li>
              </ul>

              <p className={styles.listitemdoc}>Follow up List</p>
            </div>
          </div>
          {/* =======Logs Container====== */}
          {user?.role === 2002 && (
            <div
              style={{ marginTop: "5rem" }}
              className={styles.container_cards}
            >
              <div
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #808BE5, #6A9CE4)",
                }}
                className={`${styles.container_cards_item}`}
              >
                <p className={styles.listitemdocLog}>Present Log</p>

                <ul className={styles.ul}>
                  <li className={styles.listitemcount}>
                    {attendanceLogs?.presentLogs}
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
                    <img className={styles.listimg} src={report} alt="report" />
                  </li>
                </ul>
              </div>

              <div
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #FAAD86, #FBB892)",
                }}
                className={`${styles.container_cards_item}`}
              >
                <p className={styles.listitemdocLog}>Absence Log</p>

                <ul className={styles.ul}>
                  <li className={styles.listitemcount}>
                  {attendanceLogs?.leaveLogs}
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
                    <img className={styles.listimg} src={report} alt="report" />
                  </li>
                </ul>
              </div>
            </div>
          )}

          <MyTasks />
        </div>
      </div>
    </>
  );
}

export default NurseDashboard;
