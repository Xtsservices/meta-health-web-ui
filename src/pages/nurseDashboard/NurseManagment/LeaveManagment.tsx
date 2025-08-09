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
import styles from "./Nursemanagment.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { authFetch } from "../../../axios/useAuthFetch";
import { setError, setLoading, setSuccess } from "../../../store/error/error.action";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authPost } from "../../../axios/useAuthPost";
import { capitalizeFirstLetter } from "../../../utility/global";
import { authDelete } from "../../../axios/authDelete";
import { canDeleteWithinOneHour } from "../../../utility/calender";

export type Nurse = {
  name:string;
  approvedBy:number;
  fromDate:string;
  hospitalID:number;
  id:number;
  leaveType:string;
  toDate:string;
  userID:number;
  addedOn?: string;
}

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
  const [nurseData, setNurseData] = useState<Nurse[]>([]);
  const user = useSelector(selectCurrentUser);
  const [nurseNames, setNurseNames] = useState<{ id: number; name: string; role:number }[]>([]);
  const dispatch = useDispatch();

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

  const handleAddLeaves = async () => {
    if (!filters.leavetype || !startDate || !endDate !) {
      setError("Please fill all required fields: Leave Type, Date Range.");
      return;
    }

    const selectedNurse = nurseNames.find((nurse) => nurse.name === filters.name);
    if (!selectedNurse) {
      setError("Invalid or No nurse selected.");
      return;
    }

    const data = {
      userID: selectedNurse.id, // Nurse ID
      fromDate: formatDate(startDate), // From Date
      toDate: formatDate(endDate), // To Date
      leaveType:filters.leavetype,
    };

    try {
      setLoading(true);
      const endpoint =`nurse/addleaves/${user.hospitalID}`

      const response = await authPost(endpoint, data, user.token);

      if (response.message === "success") {
        const newLeaveData: Nurse = {
          userID: selectedNurse.id,
          fromDate: formatDate(startDate),
          toDate: formatDate(endDate),
          leaveType: filters.leavetype,
          name: selectedNurse.name, // Add name from local nurseNames
          hospitalID: user.hospitalID, // From current user
          id: response.data?.id || Date.now(), // Use API-provided ID or temporary
          approvedBy: response.data?.approvedBy || null, // Use API data if available
        };
  
        // Update nurseData state with the new leave entry
        setNurseData((prevNurseData) => [...prevNurseData, newLeaveData]);
  
        // Reset filters and date pickers
        setFilters({ name: "", service: "", ward: "", shift: "", fromDate: "", toDate: "", leavetype: "" });
        setStartDate(null);
        setEndDate(null);
        setSuccess("Leaves Added Successfully")
        await fetchNurseData();
        // Refresh the nurse data
      } else {
        throw new Error("Failed to add leaves");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (nurse: Nurse) => {
    console.log("Delete Clicked", nurse);

    // Check if deletion is allowed within 1 hour
    if (!canDeleteWithinOneHour(nurse.addedOn)) {
      dispatch(setError("Cannot delete: Record is older than 1 hour"));
      return;
    }

    try {
      dispatch(setLoading(true));
      const endpoint = `nurse/deletestaffleave/${user.hospitalID}/${nurse.id}`;
      const response = await authDelete(endpoint, user.token);

      if (response.message === "success") {
        dispatch(setSuccess("Leave deleted successfully!"));
        setNurseData((prevData) => prevData.filter((item) => item.id !== nurse.id));
      } else {
        throw new Error(response.message || "Failed to delete leave");
      }
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "An error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  };

    useEffect(() => {
      const fetchNurseNames = async () => {
        if (!user?.hospitalID) return;
  
        setLoading(true);
        setError('');
  
        try {
          const response = await authFetch(
            `nurse/getallnurse/${user.hospitalID}`,
            user.token
          );
  
          if (response.message === "success") {
            setNurseNames(response.data);
          } else {
            throw new Error("Failed to fetch nurse names");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      };
  
      fetchNurseNames();
    }, [user?.hospitalID, user?.token]);

    function formatDate(date: string | Date) {
      if (date instanceof Date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }
      return date.split("T")[0]; 
    }

    const fetchNurseData = async () => {
      if (!user?.hospitalID) return;

      setLoading(true);
      setError("");

      try {
        const response = await authFetch(
          `nurse/getstaffleaves/${user.hospitalID}`,
          user.token
        );
  
        if (response.message === "success") {
          setNurseData(response.data); 
        } else {
          throw new Error("Failed to fetch nurse shift schedule data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {

  
      fetchNurseData();
    }, [user?.hospitalID, user?.token]);

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

  const handleChangePage = (_event: unknown,newPage: any) => {
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
          {/* Nurse Name */}
          <Grid item xs={12} sm={6} md={2}>
            <label>Select Nurse</label>
            <Select
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              displayEmpty
              variant="outlined"
              size="small"
              fullWidth
            >
              <MenuItem value="">Select Nurse</MenuItem>
              {nurseNames.map((nurse) => (
                <MenuItem key={nurse.id} value={nurse.name}>
                  {capitalizeFirstLetter(nurse.name)}{" "}{nurse.role === 2002 ? "(Head Nurse)" : "(Nurse)"}
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
                  minDate={new Date()}
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
              <MenuItem value="Casual Leave">Casual Leave</MenuItem>
              <MenuItem value="Sick Leave">Sick Leave</MenuItem>
              <MenuItem value="Earned Leave">Earned Leave</MenuItem>
              <MenuItem value="Maternity Leave">Maternity Leave</MenuItem>
              <MenuItem value="Paternity Leave">Paternity Leave</MenuItem>
              <MenuItem value="Compensatory Leave">Compensatory Leave</MenuItem>
              <MenuItem value="Study Leave">Study Leave</MenuItem>
              <MenuItem value="Bereavement Leave">Bereavement Leave</MenuItem>
              <MenuItem value="Quarantine Leave">Quarantine Leave</MenuItem>
              <MenuItem value="Special Leave">Special Leave</MenuItem>
            </Select>
          </Grid>

          {/* Add Button */}
          <Grid item xs={12} sm={6} md={1} style={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              className={styles["add-button"]}
              fullWidth
              onClick={handleAddLeaves}
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
                  <TableCell>{nurse.userID}</TableCell>
                  <TableCell>{capitalizeFirstLetter(nurse.name)}</TableCell>
                  <TableCell>{nurse.leaveType}</TableCell>
                  <TableCell>{formatDate(nurse.fromDate)}</TableCell>
                  <TableCell>{formatDate(nurse.toDate)}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDeleteClick(nurse)}
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

export default LeaveManagment;
