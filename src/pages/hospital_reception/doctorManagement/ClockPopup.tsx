import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Typography,
  IconButton,
  Grid, InputAdornment
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DatePicker from "react-datepicker";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authPost } from "../../../axios/useAuthPost";
import { setError, setSuccess } from "../../../store/error/error.action";
import { format } from "date-fns";
import styles from "./ClockPopup.module.scss"
import Time_schedule_pop_up from "../../../assets/reception/Time_schedule_pop_up.png"
import "react-datepicker/dist/react-datepicker.css"

type ClockPopupProps = {
  open: boolean;
  onClose: () => void;
};

type SlotDetail = {
  time: string;
  availableSlots: number;
  bookedIds: number[];
  date: string;
};

type TimeSlot = {
  from: string;
  to: string;
  date: string;
  hours: number;
  persons: number;
  slots: SlotDetail[];
};

const daysOfWeek: { label: string; shortLabel: string }[] = [
  { label: "Monday", shortLabel: "Mon" },
  { label: "Tuesday", shortLabel: "Tue" },
  { label: "Wednesday", shortLabel: "Wed" },
  { label: "Thursday", shortLabel: "Thu" },
  { label: "Friday", shortLabel: "Fri" },
  { label: "Saturday", shortLabel: "Sat" },
  { label: "Sunday", shortLabel: "Sun" }
];

const docData = [
  {
    id: 491,
    firstName: "Arjun",
    lastName: "A",
    shiftTimings: { fromTime: "2023-11-10 09:00", toTime: "2023-11-10 18:30" }
  }
];

// Define the iOS-style toggle
const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#2196f3",
        opacity: 1,
        border: 0
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5
      }
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#2196f3",
      border: "6px solid #fff"
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100]
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7
    }
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500
    })
  }
}));

