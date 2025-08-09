import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import styles from "./MySchedule.module.scss";
import holiday from "../../../assets/nurse/noun-holidays-2518025 1.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { IconButton} from "@mui/material";
import { authFetch } from "../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { capitalizeFirstLetter } from "../../../utility/global";

const localizer = momentLocalizer(moment);

const CustomEvent = ({ event }: { event: any }) => {
  return (
    <div className={styles.eventContainer}>
      <div className={styles.eventTime}>
        {event.shiftType !== "leave" ? (
          <>
            <AccessTimeIcon fontSize="small" sx={{ marginRight: 1 }} />
            {moment(event.start).format("hh:mm A")} - {moment(event.end).format("hh:mm A")}
          </>
        ) : (
          <h3 style={{ margin: 0 }}>Leave</h3>
        )}
      </div>
      <div className={styles.eventResource}>
        {event.shiftType === "leave" 
          ? event.title 
          : `${event.shiftType} - ${capitalizeFirstLetter(event.department)} - ${capitalizeFirstLetter(event.ward)}`}
      </div>
    </div>
  );
};


const MySchedule: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const user = useSelector(selectCurrentUser);
  const [leavesCount, setLeavesCount] = useState({
    totalLeaves: 0,
    approvedLeaves: 0,
    pendingLeaves: 0
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await authFetch(
          `nurse/getmyshiftschedule/${user?.hospitalID}`,
          user?.token
        );
  
        if (response.message !== "success") {
          throw new Error("Failed to fetch schedule");
        }
  
        const data = response?.data;
  
        const formattedEvents: any[] = [];
        const processedLeaves = new Set(); // Track processed leave date ranges
        const processedShifts = new Set(); // Track processed shift periods
  
        // Process leaves
        data?.forEach((shift: any) => {
          if (shift.leaveFrom && shift.leaveTo) {
            const leaveStart = moment(shift.leaveFrom).startOf('day');
            const leaveEnd = moment(shift.leaveTo).endOf('day');
            // Deduplicate based only on date range
            const leaveKey = `${leaveStart.format('YYYY-MM-DD')}-${leaveEnd.format('YYYY-MM-DD')}`;
  
            if (!processedLeaves.has(leaveKey)) {
              formattedEvents.push({
                id: `leave-${shift.id}-${leaveStart.format('YYYY-MM-DD')}`,
                title: shift.leaveType || "Leave",
                start: leaveStart.toDate(),
                end: leaveEnd.toDate(),
                resource: shift.leaveType || "Leave",
                shiftType: "leave",
                scope: shift.scope,
                isLeave: true,
                department: shift.departmentName,
                ward: shift.wardName,
                isContinuous: true
              });
              processedLeaves.add(leaveKey);
            } else {
              console.log(`Skipped duplicate leave: ${leaveKey}`, shift); // Log skipped duplicates
            }
          }
        });
  
        // Process shifts
        data?.forEach((shift: any) => {
          if (shift.fromDate && shift.toDate && shift.shiftTimings) {
            const shiftStart = moment(shift.fromDate);
            const shiftEnd = moment(shift.toDate);
            const [startTime, endTime] = shift.shiftTimings.split(" - ");
            const shiftKey = `${shiftStart.format('YYYY-MM-DD')}-${shiftEnd.format('YYYY-MM-DD')}-${shift.scope}-${shift.id}-${startTime}-${endTime}`;
  
            // Check for overlapping leaves
            const overlappingLeaves = formattedEvents.filter(event =>
              event.isLeave &&
              moment(event.start).isSameOrBefore(shiftEnd, 'day') &&
              moment(event.end).isSameOrAfter(shiftStart, 'day')
            );
  
            if (!processedShifts.has(shiftKey)) {
              if (overlappingLeaves.length === 0) {
                // No leaves - add the entire shift
                formattedEvents.push({
                  id: `shift-${shift.id}-${shiftStart.format('YYYY-MM-DD')}`,
                  title: "Shift",
                  start: shiftStart.clone().set({
                    hour: moment(startTime, "hh:mm A").hour(),
                    minute: moment(startTime, "hh:mm A").minute()
                  }).toDate(),
                  end: shiftEnd.clone().set({
                    hour: moment(endTime, "hh:mm A").hour(),
                    minute: moment(endTime, "hh:mm A").minute()
                  }).toDate(),
                  resource: shift.scope === 1 ? "IPD" : "OPD",
                  shiftType: shift.scope === 2 ? "OPD" : "IPD",
                  scope: shift.scope,
                  isLeave: false,
                  department: shift.departmentName,
                  ward: shift.wardName,
                  isContinuous: true
                });
                processedShifts.add(shiftKey);
              } else {
                // Split shifts around leaves
                let currentPeriodStart = shiftStart.clone();
  
                // Sort leaves by date
                overlappingLeaves.sort((a, b) => moment(a.start).diff(moment(b.start)));
  
                for (const leave of overlappingLeaves) {
                  const leaveStart = moment(leave.start).startOf('day');
  
                  // Add shift period before this leave
                  if (currentPeriodStart.isBefore(leaveStart)) {
                    const periodEnd = leaveStart.clone().subtract(1, 'day');
  
                    formattedEvents.push({
                      id: `shift-${shift.id}-${currentPeriodStart.format('YYYY-MM-DD')}-${periodEnd.format('YYYY-MM-DD')}`,
                      title: "Shift",
                      start: currentPeriodStart.clone().set({
                        hour: moment(startTime, "hh:mm A").hour(),
                        minute: moment(startTime, "hh:mm A").minute()
                      }).toDate(),
                      end: periodEnd.clone().set({
                        hour: moment(endTime, "hh:mm A").hour(),
                        minute: moment(endTime, "hh:mm A").minute()
                      }).toDate(),
                      resource: shift.scope === 1 ? "IPD" : "OPD",
                      shiftType: shift.scope === 2 ? "OPD" : "IPD",
                      scope: shift.scope,
                      isLeave: false,
                      department: shift.departmentName,
                      ward: shift.wardName,
                      isContinuous: true
                    });
                  }
  
                  // Move current period start to after the leave
                  currentPeriodStart = moment(leave.end).add(1, 'day').startOf('day');
                }
  
                // Add remaining shift period
                if (currentPeriodStart.isSameOrBefore(shiftEnd)) {
                  formattedEvents.push({
                    id: `shift-${shift.id}-${currentPeriodStart.format('YYYY-MM-DD')}-${shiftEnd.format('YYYY-MM-DD')}`,
                    title: "Shift",
                    start: currentPeriodStart.clone().set({
                      hour: moment(startTime, "hh:mm A").hour(),
                      minute: moment(startTime, "hh:mm A").minute()
                    }).toDate(),
                    end: shiftEnd.clone().set({
                      hour: moment(endTime, "hh:mm A").hour(),
                      minute: moment(endTime, "hh:mm A").minute()
                    }).toDate(),
                    resource: shift.scope === 1 ? "IPD" : "OPD",
                    shiftType: shift.scope === 2 ? "OPD" : "IPD",
                    scope: shift.scope,
                    isLeave: false,
                    department: shift.departmentName,
                    ward: shift.wardName,
                    isContinuous: true
                  });
                }
                processedShifts.add(shiftKey);
              }
            } else {
              console.log(`Skipped duplicate shift: ${shiftKey}`, shift); // Log skipped duplicates
            }
          }
        });
  
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching shift schedule:", error);
      }
    };

    const fetchLeavesCount = async () => {
      try {
        const response = await authFetch(
          `nurse/getstaffleavesCount/${user?.hospitalID}`,
          user?.token
        );
        
        if (response.message === "success") {
          setLeavesCount({
            totalLeaves: response.data.totalLeaves,
            approvedLeaves: response.data.approvedLeaves,
            pendingLeaves: response.data.pendingLeaves
          });
        }
      } catch (error) {
        console.error("Error fetching leaves count:", error);
      }
    };
  
    fetchSchedule();
    fetchLeavesCount();
  }, [user?.hospitalID, user?.token]);

  const [currentDate, setCurrentDate] = useState(new Date());

  // Custom event styling
  const eventStyleGetter = (event: any) => {
    const style = {
      backgroundColor: event.isLeave ? "#FFCCCC" : 
                     (event.scope === 1 ? "#D4EDDA" : "#DEEAFF"),
      borderRadius: "5px",
      color: "#000",
      padding: "5px",
      borderLeft: event.isLeave ? "4px solid #FF0000" : 
                 (event.scope === 1 ? "4px solid #28A745" : "4px solid #1977F3"),
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      opacity: event.isLeave ? 0.8 : 1,
      height: "100%",
    };
  
    return { style };
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
            <li className={styles.listitemcount}>{leavesCount.totalLeaves}</li>
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
            <li className={styles.listitemcount}>{leavesCount.pendingLeaves}</li>
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
            <li className={styles.listitemcount}>{leavesCount.approvedLeaves}</li>
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
              OPD Shift
            </div>
            <div className={styles.legendItem}>
              <span
                className={styles.colorBox}
                style={{ backgroundColor: "#D4EDDA" }}
              ></span>
              IPD Shift
            </div>
            <div className={styles.legendItem}>
              <span
                className={styles.colorBox}
                style={{ backgroundColor: "#FFCCCC" }}
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
          style={{ height: 600, margin: "20px 0" }}
          eventPropGetter={eventStyleGetter}
          components={{
            event: CustomEvent,
          }}
          toolbar={false}
        />
      </div>
    </div>
  );
};

export default MySchedule;