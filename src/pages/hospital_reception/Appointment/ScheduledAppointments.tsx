const data = [
  {
    id: 1,
    PatientName: "John Doe",
    AppointmentDate: "2025-01-02",
    Time: "10:30 AM",
    DoctorName: "Dr. Emily Carter",
    Department: "Cardiology",
    status: "Pending",
    Email: "johndoe@example.com",
    MobileNumber: 9876543210,
    service: "Consultation", // Updated service value
    age: "45", // Converted to string
    gender: 1
  },
  {
    id: 2,
    PatientName: "Jane Smith",
    AppointmentDate: "2025-01-03",
    Time: "11:00 AM",
    DoctorName: "Dr. Richard Brown",
    Department: "Orthopedics",
    status: "Pending",
    Email: "janesmith@example.com",
    MobileNumber: 9123456780,
    service: "Consultation", // Updated service value
    age: "34", // Converted to string
    gender: 1
  },
  {
    id: 3,
    PatientName: "Michael Johnson",
    AppointmentDate: "2025-01-04",
    Time: "02:00 PM",
    DoctorName: "Dr. Susan Lee",
    Department: "Dermatology",
    status: "Pending",
    Email: "michaeljohnson@example.com",
    MobileNumber: 9988776655,
    service: "Consultation", // Updated service value
    age: "52", // Converted to string
    gender: 1
  },
  {
    id: 4,
    PatientName: "Emily Davis",
    AppointmentDate: "2025-01-05",
    Time: "09:00 AM",
    DoctorName: "Dr. William Green",
    Department: "Pediatrics",
    status: "Pending",
    Email: "emilydavis@example.com",
    MobileNumber: 9345678901,
    service: "Consultation", // Updated service value
    age: "29", // Converted to string
    gender: 1
  },
  {
    id: 5,
    PatientName: "David Wilson",
    AppointmentDate: "2025-01-06",
    Time: "01:15 PM",
    DoctorName: "Dr. Angela White",
    Department: "Neurology",
    status: "Pending",
    Email: "davidwilson@example.com",
    MobileNumber: 9012345678,
    service: "Consultation", // Updated service value
    age: "37", // Converted to string
    gender: 1
  },
  {
    id: 6,
    PatientName: "Chris Brown",
    AppointmentDate: "2025-01-07",
    Time: "12:30 PM",
    DoctorName: "Dr. Angela White",
    Department: "Cardiology",
    status: "Pending",
    Email: "chrisbrown@example.com",
    MobileNumber: 9876012345,
    service: "Consultation", // Updated service value
    age: "41", // Converted to string
    gender: 1
  },
  {
    id: 7,
    PatientName: "Jessica Taylor",
    AppointmentDate: "2025-01-08",
    Time: "03:00 PM",
    DoctorName: "Dr. Emily Carter",
    Department: "Orthopedics",
    status: "Pending",
    Email: "jessicataylor@example.com",
    MobileNumber: 9765432109,
    service: "Consultation", // Updated service value
    age: "28", // Converted to string
    gender: 1
  },
  {
    id: 8,
    PatientName: "Daniel Martin",
    AppointmentDate: "2025-01-09",
    Time: "10:45 AM",
    DoctorName: "Dr. Susan Lee",
    Department: "Dermatology",
    status: "Pending",
    Email: "danielmartin@example.com",
    MobileNumber: 9988001122,
    service: "Consultation", // Updated service value
    age: "55", // Converted to string
    gender: 1
  },
  {
    id: 9,
    PatientName: "Sophia Brown",
    AppointmentDate: "2025-01-10",
    Time: "01:30 PM",
    DoctorName: "Dr. William Green",
    Department: "Pediatrics",
    status: "Pending",
    Email: "sophiabrown@example.com",
    MobileNumber: 9876543110,
    service: "Consultation", // Updated service value
    age: "31", // Converted to string
    gender: 1
  },
  {
    id: 10,
    PatientName: "Oliver Scott",
    AppointmentDate: "2025-01-11",
    Time: "02:15 PM",
    DoctorName: "Dr. Emily Carter",
    Department: "Cardiology",
    status: "Pending",
    Email: "oliverscott@example.com",
    MobileNumber: 9765401122,
    service: "Consultation", // Updated service value
    age: "47", // Converted to string
    gender: 1
  }
];

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  TablePagination,
  Box,
  Typography,
  Modal
} from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import styles from "../../hospital_pharmacy/OrderManagement/OuterTable.module.scss";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { makeStyles } from "@mui/styles";
import search_icon from "../../../../src/assets/sidebar/search_icon.png";

import { setRescheduledata } from "../../../store/appointment/currentAppointment.action";
import { useDispatch } from "react-redux";
import { RescheduleDataType } from "../../../types";

interface Appointment {
  id: number;
  PatientName: string;
  AppointmentDate: string;
  Time: string;
  DoctorName: string;
  Department: string;
  status: string;
}

const useStyles = makeStyles(() => ({
  customCalendar: {
    "& .MuiPickersCalendar-root": {
      width: "400px",
      height: "400px",
      padding: "12px"
    }
  }
}));

