import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import styles from "./enrollmentdesk.module.scss";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

import Autocomplete from "@mui/material/Autocomplete";
import { Button } from "@mui/material";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Divider,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { patientregistrationDetailType } from "../../../types";
import { city, state } from "../../../utility/state";

const EnrollmentDesk = () => {
  const titleList = ["B/O", "Master", "Miss", "Mr.", "Mrs.", "Ms."];
  const [title, setTitle] = React.useState("");
  const [, setGender] = React.useState<number>(0);
  const [cityList, setCityList] = React.useState<string[]>([]);
  const [submittedData, setSubmittedData] = useState<any[]>([]);
  const [submittedPharmaData, setSubmittedPharmaData] = useState<any[]>([]);
  const [isPaymentSuccess, setPaymentSuccess] = useState(false);

  const [registrationFormData, setRegistrationFormData] =
    React.useState<patientregistrationDetailType>({
      pID: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },

      ptype: {
        valid: true,
        value: null,
        showError: false,
        message: "",
      },
      dob: {
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

      medicineName: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      dosage: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      quantity: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      testType: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      testName: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      sampleType: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      testDate: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },

      amount: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      gst: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      totalAmount: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      paymentMethod: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },

      referralName: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      serviceType: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },

      referralMobile: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },

      phoneNumber: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },

      address: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      country: {
        valid: false,
        value: "India",
        showError: false,
        message: "",
      },
      city: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      state: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },

      userID: {
        valid: false,
        value: null,
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

  const genderList = [
    { value: "Male", key: 1 },
    { value: "Female", key: 2 },
    { value: "Others", key: 3 },
  ];

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let isvalid = event.target.validity.valid;
    let showError = !isvalid;
    const name = event.target.name;
    let message = "This field is required";
    let value: string | number;
    value = event.target.value;
    const nameregex = /^[A-Za-z\s]*$/;

    // console.log("validity", event.target.validity);
    if (event.target.validity.stepMismatch) {
      isvalid = true;
    }

    if (name === "dob") {
      const dobValue = event.target.value;
      const dob = new Date(event.target.value);
      const today = new Date();

      let ageInDays = 0;
      if (dobValue) {
        // Check if the dobValue has year, month, and day parts
        const parts = dobValue.split("-");
        if (parts.length === 3) {
          const [year, month, day] = parts.map(Number);
          if (
            year > 1900 &&
            month >= 1 &&
            month <= 12 &&
            day >= 1 &&
            day <= 31
          ) {
            ageInDays = (today.getTime() - dob.getTime()) / (1000 * 3600 * 24);
            console.log(ageInDays);
          } else {
            // Display error if the date is not valid
            isvalid = false;
            showError = true;
            // dispatch(setError("Please enter a valid date"));
          }
        } else {
          // Display error if date is incomplete
          isvalid = false;
          showError = true;
          // dispatch(setError("Please enter a complete date (year, month, and day)"));
          message = "Please enter a complete date (year, month, and day)";
          // dispatch(setError(message));
        }
      } else {
        // Display error if date is not provided
        isvalid = false;
        showError = true;
        // dispatch(setError("Date of birth is required"));
      }

      const ageValid = true;

      isvalid = ageValid;
      showError = !ageValid;
    } else if (name === "pName" || name === "referredBy") {
      if (
        nameregex.test(event.target.value) &&
        event.target.value.length < 50
      ) {
        value = event.target.value;
      } else {
        return;
      }
    } else if (name === "phoneNumber" || name === "referralMobile") {
      value = event.target.value.replace(/\D/g, "");
    }

    setRegistrationFormData((state) => {
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

    setRegistrationFormData((prevFormData) => ({
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

  const handleTitleChange = (event: SelectChangeEvent) => {
    setTitle(event.target.value);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const isvalid = true;
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    const name = event.target.name;

    setRegistrationFormData((state) => {
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

  React.useEffect(() => {
    const stateName = state.indexOf(registrationFormData.state.value || "");
    setCityList(city[stateName]);
  }, [registrationFormData.state]);

  useEffect(() => {
    function generateUniqueId() {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
      const date = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const uniqueId = `${year}${month}${date}${hours}${minutes}${seconds}`;

      return uniqueId;
    }

    // Example usage
    const value = generateUniqueId();
    const isvalid = true;
    const name = "pID";
    const showError = false;
    const message = "";

    setRegistrationFormData((state) => {
      return {
        ...state,
        [name]: {
          valid: isvalid,
          showError: showError,
          value: value,
          message: message,
          name: name,
        },
      };
    });
  }, []);

  type TestNameOptions = {
    [key: string]: string[];
  };

  // test name options with specific keys
  const testNameOptions: TestNameOptions = {
    Radiology: ["MRI", "CT Scan", "Ultrasound"],
    Pathology: ["Blood Culture", "Urinalysis", "Biopsy"],
    "X-ray": ["Chest X-ray", "Hand X-ray", "Leg X-ray"],
    "Blood Test": ["CBC", "Lipid Profile", "Thyroid Test"],
  };

  const handleSave = () => {
    setSubmittedData((prev) => [
      ...prev,
      {
        testType: registrationFormData.testType.value,
        testName: registrationFormData.testName.value,
        testDate: registrationFormData.testDate.value,
      },
    ]);

    setRegistrationFormData((prev) => ({
      ...prev,
      serviceType: {
        value: "",
        valid: false,
        showError: false,
        message: "",
      },
      testType: {
        value: "",
        valid: false,
        showError: false,
        message: "",
      },
      testName: {
        value: "",
        valid: false,
        showError: false,
        message: "",
      },
      testDate: {
        value: "",
        valid: false,
        showError: false,
        message: "",
      },
    }));
  };

  const handlePharmaSave = () => {
    setSubmittedPharmaData((prev) => [
      ...prev,
      {
        medicineName: registrationFormData.medicineName.value,
        dosage: registrationFormData.dosage.value,
        quantity: registrationFormData.quantity.value,
      },
    ]);

    setRegistrationFormData((prev) => ({
      ...prev,
      serviceType: {
        value: "",
        valid: false,
        showError: false,
        message: "",
      },
      medicineName: {
        value: "",
        valid: false,
        showError: false,
        message: "",
      },
      dosage: {
        value: "",
        valid: false,
        showError: false,
        message: "",
      },
      quantity: {
        value: "",
        valid: false,
        showError: false,
        message: "",
      },
    }));
  };

  const handlePaymentCompletion = () => {
    setPaymentSuccess(true);
  };

  const handleClose = () => {
    setPaymentSuccess(false);
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmitClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.mainContainer}>
      <h3 className={styles.heading}>Registration</h3>
      <div className={styles.container}>
        <div>
          <Grid
            container
            columnSpacing={2}
            rowSpacing={3}
            className={styles.subContainer}
          >
            <Grid item xs={8}>
              <TextField
                label="Patient's ID"
                variant="outlined"
                fullWidth
                required
                disabled
                error={
                  !registrationFormData.pID.valid &&
                  registrationFormData.pID.showError
                }
                helperText={
                  registrationFormData.pID.showError &&
                  registrationFormData.pID.message
                }
                name="pID"
                value={registrationFormData.pID.value || ""}
              />
            </Grid>
            <Grid container xs={8} item>
              <Grid item xs={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Title</InputLabel>
                  <Select
                    value={title}
                    onChange={handleTitleChange}
                    label="Title"
                    required
                  >
                    {titleList.map((el) => {
                      return <MenuItem value={el}>{el}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  label="Patient Name"
                  variant="outlined"
                  fullWidth
                  required
                  name="pName"
                  error={
                    !registrationFormData.pName.valid &&
                    registrationFormData.pName.showError
                  }
                  onChange={handleTextChange}
                  helperText={
                    registrationFormData.pName.showError &&
                    registrationFormData.pName.message
                  }
                  value={registrationFormData.pName.value}
                />
              </Grid>
            </Grid>

            <Grid item xs={8}>
              <TextField
                label="Date of Birth"
                variant="outlined"
                fullWidth
                required
                type="date"
                onChange={handleTextChange}
                error={
                  !registrationFormData.dob.valid &&
                  registrationFormData.dob.showError
                }
                helperText={
                  registrationFormData.dob.showError &&
                  registrationFormData.dob.message
                }
                name="dob"
                InputLabelProps={{
                  shrink: true,
                }}
                value={registrationFormData.dob.value}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
              />
            </Grid>
            <Grid item xs={8}>
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
                      registrationFormData.gender.value === el.key
                        ? "primary"
                        : "default"
                    }
                    sx={{ boxSizing: "border-box", padding: "10px 20px" }}
                  />
                ))}
              </Stack>

              <p style={{ color: "#d84315", fontSize: "12px" }}>
                {registrationFormData.gender.showError &&
                  "Please Select Gender"}
              </p>
            </Grid>

            <Grid item xs={8} className={styles.coutryContainer}>
              <Grid xs={3}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={registrationFormData.country.showError}
                >
                  <TextField
                    label="Country"
                    name="country"
                    value={registrationFormData.country.value}
                    variant="outlined"
                    disabled
                  />
                </FormControl>
              </Grid>

              <Grid xs={3}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={registrationFormData.state.showError}
                >
                  <InputLabel>State</InputLabel>
                  <Select
                    label="State"
                    required
                    onChange={(event: SelectChangeEvent) => {
                      setRegistrationFormData((prev) => {
                        return {
                          ...prev,
                          city: { ...prev.city, valid: false, value: "" },
                        };
                      });
                      handleSelectChange(event);
                    }}
                    name="state"
                    value={registrationFormData.state.value || ""}
                  >
                    {state.map((name) => {
                      return <MenuItem value={name}>{name}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={3}>
                <Autocomplete
                  freeSolo
                  value={registrationFormData.city.value || null}
                  onChange={(_event: unknown, newValue: string | null) => {
                    setRegistrationFormData((pre: any) => {
                      return {
                        ...pre,
                        city: {
                          valid: newValue ? true : false,
                          value: newValue,
                          message: "",
                          showError: !newValue ? true : false,
                        },
                      };
                    });
                  }}
                  inputValue={registrationFormData.city.value || undefined}
                  onInputChange={(_event, newInputValue) => {
                    setRegistrationFormData((pre) => {
                      return {
                        ...pre,
                        city: {
                          valid: newInputValue ? true : false,
                          value: newInputValue,
                          message: "",
                          showError: !newInputValue ? true : false,
                        },
                      };
                    });
                  }}
                  options={cityList?.length ? cityList : ["No Option"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      required
                      value={registrationFormData.city.value || ""}
                      error={registrationFormData.city.showError}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid item xs={8}>
              <TextField
                label="Address"
                multiline
                rows={2}
                variant="outlined"
                type="text"
                fullWidth
                required
                name="address"
                onChange={handleTextChange}
                value={registrationFormData.address.value}
                error={
                  registrationFormData.address.showError &&
                  !registrationFormData.address.valid
                }
                helperText={
                  registrationFormData.address.showError &&
                  registrationFormData.address.message
                }
              />
            </Grid>

            {/* Referral Name */}
            <Grid item xs={8}>
              <TextField
                label="Referral Name"
                variant="outlined"
                fullWidth
                name="referralName"
                error={
                  !registrationFormData.referralName.valid &&
                  registrationFormData.referralName.showError
                }
                onChange={handleTextChange}
                helperText={
                  registrationFormData.referralName.showError &&
                  registrationFormData.referralName.message
                }
                value={registrationFormData.referralName.value}
              />
            </Grid>

            {/* Referral Mobile Number */}
            <Grid item xs={8}>
              <TextField
                label="Referral Mobile Number"
                variant="outlined"
                fullWidth
                name="referralMobile"
                error={
                  !registrationFormData.referralMobile.valid &&
                  registrationFormData.referralMobile.showError
                }
                onChange={handleTextChange}
                helperText={
                  registrationFormData.referralMobile.showError &&
                  registrationFormData.referralMobile.message
                }
                value={registrationFormData.referralMobile.value}
                type="tel"
                inputProps={{
                  pattern: "[0-9]{10}",
                  maxLength: 10,
                }}
              />
            </Grid>

            <Grid item xs={8}>
              <FormControl variant="outlined" fullWidth required>
                <InputLabel>Select Service</InputLabel>
                <Select
                  label="Select Service"
                  name="serviceType"
                  onChange={handleSelectChange}
                  value={registrationFormData.serviceType.value || ""}
                  error={registrationFormData.serviceType.showError}
                >
                  <MenuItem value="Pharmacy">Pharmacy</MenuItem>
                  <MenuItem value="Lab">Lab</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {registrationFormData.serviceType.value === "Pharmacy" && (
              <div className={styles.pharmaContainer}>
                <Grid container columnSpacing={1} spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      label="Medicine Name"
                      variant="outlined"
                      fullWidth
                      required
                      name="medicineName"
                      value={registrationFormData.medicineName.value || ""}
                      onChange={handleTextChange}
                      error={registrationFormData.medicineName.showError}
                      helperText={
                        registrationFormData.medicineName.showError &&
                        registrationFormData.medicineName.message
                      }
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      label="Dosage"
                      variant="outlined"
                      fullWidth
                      required
                      name="dosage"
                      value={registrationFormData.dosage.value || ""}
                      onChange={handleTextChange}
                      error={registrationFormData.dosage.showError}
                      helperText={
                        registrationFormData.dosage.showError &&
                        registrationFormData.dosage.message
                      }
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <FormControl variant="outlined" fullWidth required>
                      <InputLabel>Quantity</InputLabel>
                      <Select
                        label="Quantity"
                        name="quantity"
                        onChange={handleSelectChange}
                        value={registrationFormData.quantity.value || ""}
                        error={registrationFormData.quantity.showError}
                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={2} sx={{ mt: "10px" }}>
                    <Stack
                      spacing={1}
                      direction="row"
                      justifyContent="flex-end"
                    >
                      <Button
                        variant="contained"
                        onClick={handlePharmaSave}
                        sx={{ ml: "auto" }}
                      >
                        Save
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </div>
            )}

            {submittedPharmaData.length > 0 && (
              <Grid xs={8} style={{ paddingLeft: "18px" }}>
                <TableContainer
                  component={Paper}
                  className={styles.tabContainer}
                  style={{
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "16px",
                  }}
                >
                  <Table className={styles.tableContainer}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={styles.tableHeader}>
                          Sl. No.
                        </TableCell>
                        <TableCell className={styles.tableHeader}>
                          Medicine Name
                        </TableCell>
                        <TableCell className={styles.tableHeader}>
                          Dosage
                        </TableCell>
                        <TableCell className={styles.tableHeader}>
                          Quantity
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {submittedPharmaData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{data.medicineName}</TableCell>
                          <TableCell>{data.dosage}</TableCell>
                          <TableCell>{data.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}

            {registrationFormData.serviceType.value === "Lab" && (
              <>
                <Grid item xs={8}>
                  <FormControl variant="outlined" fullWidth required>
                    <InputLabel>Test Type</InputLabel>
                    <Select
                      label="Test Type"
                      name="testType"
                      onChange={handleSelectChange}
                      value={registrationFormData.testType.value || ""}
                      error={registrationFormData.testType.showError}
                    >
                      <MenuItem value="Radiology">Radiology</MenuItem>
                      <MenuItem value="Pathology">Pathology</MenuItem>
                      <MenuItem value="X-ray">X-ray</MenuItem>
                      <MenuItem value="Blood Test">Blood Test</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={8}>
                  <FormControl variant="outlined" fullWidth required>
                    <InputLabel>Test Name</InputLabel>
                    <Select
                      label="Test Name"
                      name="testName"
                      onChange={handleSelectChange}
                      value={registrationFormData.testName.value || ""}
                      error={registrationFormData.testName.showError}
                      disabled={!registrationFormData.testType.value} // Disable if no testType is selected
                    >
                      {(
                        testNameOptions[registrationFormData.testType.value] ||
                        []
                      ).map((test) => (
                        <MenuItem key={test} value={test}>
                          {test}
                        </MenuItem>
                      ))}
                    </Select>
                    {registrationFormData.testName.showError && (
                      <div style={{ color: "red" }}>
                        {registrationFormData.testName.message}
                      </div>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Test Date"
                    variant="outlined"
                    fullWidth
                    required
                    name="testDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={registrationFormData.testDate.value || ""}
                    onChange={handleTextChange}
                    error={registrationFormData.testDate.showError}
                    helperText={
                      registrationFormData.testDate.showError &&
                      registrationFormData.testDate.message
                    }
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                    }}
                  />
                </Grid>

                <Grid item xs={2} sx={{ mt: "10px" }}>
                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      sx={{ ml: "auto" }}
                    >
                      Save
                    </Button>
                  </Stack>
                </Grid>
              </>
            )}

            {submittedData.length > 0 && (
              <Grid xs={8} style={{ paddingLeft: "18px" }}>
                <TableContainer
                  component={Paper}
                  className={styles.tabContainer}
                  style={{
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "16px",
                  }}
                >
                  <Table className={styles.tableContainer}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={styles.tableHeader}>
                          Sl. No.
                        </TableCell>
                        <TableCell className={styles.tableHeader}>
                          Test Type
                        </TableCell>
                        <TableCell className={styles.tableHeader}>
                          Test Name
                        </TableCell>
                        <TableCell className={styles.tableHeader}>
                          Test Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {submittedData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{data.testType}</TableCell>
                          <TableCell>{data.testName}</TableCell>
                          <TableCell>{data.testDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}

            <Grid item xs={8}>
              <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                required
                value={registrationFormData.amount.value || "0"}
                disabled
              />
            </Grid>

            <Grid item xs={8}>
              <FormControl
                variant="outlined"
                fullWidth
                required
                error={registrationFormData.gst.showError}
              >
                <InputLabel>GST</InputLabel>
                <Select
                  label="GST"
                  name="gst"
                  onChange={(event: SelectChangeEvent) => {
                    setRegistrationFormData((state) => ({
                      ...state,
                      gst: {
                        value: event.target.value,
                        showError: false,
                        message: "",
                        valid: true,
                      },
                    }));
                    handleSelectChange(event);
                  }}
                  value={registrationFormData.gst.value || ""}
                >
                  <MenuItem value="With GST">With GST</MenuItem>
                  <MenuItem value="Without GST">Without GST</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={8}>
              <TextField
                label="Total Amount"
                variant="outlined"
                fullWidth
                required
                value={registrationFormData.totalAmount.value || "0"}
                disabled
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={8}>
              <FormControl
                variant="outlined"
                fullWidth
                required
                error={registrationFormData.paymentMethod.showError}
              >
                <InputLabel>Payment Method</InputLabel>
                <Select
                  label="Payment Method"
                  name="paymentMethod"
                  onChange={(event: SelectChangeEvent) => {
                    setRegistrationFormData((state) => ({
                      ...state,
                      paymentMethod: {
                        value: event.target.value,
                        showError: false,
                        message: "",
                        valid: true,
                      },
                    }));
                    handleSelectChange(event);
                  }}
                  value={registrationFormData.paymentMethod.value || ""}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Debit Card">Debit Card</MenuItem>
                  <MenuItem value="Online Payment">Online Payment</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ mt: "30px" }} className={styles.button}>
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                  variant="contained"
                  sx={{ ml: "auto" }}
                  onClick={handleOpen}
                >
                  Submit
                </Button>
              </Stack>
              <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                  variant="contained"
                  sx={{ ml: "auto", backgroundColor: "green" }}
                  onClick={handlePaymentCompletion}
                >
                  Pay Now
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Dialog
            open={isPaymentSuccess}
            onClose={handleClose}
            aria-labelledby="payment-success-dialog-title"
            aria-describedby="payment-success-dialog-description"
          >
            <DialogTitle id="payment-success-dialog-title">
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircleIcon style={{ color: "green" }} />
                <Typography variant="h6" component="span">
                  Payment Successful
                </Typography>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="payment-success-dialog-description">
                Your payment has been successfully processed.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>

          {/* submit  popup */}
          <Dialog
            open={open}
            onClose={handleSubmitClose}
            aria-labelledby="profile-dialog-title"
            aria-describedby="profile-dialog-description"
            PaperProps={{
              sx: { padding: 4, textAlign: "center", width: "350px" },
            }}
          >
            <DialogTitle id="profile-dialog-title" sx={{ p: 0 }}>
              <Stack direction="column" alignItems="center" spacing={2}>
                <Avatar sx={{ width: 80, height: 80 }}>
                  <AccountCircleIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="h5" component="span">
                  John Doe
                </Typography>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" component="p">
                ID: 123456
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack direction="column" alignItems="center" spacing={1}>
                <CheckCircleIcon style={{ color: "green", fontSize: 50 }} />
                <Typography variant="h6" component="p">
                  Thank you
                </Typography>
                <Typography component="p">
                  Your form hasbeen submitted
                </Typography>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
              <Button onClick={handleSubmitClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
export default EnrollmentDesk;

//up on successfull payment data should submit to corresponding department
