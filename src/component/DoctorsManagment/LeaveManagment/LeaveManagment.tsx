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
  TablePagination,
  Button,
  Grid,
  MenuItem,
  IconButton,
} from "@mui/material";
import styles from "../../../pages/nurseDashboard/NurseManagment/Nursemanagment.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

const LeaveManagment = () => {
  const datePickerRef = useRef<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [, setOpenModal] = useState(false);

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
      leavetype: "Casual Leave",
    },
  ]);

  useEffect(()=>{
    setNurseData(nurseData)
  },[])

  const nurseNames = [
    { id: 1, name: "Doctor Alice" },
    { id: 2, name: "Doctor Bob" },
    { id: 3, name: "Doctor Charlie" },
    { id: 4, name: "Doctor Diana" },
    { id: 5, name: "Doctor Emma" },
    { id: 6, name: "Doctor Frank" },
    { id: 7, name: "Doctor Grace" },
  ];

  const [filters, setFilters] = useState({
    name: "",
    service: "",
    ward: "",
    shift: "",
    fromDate: "",
    toDate: "",
    leavetype: "",
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

          {/* Service */}
          <Grid item xs={12} sm={6} md={2}>
            <label>Leave Type</label>
            <Select
              value={filters.leavetype}
              onChange={(e) => handleFilterChange("leavetype", e.target.value)}
              displayEmpty
              variant="outlined"
              size="small"
              fullWidth
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="casualLeave">Casual Leave</MenuItem>
              <MenuItem value="sickLeave">Sick Leave</MenuItem>
            </Select>
          </Grid>

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
              <TableCell>Leave Type</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
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
                  <TableCell>{nurse.leavetype}</TableCell>
                  <TableCell>{nurse.fromDate}</TableCell>
                  <TableCell>{nurse.toDate}</TableCell>
                  <TableCell>
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

export default LeaveManagment