interface ScheduledAppointmentsProps {
  callBackActiveTabFunction: (newTab: string) => void; // Define the function type
}
const ScheduledAppointments: React.FC<ScheduledAppointmentsProps> = ({
  callBackActiveTabFunction
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const rowsPerPage = 10;
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);

  const classes = useStyles();
  const dispatch = useDispatch();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    // if (date) {
    //   fetchPatients(date);
    // }
    setOpenCalendar(false); // Close calendar after selecting date
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setAppointments((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
    );
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    console.log(event);
    setCurrentPage(newPage);
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.PatientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedAppointments = filteredAppointments.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const handleOpenCalendar = () => {
    setOpenCalendar(true);
  };

  const handleCloseCalendar = () => {
    setOpenCalendar(false);
  };

  const handleReschedule = (row: any) => {
    // Map the row data to the RescheduleDataType format
    const data: RescheduleDataType = {
      id: row.id || 0, // Use `row.id` or fallback to 0
      // department: row.Department ? parseInt(row.Department, 10) : null, // Convert department if needed
      // doctorName: row.DoctorName ? parseInt(row.DoctorName, 10) : null, // Convert doctor name if needed
      department: 239,
      doctorName: 487, // Convert doctor name if needed
      services: row.service || "Unknown", // Default to "Unknown"
      pName: row.PatientName || "Unknown", // Default to "Unknown"
      age: row.age, // Assuming age is not available in the row data
      gender: row.gender, // Assuming gender is not available in the row data
      mobileNumber: row.MobileNumber || 0, // Fallback to 0
      email: row.Email || "unknown@example.com" // Fallback to default email
    };

    // Dispatch action to set reschedule data
    dispatch(setRescheduledata({ currentRescheduledData: data }));
    callBackActiveTabFunction("BookAppointment");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          padding: "15px"
        }}
      >
        <div
          style={{
            display: "flex",
            marginBottom: "1rem",
            gap: "1rem",
            borderRadius: "30px"
          }}
        >
          <TextField
            placeholder="Search by mobile number"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ flex: 1 }}
            InputProps={{
              startAdornment: (
                <img
                  src={search_icon}
                  alt="search"
                  style={{ marginRight: "8px" }}
                />
              ),
              style: {
                borderRadius: "50px",
                padding: "5px",
                width: "50%"
              }
            }}
          />

          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            p={1}
            sx={{
              backgroundColor: "white",
              borderRadius: "35px",
              cursor: "pointer",
              border: "1px solid gray"
            }}
            onClick={handleOpenCalendar}
          >
            <CalendarTodayIcon />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              {selectedDate ? selectedDate.format("DD/MM/YYYY") : "Select Date"}
            </Typography>
          </Box>
        </div>

        <TableContainer component={Paper} style = {{borderRadius:"25px", height:"90vh"}}>
          <Table>
            <TableHead style={{ borderTop: "0px solid #023f80" }}>
              <TableRow className={styles.header} style ={{background:"#1977F3"}}>
                <TableCell style={{ color: "white", fontSize:"16px" }}>Appointment ID</TableCell>
                <TableCell style={{ color: "white",  fontSize:"16px" }}>Patient Name</TableCell>
                <TableCell style={{ color: "white", fontSize:"16px" }}>
                  Appointment Date
                </TableCell>
                <TableCell style={{ color: "white", fontSize:"16px" }}>Time</TableCell>
                <TableCell style={{ color: "white", fontSize:"16px" }}>Doctor Name</TableCell>
                <TableCell style={{ color: "white",fontSize:"16px" }}>Department</TableCell>
                <TableCell style={{ color: "white", fontSize:"16px" }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: "center" }}>
                    No appointments found!
                  </TableCell>
                </TableRow>
              )}
              {paginatedAppointments.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.PatientName}</TableCell>
                  <TableCell>{row.AppointmentDate}</TableCell>
                  <TableCell>{row.Time}</TableCell>
                  <TableCell>{row.DoctorName}</TableCell>
                  <TableCell>{row.Department}</TableCell>
                  <TableCell>
                    <Select
                      value={row.status}
                      onChange={(e) =>
                        handleStatusChange(row.id, e.target.value)
                      }
                      size="small"
                      style={{ borderRadius: "30px" }}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem
                        value="Reschedule"
                        onClick={() => handleReschedule(row)}
                      >
                        Reschedule
                      </MenuItem>
                      <MenuItem value="Cancel">Cancel</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={filteredAppointments.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={(event, newPage) => handleChangePage(event, newPage)} 
        />
      </div>
      <Modal open={openCalendar} onClose={handleCloseCalendar}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
            width: "100%" // Full width
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: 4,
              boxShadow: 3
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                className={classes.customCalendar}
                shouldDisableDate={(date) => date.isAfter(dayjs())}
                sx={{
                  fontSize: "1.2rem",
                  width: "100%",
                  height: "100%"
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default ScheduledAppointments;
