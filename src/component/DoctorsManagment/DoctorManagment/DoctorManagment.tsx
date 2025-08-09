import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  TextField,
  TablePagination,
  Button,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import styles from "../../../pages/nurseDashboard/NurseManagment/Nursemanagment.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CustomInput = React.forwardRef(({ value, onClick }: any, ref: any) => (
  <input
    className={styles.datePicker}
    onClick={onClick}
    ref={ref}
    value={value}
    placeholder="Select a date range"
    readOnly
  />
));

const DoctorManagment = () => {
  const datePickerRef = useRef<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [fromTime, setFromTime] = useState({
    hour: "",
    minute: "",
    ampm: "AM",
  });
  const [toTime, setToTime] = useState({
    hour: "",
    minute: "",
    ampm: "PM",
  });

  const handleTimeChange = (
    type: "from" | "to",
    field: "hour" | "minute" | "ampm",
    value: string
  ) => {
    if (type === "from") {
      setFromTime((prev) => ({ ...prev, [field]: value }));
    } else {
      setToTime((prev) => ({ ...prev, [field]: value }));
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const [nurseData, setNurseData] = useState([
    {
      empId: "141513",
      name: "Kavya",
      fromDate: "2024-11-06",
      toDate: "2024-11-30",
      shift: "Other",
      fromTiming: "09:00 AM",
      toTiming: "06:00 PM",
      service: "IPD",
      department: "--",
      ward: "ICU",
    },
  ]);

  const nurseNames = [
    { id: 1, name: "Doctor Alice" },
    { id: 2, name: "Doctor Bob" },
    { id: 3, name: "Doctor Charlie" },
    { id: 4, name: "Doctor Diana" },
    { id: 5, name: "Doctor Emma" },
    { id: 6, name: "Doctor Frank" },
    { id: 7, name: "Doctor Grace" },
  ];
useEffect(()=>{
  setNurseData(nurseData)
},[])
  const [filters, setFilters] = useState({
    name: "",
    service: "",
    ward: "",
    department:"",
    shift: "",
    fromDate: "",
    toDate: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const handleFilterChange = (field: string, value: string) => {
    if (field === "shift") {
      setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
      if (value === "Custom") {
        setOpenModal(true);
      }
    } else {
      setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
    }
  };

  const handleChangePage = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const paginatedNurseData = nurseData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <div className={styles["nurse-management"]}>
      <div className={styles["filter-section"]}>
        <Grid container spacing={2}>
          {/* Doctor Name */}
          <Grid item xs={12} sm={6} md={2}>
            <label>Select Doctor</label>
            <Select
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              displayEmpty
              variant="outlined"
              size="small"
              fullWidth
            >
              <MenuItem value="">Select Doctor</MenuItem>
              {nurseNames.map((nurse) => (
                <MenuItem key={nurse.id} value={nurse.name}>
                  {nurse.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Service */}
          <Grid item xs={12} sm={6} md={2}>
            <label>Service</label>
            <Select
              value={filters.service}
              onChange={(e) => handleFilterChange("service", e.target.value)}
              displayEmpty
              variant="outlined"
              size="small"
              fullWidth
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="IPD">IPD</MenuItem>
              <MenuItem value="OPD">OPD</MenuItem>
            </Select>
          </Grid>

         
          <Grid item xs={12} sm={6} md={2}>
              <label>Department</label>
              <Select
                value={filters.department}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
                displayEmpty
                variant="outlined"
                size="small"
                fullWidth
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Cardiology">Cardiology</MenuItem>
                <MenuItem value="Orthopedic">Orthopedic</MenuItem>
              </Select>
            </Grid>

          {filters?.service === "IPD" && (
            <Grid item xs={12} sm={6} md={2}>
              <label>Ward</label>
              <Select
                value={filters.ward}
                onChange={(e) => handleFilterChange("ward", e.target.value)}
                displayEmpty
                variant="outlined"
                size="small"
                fullWidth
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="ICU">ICU</MenuItem>
                <MenuItem value="General">General</MenuItem>
              </Select>
            </Grid>
          )}

          {/* From Date and to date */}
          <Grid item xs={12} sm={6} md={2}>
            <label>Date</label>
            <Grid container alignItems="center" className={styles.calendar}>
              <Grid item xs>
                <DatePicker
                  ref={datePickerRef}
                  selected={startDate}
                  onChange={(dates: [Date | null, Date | null]) => {
                    const [start, end] = dates;
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  selectsRange
                  isClearable
                  placeholderText="Select a date range"
                  customInput={<CustomInput />}
                  dateFormat="MM/dd/yyyy" // Adjust date format as needed
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Shift */}
          <Grid item xs={12} sm={6} md={2}>
            <label>Shift</label>
            <Select
              value={filters.shift}
              onChange={(e) => handleFilterChange("shift", e.target.value)}
              displayEmpty
              variant="outlined"
              size="small"
              fullWidth
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="shift1">Shift 1 (07:00 AM - 03:00 PM)</MenuItem>
              <MenuItem value="shift2">Shift 2 (07:00 PM - 11:00 PM)</MenuItem>
              <MenuItem value="shift3">Shift 3 (11:00 PM - 03:00 AM)</MenuItem>
              <MenuItem value="Custom">
                {fromTime.hour && toTime.hour
                  ? `${fromTime.hour}:${fromTime.minute} ${fromTime.ampm} - ${toTime.hour}:${toTime.minute} ${toTime.ampm}`
                  : "Custom"}
              </MenuItem>
            </Select>
          </Grid>

          {/* Custom Time Modal */}
          <Dialog open={openModal} onClose={closeModal} maxWidth="xs" fullWidth>
            <DialogTitle>Select Custom Timing</DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column" gap={3}>
                {/* From Time */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>From time</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      value={fromTime.hour}
                      onChange={(e) =>
                        handleTimeChange("from", "hour", e.target.value)
                      }
                      inputProps={{ maxLength: 2 }}
                      size="small"
                      variant="outlined"
                      style={{ width: "50px" }}
                      placeholder="09"
                    />
                    :
                    <TextField
                      value={fromTime.minute}
                      onChange={(e) =>
                        handleTimeChange("from", "minute", e.target.value)
                      }
                      inputProps={{ maxLength: 2 }}
                      size="small"
                      variant="outlined"
                      style={{ width: "50px" }}
                      placeholder="00"
                    />
                    <Select
                      value={fromTime.ampm}
                      onChange={(e) =>
                        handleTimeChange("from", "ampm", e.target.value)
                      }
                      size="small"
                      variant="outlined"
                    >
                      <MenuItem value="AM">AM</MenuItem>
                      <MenuItem value="PM">PM</MenuItem>
                    </Select>
                  </Box>
                </Box>

                {/* To Time */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>To time</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      value={toTime.hour}
                      onChange={(e) =>
                        handleTimeChange("to", "hour", e.target.value)
                      }
                      inputProps={{ maxLength: 2 }}
                      size="small"
                      variant="outlined"
                      style={{ width: "50px" }}
                      placeholder="06"
                    />
                    :
                    <TextField
                      value={toTime.minute}
                      onChange={(e) =>
                        handleTimeChange("to", "minute", e.target.value)
                      }
                      inputProps={{ maxLength: 2 }}
                      size="small"
                      variant="outlined"
                      style={{ width: "50px" }}
                      placeholder="30"
                    />
                    <Select
                      value={toTime.ampm}
                      onChange={(e) =>
                        handleTimeChange("to", "ampm", e.target.value)
                      }
                      size="small"
                      variant="outlined"
                    >
                      <MenuItem value="AM">AM</MenuItem>
                      <MenuItem value="PM">PM</MenuItem>
                    </Select>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal} color="primary">
                Cancel
              </Button>
              <Button onClick={closeModal} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add Button */}
          <Grid item xs={12} sm={6} md={1} style={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              className={styles["add-button"]}
              fullWidth
            >
              + Add
            </Button>
          </Grid>
        </Grid>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className={styles.header}>
              <TableCell>Emp ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>From Timing</TableCell>
              <TableCell>To Timing</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Ward</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedNurseData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedNurseData.map((nurse, index) => (
                <TableRow key={index}>
                  <TableCell>{nurse.empId}</TableCell>
                  <TableCell>{nurse.name}</TableCell>
                  <TableCell>{nurse.fromDate}</TableCell>
                  <TableCell>{nurse.toDate}</TableCell>
                  <TableCell>{nurse.shift}</TableCell>
                  <TableCell>{nurse.fromTiming}</TableCell>
                  <TableCell>{nurse.toTiming}</TableCell>
                  <TableCell>{nurse.service}</TableCell>
                  <TableCell>{nurse.department}</TableCell>
                  <TableCell>{nurse.ward}</TableCell>
                  <TableCell>
                    <IconButton
                      sx={{
                        color: "#d32f2f",
                        "&:hover": {
                          color: "#b71c1c",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: "#d32f2f",
                        "&:hover": {
                          color: "#b71c1c",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={nurseData.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
      />
    </div>
  );
};

export default DoctorManagment
