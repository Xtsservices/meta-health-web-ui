import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Role_NAME } from "../../../utility/role";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormHelperText,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "../../../axios/useAuthFetch";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useDispatch, useSelector } from "react-redux";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from '../../../utility/debounce';
import { setError, setSuccess } from "../../../store/error/error.action";
import { selectCurrPatient } from "../../../store/currentPatient/currentPatient.selector";
import dayjs from "dayjs";
interface Errors {
  patientId?: string;
  patientName?: string;
  surgeryType?: string;
  roomNumber?: string;
  patientAge?: string;
  gender?: string;
  phoneNumber?: string;
  attendees?: string;
  fromTime?: string;
  toTime?: string;
  bloodGroup?: string;
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    patientId: string;
    patientName: string;
    attendees: OTAttendee[];
    surgeryType: string;
    roomNumber: string;
  };
}

interface FormData {
  roomNumber: string;
  attendees: OTAttendee[];
  // bloodRequired: boolean;
  // bloodGroup: string;
  fromTime: string;
  toTime: string;
}

const initialFormData: FormData = {
  roomNumber: "",
  attendees: [],
  // bloodRequired: false,
  // bloodGroup: "",
  fromTime: "",
  toTime: "",
};

export interface OTAttendee {
  id: number;
  departmentID: number;
  firstName: string;
  lastName: string;
  photo: string | null;
  imageURL?: string;
}

