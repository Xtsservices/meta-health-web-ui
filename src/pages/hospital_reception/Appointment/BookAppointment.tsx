import React, { useEffect } from "react";
import styles from "./appointmet.module.scss";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { Typography, Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import appointmentImg from "../../../assets/reception/appointment.gif.gif";
import {
  departmentType,
  doctorAppointmentDetailType,
  RescheduleDataType,
  staffType,
} from "../../../types";
import { authFetch } from "../../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { Role_NAME } from "../../../utility/role";
import AppointmentSlots from "./AppointmentSlots";
import { selectCurrAppointmentData } from "../../../store/appointment/currentAppointment.selector";
import { setRescheduledata } from "../../../store/appointment/currentAppointment.action";
interface Slot {
  date: string;
  time: string;
  bookedIds: string[];
  availableSlots: number;
}

interface SlotTiming {
  to: string;
  day: string;
  from: string;
  hours: number;
  persons: number;
  date: string;
  slots: Slot[];
}

interface DayToggles {
  [day: string]: boolean;
}

interface AppointmentEntry {
  id: number;
  doctorID: number;
  hospitalID: number;
  slotTimings: SlotTiming[];
  dayToggles: DayToggles;
  addedOn: string;
  updatedOn: string;
  addedBy: number;
}

const slotData = [
  {
    id: 3,
    doctorID: 487,
    hospitalID: 140,
    slotTimings: [
      {
        to: "18:30",
        day: "Monday",
        date: "2024-12-23",
        from: "09:00",
        hours: 1,
        slots: [
          {
            date: "2024-12-23",
            time: "09:00",
            bookedIds: [],
            availableSlots: 0,
          },
          {
            date: "2024-12-23",
            time: "10:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-23",
            time: "11:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-23",
            time: "12:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-23",
            time: "13:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-23",
            time: "14:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-23",
            time: "15:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-23",
            time: "16:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-23",
            time: "17:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-23",
            time: "18:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-23",
            time: "18:30",
            bookedIds: [],
            availableSlots: 2,
          },
        ],
        persons: 5,
      },
      {
        to: "18:30",
        day: "Tuesday",
        date: "2024-12-24",
        from: "09:00",
        hours: 1,
        slots: [
          {
            date: "2024-12-24",
            time: "09:00",
            bookedIds: [],
            availableSlots: 0,
          },
          {
            date: "2024-12-24",
            time: "11:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-24",
            time: "12:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-24",
            time: "13:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-24",
            time: "14:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-24",
            time: "15:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-24",
            time: "16:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-24",
            time: "17:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-24",
            time: "18:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-24",
            time: "18:30",
            bookedIds: [],
            availableSlots: 2,
          },
        ],
        persons: 5,
      },
      {
        to: "18:30",
        day: "Wednesday",
        date: "2024-12-25",
        from: "09:00",
        hours: 1,
        slots: [
          {
            date: "2024-12-25",
            time: "09:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-25",
            time: "10:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-25",
            time: "11:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-25",
            time: "12:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-25",
            time: "13:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-25",
            time: "14:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-25",
            time: "15:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-25",
            time: "16:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-25",
            time: "17:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-25",
            time: "18:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-25",
            time: "18:30",
            bookedIds: [],
            availableSlots: 2,
          },
        ],
        persons: 5,
      },
      {
        to: "18:30",
        day: "Thursday",
        date: "2024-12-26",
        from: "09:00",
        hours: 1,
        slots: [
          {
            date: "2024-12-26",
            time: "09:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-26",
            time: "10:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-26",
            time: "11:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-26",
            time: "12:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-26",
            time: "13:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-26",
            time: "14:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-26",
            time: "15:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-26",
            time: "16:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-26",
            time: "17:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-26",
            time: "18:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-26",
            time: "18:30",
            bookedIds: [],
            availableSlots: 2,
          },
        ],
        persons: 5,
      },
      {
        to: "18:30",
        day: "Friday",
        date: "2024-12-20",
        from: "09:00",
        hours: 1,
        slots: [
          {
            date: "2024-12-20",
            time: "09:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-20",
            time: "10:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-20",
            time: "11:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-20",
            time: "12:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-20",
            time: "13:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-20",
            time: "14:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-20",
            time: "15:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-20",
            time: "16:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-20",
            time: "17:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-20",
            time: "18:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-20",
            time: "18:30",
            bookedIds: [],
            availableSlots: 2,
          },
        ],
        persons: 5,
      },
      {
        to: "18:30",
        day: "Saturday",
        date: "2024-12-21",
        from: "09:00",
        hours: 1,
        slots: [
          {
            date: "2024-12-21",
            time: "09:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-21",
            time: "10:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-21",
            time: "11:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-21",
            time: "12:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-21",
            time: "13:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-21",
            time: "14:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-21",
            time: "15:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-21",
            time: "16:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-21",
            time: "17:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-21",
            time: "18:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-21",
            time: "18:30",
            bookedIds: [],
            availableSlots: 2,
          },
        ],
        persons: 5,
      },
      {
        to: "18:30",
        day: "Sunday",
        date: "2024-12-22",
        from: "09:00",
        hours: 1,
        slots: [
          {
            date: "2024-12-22",
            time: "09:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-22",
            time: "10:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-22",
            time: "11:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-22",
            time: "12:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-22",
            time: "13:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-22",
            time: "14:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-22",
            time: "15:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-22",
            time: "16:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-22",
            time: "17:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-22",
            time: "18:00",
            bookedIds: [],
            availableSlots: 5,
          },
          {
            date: "2024-12-22",
            time: "18:30",
            bookedIds: [],
            availableSlots: 2,
          },
        ],
        persons: 5,
      },
    ],
    dayToggles: {
      Friday: true,
      Monday: true,
      Sunday: true,
      Tuesday: true,
      Saturday: true,
      Thursday: true,
      Wednesday: true,
    },
    addedOn: "2024-12-20T01:22:01.000Z",
    updatedOn: "2024-12-21T02:56:10.000Z",
    addedBy: 378,
  },
];

const BookAppointment = () => {
  const dispatch = useDispatch();

  const [, setGender] = React.useState<number>(0);
  const [open, setOpen] = React.useState(false);
  const [rescheduleActive, setRescheduleActive] = React.useState(false);
  const [departments, setDepartments] = React.useState<departmentType[]>([]);
  const [doctorList, setDoctorList] = React.useState<staffType[]>([]);
  const [filteredDoctors, setFilteredDoctors] = React.useState<staffType[]>([]);
  const [appointmentData, setAppointmentData] = React.useState<
    AppointmentEntry[]
  >([]);

  const user = useSelector(selectCurrentUser);
  const rescheduleAppointmentData = useSelector(selectCurrAppointmentData);
  const genderList = [
    { value: "Male", key: 1 },
    { value: "Female", key: 2 },
    { value: "Others", key: 3 },
  ];

  const [appointmentFormData, setAppointmentFormData] =
    React.useState<doctorAppointmentDetailType>({
      department: {
        valid: false,
        value: -1,
        showError: false,
        message: "",
      },
      doctorName: {
        valid: true,
        value: -1,
        showError: false,
        message: "",
      },
      services: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      gender: {
        valid: false,
        value: -1,
        showError: false,
        message: "",
      },

      pName: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },

      age: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },

      date: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },

      timeSlot: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },

      mobileNumber: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },

      email: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },

      departmentID: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },
    });

  // const getAppoinmentData = async (doctorID: number) => {
  //   const response = await authFetch(
  //     `doctor/${user.hospitalID}/${doctorID}/getDoctorAppointmentsdata`,
  //     user.token
  //   );
  //   // console.log("getDoctorAppointmentsdata", response)
  //   if (response.message == "success") {
  //     const data = response.data;
  //     setAppointmentData(data);
  //   }
  // };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const isvalid = true;
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    const name = event.target.name;

    if (name === "department") {
      const departmentID = Number(event.target.value);
      const filteredData = doctorList.filter(
        (each) => each.departmentID === departmentID
      );
      setFilteredDoctors(filteredData);
    }
    if (name === "doctorName") {
      // const doctorID = Number(event.target.value);
      setAppointmentData(slotData);

      // getAppoinmentData(doctorID) === keep it dont delete
    }

    setAppointmentFormData((state) => {
      return {
        ...state,
        [name]: {
          valid: isvalid,
          showError,
          value: event.target.value,
          message,
          name,
        },
      };
    });
  };

  const handleClick = (value: string) => {
    let genderValue: number;
    if (value === "Male") {
      genderValue = 1;
    } else if (value === "Female") {
      genderValue = 2;
    } else {
      genderValue = 3;
    }

    setGender(genderValue);

    setAppointmentFormData((prevFormData) => ({
      ...prevFormData,
      gender: {
        value: genderValue,
        name: "gender",
        message: "",
        valid: true,
        showError: false,
      },
    }));
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let isvalid = event.target.validity.valid;
    const showError = !isvalid;
    const name = event.target.name;
    const message = "This field is required";
    let value: string | number;
    value = event.target.value;
    const nameregex = /^[A-Za-z\s]*$/;
    if (event.target.validity.stepMismatch) {
      isvalid = true;
    }

    if (name === "pName") {
      if (
        nameregex.test(event.target.value) &&
        event.target.value.length < 50
      ) {
        value = event.target.value;
      } else {
        return;
      }
    } else if (name === "mobileNumber" || name === "mobileNumber") {
      value = event.target.value.replace(/\D/g, "");
    }

    setAppointmentFormData((state) => {
      return {
        ...state,
        [name]: {
          valid: isvalid,
          showError,
          value,
          message,
          name,
        },
      };
    });
  };

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const getAllDepartment = async () => {
      const response = await authFetch(
        `department/${user.hospitalID}`,
        user.token
      );
      if (response?.message == "success") {
        setDepartments(response.departments);
      } else {
        // console.log("error occured in fetching data", response);
      }
    };

    const getDocList = async () => {
      const doctorResponse = await authFetch(
        `user/${user.hospitalID}/list/${Role_NAME.doctor}`,
        user.token
      );
      if (doctorResponse.message == "success") {
        setDoctorList(doctorResponse.users);
        setFilteredDoctors(doctorResponse.users);
      }
    };

    if (user?.token) {
      getAllDepartment();
      getDocList();
    }
  }, [user?.token]);

  const handleSlotChange = () => {
    const isvalid = true;
    console.log(isvalid)
  };

  const resetAppointmentForm = () => {
    setAppointmentFormData({
      department: {
        valid: false,
        value: -1,
        showError: false,
        message: "",
      },
      doctorName: {
        valid: true,
        value: -1,
        showError: false,
        message: "",
      },
      services: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      gender: {
        valid: false,
        value: -1,
        showError: false,
        message: "",
      },
      pName: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      age: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      date: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      timeSlot: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },
      mobileNumber: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      email: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      departmentID: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },
    });
  };

  const handleSubmitAppointment = async () => {
    // handleClickOpen();
    // Map the row data to the RescheduleDataType format
    const data: RescheduleDataType = {
      id: 0,
      department: null,
      doctorName: null,
      services: "",
      pName: "",
      age: "",
      gender: 0,
      mobileNumber: null,
      email: "",
    };

    // Dispatch action to set reschedule data
    dispatch(setRescheduledata({ currentRescheduledData: data }));

    setRescheduleActive(false);
    resetAppointmentForm();
  };


  useEffect(() => {
    if (rescheduleAppointmentData?.pName) {
      setRescheduleActive(true);
      setAppointmentFormData((prevState) => ({
        ...prevState,
        department: {
          ...prevState.department,
          value:
            typeof rescheduleAppointmentData.department === "string"
              ? parseInt(rescheduleAppointmentData.department, 10) || null // Convert string to number or null
              : rescheduleAppointmentData.department || null,
          valid: !!rescheduleAppointmentData.department,
        },
        doctorName: {
          ...prevState.doctorName,
          value: rescheduleAppointmentData.doctorName || null, // Ensure this is either a string or null
          valid: !!rescheduleAppointmentData.doctorName,
        },
        services: {
          ...prevState.services,
          value: rescheduleAppointmentData.services || "",
          valid: !!rescheduleAppointmentData.services,
        },
        gender: {
          ...prevState.gender,
          value: rescheduleAppointmentData.gender ?? -1, // Use nullish coalescing to ensure valid fallback
          valid:
            rescheduleAppointmentData.gender !== undefined &&
            rescheduleAppointmentData.gender !== -1,
        },
        pName: {
          ...prevState.pName,
          value: rescheduleAppointmentData.pName || "",
          valid: !!rescheduleAppointmentData.pName,
        },
        age: {
          ...prevState.age,
          value: rescheduleAppointmentData.age || "", // Ensure this is a string
          valid: !!rescheduleAppointmentData.age,
        },
        mobileNumber: {
          ...prevState.mobileNumber,
          value: rescheduleAppointmentData.mobileNumber || null, // Ensure this is a number or null
          valid: !!rescheduleAppointmentData.mobileNumber,
        },
        email: {
          ...prevState.email,
          value: rescheduleAppointmentData.email || "",
          valid: !!rescheduleAppointmentData.email,
        },
      }));
    }
  }, [rescheduleAppointmentData]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <h3 className={styles.heading}>Select Appointment Schedule</h3>
        <div className={styles.subContainer}>
          <Grid container columnSpacing={9} rowSpacing={2}>
            <Grid item xs={8}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel>Select Department</InputLabel>
                <Select
                  label="Select Department"
                  name="department"
                  onChange={handleSelectChange}
                  value={String(appointmentFormData.department.value) || "0"}
                  error={appointmentFormData.department.showError}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Doctor Selection */}
            <Grid item xs={8}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  label="Select Doctor"
                  name="doctorName"
                  onChange={handleSelectChange}
                  value={String(appointmentFormData.doctorName.value) || "0"}
                  error={appointmentFormData.doctorName.showError}
                >
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        {doctor.firstName} {doctor.lastName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      No doctors available for this department
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Services Dropdown */}
            <Grid item xs={8}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel>Select Service</InputLabel>
                <Select
                  label="Select Service"
                  name="services"
                  onChange={handleSelectChange}
                  value={appointmentFormData.services.value || ""}
                  error={appointmentFormData.services.showError}
                >
                  <MenuItem value="Consultation">Consultation</MenuItem>
                  <MenuItem value="Routine Checkup">Routine Checkup</MenuItem>
                  <MenuItem value="Emergency">Emergency</MenuItem>
                  <MenuItem value="Follow-Up">Follow-Up</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {appointmentData.length>0 && (
              <Grid item xs={12}>
              <Typography variant="h6" className={styles.timeSlotsHeading}>
                Select Time Appointment
              </Typography>
              <hr className={styles.hrline} />
              <AppointmentSlots
                    data={appointmentData}
                    handleSlotChange={handleSlotChange}
                  />
                    </Grid>

            )}
            

              
          

            <Grid item xs={8}>
              <TextField
                label="Patient Name"
                variant="outlined"
                fullWidth
                required
                name="pName"
                error={
                  !appointmentFormData.pName.valid &&
                  appointmentFormData.pName.showError
                }
                onChange={handleTextChange}
                helperText={
                  appointmentFormData.pName.showError &&
                  appointmentFormData.pName.message
                }
                value={appointmentFormData.pName.value}
              />
            </Grid>

            <Grid item xs={8}>
              <TextField
                label="Age"
                variant="outlined"
                fullWidth
                required
                name="age"
                error={
                  !appointmentFormData.age.valid &&
                  appointmentFormData.age.showError
                }
                onChange={handleTextChange}
                helperText={
                  appointmentFormData.age.showError &&
                  appointmentFormData.age.message
                }
                value={appointmentFormData.age.value}
              />
            </Grid>

            <Grid item xs={11}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                columnGap={2}
              >
                Gender*
                {genderList.map((el) => (
                  <Chip
                    key={el.key}
                    label={el.value}
                    onClick={() => handleClick(el.value)}
                    color={
                      appointmentFormData.gender.value === el.key
                        ? "primary"
                        : "default"
                    }
                    sx={{ boxSizing: "border-box", padding: "10px 20px" }}
                  />
                ))}
              </Stack>

              <p style={{ color: "#d84315", fontSize: "12px" }}>
                {appointmentFormData.gender.showError && "Please Select Gender"}
              </p>
            </Grid>

            <Grid item xs={8}>
              <TextField
                label="Mobile Number"
                variant="outlined"
                fullWidth
                name="mobileNumber"
                error={
                  !appointmentFormData.mobileNumber.valid &&
                  appointmentFormData.mobileNumber.showError
                }
                onChange={handleTextChange}
                helperText={
                  appointmentFormData.mobileNumber.showError &&
                  appointmentFormData.mobileNumber.message
                }
                value={appointmentFormData.mobileNumber.value}
                type="tel"
                inputProps={{
                  pattern: "[0-9]{10}",
                  maxLength: 10,
                }}
              />
            </Grid>

            <Grid item xs={8}>
              <TextField
                label="Email ID"
                variant="outlined"
                type="email"
                fullWidth
                name="email"
                required
                onChange={handleTextChange}
                error={
                  !appointmentFormData.email.valid &&
                  appointmentFormData.email.showError
                }
                helperText={
                  appointmentFormData.email.showError &&
                  appointmentFormData.email.message
                }
                value={appointmentFormData.email.value}
              />
            </Grid>

            <Grid item xs={8} sx={{ mt: "30px" }}>
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                  variant="contained"
                  sx={{ ml: "auto" }}
                  onClick={handleSubmitAppointment}
                >
                  {rescheduleActive ? "Reschedule" : "Submit"}
                </Button>
              </Stack>
            </Grid>

            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ textAlign: "center", p: 4 }}>
                <img src={appointmentImg} alt="" />
                <Typography variant="h6">
                  Appointment Scheduled Successfully
                </Typography>
              </DialogContent>
            </Dialog>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
