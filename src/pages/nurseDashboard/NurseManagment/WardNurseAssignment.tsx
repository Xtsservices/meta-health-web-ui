import { useEffect, useState } from "react";
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
  Grid,
  MenuItem,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import styles from "./Nursemanagment.module.scss";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import "react-datepicker/dist/react-datepicker.css";
import DeleteIcon from "@mui/icons-material/Delete";

const WardNurseAssignment = () => {
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
useEffect(()=>{
  setNurseData(nurseData)
},[])
  const [filters, setFilters] = useState({
    name: "",
    service: "",
    ward: "",
    department: "",
    shift: "",
    fromDate: "",
    toDate: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  const handleChangePage = ( newPage: any) => {
    setCurrentPage(newPage);
  };

  const paginatedNurseData = nurseData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const getTodayDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return today.toLocaleDateString("en-US", options);
  };

  return (
    <div className={styles["nurse-management"]}>
      <div className={styles["filter-section"]}>
        <Grid container spacing={2} className={styles.spacer}>
          {/* Service and Ward Container */}
          <Grid item xs={12} sm={6} md={6}>
            <Box display="flex" flexDirection="row" gap={2}>
              {/* Service */}
              <Box flex={1}>
                <label>Service</label>
                <Select
                  value={filters.service}
                  onChange={(e) =>
                    handleFilterChange("service", e.target.value)
                  }
                  displayEmpty
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="IPD">IPD</MenuItem>
                  <MenuItem value="OPD">OPD</MenuItem>
                </Select>
              </Box>

              {/* department */}
              <Box flex={1}>
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
              </Box>

              {/* Ward */}
              {filters?.service === "IPD" && (
                <Box flex={1}>
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
                </Box>
              )}
            </Box>
          </Grid>

          {/* Calendar Section */}
          <Grid item xs={12} sm={6} md={2}>
            <Box
              className={styles.calendarSection}
              display="flex"
              alignItems="center"
            >
              <CalendarTodayIcon className={styles.calendarIcon} />
              <Typography variant="body2" className={styles.date}>
                {getTodayDate()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className={styles.header}>
              <TableCell>Emp ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>From Timing</TableCell>
              <TableCell>To Timing</TableCell>
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
                  <TableCell>{nurse.shift}</TableCell>
                  <TableCell>{nurse.fromTiming}</TableCell>
                  <TableCell>{nurse.toTiming}</TableCell>
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

export default WardNurseAssignment;