const MySchedule = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [attendeesList, setAttendeesList] = useState<OTAttendee[]>([]);
  const currentPatient = useSelector(selectCurrPatient);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedFromTime, setSelectedFromTime] = useState<string>("");
  const [selectedToTime, setSelectedToTime] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Errors>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [isRetrievingParamsUser, setIsRetrievingParamsUser] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const calendarRef = useRef<FullCalendar | null>(null); // Correct type here

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const getAllAttendees = async () => {
      const doctorResponse = await authFetch(
        `user/${user.hospitalID}/list/${Role_NAME.doctor}`,
        user.token
      );
      if (doctorResponse.message == "success") {
        setAttendeesList(doctorResponse.users);
      }
    };

    const getAllEvents = async () => {
      try {
        const response = await authFetch(
          `schedule/${user.hospitalID}/${user.id}/viewSchedule`,
          user.token
        );
        console.log("newEvent", response);
        if (response.status == 200) {
          const arr = response.data.map((eventData: any) => {
            const newEvent: Event = {
              id: eventData.pID,
              title:
                `PatientName: ${eventData.pName}\n` +
                `PatientId: ${eventData.pID}\n` +
                `Attendees: ${eventData.attendees}\n` +
                `Room Number: ${eventData.roomID}\n` +
                `Surgery Type: ${eventData.surgeryType}`,
              start: new Date(eventData.startTime),
              end: new Date(eventData.endTime),
              extendedProps: {
                patientId: eventData.pID,
                patientName: eventData.pName,
                attendees: eventData.attendees,
                surgeryType: eventData.surgeryType,
                roomNumber: eventData.roomNumber,
              },
            };
            return newEvent;
          });
          setEvents(arr);
        }
      } catch (error) {
        // console.log(error);
      }
    };

    getAllAttendees();
    getAllEvents();
  }, [user]);

  const handleSelect = (info: any) => {
    setSelectedDate(info.start);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
    setSelectedDate(null);
    setSelectedFromTime("");
    setSelectedToTime("");
    setFormErrors({});
  };

  const handleRoomNumberChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, roomNumber: e.target.value });
  };

  const handleAttendeesChange = (event: SelectChangeEvent<number[]>) => {
    const selectedUserIds = event.target.value as number[];
    const selectedAttendees = attendeesList?.filter((attendee) =>
      selectedUserIds.includes(attendee.id)
    );
    setFormData({ ...formData, attendees: selectedAttendees });
  };

  const validateForm = () => {
    let valid = true;
    const errors: Errors = {};

    // if (!formData.patientId) {
    //   errors.patientId = 'Patient ID is required';
    //   valid = false;
    // }
    // if (!formData.patientName) {
    //   errors.patientName = 'Patient Name is required';
    //   valid = false;
    // }
    // if (!formData.surgeryType) {
    //   errors.surgeryType = 'Surgery Type is required';
    //   valid = false;
    // }
    // if (!formData.patientAge) {
    //   errors.patientAge = 'Patient Age is required';
    //   valid = false;
    // }

    if (!formData.roomNumber) {
      errors.roomNumber = "Room Number is required";
      valid = false;
    }
    if (!selectedFromTime) {
      errors.fromTime = "From Time is required";
      valid = false;
    }
    if (!selectedToTime) {
      errors.toTime = "To Time is required";
      valid = false;
    }
    if (formData.attendees.length === 0) {
      errors.attendees = "At least one attendee is required";
      valid = false;
    }
    // if (formData.bloodRequired && !formData.bloodGroup) {
    //   errors.bloodGroup = "Blood Group is required if blood is required";
    //   valid = false;
    // }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD"); // Formats in local time

      const startTime = `${selectedDateStr}T${selectedFromTime.padStart(
        5,
        "0"
      )}`;
      const endTime = `${selectedDateStr}T${selectedToTime.padStart(5, "0")}`;

      const attendeesString = formData.attendees
        .map((attendee) => `${attendee.firstName} ${attendee.lastName}`)
        .join(", ");

      try {
        const response = await authPost(
          `schedule/${user.hospitalID}/${user.id}/${currentPatient.patientTimeLineID}/${currentPatient.id}/addSchedule`,
          {
            startTime: startTime,
            endTime: endTime,
            roomId: formData.roomNumber,
            attendees: attendeesString,
            baseURL: import.meta.env.VITE_BASE_URL,
          },
          user.token
        );
        if (response.status === 201) {
          dispatch(setSuccess("Scheduled Successfully"));
          navigate("../../");
          const newEvent: Event = {
            id: String(events.length),
            title:
              `PatientName: ${response.data[0].pName}\n` +
              `PatientId: ${response.data[0].pID}\n` +
              `Attendees: ${attendeesString}\n` +
              `Room Number: ${formData.roomNumber}\n` +
              `Surgery Type: ${response.data[0].surgeryType}`,
            start: new Date(startTime),
            end: new Date(endTime),
            extendedProps: {
              patientId: response.data[0].pID,
              patientName: response.data[0].pName,
              attendees: formData.attendees,
              surgeryType: response.data[0].surgeryType,
              roomNumber: formData.roomNumber,
            },
          };
          setEvents([...events, newEvent]);
        } else if (response.status === 403) {
          dispatch(setError("Already Scheduled"));
        } else {
          dispatch(setError("Scheduled Failed"));
        }
      } catch (err) {
        console.log(err);
      }
      handleClose();
    }
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);

  useEffect(() => {
    // Fetch user data and set here
    const getParamsPatientData = async () => {
      try {
        // const response = await authFetch("", user.token);
        setFormData((formData) => ({ ...formData }));
        setIsRetrievingParamsUser(false);
      } catch (err) {
        // console.log(err);
        setIsRetrievingParamsUser(false);
      }
    };
    getParamsPatientData();
  }, [setFormData, id, user]);

  useEffect(() => {
    // Trigger the next button on load (you can replace this with prev() if needed)
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
    }
  }, []);

  console.log("eventski", events);
  return (
    <>
      {id ? (
        <div
          style={{
            maxWidth: "1000px", // Full width of the parent
            height: "100vh", // Full viewport height
          }}
        >
          <Calendar
            localizer={localizer}
            selectable
            events={events}
            onSelectSlot={!isRetrievingParamsUser ? handleSelect : undefined} // Use onSelectSlot for selecting slots
            onSelectEvent={!isRetrievingParamsUser ? handleSelect : undefined} // Optionally handle event selection
            toolbar={true}
            eventPropGetter={() => ({
              style: {
                height: "100px", // Consistent event height
                backgroundColor: "#2196f3", // Blue background
                color: "#fff", // White text for contrast
                borderRadius: "5px", // Rounded corners
                padding: "5px", // Add spacing inside events
                boxSizing: "border-box",
              },
            })}
            dayPropGetter={() => ({
              style: {
                overflow: "hidden", // To ensure max events work
              },
            })}
          />
        </div>
      ) : (
        <div
          style={{
            maxWidth: "65vw", // Full width of the parent
            height: "100vh", // Full viewport height
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            onNavigate={setCurrentDate}
            style={{
              width: "90%", // Occupy 90% of the container width
              height: "80vh", // Adjust height dynamically
            }}
            toolbar={true}
            eventPropGetter={() => ({
              style: {
                height: "100px", // Consistent event height
                backgroundColor: "#2196f3", // Blue background
                color: "#fff", // White text for contrast
                borderRadius: "5px", // Rounded corners
                padding: "5px", // Add spacing inside events
                boxSizing: "border-box",
              },
            })}
          />
        </div>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Surgery</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" error={!!formErrors.roomNumber}>
            <InputLabel id="roomNumber-label">Room Number</InputLabel>
            <Select
              labelId="roomNumber-label"
              id="roomNumber"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleRoomNumberChange}
              input={<OutlinedInput label="Room Number" />}
            >
              <MenuItem value="101">101</MenuItem>
              <MenuItem value="102">102</MenuItem>
              <MenuItem value="103">103</MenuItem>
            </Select>
            <FormHelperText>{formErrors.roomNumber}</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="dense" error={!!formErrors.attendees}>
            <InputLabel id="attendees-label">Attendees</InputLabel>
            <Select
              labelId="attendees-label"
              id="attendees"
              name="attendees"
              multiple
              value={formData.attendees.map((attendee) => attendee.id)} // Attendee IDs array
              onChange={handleAttendeesChange}
              input={<OutlinedInput label="Attendees" />}
              renderValue={(selected) =>
                (selected as number[])
                  .map((id) =>
                    attendeesList?.find((attendee) => attendee.id === id)
                  )
                  .map((attendee) =>
                    attendee ? `${attendee.firstName} ${attendee.lastName}` : ""
                  )
                  .join(", ")
              }
            >
              {attendeesList?.map((attendee) => (
                <MenuItem key={attendee.id} value={attendee.id}>
                  <Checkbox
                    checked={formData.attendees.some(
                      (selectedAttendee) => selectedAttendee.id === attendee.id
                    )}
                  />
                  <ListItemText
                    primary={`${attendee.firstName} ${attendee.lastName}`}
                  />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formErrors.attendees}</FormHelperText>
          </FormControl>

          <TextField
            margin="dense"
            id="fromTime"
            name="fromTime"
            label="From Time"
            type="time"
            fullWidth
            value={selectedFromTime}
            onChange={(e) => setSelectedFromTime(e.target.value)}
            error={!!formErrors.fromTime}
            helperText={formErrors.fromTime}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
          <TextField
            margin="dense"
            id="toTime"
            name="toTime"
            label="To Time"
            type="time"
            fullWidth
            value={selectedToTime}
            onChange={(e) => setSelectedToTime(e.target.value)}
            error={!!formErrors.toTime}
            helperText={formErrors.toTime}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={debouncedHandleSubmit} color="primary">
            Add Surgery
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MySchedule;
