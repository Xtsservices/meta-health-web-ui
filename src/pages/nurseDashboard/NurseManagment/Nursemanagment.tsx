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
import styles from "./Nursemanagment.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { setError, setLoading, setSuccess } from "../../../store/error/error.action";
import { authFetch } from "../../../axios/useAuthFetch";
import { capitalizeFirstLetter } from "../../../utility/global";
import { wardType } from "../../../types";
import { authPost } from "../../../axios/useAuthPost";
import EditScheduleDialog from "./EditSchedule";
import { authDelete } from "../../../axios/authDelete";
import { canDeleteWithinOneHour } from "../../../utility/calender";

export type Nurse = {
  addedBy:number;
  departmentID:number;
  fromDate:string;
  hospitalID:number;
  id:number;
  scope:number;
  shiftTimings:string;
  toDate:string;
  userID:number;
  wardID:number;
  name:string;
  shift:string;
  addedOn?: string;
  departmenName:string;
  wardName:string;
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

const Nursemanagment = () => {
  const datePickerRef = useRef<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [nurseNames, setNurseNames] = useState<{ id: number; name: string; role:number }[]>([]);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [departmentName, setDepartmentName] = useState("");
  const [wardList, setWardList] = React.useState<wardType[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [nurseData, setNurseData] = useState<Nurse[]>([]);
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const handleEditClick = (nurse: Nurse) => {
    if (!canDeleteWithinOneHour(nurse.addedOn)) {
      dispatch(setError("Cannot edit: Record is older than 1 hour"));
      console.log("Nurse Added on time",nurse.addedOn);
      return;
    }
    setSelectedNurse(nurse);
    setEditDialogOpen(true);
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
        const endpoint = `nurse/deleteshiftschedule/${user.hospitalID}/${nurse.id}`;
        const response = await authDelete(endpoint, user.token);
  
        if (response.message === "success") {
          dispatch(setSuccess("Shift schedule deleted successfully!"));
          setNurseData((prevData) => prevData.filter((item) => item.id !== nurse.id));
        } else {
          throw new Error(response.message || "Failed to delete shift schedule");
        }
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : "An error occurred"));
      } finally {
        dispatch(setLoading(false));
      }
    };



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

  useEffect(() => {
    const fetchDepartmentName = async () => {
      try {
        if (user.departmentID) {
          const departmentData = await authFetch(
            `department/singledpt/${user.departmentID}`,
            user.token
          );
          if (departmentData.message === "success") {
            setDepartmentName(departmentData.department[0].name);
          }
        }
      } catch (error) {
        console.error("Error fetching department name:", error);
      }
    };
  
    fetchDepartmentName();
  }, [user.departmentID, user.token]);

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

  const closeModal = () => {
    setOpenModal(false);
  };

  const extractTimings = (shiftTimings : string) => {
    if (!shiftTimings) return { fromTiming: "", toTiming: "" };
    const [fromTiming, toTiming] = shiftTimings.split(" - ");
    return { fromTiming, toTiming };
  };

  const getWardData = React.useCallback(async () => {
      const wardResonse = await authFetch(`ward/${user.hospitalID}`, user.token);
      if (wardResonse.message == "success") {
        setWardList(wardResonse.wards);
      }
    }, [user.hospitalID, user.token]);
  
    useEffect(() => {
      if (user?.token) {
        getWardData();
      }
    }, [user]);

    const fetchNurseData = async () => {
      if (!user?.hospitalID) return;

      setLoading(true);
      setError("");

      try {
        const response = await authFetch(
          `nurse/shiftschedule/${user.hospitalID}`,
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

  const handleAddShiftSchedule = async () => {
    if (!filters.name || !startDate || !endDate || !filters.shift || !filters.service || (filters.service === "1" && !filters.ward)) {
      dispatch(setError("Please fill all required fields."));
      return;
    }

    const selectedNurse = nurseNames.find((nurse) => nurse.name === filters.name);
    if (!selectedNurse) {
      dispatch(setError("Invalid nurse selected."));
      return;
    }

    const shiftTimings = filters.shift === "Custom"
      ? `${fromTime.hour}:${fromTime.minute} ${fromTime.ampm} - ${toTime.hour}:${toTime.minute} ${toTime.ampm}`
      : filters.shift.replace(/^Shift \d+ \(([^)]+)\)$/, "$1");

    const data = {
      userID: editId ? editId : selectedNurse.id,
      departmentID: user.departmentID,
      wardID: parseInt(filters.ward, 10),
      fromDate: formatDate(startDate),
      toDate: formatDate(endDate),
      shiftTimings,
      scope: parseInt(filters.service, 10),
    };

    try {
      dispatch(setLoading(true));
      const endpoint = `nurse/shiftschedule/${user.hospitalID}`;
      const response = await authPost(endpoint, data, user.token);

      if (response.message === "success") {
        dispatch(setSuccess("Shift schedule added successfully!"));

        // Local update for immediate UI feedback
        const newNurseEntry: Nurse = {
          addedBy: user.id,
          departmentID: user.departmentID,
          fromDate: formatDate(startDate),
          hospitalID: user.hospitalID,
          id: editId || response.data?.id || Date.now(),
          scope: parseInt(filters.service, 10),
          shiftTimings,
          toDate: formatDate(endDate),
          userID: selectedNurse.id,
          wardID: parseInt(filters.ward, 10),
          departmenName:departmentName,
          wardName:wardList.find(ward => ward.id === parseInt(filters.ward, 10))?.name || '',
          name: selectedNurse.name,
          shift: shiftTimings,
        };

        if (editId) {
          setNurseData((prevData) =>
            prevData.map((nurse) =>
              nurse.id === editId ? { ...nurse, ...newNurseEntry } : nurse
            )
          );
        } else {
          setNurseData((prevData) => [...prevData, newNurseEntry]);
        }

        // Reset filters and state
        setFilters({
          name: "",
          service: "",
          ward: "",
          department: "",
          shift: "",
          fromDate: "",
          toDate: "",
        });
        setStartDate(null);
        setEndDate(null);
        setFromTime({ hour: "", minute: "", ampm: "AM" });
        setToTime({ hour: "", minute: "", ampm: "PM" });
        setEditId(null);

        // Fetch updated data from backend
        await fetchNurseData();
      } else {
        throw new Error("Failed to add shift schedule");
      }
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "An error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // const handleEditClick = (nurse: Nurse) => {
  //   setEditId(nurse.id); 
  //   const selectedNurse = nurseNames.find((n) => n.id === nurse.userID);
  //   if (selectedNurse) {
  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       name: selectedNurse.name,
  //       service: nurse.scope === 1 ? "IPD" : "OPD",
  //       ward: nurse.wardID.toString(),
  //       shift: nurse.shiftTimings,
  //     }));
  //   }
  //   setStartDate(new Date(nurse.fromDate));
  //   setEndDate(new Date(nurse.toDate));
  // };

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
    if (field === "shift") {
      setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
      if (value === "Custom") {
        setOpenModal(true);
      }
    } else {
      setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
    }
  };

  function formatDate(date: string | Date) {
    if (date instanceof Date) {
      // Use local timezone (IST) for formatting
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }
    // Handle string input (assume YYYY-MM-DD or ISO)
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`;
    }
    return date.split("T")[0]; // Fallback for ISO strings
  }
  

  const handleChangePage = (_event: unknown, newPage: number) => {
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
              <MenuItem value="1">IPD</MenuItem>
              <MenuItem value="2">OPD</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <label>Department</label>
            <TextField
              value={capitalizeFirstLetter(departmentName) || "Loading..."}
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          {filters?.service === "1" && (
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
                {wardList?.map((ward) => (
                  <MenuItem key={ward?.id} value={ward.id}>
                    {ward?.name}
                  </MenuItem>
                ))}
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
                  minDate={new Date()}
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
              <MenuItem value="07:00 AM - 03:00 PM">Shift 1 (07:00 AM - 03:00 PM)</MenuItem>
              <MenuItem value="07:00 PM - 11:00 PM">Shift 2 (07:00 PM - 11:00 PM)</MenuItem>
              <MenuItem value="11:00 PM - 03:00 AM">Shift 3 (11:00 PM - 03:00 AM)</MenuItem>
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
              onClick={handleAddShiftSchedule}
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
              paginatedNurseData.map((nurse, index) => {
                const { fromTiming, toTiming } = extractTimings(nurse.shiftTimings);
                
                return (
                  <TableRow key={index}>
                    <TableCell>{nurse.userID}</TableCell>
                    <TableCell>{capitalizeFirstLetter(nurse.name)}</TableCell>
                    <TableCell>{formatDate(nurse.fromDate)}</TableCell>
                    <TableCell>{formatDate(nurse.toDate)}</TableCell>
                    <TableCell>{fromTiming}</TableCell>
                    <TableCell>{toTiming}</TableCell>
                    <TableCell>{nurse.scope === 1 ? "IPD" : "OPD"}</TableCell>
                    <TableCell>{capitalizeFirstLetter(nurse.departmenName)}</TableCell>
                    <TableCell>{capitalizeFirstLetter(nurse.wardName)}</TableCell>
                    <TableCell>
                      <IconButton
                        sx={{
                          color: "#d32f2f",
                          "&:hover": {
                            color: "#b71c1c",
                          },
                        }}
                        onClick={() => handleEditClick(nurse)}
                      >
                        <EditIcon />
                      </IconButton>
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
                );
              })
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
      {selectedNurse && (
        <EditScheduleDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          nurseData={selectedNurse}
          wardList={wardList}
          toDate={selectedNurse.toDate}
          departmentName={departmentName}
          onUpdate={() => {
            // Refresh the nurse data after update
            fetchNurseData();
          }}
        />
      )}
    </div>
  );
};

export default Nursemanagment;
