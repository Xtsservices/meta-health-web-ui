import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import styles from "../../../pages/nurseDashboard/NurseManagment/MySchedule.module.scss";

import holiday from "../../../assets/nurse/noun-holidays-2518025 1.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
 
  IconButton,
} from "@mui/material";

const localizer = momentLocalizer(moment);

const CustomEvent = ({ event }: { event: any }) => {
  const startTime = moment(event.start).format("hh:mm A");
  const endTime = moment(event.end).format("hh:mm A");

  return (
    <div className={styles.eventContainer}>
      <div className={styles.eventTime}>
        {event.shiftType !== "leave" ? (
          <>
            <AccessTimeIcon fontSize="small" sx={{ marginRight: 1 }} />
            {startTime} - {endTime}
          </>
        ) : (
          <h3>leave</h3>
        )}
      </div>
      <div className={styles.eventResource}>{event.resource}</div>
    </div>
  );
};

const MySchedule: React.FC = () => {
  const [events, setEvents] = useState([
    {
      title: "Morning Shift",
      start: new Date(2024, 11, 2, 8, 0), // December 2, 8:00 AM
      end: new Date(2024, 11, 4, 13, 0), // December 8, 1:00 PM
      resource: "General Ward",
      shiftType: "morning",
    },

    {
      title: "Night Shift",
      start: new Date(2024, 11, 8, 18, 0), // December 8, 6:00 PM
      end: new Date(2024, 11, 8, 1, 0), // December 9, 1:00 AM
      resource: "ICU",
      shiftType: "night",
    },
    {
      title: "Leave",
      start: new Date(2024, 11, 12), // December 12
      end: new Date(2024, 11, 12),
      shiftType: "leave",
    },
  ]);

  useEffect(()=>{
    setEvents(events)
  },[])

  const [currentDate, setCurrentDate] = useState(new Date());

  // Custom event styling
  const eventStyleGetter = (event: any) => {
    const shiftColors: { [key: string]: string } = {
      morning: "#DEEAFF",
      night: "#FFE3E1",
      leave: "#DBFDDB",
    };

    const backgroundColor = shiftColors[event.shiftType] || shiftColors.leave;
    let borderLeft = "4px solid #20A51E"; // Default border color

    // Customize border color based on the shift type, if necessary
    if (event.shiftType === "morning") borderLeft = "4px solid #1977F3";
    if (event.shiftType === "night") borderLeft = "4px solid #C0534B";

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        color: "#fff",
        padding: "5px",
        borderLeft,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
      },
    };
  };

  // Navigation handlers
  const handlePrev = () => {
    setCurrentDate(moment(currentDate).subtract(1, "month").toDate());
  };

  const handleNext = () => {
    setCurrentDate(moment(currentDate).add(1, "month").toDate());
  };

  return (
    <div className={styles.mySchedule}>
      {/* Leave Cards */}
      <div style={{ marginBottom: "55px" }} className={styles.container_cards}>
        <div
          style={{
            backgroundImage: "linear-gradient(to right, #D568AB, #FAB0E1)",
          }}
          className={`${styles.container_cards_item}`}
        >
          <ul className={styles.ul}>
            <li className={styles.listitemcount}>23</li>
            <li>
              <img className={styles.listimg} src={holiday} alt="Appointment" />
            </li>
          </ul>
          <p className={styles.listitemdoc}>Total Annual Leaves</p>
        </div>

        <div
          style={{
            backgroundImage: "linear-gradient(to right, #6095C5, #73ACDF)",
          }}
          className={`${styles.container_cards_item}`}
        >
          <ul className={styles.ul}>
            <li className={styles.listitemcount}>10</li>
            <li>
              <img className={styles.listimg} src={holiday} alt="Appointment" />
            </li>
          </ul>
          <p className={styles.listitemdoc}>Pending Leaves</p>
        </div>

        <div
          style={{
            backgroundImage: "linear-gradient(to right, #7DD3AD, #97EFB6)",
          }}
          className={`${styles.container_cards_item}`}
        >
          <ul className={styles.ul}>
            <li className={styles.listitemcount}>03</li>
            <li>
              <img className={styles.listimg} src={holiday} alt="Appointment" />
            </li>
          </ul>
          <p className={styles.listitemdoc}>Approved Leaves</p>
        </div>
      </div>

      {/* Navigation and Legend Section */}
      <div className={styles.navigationSection}>
        <div className={styles.navigation}>
          <span className={styles.currentMonthYear}>
            {moment(currentDate).format("MMMM YYYY")}
          </span>

          <div className={styles.legendSection}>
            <div className={styles.legendItem}>
              <span
                className={styles.colorBox}
                style={{ backgroundColor: "#DEEAFF" }}
              ></span>
              Morning Shift
            </div>
            <div className={styles.legendItem}>
              <span
                className={styles.colorBox}
                style={{ backgroundColor: "#FFE3E1" }}
              ></span>
              Night Shift
            </div>
            <div className={styles.legendItem}>
              <span
                className={styles.colorBox}
                style={{ backgroundColor: "#DBFDDB" }}
              ></span>
              Leave
            </div>
          </div>
        </div>

        <div className={styles.navigation}>
          <IconButton
            sx={{
              color: "#d32f2f",
              "&:hover": {
                color: "#b71c1c",
              },
            }}
            onClick={handlePrev}
          >
            <ArrowBackIosIcon />
          </IconButton>

          <IconButton
            sx={{
              color: "#d32f2f",
              "&:hover": {
                color: "#b71c1c",
              },
            }}
            onClick={handleNext}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </div>

      {/* Calendar Section */}
      <div className={styles.calendarSection}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={setCurrentDate}
          style={{ height: 600, margin: "20px 0"}}
          eventPropGetter={eventStyleGetter}
          components={{
            event: CustomEvent,
          }}
          toolbar={false} // Ensure toolbar is enabled
        />
      </div>
    </div>
  );
};

export default MySchedule;
