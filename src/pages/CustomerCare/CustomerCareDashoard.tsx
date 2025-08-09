import { useEffect, useState } from "react";
import nurse_styles from "./../../component/sidebar/admin_styles.module.scss";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { capitalizeFirstLetter } from "../../utility/global";
import NurseCommonHeader from "../nurseDashboard/NurseCommonHeader";
import styles from "../nurseDashboard/dashboard.module.scss";
import { setLoading } from "../../store/error/error.action";
import { useDispatch } from "react-redux";
import { FaInfoCircle, FaUser } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { authFetch } from "../../axios/useAuthFetch";
import { AlertStatsChart } from "./AlertStatsChart";
import { PeakHourAlertsChart } from "./PeakHourAlertsChart";
import { AlertsByTimeFrame } from "./AlertByTimeFrame";
import { PriorityCard } from "./PriorityCard";

interface AlertCounts {
  individual: {
    high: number;
    medium: number;
    low: number;
  };
  hospital: {
    high: number;
    medium: number;
    low: number;
  };
}

interface AlertDetails {
  individualAlerts: {
    highPriority: { total: number; viewed: number };
    mediumPriority: { total: number; viewed: number };
    lowPriority: { total: number; viewed: number };
    total: number;
    active: number;
    watched: number;
  };
  hospitalAlerts: {
    highPriority: { total: number; viewed: number };
    mediumPriority: { total: number; viewed: number };
    lowPriority: { total: number; viewed: number };
    total: number;
    active: number;
    watched: number;
  };
}