const ClockPopup: React.FC<ClockPopupProps> = ({ open, onClose }) => {
  function getWeekDates() {
    const currentDate = new Date();

    // Array to store the days with their dates
    const daysWithDates = [];

    // Generate dates for the next 7 days, starting from today
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() + i); // Move to the next day for each iteration
      const formattedDate = format(day, "MMM dd"); // Format date like "Nov 10"
      const dayLabel = format(day, "EEEE"); // Get the full day name (e.g., "Monday")

      daysWithDates.push({
        label: dayLabel, // Full day name (e.g., "Monday")
        date: formattedDate // Formatted date (e.g., "Nov 10")
      });
    }

    return daysWithDates;
  }

  const daysOfWeekThead = getWeekDates();

  const [timeSlots, setTimeSlots] = useState<Record<string, TimeSlot[]>>(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day.label]: [] }), {})
  );
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const [daySelection, ] = useState("Everyday");
  const [fromTime, setFromTime] = useState("14:00");
  const [toTime, setToTime] = useState("15:00");
  const [hours, setHours] = useState<number>(1);
  const [persons, setPersons] = useState<number>(0);
  // State to manage the toggle for each day
  const [dayToggles, setDayToggles] = useState<Record<string, boolean>>(
    daysOfWeekThead.reduce((acc, day) => ({ ...acc, [day.label]: true }), {})
  );

  // Doctor's shift timing variables
  const [shiftFromTime, setShiftFromTime] = useState<string>("");
  const [shiftToTime, setShiftToTime] = useState<string>("");

  const handleToggleDay = (day: string) => {
    console.log("day", day);
    setDayToggles((prev) => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const handleAddTimeSlot = () => {
    if (!hours || !persons) {
      alert("Both Hours and Persons fields are mandatory.");
      return;
    }

    if (fromTime >= toTime) {
      alert("From time must be less than To time.");
      return;
    }

    if (fromTime < shiftFromTime || toTime > shiftToTime) {
      alert(
        `Time slot must be within the doctor's shift timings: ${shiftFromTime} - ${shiftToTime}.`
      );
      return;
    }

    // Calculate applicable dates based on daySelection
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 6); // Next 7 days

    const getApplicableDates = () => {
      const applicableDates = [];
      const currentDate = new Date(startDate);

      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];

      while (currentDate <= endDate) {
        const dayIndex = currentDate.getDay();
        const dayLabel = daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1]; // Adjust for Sunday as the last day

        if (
          daySelection === "Everyday" ||
          (daySelection === "Weekdays" &&
            !["Saturday", "Sunday"].includes(dayLabel)) ||
          (daySelection === "Weekends" &&
            ["Saturday", "Sunday"].includes(dayLabel)) ||
          daySelection === dayLabel
        ) {
          applicableDates.push({
            dayLabel,
            date: currentDate.toISOString().split("T")[0] // Format as YYYY-MM-DD
          });
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return applicableDates;
    };

    const applyDays = getApplicableDates();

    // Check if time slot conflicts within the selected week range
    const isConflict = applyDays.some(
      ({ dayLabel }) =>
        dayToggles[dayLabel] &&
        timeSlots[dayLabel]?.some(
          (slot) => slot.from === fromTime && slot.to === toTime
        )
    );

    if (isConflict) {
      alert("Time slot already exists for the selected day.");
      return;
    }

    setTimeSlots((prev) => {
      const newSlots = { ...prev };

      applyDays.forEach(({ dayLabel, date }) => {
        if (dayToggles[dayLabel]) {
          const slots = [];
          let slotTime = fromTime;

          // Generate slots for each day within the selected week
          while (slotTime < toTime) {
            const [hour, minute] = slotTime.split(":").map(Number);
            const nextHour = hour + 1;
            const nextSlotTime = `${String(nextHour).padStart(2, "0")}:00`;

            const isPartialSlot = nextSlotTime !== toTime;
            let availableSlotCount = persons;
            if (isPartialSlot) {
              const remainingMinutes = 60 - minute;
              availableSlotCount = Math.floor(
                persons * (remainingMinutes / 60)
              );
            }

            slots.push({
              time: slotTime,
              availableSlots: availableSlotCount,
              bookedIds: [],
              date // Use the calculated date for each day
            });

            slotTime = nextSlotTime;
          }

          // Handle the partial time at the end
          const [, fromMinute] = fromTime.split(":").map(Number);
          const [toHour, toMinute] = toTime.split(":").map(Number);

          if (fromMinute !== 0 || toMinute !== 0) {
            const lastSlotTime = `${String(toHour).padStart(2, "0")}:${String(
              toMinute
            ).padStart(2, "0")}`;
            const remainingMinutes = toMinute;
            const finalAvailableSlots = Math.floor(
              persons * (remainingMinutes / 60)
            );

            slots.push({
              time: lastSlotTime,
              availableSlots: finalAvailableSlots,
              bookedIds: [],
              date
            });
          }

          // Add the generated slots to the specific day in the newSlots object
          newSlots[dayLabel] = [
            ...(newSlots[dayLabel] || []),
            {
              from: fromTime,
              to: toTime,
              hours,
              persons,
              date, // Add date at the parent level
              slots
            }
          ];
        }
      });

      return newSlots;
    });
  };

  const handleRemoveSlot = (
    day: string,
    timeSlotIndex: number,
    slotIndex: number
  ) => {
    setTimeSlots((prev) => {
      const newSlots = { ...prev };

      // Remove the slot from the correct day's slots
      newSlots[day] = newSlots[day].map((timeSlot, index) => {
        if (index === timeSlotIndex) {
          // Filter the specific slot to remove by slotIndex
          timeSlot.slots = timeSlot.slots.filter((_, idx) => idx !== slotIndex);
        }
        return timeSlot;
      });

      return newSlots;
    });
  };

  const handleClearAll = () => {
    setTimeSlots(
      daysOfWeek.reduce((acc, day) => ({ ...acc, [day.label]: [] }), {})
    );
  };

  const handleSave = async () => {
    if (
      !timeSlots ||
      Object.keys(timeSlots).length === 0 ||
      Object.values(timeSlots).every((slots) => slots.length === 0)
    ) {
      alert("Please Add Slot");
      dispatch(setError("Please Add Slot"));
      return;
    }

    const slotTimings = Object.entries(timeSlots).flatMap(([day, slots]) =>
      slots.map((slot) => ({
        day,
        ...slot
      }))
    );

    const body = {
      slotTimings: slotTimings,
      dayToggles: dayToggles,
      addedBy: user.id,
      doctorID: docData[0].id
    };

    console.log("body", body);
    return;

    try {
      const response = await authPost(
        `doctor/${user.hospitalID}/doctorAppointmentSchedule`,
        { data: body },
        user.token
      );

      console.log("response", response);

      if (response.message == "success") {
        dispatch(setSuccess("Schedule saved successfully!"));
      } else {
        dispatch(setError(response.message));
      }

      onClose();
      handleClearAll();
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("An error occurred while saving the schedule.");
    }
  };

  useEffect(() => {
    if (docData && docData.length > 0) {
      const { fromTime, toTime } = docData[0].shiftTimings;
      setShiftFromTime(fromTime.split(" ")[1]); // Save shift timings
      setShiftToTime(toTime.split(" ")[1]);
      setFromTime(fromTime.split(" ")[1]); // Set initial values
      setToTime(toTime.split(" ")[1]);
    }
  }, []);
  

  return (
    // Dialog Box Structure
    <Dialog open={open} onClose={onClose} maxWidth="lg"   fullWidth>
      <DialogTitle style={{ textAlign: "start", fontWeight:"600"}}>Time Schedule</DialogTitle>
      <div style = {{position:"relative"}}>
      <img src = {Time_schedule_pop_up} alt = "time schedule banner" style = {{width:"140px", position:"absolute",right:0, top:-70}} />
      </div>
      <hr style={{ width: "100%", border: "1px solid #F1EBEB",marginBottom:"25px" }} />
     
      <DialogContent >
        {/* Table Structure */}
        <div style = {{display:"flex", alignItems:"center", width:"100%"}}>
        <ArrowBackIosIcon onClick= {()=>""} style = {{cursor:"pointer"}}  />
        <div style = {{borderRadius:"12px", border: "1px solid #E4E1E1", overflow:"hidden"}}>
       
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              {daysOfWeekThead.map((day) => (
                <th
                  key={day.label}
                  style={{
                    textAlign: "center",
                    borderRadius: "50px",
                    border: "1px solid #F1EBEB",
                    padding: "8px"
                  }}
                >
                  {`${day.label} (${day.date})`}{" "}
                  {/* Displaying "Monday (Nov 10)" */}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              {daysOfWeekThead.map((day) => (
                <td
                  key={day.label}
                  style={{
                    textAlign: "center",
                    border: "1px solid #ddd",
                    padding: "8px"
                  }}
                >
                  <IOSSwitch
                    checked={dayToggles[day.label]}
                    onChange={() => handleToggleDay(day.label)}
                    size="small"
                  />
                </td>
              ))}
            </tr>

            <tr>
              {daysOfWeekThead.map((day) => (
                <td
                  key={day.label}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    verticalAlign: "top"
                  }}
                >
                  {timeSlots[day.label].length === 0 ? (
                    <Typography
                      variant="body2"
                      style={{ textAlign: "center", color: "#999" }}
                    >
                      No time slots
                    </Typography>
                  ) : (
                    timeSlots[day.label].map((timeSlot, timeSlotIndex) =>
                      timeSlot.slots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "8px",
                            opacity: dayToggles[day.label] ? 1 : 0.5 // Full opacity if enabled
                          }}
                        >
                          {/* Time with individual background */}
                          <div
                            style={{
                              backgroundColor: "#B2CAEA",
                              padding: "8px 8px",
                              color: dayToggles[day.label] ? "inherit" : "#999"
                            }}
                          >
                            <Typography variant="body2" component="span">
                              {`${slot.time} ${
                                parseInt(slot.time.split(":")[0], 10) < 12
                                  ? "AM"
                                  : "PM"
                              }`}
                            </Typography>
                          </div>

                          {/* Close button with individual background */}
                          <div
                            style={{
                              backgroundColor: "#E5E6EF",
                              padding: "1px 8px",
                              color: dayToggles[day.label] ? "inherit" : "#999"
                            }}
                          >
                            <IconButton
                              onClick={() =>
                                handleRemoveSlot(
                                  day.label,
                                  timeSlotIndex,
                                  slotIndex
                                )
                              }
                              size="small"
                              style={{
                                color: "white"
                              }}
                              disabled={!dayToggles[day.label]} // Disable if toggle is false
                            >
                              <Close fontSize="medium" sx={{ color: "gray" }} />
                            </IconButton>
                          </div>
                        </div>
                      ))
                    )
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
       
        </div>
        <ArrowForwardIosIcon onClick = {()=>""} style = {{cursor:"pointer"}} />
        </div>

        <Grid
          container
          spacing={3}
          alignItems="center"
          style={{ marginTop: "16px" }}
        >
          {/* Day Selection */}
          {/* <Grid item xs={12} sm={2}>
            <Select
              value={daySelection}
              onChange={(e) => setDaySelection(e.target.value)}
              fullWidth
            >
              <MenuItem value="Everyday">Everyday</MenuItem>
              <MenuItem value="Weekdays">Weekdays</MenuItem>
              <MenuItem value="Weekends">Weekends</MenuItem>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ].map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </Grid> */}
         
         <div className={styles.iconsContainer} style = {{marginTop:"10px", padding:"4px"}}>
              <div className={styles.calendar} style={{ marginRight: "2px" }}>
                <CalendarTodayIcon
                  
                  style={{ cursor: "pointer" }}
                />
                <div className={styles.datePickerContainer}>
                <DatePicker
                  selectsRange
                  isClearable
                  placeholderText="Select a date range"
                  className={styles.datePicker}
                  calendarClassName={styles.calendar}
                  maxDate={new Date()}
                />
              </div>
              </div>
            </div>
         

          {/* From Time */}
          <Grid item xs={12} sm={2}>
            <TextField
              type="time"
              label="From Time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              fullWidth
              
            />
          </Grid>

          {/* To Time */}
          <Grid item xs={12} sm={1.5}>
            <TextField
              type="time"
              label="To Time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              fullWidth
            />
          </Grid>

          {/* Slot Duration */}
          <Grid item xs={12} sm={1}>
            <TextField
              type="number"
              label="Slot Duration"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
              disabled
              fullWidth
            />
          </Grid>

          {/* Persons */}
          <Grid item xs={12} sm={1.4}>
            <TextField
              type="number"
              label="Persons"
              value={persons}
              onChange={(e) => setPersons(parseInt(e.target.value, 10) || 0)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Add Button */}
          <Grid item xs={12} sm={1}>
            <Button
              variant="contained"
              sx={{ height: "40px" }}
              onClick={handleAddTimeSlot}
            >
              Add
            </Button>
          </Grid>

          {/* Clear All and Save Buttons */}
          <Grid
            item
            container
            xs={12}
            sm={2}
            spacing={2}
            justifyContent="flex-end"
          >
            <Grid item  >
              <Button
                sx={{ height: "40px",width:"90px", border:"none", outline:"none", background:"#DCDEE1", color:"#000", textTransform:"none" }}
                onClick={handleClearAll}
                variant="outlined"
              
              >
                Clear All
              </Button>
            </Grid>
            <Grid item>
              <Button
                sx={{ height: "40px" }}
                onClick={handleSave}
                // color="primary"
                style = {{background:"#1977F3", textTransform:"none"}}
                variant="contained"
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <p style = {{marginTop:"20px", fontSize:"14px", fontWeight:"400"}}><span style ={{color:"#F35757"}}>Note :</span> Hours of day (maximum 12)</p>
      </DialogContent>
   
    </Dialog>
  );
};

export default ClockPopup;
