import { capitalizeFirstLetter } from "../../../utility/global";
import LabBarGraph from "../charts/lab-bar-graph";
import DoughnutChart from "../charts/lab-doughnut-chart";
import styles from "./dashboard-template.module.scss";
import NotificationCard from "./notification-card";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

type DashboardProps = {
  labType: string;
  labCode?: number;
};

// eslint-disable-next-line no-empty-pattern
const LabDashboardTemplate = ({ labType }: DashboardProps) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_row}>
          <div className={styles.container_row_item}>
            <h4 className={styles.heading}>
              {capitalizeFirstLetter(labType)} Test Summary
            </h4>
            <div className={styles.chart_container}>
              <DoughnutChart />
            </div>
          </div>

          <div className={styles.container_row_item}>
            <h4 className={styles.heading}>Patient Payment Summary</h4>
            <div className={styles.chart_container}>
              <LabBarGraph />
            </div>
          </div>
        </div>

        <div className={styles.container_row}>
          <div
            className={styles.container_row_item + " " + styles.clearBoxShadow}
          >
            <div
              className={
                styles.container_row +
                " " +
                styles.justifyLeft +
                " " +
                styles.alignItemsCenter
              }
            >
              <h3 className={styles.heading}>Test Notifications</h3>
              <div className={styles.container_fixed_notifications}>
                <NotificationsActiveIcon
                  sx={{ height: 35, width: 35, color: "black" }}
                />
                <span className={styles.container_fixed_notifications_count}>
                  16
                </span>
              </div>
            </div>

            <NotificationCard />
            <NotificationCard />
            <NotificationCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default LabDashboardTemplate;
