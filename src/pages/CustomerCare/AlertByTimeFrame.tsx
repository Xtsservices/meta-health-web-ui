import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { setLoading } from "../../store/error/error.action";
import { authFetch } from "../../axios/useAuthFetch";
import styles from "../nurseDashboard/dashboard.module.scss";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";

interface ProgressBarData {
  label: string;
  value: number;
  max: number;
  color: string;
  time: string;
}

const ProgressBar: React.FC<{
  label: string;
  value: number;
  max: number;
  color: string;
  time: string;
}> = ({ value, max, color, time }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const [isHovered, setIsHovered] = useState(false);
  const tooltipPosition = Math.min(Math.max(percentage, 30), 80);

  return (
    <div
      className={styles.progressBarContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: "relative" }}
    >
      <div className={styles.progressBarLabel}>
        <span style={{ color: "#888" }}>{time}</span>
      </div>
      <div className={styles.progressBarWrapper}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
        {isHovered && (
          <div
            className={styles.progressBarTooltip}
            style={{
              position: "absolute",
              left: `${tooltipPosition}%`,
              transform: "translateX(-50%)",
              top: "-30px",
              background: "#333",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              zIndex: 1000,
            }}
          >
            {value}
          </div>
        )}
      </div>
      <div className={styles.progressBarText}>{max}</div>
    </div>
  );
};

export const AlertsByTimeFrame: React.FC<{
  section: "Individual" | "Hospital";
}> = ({ section }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [progressData, setProgressData] = useState<ProgressBarData[]>([
    { label: "", value: 0, max: 1, color: "#E69DB8", time: "< 5 Min" },
    { label: "", value: 0, max: 1, color: "#E69DB8", time: "< 10 Min" },
    { label: "", value: 0, max: 1, color: "#E69DB8", time: "< 15 Min" },
    { label: "", value: 0, max: 1, color: "#E69DB8", time: "< 20 Min" },
    { label: "", value: 0, max: 1, color: "#E69DB8", time: "< 25 Min" },
  ]);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const datePickerRef = useRef<any>(null);

  const handleCalendarIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const formatDateLabel = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (selectedDate && user?.token) {
      const dateKey = formatDate(selectedDate);
      const dateLabel = formatDateLabel(selectedDate);
      const fetchProgressData = async () => {
        try {
          dispatch(setLoading(true));
          const endpoint =
            section === "Hospital"
              ? `alerts/getHospitalAlertsByTimeIntervals/${dateKey}`
              : `alerts/getIndividualAlertsByTimeIntervals/${dateKey}`;
          const response = await authFetch(endpoint, user.token);
          console.log(
            `${section} AlertsByTimeFrame API response for ${dateKey}:`,
            response
          );

          if (response.message === "success") {
            const alertsData =
              section === "Hospital"
                ? response.hospitalAlerts
                : response.individualAlerts;
                console.log("alertsDataboom",alertsData)
            const total = alertsData.total || 0;
            console.log("alertsDataboom",total)

            const newProgressData: ProgressBarData[] = [
              {
                label: dateLabel,
                value: alertsData.timeIntervals.lessThan5Min.watched,
                max: total,
                color: "#E69DB8",
                time: "< 5 Min",
              },
              {
                label: dateLabel,
                value: alertsData.timeIntervals.lessThan10Min.watched,
                max: total,
                color: "#E69DB8",
                time: "< 10 Min",
              },
              {
                label: dateLabel,
                value: alertsData.timeIntervals.lessThan15Min.watched,
                max: total,
                color: "#E69DB8",
                time: "< 15 Min",
              },
              {
                label: dateLabel,
                value: alertsData.timeIntervals.lessThan20Min.watched,
                max: total,
                color: "#E69DB8",
                time: "< 20 Min",
              },
              {
                label: dateLabel,
                value: alertsData.timeIntervals.moreThan20Min.watched,
                max: total,
                color: "#E69DB8",
                time: "> 20 Min",
              },
            ];
            setProgressData(newProgressData);
          } else {
            console.error(
              `${section} AlertsByTimeFrame API error:`,
              response.message
            );
            setProgressData([
              {
                label: dateLabel,
                value: 0,
                max: 1,
                color: "#E69DB8",
                time: "< 5 Min",
              },
              {
                label: dateLabel,
                value: 0,
                max: 1,
                color: "#E69DB8",
                time: "< 10 Min",
              },
              {
                label: dateLabel,
                value: 0,
                max: 1,
                color: "#E69DB8",
                time: "< 15 Min",
              },
              {
                label: dateLabel,
                value: 0,
                max: 1,
                color: "#E69DB8",
                time: "< 20 Min",
              },
              {
                label: dateLabel,
                value: 0,
                max: 1,
                color: "#E69DB8",
                time: "< 25 Min",
              },
            ]);
          }
        } catch (error) {
          console.error(
            `Error fetching ${section} alerts by time intervals for ${dateKey}:`,
            error
          );
          setProgressData([
            {
              label: dateLabel,
              value: 0,
              max: 1,
              color: "#E69DB8",
              time: "< 5 Min",
            },
            {
              label: dateLabel,
              value: 0,
              max: 1,
              color: "#E69DB8",
              time: "< 10 Min",
            },
            {
              label: dateLabel,
              value: 0,
              max: 1,
              color: "#E69DB8",
              time: "< 15 Min",
            },
            {
              label: dateLabel,
              value: 0,
              max: 1,
              color: "#E69DB8",
              time: "< 20 Min",
            },
            {
              label: dateLabel,
              value: 0,
              max: 1,
              color: "#E69DB8",
              time: "< 25 Min",
            },
          ]);
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchProgressData();
    } else {
      console.warn(
        `No user token or selected date for ${section} AlertsByTimeFrame`
      );
    }
  }, [selectedDate, user?.token, dispatch, section]);

  return (
    <div className={styles.progressCard}>
      <div className={styles.chartCardHeader}>
        <h3 className={styles.chartTitle}>
          No of {section} Alerts Viewed by Time Frame
        </h3>
        <div className={styles.datePickerContainer}>
          <DatePicker
            ref={datePickerRef}
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
            className={styles.datePicker}
            maxDate={new Date()}
          />
          <FaCalendarAlt
            className={styles.calendarIcon}
            style={{ color: "#e69db8" }}
            onClick={handleCalendarIconClick}
          />
        </div>
      </div>
      <div className={styles.progressContainer}>
        {/* Add the Total label header row */}
        <div className={styles.progressHeaderRow}>
          <div className={styles.timeLabelHeader}>Time Frame</div>
          <div className={styles.progressBarHeader}></div>
          <div className={styles.totalLabelHeader}>
            <div>Total Alerts</div>
          </div>
        </div>
        
        {/* Progress bars */}
        {progressData.map((bar, index) => (
          <ProgressBar
            key={index}
            label={bar.label}
            value={bar.value}
            max={bar.max}
            color={bar.color}
            time={bar.time}
          />
        ))}
      </div>
    </div>
  );
};
