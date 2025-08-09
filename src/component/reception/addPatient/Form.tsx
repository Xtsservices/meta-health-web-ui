import React, { useCallback, useEffect, useState, ChangeEvent } from "react";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Grid,
  Chip,
  Stack,
  SelectChangeEvent,
  Autocomplete
} from "@mui/material";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Radio,
  IconButton,
  RadioGroup,
  FormControlLabel
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { patientOPDbasicDetailType, staffType } from "../../../types";
import { state, city } from "../../../utility/state";
import { authFetch } from "../../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { Role_NAME } from "../../../utility/role";
import { setError } from "../../../store/error/error.action";
import {
  Category,
  getMaxValue,
  getUniqueId,
  getValidationMessage,
  genderList
} from "./helper";

import cards from "../../../../src/assets/addPatient/Frame3809.png";
import online from "../../../../src/assets/addPatient/Frame3810.png";
import { validateAgeAndUnit } from "../../../utility/ageValidation";

type Department = {
  id: number;
  name: string;
};

type category = {
  category: string;
  formData: patientOPDbasicDetailType;
  setFormData: React.Dispatch<React.SetStateAction<patientOPDbasicDetailType>>;
};

function Form({ category, formData, setFormData }: category) {
  const user = useSelector(selectCurrentUser);
  const [title, setTitle] = useState("");
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [cityList, setCityList] = useState<string[]>([]);
  const [doctorList, setDoctorList] = useState<staffType[]>([]);
  const [titleList, setTitleList] = useState<string[]>([]);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [ageUnit, setAgeUnit] = React.useState("");
console.log("opcity",cityList)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePaymentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedPayment(event.target.value);
  };

  const handleSubmit = () => {
    setPaymentCompleted(true);
    setOpen(false);
  };

  const handleUnitChange = (event: SelectChangeEvent) => {
    const newUnit = event.target.value;
    setAgeUnit(newUnit); // Only update local state

    const ageValue = parseInt(formData.age.value.split(" ")[0]) || 0;

    // Validate new age-unit combination
    const { isValid, message } = validateAgeAndUnit(ageValue, newUnit, category);

    if (isValid) {
      setFormData((prev) => ({
        ...prev,
        age: { ...prev.age, value: `${ageValue} ${newUnit}`, valid: true, showError: false, message: "" },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        age: { ...prev.age, valid: false, showError: true, message },
      }));
    }
  };


  const getAllList = useCallback(async () => {
    const doctorResponse = await authFetch(
      `user/${user.hospitalID}/list/${Role_NAME.doctor}`,
      user.token
    );
    if (doctorResponse.message === "success") {
      setDoctorList(doctorResponse.users);
    }
  }, [user.hospitalID, user.token]);

  const handleTitleChange = (event: SelectChangeEvent) => {
    setTitle(event.target.value);
  };

  const fetchDepartments = async () => {
    try {
      const response = await authFetch(`department/${user.hospitalID}`, user.token);
      if (response.message === "success") {
        setDepartmentList(response.departments); 
      } else {
        console.error("Failed to fetch departments:", response);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    if (user.token) {
      fetchDepartments();
    }
  }, [user.token]);

    React.useEffect(() => {
      if (formData.dob.value) {
        const dob = new Date(formData.dob.value);
        const today = new Date();
        const ageInDays = Math.floor((today.getTime() - dob.getTime()) / (1000 * 3600 * 24));
  
        let ageValue = ageInDays;
        let unit = "days";
  
        if (ageInDays >= 365) {
          ageValue = Math.floor(ageInDays / 365);
          unit = "years";
        } else if (ageInDays >= 30) {
          ageValue = Math.floor(ageInDays / 30);
          unit = "months";
        }
  
        setAgeUnit(unit); // Only for temporary UI
        const combinedAge = `${ageValue} ${unit}`;
  
        setFormData((prev) => ({
          ...prev,
          age: { ...prev.age, value: combinedAge, valid: true, showError: false },
        }));
      }
    }, [formData.dob.value]);
  

  const handleGenderSelect = (value: string) => {
    const genderValue = value === "Male" ? 1 : value === "Female" ? 2 : 3;
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      gender: {
        value: genderValue,
        name: "gender",
        message: "",
        valid: true,
        showError: false
      }
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    const isvalid = true;
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    
    setFormData((state: any) => ({
      ...state,
      [name]: { valid: isvalid, showError, value, message, name }
    }));
  };

  const handleStateChange = (event: SelectChangeEvent) => {
    handleSelectChange(event);
    const stateName = state.indexOf(formData.state.value || "");
    const cityList = city[stateName];
    setCityList(cityList);
  };

  React.useEffect(() => {
    const stateName = state.indexOf(formData.state.value || "");
    setCityList(city[stateName]);
  }, [formData.state]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: "weight" | "height"
  ) => {
    const inputValue =
      type === "weight"
        ? parseInt(event.target.value)
        : parseFloat(event.target.value);
    const name = event.target.name;
    const message = inputValue
      ? getValidationMessage(inputValue, category, type)
      : "This field is required";
    const isValid = inputValue && !message;

    setFormData((state: any) => ({
      ...state,
      [name]: {
        valid: isValid,
        showError: !isValid,
        value: event.target.value,
        message,
        name
      }
    }));
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    let isvalid = event.target.validity.valid;
    let showError = !isvalid;
    let message = "This field is required";
    let newValue = value;
    console.log(newValue);
    const nameregex = /^[A-Za-z\s]*$/;

    if (event.target.validity.stepMismatch) {
      isvalid = true;
    }

    if (name === "age") {
      const ageValue = parseInt(value) || 0;

      // Validate the age and unit combination
      const { isValid, message } = validateAgeAndUnit(ageValue, ageUnit, category);

      if (isValid) {
        setFormData((prev) => ({
          ...prev,
          age: { ...prev.age, value: `${ageValue} ${ageUnit}`, valid: true, showError: false, message: "" },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          age: { ...prev.age, value: "", valid: false, showError: true, message },
        }));
      }
    }
    else if (name === "dob") {
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
          } else {
            isvalid = false;
            showError = true;
            dispatch(setError("Please enter a valid date"));
          }
        } else {
          isvalid = false;
          showError = true;
          message = "Please enter a complete date (year, month, and day)";
          dispatch(setError(message));
        }
      } 

      let ageValid = true;

      switch (category) {
        case "1":
          if (ageInDays < 0 || ageInDays > 28) {
            ageValid = false;
            dispatch(setError("Neonate age should be between 0 to 28 days"));
          }
          break;
        case "2":
          if (ageInDays <= 28 || ageInDays / 365 > 18) {
            ageValid = false;
            dispatch(
              setError("Child age should be between 29 days to 18 years")
            );
          }
          break;
        case "3":
          if (ageInDays / 365 <= 18) {
            ageValid = false;
            dispatch(setError("Adult age should be more than 18 years"));
          }
          break;
        default:
          ageValid = true;
          break;
      }

      isvalid = ageValid;
      showError = !ageValid;
    }
    if (name == "pName" || name === "guardianName") {
      if (nameregex.test(value) && value.length < 50) {
        newValue = value;
      } else {
        return;
      }
    } else if (name == "pUHID") {
      newValue = value;
    } else if (name == "phoneNumber" || name == "pinCode") {
      newValue = value.replace(/\D/g, "");
    } else if (name === "email") {
      if (event.target.value === "") {
        isvalid = true; // Optional email is valid if empty
        showError = false;
      } else if (!event.target.validity.valid) {
        isvalid = false;
        message = "Invalid email format";
      }
    } else if (name == "referredBy") {
      message = "";
      if (
        nameregex.test(event.target.value) &&
        event.target.value.length < 50
      ) {
        newValue = event.target.value;
      } else {
        return;
      }
    }

    setFormData((state: any) => {
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

  useEffect(() => {
    if (user.token) {
      getAllList();
    }
  }, [user.token]);

  useEffect(() => {
    if (category == "1") {
      setTitleList(["B/O"]);
      setTitle("B/O");
    }
    if (category == "2") {
      setTitleList(["Master", "Miss"]);
      setTitle("Master");
    } else if (category == "3") {
      setTitleList(["Mr.", "Mrs.", "Miss", "Ms."]);
      setTitle("Mr.");
    }
  }, [category]);

  useEffect(() => {
    const value = getUniqueId();
    setFormData((state: any) => ({
      ...state,
      pID: { valid: true, showError: false, value, message: "", name: "pID" }
    }));
  }, []);

  const handleCountryCodeChange = (event: SelectChangeEvent<string>) => {
    setCountryCode(event.target.value);
  };

  const [filteredDoctors, setFilteredDoctors] = useState<staffType[]>([]);
  const [selectedDepartmentID, setSelectedDepartmentID] = useState<number | null>(null);

useEffect(() => {
  if (formData.department.value) {
    setFilteredDoctors(doctorList.filter((doc) => doc.departmentID === selectedDepartmentID));
  } else {
    setFilteredDoctors(doctorList);
  }
}, [formData.department.value, doctorList]);

  // const departmentList = [
  //   { id: 1, name: "Cardiology" },
  //   { id: 2, name: "Neurology" },
  //   { id: 3, name: "Orthopedics" },
  //   { id: 4, name: "Pediatrics" },
  //   { id: 5, name: "General Medicine" }
  // ];

  return (
    <Grid container columnSpacing={2} rowSpacing={4}>
      <Grid container xs={12} item>
        <Grid item xs={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Title</InputLabel>
            <Select
              onChange={handleTitleChange}
              label="Title"
              required
              value={title}
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
            error={!formData.pName.valid && formData.pName.showError}
            onChange={handleTextChange}
            helperText={
              formData.pName.showError &&
              (formData.pName.message ||
                (formData.pName.value === "" && "Please Enter Patient's Name"))
            }
            value={formData.pName.value}
          />
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Patient's ID"
          variant="outlined"
          fullWidth
          required
          disabled
          error={!formData.pID.valid && formData.pID.showError}
          helperText={formData.pID.showError && formData.pID.message}
          name="pID"
          value={formData.pID.value || ""}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="UHID"
          variant="outlined"
          fullWidth
          onChange={handleTextChange}
          error={!formData.pUHID.valid && formData.pUHID.showError}
          helperText={formData.pUHID.showError && formData.pUHID.message}
          name="pUHID"
          value={formData.pUHID.value || ""}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Date of Birth"
          variant="outlined"
          fullWidth
          type="date"
          onChange={handleTextChange}
          error={!formData.dob.valid && formData.dob.showError}
          helperText={formData.dob.showError && formData.dob.message}
          name="dob"
          InputLabelProps={{
            shrink: true
          }}
          value={formData.dob.value}
          inputProps={{
            max: new Date().toISOString().split("T")[0]
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={1} alignItems="center" columnGap={2}>
          Gender*
          {genderList.map((el) => (
            <Chip
              key={el.key}
              label={el.value}
              onClick={() => handleGenderSelect(el.value)}
              color={formData.gender.value === el.key ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
            />
          ))}
          <TextField
            label="Age"
            variant="outlined"
            type="number"
            name="age"
            value={formData.age.value.split(" ")[0] || ""}
            onChange={handleTextChange}
            inputProps={{ min: 0 }}
            error={!formData.age.valid && formData.age.showError}
            helperText={
              formData.age.showError &&
              (formData.age.message ||
                (formData.age.value === "" && "Please Enter Age"))
            }
          />
          <FormControl variant="outlined" sx={{ width: "120px" }}>
            <InputLabel>Unit</InputLabel>
            <Select label="Unit" value={ageUnit} onChange={handleUnitChange}>
              <MenuItem value="days">Days</MenuItem>
              <MenuItem value="months">Months</MenuItem>
              <MenuItem value="years">Years</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <p style={{ color: "#d84315", fontSize: "12px" }}>
          {formData.gender.showError && "Please Select Gender"}
        </p>
      </Grid>
      <Grid container xs={6} item>
        <Grid item xs={6}>
          <TextField
            label="Weight"
            variant="outlined"
            fullWidth
            required
            type="number"
            onChange={(event) => handleInputChange(event, "weight")}
            error={!formData.weight.valid && formData.weight.showError}
            helperText={
              formData.weight.showError &&
              (formData.weight.message ||
                (formData.weight.value === null && "Please Enter Weight"))
            }
            name="weight"
            value={formData.weight.value || ""}
            inputProps={{
              min: 0,
              max: getMaxValue(category as Category, "weight")
            }}
          />
        </Grid>
        <Grid item md={5} xs={4}>
          <FormControl variant="outlined" fullWidth>
            <TextField
              variant="outlined"
              value="Kg"
              InputProps={{
                readOnly: true
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container xs={6} item>
        <Grid item xs={6}>
          <TextField
            label="Height"
            variant="outlined"
            fullWidth
            required
            onChange={(event) => handleInputChange(event, "height")}
            error={!formData.height.valid && formData.height.showError}
            helperText={
              formData.height.showError &&
              (formData.height.message ||
                (formData.height.value === null && "Please Enter Height"))
            }
            name="height"
            type="number"
            value={formData.height.value || ""}
            inputProps={{
              min: 0,
              max: getMaxValue(category as Category, "height")
            }}
          />
        </Grid>
        <Grid item md={5} xs={4}>
          <FormControl variant="outlined" fullWidth>
            <TextField
              variant="outlined"
              value="cm"
              InputProps={{
                readOnly: true
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container xs={12} item>
        <Grid item xs={3}>
          <FormControl variant="outlined" fullWidth>
            <Select value={countryCode} onChange={handleCountryCodeChange}>
              <MenuItem value="+91">+91</MenuItem>
              <MenuItem value="+01">+01</MenuItem>
              <MenuItem value="+44">+44</MenuItem>
              {/* Add more MenuItem elements as needed */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={9}>
          <TextField
            label="Mobile Number"
            variant="outlined"
            fullWidth
            required
            onChange={handleTextChange}
            error={
              !formData.phoneNumber.valid && formData.phoneNumber.showError
            }
            helperText={
              formData.phoneNumber.showError &&
              (formData.phoneNumber.message ||
                (formData.phoneNumber.value === null &&
                  "Please Enter Mobile Number"))
            }
            name="phoneNumber"
            value={formData.phoneNumber.value || ""}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 10,
              minLength: 10
            }}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email ID"
          variant="outlined"
          type="email"
          fullWidth
          name="email"
          onChange={handleTextChange}
          helperText={formData.email.showError && formData.email.message}
          value={formData.email.value}
        />
      </Grid>
      <Grid item xs={12}>
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
          value={formData.address.value}
          error={formData.address.showError && !formData.address.valid}
          helperText={
            formData.address.showError &&
            (formData.address.message ||
              (formData.address.value === "" && "Please Enter Address"))
          }
        />
      </Grid>
      <Grid item xs={4}>
        <FormControl
          variant="outlined"
          fullWidth
          required
          error={formData.state.showError}
        >
          <InputLabel>State</InputLabel>
          <Select
            label="State"
            required
            onChange={(event: SelectChangeEvent) => {
              setFormData((prev: any) => {
                return {
                  ...prev,
                  city: { ...prev.city, valid: false, value: "" }
                };
              });
              handleStateChange(event);

            }}
            name="state"
            value={formData.state.value || ""}
          >
            {state.map((name: string) => {
              return <MenuItem value={name}>{name}</MenuItem>;
            })}
          </Select>
          <p style={{ color: "#d84315", fontSize: "12px", marginTop: "5px" }}>
            {formData.state.showError &&
              formData.state.value === "" &&
              "Please Select State"}
          </p>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          freeSolo // Allow the user to input a value that's not in the options list
          value={formData.city.value || null}
          onChange={(_event: unknown, newValue: string | null) => {
            setFormData((pre: any) => {
              return {
                ...pre,
                city: {
                  valid: newValue ? true : false,
                  value: newValue,
                  message: "",
                  showError: !newValue ? true : false
                }
              };
            });
          }}
          inputValue={formData.city.value || undefined}
          onInputChange={(_event, newInputValue) => {
            setFormData((pre: any) => {
              return {
                ...pre,
                city: {
                  valid: newInputValue ? true : false,
                  value: newInputValue,
                  message: "",
                  showError: !newInputValue ? true : false
                }
              };
            });
          }}
          options={cityList?.length ? cityList : ["No Option"]}
          renderInput={(params) => (
            <TextField
              {...params}
              label="City"
              required
              value={formData.city.value || ""}
              error={formData.city.showError}
            />
          )}
        />
        <p style={{ color: "#d84315", fontSize: "12px", marginTop: "5px" }}>
          {formData.city.showError &&
            formData.city.value === "" &&
            "Please Select State"}
        </p>
      </Grid>
      <Grid item xs={4}>
        <TextField
          id="outlined-required"
          label="Pincode"
          name="pinCode"
          value={formData.pinCode.value || ""}
          error={formData.pinCode.showError && !formData.pinCode.valid}
          helperText={
            formData.pinCode.showError &&
            (formData.pinCode.message ||
              (formData.pinCode.value === "" && "Please Enter Pincode"))
          }
          onChange={handleTextChange}
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            maxLength: 6,
            minLength: 6
          }}
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Referred by"
          variant="outlined"
          type="text"
          fullWidth
          name="referredBy"
          onChange={handleTextChange}
          value={formData.referredBy.value}
          error={formData.referredBy.showError && !formData.referredBy.valid}
          helperText={formData.referredBy.message}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl variant="outlined" fullWidth required>
          <InputLabel>Insurance</InputLabel>
          <Select
            label="Insurance"
            required
            onChange={(event: SelectChangeEvent) => {
              setFormData((state: any) => {
                return {
                  ...state,
                  insurance: {
                    value: Number(event.target.value) as 0 | 1,
                    showError: false,
                    message: "",
                    valid: true
                  }
                };
              });
            }}
            name="insurance"
            value={String(formData.insurance.value)}
          >
            <MenuItem value={"1"}>Yes</MenuItem>
            <MenuItem value={"0"}>No</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl
          variant="outlined"
          fullWidth
          required
          error={formData.department.showError}
        >
          <InputLabel>Department</InputLabel>
          <Select
            label="Department"
            required
            onChange={(event: SelectChangeEvent) => {
              const departmentID = Number(event.target.value);
              setSelectedDepartmentID(departmentID); // Store department ID in state

              setFormData((state: any) => {
                const selectedDepartment = departmentList.find(
                  (dept) => dept.id === departmentID
                );
                return {
                  ...state,
                  department: {
                    value: selectedDepartment,
                    showError: false,
                    message: "",
                    valid: true
                  }
                };
              });
              handleSelectChange(event);
            }}
            name="department"
            value={String(formData.department.value) || undefined}
          >
            {departmentList.map((dept) => {
              return <MenuItem value={dept.id}>{dept.name}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <p style={{ color: "#d84315", fontSize: "12px", marginTop: "5px" }}>
          {formData.department.showError &&
            formData.department.value === "" &&
            "Please Select Department"}
        </p>
      </Grid>

      <Grid item xs={12}>
        <FormControl
          variant="outlined"
          fullWidth
          required
          error={formData.userID.showError}
        >
          <InputLabel>Doctor</InputLabel>
          <Select
            label="Doctor"
            required
            onChange={(event: SelectChangeEvent) => {
              setFormData((state: any) => {
                const selectedDoctor = filteredDoctors.find((el) => el.id === Number(event.target.value));
                return {
                  ...state,
                  userID: {
                    value: selectedDoctor?.id || "",
                    showError: false,
                    message: "",
                    valid: true
                  },
                  departmentID: {
                    value: selectedDoctor?.departmentID || "",
                    showError: false,
                    message: "",
                    valid: true
                  }
                };
              });
              handleSelectChange(event);
            }}
            name="userID"
            value={String(formData.userID.value) || ""}
          >
            {filteredDoctors.map((doc) => (
              <MenuItem key={doc.id} value={doc.id}>
                {`${doc.firstName ? doc.firstName : ""} ${doc.lastName ? doc.lastName : ""}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <p style={{ color: "#d84315", fontSize: "12px", marginTop: "5px" }}>
          {formData.userID.showError &&
            formData.userID.value === null &&
            "Please Select Doctor"}
        </p>
      </Grid>

      {formData?.department.value && formData?.departmentID.value && (
        <>
          <Box sx={{ padding: "20px", margin: "auto", borderRadius: "8px" }}>
            {/* Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#007bff" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Fee
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      GST
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Consultation</TableCell>
                    <TableCell>500</TableCell>
                    <TableCell>18%</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                      590.00
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Payment Details Section */}
            <Box
              sx={{
                marginTop: "20px",
                padding: "20px",
                width: "800px",
                margin: "auto",
                borderRadius: "8px"
              }}
            >
              <Typography
                variant="body1"
                component="p"
                sx={{
                  fontWeight: "bold",
                  marginBottom: "10px",
                  color: "#007bff"
                }}
              >
                Payment Details
              </Typography>

              {/* Input Fields and Payment Summary in a Row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px", // Spacing between inputs
                  marginBottom: "20px",

                  padding: "10px",
                  borderRadius: "8px"
                }}
              >
                <TextField
                  label="Discount%"
                  variant="outlined"
                  size="small"
                  name="discount"
                  value={formData.discount.value}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      discount: { ...prevData.discount, value: e.target.value }
                    }))
                  }
                  sx={{ width: "15%" }}
                />
                <TextField
                  label="Reason"
                  variant="outlined"
                  size="small"
                  name="reason"
                  sx={{ width: "20%" }}
                  value={formData.reason.value}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      reason: { ...prevData.reason, value: e.target.value }
                    }))
                  }
                />
                <TextField
                  label="ID"
                  name="id"
                  variant="outlined"
                  size="small"
                  sx={{ width: "20%" }}
                  value={formData.id.value}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      id: { ...prevData.id, value: e.target.value }
                    }))
                  }
                />
                <Typography
                  sx={{
                    fontWeight: "bold",

                    fontSize: "14px"
                  }}
                >
                  <strong>Gross:</strong>{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      marginRight: "10px"
                    }}
                  >
                    500
                  </span>{" "}
                  <strong>GST:</strong>{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      marginRight: "10px"
                    }}
                  >
                    90
                  </span>{" "}
                  <strong>Total:</strong>{" "}
                  <span style={{ fontWeight: "bold", color: "black" }}>
                    590
                  </span>
                </Typography>
              </Box>

              {/* Pay Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end"
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: paymentCompleted ? "green" : "#007bff",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    textTransform: "none",
                    "&.Mui-disabled": {
                      backgroundColor: "#90ee90", // green background for disabled state
                      color: "white"
                    }
                  }}
                  onClick={handleClickOpen}
                  disabled={paymentCompleted}
                >
                  {paymentCompleted ? "Payment Completed" : "Pay"}
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "20px",
            color: "black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span
            style={{ textAlign: "center", margin: "10px", color: "#007bff" }}
          >
            Select Payment Method
          </span>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: "10px",
              top: "10px"
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              backgroundColor: "#e6f4ff", // Light blue background
              padding: "40px",
              borderRadius: "10px"
            }}
          >
            <RadioGroup value={selectedPayment} onChange={handlePaymentChange}>
              <FormControlLabel
                value="card"
                control={<Radio />}
                label="Credit or Debit Cards"
              />
              <img
                src={cards}
                alt="GPay"
                style={{ height: "20px", width: "200px", marginBottom: "20px" }}
              />
              <FormControlLabel
                value="online"
                control={<Radio />}
                label="Online"
              />
              <img
                src={online}
                alt="GPay"
                style={{ height: "20px", width: "150px", marginBottom: "20px" }}
              />
              <FormControlLabel value="cash" control={<Radio />} label="Cash" />
            </RadioGroup>
          </Box>
          <Box
            sx={{
              textAlign: "center",
              marginTop: "20px"
            }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
              disabled={!selectedPayment}
              sx={{
                padding: "6px 26px",
                width: "fit-content",
                borderRadius: "20px",
                textTransform: "none",
                backgroundColor: "orange",
                "&:hover": {
                  backgroundColor: "darkorange" // Set a darker shade on hover
                }
              }}
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

export default Form;
