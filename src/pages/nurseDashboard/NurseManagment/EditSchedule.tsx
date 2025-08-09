import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { capitalizeFirstLetter } from "../../../utility/global";
import { authPost } from "../../../axios/useAuthPost";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { setError, setLoading, setSuccess } from "../../../store/error/error.action";
import { useDispatch } from "react-redux";

interface EditScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  nurseData: any;
  wardList: any[];
  departmentName: string;
  onUpdate: () => void;
  toDate: string;
}

const EditScheduleDialog: React.FC<EditScheduleDialogProps> = ({
  open,
  onClose,
  nurseData,
  wardList,
  departmentName,
  onUpdate,
  toDate,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [formData, setFormData] = useState({
    service: "1",
    ward: "",
    fromDate: new Date(),
    shift: "",
  });

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
  const [openTimeModal, setOpenTimeModal] = useState(false);

  useEffect(() => {
    if (open && nurseData) {
      // Parse the existing shift timings when dialog opens
      const [fromTimeStr, toTimeStr] = nurseData.shiftTimings.split(" - ");
      if (fromTimeStr && toTimeStr) {
        const [fromHourMin, fromAmPm] = fromTimeStr.split(" ");
        const [toHourMin, toAmPm] = toTimeStr.split(" ");
        const [fromHour, fromMin] = fromHourMin.split(":");
        const [toHour, toMin] = toHourMin.split(":");

        setFromTime({
          hour: fromHour,
          minute: fromMin,
          ampm: fromAmPm,
        });
        setToTime({
          hour: toHour,
          minute: toMin,
          ampm: toAmPm,
        });
      }

      // Set form data with nurse's current values
      setFormData({
        service: nurseData.scope === 1 ? "1" : "2",
        ward: nurseData.wardID?.toString() || "",
        fromDate: new Date(nurseData.fromDate),
        shift: nurseData.shiftTimings,
      });
    }
  }, [open, nurseData]);

  

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

  const handleChange = (field: string, value: string | Date | null) => {
    if (field === "shift" && value === "Custom") {
      setOpenTimeModal(true);
    }
    
    // Handle null date case
    if (field === "fromDate" && value === null) {
      return; // Don't update if date is cleared
    }

    setFormData((prev) => ({ ...prev, [field]: value as any }));
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

  const handleSubmit = async () => {
    if (!formData.service || !formData.fromDate || !formData.shift || 
        (formData.service === "1" && !formData.ward)) {
      dispatch(setError("Please fill all required fields."));
      return;
    }

    const shiftTimings = formData.shift === "Custom"
      ? `${fromTime.hour}:${fromTime.minute} ${fromTime.ampm} - ${toTime.hour}:${toTime.minute} ${toTime.ampm}`
      : formData.shift;

    const payload = {
      userID: nurseData.userID,
      departmentID: nurseData.departmentID,
      wardID: parseInt(formData.ward, 10),
      fromDate: formatDate(formData.fromDate),
      toDate:formatDate(toDate),
      shiftTimings,
      scope: parseInt(formData.service, 10),
    };

    console.log("Payload for Edit Schedule Api",payload);

    try {
      dispatch(setLoading(true));
      const endpoint = `nurse/shiftschedule/${user.hospitalID}?editID=${nurseData.id}`;
      const response = await authPost(endpoint, payload, user.token);

      if (response.message === "success") {
        dispatch(setSuccess("Schedule updated successfully!"));
        onUpdate();
        onClose();
      } else {
        throw new Error(response.message || "Failed to update schedule");
      }
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "An error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Nurse Schedule</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Service */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Service</Typography>
              <Select
                value={formData.service}
                onChange={(e) => handleChange("service", e.target.value as string)}
                fullWidth
                size="small"
              >
                <MenuItem value="1">IPD</MenuItem>
                <MenuItem value="2">OPD</MenuItem>
              </Select>
            </Grid>

            {/* Ward (only shown for IPD) */}
            {formData.service === "1" && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Ward</Typography>
                <Select
                  value={formData.ward}
                  onChange={(e) => handleChange("ward", e.target.value as string)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="">Select Ward</MenuItem>
                  {wardList.map((ward) => (
                    <MenuItem key={ward.id} value={ward.id.toString()}>
                      {ward.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}

            {/* Department (read-only) */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Department</Typography>
              <TextField
                value={capitalizeFirstLetter(departmentName)}
                fullWidth
                size="small"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            {/* From Date */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">From Date</Typography>
              <DatePicker
                selected={formData.fromDate}
                onChange={(date: Date | null) => {
                  if (date) {
                    handleChange("fromDate", date);
                  }
                }}
                dateFormat="MM/dd/yyyy"
                customInput={
                  <TextField fullWidth size="small" variant="outlined" />
                }
                minDate={new Date()}
              />
            </Grid>

            {/* Shift */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Shift</Typography>
              <Select
                value={formData.shift}
                onChange={(e) => handleChange("shift", e.target.value as string)}
                fullWidth
                size="small"
              >
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Time Modal */}
      <Dialog open={openTimeModal} onClose={() => setOpenTimeModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Select Custom Timing</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 2 }}>
            {/* From Time */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography>From time</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  value={fromTime.hour}
                  onChange={(e) => handleTimeChange("from", "hour", e.target.value)}
                  inputProps={{ maxLength: 2 }}
                  size="small"
                  variant="outlined"
                  style={{ width: "50px" }}
                  placeholder="09"
                />
                :
                <TextField
                  value={fromTime.minute}
                  onChange={(e) => handleTimeChange("from", "minute", e.target.value)}
                  inputProps={{ maxLength: 2 }}
                  size="small"
                  variant="outlined"
                  style={{ width: "50px" }}
                  placeholder="00"
                />
                <Select
                  value={fromTime.ampm}
                  onChange={(e) => handleTimeChange("from", "ampm", e.target.value as string)}
                  size="small"
                  variant="outlined"
                >
                  <MenuItem value="AM">AM</MenuItem>
                  <MenuItem value="PM">PM</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* To Time */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography>To time</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  value={toTime.hour}
                  onChange={(e) => handleTimeChange("to", "hour", e.target.value)}
                  inputProps={{ maxLength: 2 }}
                  size="small"
                  variant="outlined"
                  style={{ width: "50px" }}
                  placeholder="06"
                />
                :
                <TextField
                  value={toTime.minute}
                  onChange={(e) => handleTimeChange("to", "minute", e.target.value)}
                  inputProps={{ maxLength: 2 }}
                  size="small"
                  variant="outlined"
                  style={{ width: "50px" }}
                  placeholder="30"
                />
                <Select
                  value={toTime.ampm}
                  onChange={(e) => handleTimeChange("to", "ampm", e.target.value as string)}
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
          <Button onClick={() => setOpenTimeModal(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                shift: `${fromTime.hour}:${fromTime.minute} ${fromTime.ampm} - ${toTime.hour}:${toTime.minute} ${toTime.ampm}`
              }));
              setOpenTimeModal(false);
            }} 
            variant="contained" 
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditScheduleDialog;