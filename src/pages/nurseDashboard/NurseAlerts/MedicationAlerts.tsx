import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Modal,
  Button 
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import styles from "./PatientsAlerts.module.scss";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { setError, setLoading } from "../../../store/error/error.action";
import { authFetch } from "../../../axios/useAuthFetch";
import NotificationDialog from "../../hospital_staff/InpatientList/NotificationDialog";
import { capitalizeFirstLetter } from "../../../utility/global";

interface Medication {
  patientId: number;
  pName: string;
  ward: string;
  department: string;
  medicationTime: string;
  dosageTimes: string;
  timeLine:number;
}


const useStyles = makeStyles(() => ({
  customCalendar: {
    "& .MuiPickersCalendar-root": {
      width: "400px",
      height: "400px",
      padding: "12px",
    },
  },
}));

interface MedicationAlertsProps {
  name: "MedicationAlerts" | "MedicationMissedAlerts";
}


const MedicationAlerts = ({ name }: MedicationAlertsProps) => {
  const [appointments, setAppointments] = useState<Medication[]>([]);
  const [searchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const rowsPerPage = 10;
  const classes = useStyles();
  const [selectedPatient, setSelectedPatient] = useState<Medication | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const user = useSelector(selectCurrentUser);

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setOpenCalendar(false);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await authFetch(
          `/nurse/getpatientsmedicationalerts/${user?.hospitalID}/${user?.role}`,
          user?.token
        );
        
        if (response.message !== "success") {
          throw new Error('Failed to fetch medication alerts');
        }
        
        const result = await response;
        let data: Medication[] = name === "MedicationMissedAlerts"
          ? result.data.medicationMissedAlerts
          : result.data.medicationAlerts;

        // Process data to check for missed alerts
        const currentTime = dayjs();
        console.log("Current Time:", currentTime.format("hh:mm A")); // Log current time

        // Compute missed alerts from medicationAlerts
        const missedAlerts: Medication[] = [];
        const medicationAlerts = result.data.medicationAlerts || [];

        medicationAlerts.forEach((appointment: Medication) => {
          // Extract the second time from medicationTime (e.g., "10:00 AM - 11:00 AM" -> "11:00 AM")
          const secondTimeStr = appointment.medicationTime.split("-")[1]?.trim().split(" ")[0] + " " + appointment.medicationTime.split("-")[1]?.trim().split(" ")[1];
          const secondTime = dayjs(secondTimeStr, "hh:mm A");

          // Compare second time with current time
          if (secondTime.isBefore(currentTime)) {
            missedAlerts.push(appointment);
          }
        });

        if (name === "MedicationMissedAlerts") {
          // Combine backend medicationMissedAlerts with computed missedAlerts
          const combinedMissedAlerts = [...data, ...missedAlerts];
          // Remove duplicates based on patientId and dosageTimes
          const uniqueMissedAlerts = Array.from(
            new Map(
              combinedMissedAlerts.map((item: Medication) => [`${item.patientId}-${item.dosageTimes}`, item])
            ).values()
          ) as Medication[];
          data = uniqueMissedAlerts;
        } else {
          // For MedicationAlerts, remove missed alerts from medicationAlerts
          const missedAlertKeys = new Set(
            missedAlerts.map((item: Medication) => `${item.patientId}-${item.dosageTimes}`)
          );
          data = data.filter(
            (item: Medication) => !missedAlertKeys.has(`${item.patientId}-${item.dosageTimes}`)
          );
          console.log("Computed Missed Alerts:", missedAlerts);
        }

          
        setAppointments(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.hospitalID, user?.role, name]);


  const handleViewClick = (patient: Medication) => {
    setSelectedPatient(patient); 
    setOpenDialog(true); 
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const calculateTimeElapsed = (medicationTime: string) => {
    // Extract the second time from the medicationTime string
    const secondTime = medicationTime.split('-')[1].trim().split(' ')[0] + ' ' + medicationTime.split('-')[1].trim().split(' ')[1];
  
    // Get the current time
    const now = dayjs();
  
    // Parse the second time using dayjs
    const dosageTime = dayjs(secondTime, 'hh:mm A');
  
    // Calculate the difference in minutes
    const diffMinutes = now.diff(dosageTime, 'minute');
  
    // Convert the difference to hours and minutes
    if (diffMinutes < 60) {
      return `${diffMinutes} Minutes`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      return `${diffHours} Hour${diffHours > 1 ? 's' : ''} ${remainingMinutes} Minute${remainingMinutes > 1 ? 's' : ''}`;
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    console.log("event",event)
    setCurrentPage(newPage);
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.pName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedAppointments = filteredAppointments.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const handleCloseCalendar = () => {
    setOpenCalendar(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ borderTop: "5px solid #FDFDFF" }}>
              <TableRow className={styles.header}>
                <TableCell style={{ color: "black" }}>Patient Id</TableCell>
                <TableCell style={{ color: "black" }}>Patient Name</TableCell>
                <TableCell style={{ color: "black" }}>Ward</TableCell>
                <TableCell style={{ color: "black" }}>Schedule Time</TableCell>
                {name === "MedicationMissedAlerts" ? (
                  <TableCell style={{ color: "black" }}>Time Elapsed</TableCell>
                ) : null}
                <TableCell style={{ color: "black" }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={name === "MedicationMissedAlerts" ? 6 : 5} style={{ textAlign: "center" }}>
                    No Alerts Found!
                  </TableCell>
                </TableRow>
              )}
              {paginatedAppointments.map((row) => (
                <TableRow key={`${row.patientId}-${row.dosageTimes}`}>
                <TableCell>{row.patientId}</TableCell>
                <TableCell>{capitalizeFirstLetter(row.pName)}</TableCell>
                <TableCell>{capitalizeFirstLetter(row.ward)}</TableCell>
                <TableCell>{row.medicationTime}</TableCell>
                {name === "MedicationMissedAlerts" ? (
                  <TableCell>{calculateTimeElapsed(row.medicationTime)}</TableCell>
                ) : null}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ textTransform: "none", borderRadius: "8px" }}
                    onClick={() => handleViewClick(row)}
                  >
                    View
                  </Button>
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
          onPageChange={handleChangePage}
        />
        {selectedPatient && (
          <NotificationDialog
            open={openDialog}
            setOpen={handleCloseDialog}
            timelineID={selectedPatient.timeLine} 
            name={selectedPatient.pName} 
          />
        )}
      </div>
      <Modal open={openCalendar} onClose={handleCloseCalendar}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <Box
            sx={{
              backgroundColor: "black",
              borderRadius: "8px",
              padding: 4,
              boxShadow: 3,
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
                  height: "100%",
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default MedicationAlerts;