function CustomerCareDashboard() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [, setAlertCounts] = useState<AlertCounts>({
    individual: { high: 0, medium: 0, low: 0 },
    hospital: { high: 0, medium: 0, low: 0 },
  });
  const [summaryCounts, setSummaryCounts] = useState<{
    individual: { total: number; active: number; watched: number };
    hospital: { total: number; active: number; watched: number };
  }>({
    individual: { total: 0, active: 0, watched: 0 },
    hospital: { total: 0, active: 0, watched: 0 },
  });
  const [alertDetails, setAlertDetails] = useState<AlertDetails>({
    individualAlerts: {
      highPriority: { total: 0, viewed: 0 },
      mediumPriority: { total: 0, viewed: 0 },
      lowPriority: { total: 0, viewed: 0 },
      total: 0,
      active: 0,
      watched: 0,
    },
    hospitalAlerts: {
      highPriority: { total: 0, viewed: 0 },
      mediumPriority: { total: 0, viewed: 0 },
      lowPriority: { total: 0, viewed: 0 },
      total: 0,
      active: 0,
      watched: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) {
        console.warn("No user token available");
        return;
      }

      dispatch(setLoading(true));
      try {
        const response = await authFetch(
          "alerts/getccedashboardalertcount",
          user?.token
        );

        if (response.message === "success") {
          const { individualAlerts, hospitalAlerts } = response;

          setAlertCounts({
            individual: {
              high: individualAlerts.highPriority.total,
              medium: individualAlerts.mediumPriority.total,
              low: individualAlerts.lowPriority.total,
            },
            hospital: {
              high: hospitalAlerts.highPriority.total,
              medium: hospitalAlerts.mediumPriority.total,
              low: hospitalAlerts.lowPriority.total,
            },
          });

          setSummaryCounts({
            individual: {
              total: individualAlerts.total,
              active: individualAlerts.active,
              watched: individualAlerts.watched,
            },
            hospital: {
              total: hospitalAlerts.total,
              active: hospitalAlerts.active,
              watched: hospitalAlerts.watched,
            },
          });

          setAlertDetails({
            individualAlerts,
            hospitalAlerts,
          });
        } else {
          console.error("Dashboard API error:", response.message);
          setAlertCounts({
            individual: { high: 0, medium: 0, low: 0 },
            hospital: { high: 0, medium: 0, low: 0 },
          });
          setSummaryCounts({
            individual: { total: 0, active: 0, watched: 0 },
            hospital: { total: 0, active: 0, watched: 0 },
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setAlertCounts({
          individual: { high: 0, medium: 0, low: 0 },
          hospital: { high: 0, medium: 0, low: 0 },
        });
        setSummaryCounts({
          individual: { total: 0, active: 0, watched: 0 },
          hospital: { total: 0, active: 0, watched: 0 },
        });
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [user?.token, dispatch]);

  return (
    <>
      <NurseCommonHeader />
      <div className={nurse_styles.main_info_right}>
        <div className={styles.container}>
          <div className={nurse_styles.adminwelcomecontainer}>
            <h1 style={{ paddingLeft: "0px" }}>
              Good Morning,{" "}
              {user?.firstName && capitalizeFirstLetter(user.firstName)}
            </h1>
          </div>

          <div className={styles.sectionsContainer}>
            {/* Individual Alerts Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Individual Alerts</h2>
              <div className={styles.topCardContainer}>
                <div className={styles.summaryCardsContainer}>
                  <div
                    className={`${styles.summaryCard} ${styles.summaryTotalAlerts}`}
                  >
                    <ul className={styles.summaryCardList}>
                      <p className={styles.summaryCardLabel}>Total Alerts</p>
                      <li
                        className={styles.summaryCardCount}
                        style={{ color: "#20DAFF" }}
                      >
                        {summaryCounts.individual.total}
                      </li>
                    </ul>
                  </div>
                  <div
                    className={`${styles.summaryCard} ${styles.summaryTotalAlerts}`}
                  >
                    <ul className={styles.summaryCardList}>
                      <p className={styles.summaryCardLabel}>
                        Total Active Alerts
                      </p>
                      <li
                        className={styles.summaryCardCount}
                        style={{ color: "#6B43BB" }}
                      >
                        {summaryCounts.individual.active}
                      </li>
                    </ul>
                  </div>
                  <div
                    className={`${styles.summaryCard} ${styles.summaryViewedAlerts}`}
                  >
                    <ul className={styles.summaryCardList}>
                      <p className={styles.summaryCardLabel}>
                        Total Alerts Viewed
                      </p>
                      <li
                        className={styles.summaryCardCount}
                        style={{ color: "#C64ECE" }}
                      >
                        {summaryCounts.individual.watched}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className={styles.priorityCardsContainer}>
                  <PriorityCard
                    title="High Priority"
                    total={alertDetails.individualAlerts.highPriority.total}
                    viewed={alertDetails.individualAlerts.highPriority.viewed}
                    priority="high"
                    icon={<FaUser style={{ color: "#ff5e62" }} />}
                    color="#ff5e62"
                    section="Individual"
                  />
                  <PriorityCard
                    title="Medium Priority"
                    total={alertDetails.individualAlerts.mediumPriority.total}
                    viewed={alertDetails.individualAlerts.mediumPriority.viewed}
                    priority="medium"
                    icon={<FaUser style={{ color: "#ffb347" }} />}
                    color="#ffb347"
                    section="Individual"
                  />
                  <PriorityCard
                    title="Low Priority"
                    total={alertDetails.individualAlerts.lowPriority.total}
                    viewed={alertDetails.individualAlerts.lowPriority.viewed}
                    priority="low"
                    icon={<FaUser style={{ color: "#4CAF50" }} />}
                    color="#4CAF50"
                    section="Individual"
                  />
                </div>
                <div className={styles.infoText}>
                  <FaInfoCircle className={styles.infoIcon} />
                  <span>This data is of 24 hours interval</span>
                </div>
              </div>
              <PeakHourAlertsChart name="Individual" />
              <AlertsByTimeFrame section="Individual" />
              <AlertStatsChart name="Individual" />
            </div>

            {/* Hospital Alerts Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Hospital Alerts</h2>
              <div className={styles.topCardContainer}>
                <div className={styles.summaryCardsContainer}>
                  <div
                    className={`${styles.summaryCard} ${styles.summaryTotalAlerts}`}
                  >
                    <ul className={styles.summaryCardList}>
                      <p className={styles.summaryCardLabel}>Total Alerts</p>
                      <li
                        className={styles.summaryCardCount}
                        style={{ color: "#20DAFF" }}
                      >
                        {summaryCounts.hospital.total}
                      </li>
                    </ul>
                  </div>
                  <div
                    className={`${styles.summaryCard} ${styles.summaryTotalAlerts}`}
                  >
                    <ul className={styles.summaryCardList}>
                      <p className={styles.summaryCardLabel}>
                        Total Active Alerts
                      </p>
                      <li
                        className={styles.summaryCardCount}
                        style={{ color: "#6B43BB" }}
                      >
                        {summaryCounts.hospital.active}
                      </li>
                    </ul>
                  </div>
                  <div
                    className={`${styles.summaryCard} ${styles.summaryViewedAlerts}`}
                  >
                    <ul className={styles.summaryCardList}>
                      <p className={styles.summaryCardLabel}>
                        Total Alerts Viewed
                      </p>
                      <li
                        className={styles.summaryCardCount}
                        style={{ color: "#C64ECE" }}
                      >
                        {summaryCounts.hospital.watched}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className={styles.priorityCardsContainer}>
                  <PriorityCard
                    title="High Priority"
                    total={alertDetails.hospitalAlerts.highPriority.total}
                    viewed={alertDetails.hospitalAlerts.highPriority.viewed}
                    priority="high"
                    icon={<FaUser style={{ color: "#ff5e62" }} />}
                    color="#ff5e62"
                    section="Hospital"
                  />
                  <PriorityCard
                    title="Medium Priority"
                    total={alertDetails.hospitalAlerts.mediumPriority.total}
                    viewed={alertDetails.hospitalAlerts.mediumPriority.viewed}
                    priority="medium"
                    icon={<FaUser style={{ color: "#ffb347" }} />}
                    color="#ffb347"
                    section="Hospital"
                  />
                  <PriorityCard
                    title="Low Priority"
                    total={alertDetails.hospitalAlerts.lowPriority.total}
                    viewed={alertDetails.hospitalAlerts.lowPriority.viewed}
                    priority="low"
                    icon={<FaUser style={{ color: "#4CAF50" }} />}
                    color="#4CAF50"
                    section="Hospital"
                  />
                </div>
                <div className={styles.infoText}>
                  <FaInfoCircle className={styles.infoIcon} />
                  <span>This data is of 24 hours interval</span>
                </div>
              </div>
              <PeakHourAlertsChart name="Hospital" />
              <AlertsByTimeFrame section="Hospital" />
              <AlertStatsChart name="Hospital"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerCareDashboard;