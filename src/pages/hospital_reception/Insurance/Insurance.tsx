import React, { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from "@mui/material";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import styles from "./insurance.module.scss";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import addIcon from "../../../assets/reception/add_icon.png";
import { patientinsuranceDetailType } from "../../../types";
import InsuranceTable from "./InsuranceTable";
import { useLocation } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Insurance = () => {
  const location = useLocation()
  const value = location.state?.value || "";
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [insuranceFormData, setInsuranceFormData] =
    React.useState<patientinsuranceDetailType>({
      submissionId: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      patientID: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      patientName: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      patientMobileNumber: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      sponsorName: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      sponsorMobileNum: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      estimationAmount: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      claimAmount: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      }
    });

  const [open, setOpen] = useState(false);
  const [showInnerTable, setShowInnerTable] = useState(false);

  const normalizeDate = (date: Date | null) => {
    if (!date) return null;
    // Use UTC to avoid timezone issues
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  };

const handleAddClaimClick = () => {
  setShowInnerTable(true); // Show inner table when button is clicked
};

  const handleClose = () => {
    setOpen(false);
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

    if (name === "patientName") {
      if (
        nameregex.test(event.target.value) &&
        event.target.value.length < 50
      ) {
        value = event.target.value;
      } else {
        return;
      }
    } else if (name === "patientMobileNumber" || name === "sponsorMobileNum") {
      value = event.target.value.replace(/\D/g, "");
    }

    setInsuranceFormData((state) => {
      return {
        ...state,
        [name]: {
          valid: isvalid,
          showError,
          value,
          message,
          name
        }
      };
    });
  };

  const handleDelete = () => {
    setOpen(false);
  };

  const handleClearAll = () => {
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  const sampleData = [
    {
      id: 1,
      patientID: "P12345",
      pName: "John Doe",
      department: "IPD",
      addedOn: "2024-12-20T10:30:00Z",
      insuranceType:"Claim",
      insuranceProvider: "ABC Health Insurance",
      action: ""
    },
    {
      id: 2,
      patientID: "P67890",
      pName: "Alice Smith",
      department: "OPD",
      addedOn: "2024-12-19T14:00:00Z",
      insuranceType:"Claim",
      insuranceProvider: "XYZ Insurance Co.",
      action: ""
    },
    {
      id: 3,
      patientID: "P11223",
      pName: "Robert Brown",
      department: "IPD",
      addedOn: "2024-12-18T16:15:00Z",
      insuranceType:"Claim",
      insuranceProvider: "HealthCare Plus",
      action: ""
    }
  ];

  return (
    <div className={styles.boxContainer}>
      <div className={styles.container}>
      <p className={styles.insuranceHeading}>
        {value ? (value !== "Reimbursement" ? "Claim" : value) : "Insurance Claimed Patient List"}
      </p>

        <div className={styles.rowcontainer}>
          <Grid item xs={2} sx={{ mt: "25px" }}>
            <Stack spacing={1} direction="row" justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{ ml: "auto", background: "#1977f3", borderRadius: "50px" , textTransform:"none"}}
                onClick={handleAddClaimClick}
              >
                <img src={addIcon} className={styles.img} alt="" />
                Add Claim
              </Button>
            </Stack>
          </Grid>
        

      <div style={{ display: "flex", alignItems: "center" }}>
          <div className={styles.calendarIn} style={{ marginRight: "1rem" }}>
            <CalendarTodayIcon />
            <div className={styles.timeFrameContainerIn}>
              <div className={styles.datePickerContainer}>
                <DatePicker
                  selected={startDate}
                  onChange={(dates: [Date | null, Date | null]) => {
                    const [start, end] = dates;
                    setStartDate(normalizeDate(start));
                    setEndDate(normalizeDate(end));
                  }}
                  startDate={startDate || undefined}
                  endDate={endDate || undefined}
                  selectsRange
                  isClearable
                  placeholderText="Select a date range"
                  className={styles.datePicker}
                  style={{
                    padding: "10px",
                    zIndex: 9999,
                    position: "relative",
                  }}
                  calendarClassName={styles.calendarIn}
                  maxDate={new Date()}
                />
              </div>
            </div>
          </div>

         
        </div>
        </div>
      </div>
      <InsuranceTable insuranceData={sampleData}  showInnerTable={showInnerTable}  value={value}/>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Insurance Claiming</DialogTitle>
        <DialogContent>
          <Grid container columnSpacing={2} rowSpacing={3}>
            <Grid item xs={10}>
              <TextField
                label="Submission ID"
                variant="outlined"
                fullWidth
                required
                onChange={handleTextChange}
                error={
                  !insuranceFormData.submissionId.valid &&
                  insuranceFormData.submissionId.showError
                }
                helperText={
                  insuranceFormData.submissionId.showError &&
                  insuranceFormData.submissionId.message
                }
                name="pID"
                value={insuranceFormData.submissionId.value || ""}
              />
            </Grid>

            <Grid item xs={10}>
              <TextField
                label="Patient ID"
                variant="outlined"
                fullWidth
                required
                name="patientID"
                error={
                  !insuranceFormData.patientID.valid &&
                  insuranceFormData.patientID.showError
                }
                onChange={handleTextChange}
                helperText={
                  insuranceFormData.patientID.showError &&
                  insuranceFormData.patientID.message
                }
                value={insuranceFormData.patientID.value}
              />
            </Grid>

            <Grid item xs={10}>
              <TextField
                label="Patient Name"
                variant="outlined"
                fullWidth
                required
                name="patientName"
                error={
                  !insuranceFormData.patientName.valid &&
                  insuranceFormData.patientName.showError
                }
                onChange={handleTextChange}
                helperText={
                  insuranceFormData.patientName.showError &&
                  insuranceFormData.patientName.message
                }
                value={insuranceFormData.patientName.value}
              />
            </Grid>

            <Grid container xs={10} item>
              <Grid item xs={3}>
                <TextField
                  label="Country Code"
                  variant="outlined"
                  fullWidth
                  value="+91"
                  InputProps={{
                    readOnly: true,
                    style: {
                      backgroundColor: "#f0f0f0",
                      cursor: "not-allowed"
                    }
                  }}
                />
              </Grid>
              <Grid item xs={9}>
                <TextField
                  label="Patient Mobile Number"
                  variant="outlined"
                  fullWidth
                  required
                  name="patientMobileNumber"
                  error={
                    !insuranceFormData.patientMobileNumber.valid &&
                    insuranceFormData.patientMobileNumber.showError
                  }
                  onChange={handleTextChange}
                  helperText={
                    insuranceFormData.patientMobileNumber.showError &&
                    insuranceFormData.patientMobileNumber.message
                  }
                  value={insuranceFormData.patientMobileNumber.value}
                />
              </Grid>
            </Grid>

            <Grid item xs={10}>
              <TextField
                label="Sponsor Name"
                variant="outlined"
                fullWidth
                required
                name="sponsorName"
                error={
                  !insuranceFormData.sponsorName.valid &&
                  insuranceFormData.sponsorName.showError
                }
                onChange={handleTextChange}
                helperText={
                  insuranceFormData.sponsorName.showError &&
                  insuranceFormData.sponsorName.message
                }
                value={insuranceFormData.sponsorName.value}
              />
            </Grid>

            <Grid container xs={10} item>
              <Grid item xs={3}>
                <TextField
                  label="Country Code"
                  variant="outlined"
                  fullWidth
                  value="+91"
                  InputProps={{
                    readOnly: true,
                    style: {
                      backgroundColor: "#f0f0f0",
                      cursor: "not-allowed"
                    }
                  }}
                />
              </Grid>
              <Grid item xs={9}>
                <TextField
                  label="Sponsor Mobile Number"
                  variant="outlined"
                  fullWidth
                  required
                  name="sponsorMobileNum"
                  error={
                    !insuranceFormData.sponsorMobileNum.valid &&
                    insuranceFormData.sponsorMobileNum.showError
                  }
                  onChange={handleTextChange}
                  helperText={
                    insuranceFormData.sponsorMobileNum.showError &&
                    insuranceFormData.sponsorMobileNum.message
                  }
                  value={insuranceFormData.sponsorMobileNum.value}
                />
              </Grid>
            </Grid>

            <Grid item xs={10}>
              <TextField
                label="Estimation Amount"
                variant="outlined"
                fullWidth
                required
                name="estimationAmount"
                error={
                  !insuranceFormData.estimationAmount.valid &&
                  insuranceFormData.estimationAmount.showError
                }
                onChange={handleTextChange}
                helperText={
                  insuranceFormData.estimationAmount.showError &&
                  insuranceFormData.estimationAmount.message
                }
                value={insuranceFormData.estimationAmount.value}
              />
            </Grid>

            <Grid item xs={10}>
              <TextField
                label="Claim Amount"
                variant="outlined"
                fullWidth
                required
                name="claimAmount"
                error={
                  !insuranceFormData.claimAmount.valid &&
                  insuranceFormData.claimAmount.showError
                }
                onChange={handleTextChange}
                helperText={
                  insuranceFormData.claimAmount.showError &&
                  insuranceFormData.claimAmount.message
                }
                value={insuranceFormData.claimAmount.value}
              />
            </Grid>
          </Grid>

          <Stack
            spacing={4}
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 4 }}
          >
            {/* Delete Icon Button */}
            <IconButton onClick={handleDelete} color="error">
              <DeleteIcon />
              <Typography variant="body2" sx={{ ml: 1, mt: 0.5 }}>
                Delete
              </Typography>
            </IconButton>

            {/* Clear All Button */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearAll}
            >
              Clear All
            </Button>

            {/* Save Button */}
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Insurance;
