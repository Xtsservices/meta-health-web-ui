import { useNavigate } from "react-router-dom";
import styles from "../nurseDashboard/dashboard.module.scss";

export const PriorityCard: React.FC<{
  title: string;
  total: number;
  viewed: number;
  priority: "high" | "medium" | "low";
  icon: React.ReactNode;
  color: string;
  section: "Individual" | "Hospital";
}> = ({ title, total, viewed, priority, icon, color, section }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/customerCare/alerts?activeTab=${section}&priority=${priority}`);
  };

  return (
    <div
      className={`${styles.priorityCard} ${styles[`${priority}Priority`]}`}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.cardIcon}>{icon}</div>
      </div>
      <div className={styles.cardValue} style={{ color: color }}>
        {total - viewed}
      </div>
      <div className={styles.gradientLine}></div>
      <div className={styles.cardTitle2}>
        Viewed: <span style={{ color: color }}>{viewed}</span>
      </div>
    </div>
  );
};
