import React, { useEffect, useRef, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { patientbasicDetailType, staffType, wardType } from "../../../types";
import { state } from "../../../utility/state";
import { city } from "../../../utility/state";
import { authFetch } from "../../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { Role_NAME, patientStatus } from "../../../utility/role";
import Autocomplete from "@mui/material/Autocomplete";
import { capitalizeFirstLetter } from "../../../utility/global";
import { useParams } from "react-router-dom";
import { setError } from "../../../store/error/error.action";
import ContactForm from "../ContactForm/ContactForm";
import { validateAgeAndUnit } from "../../../utility/ageValidation";

const genderList = [
  { value: "Male", key: 1 },
  { value: "Female", key: 2 },
  { value: "Others", key: 3 },
];

type category = {
  category: string;
  formData: patientbasicDetailType;
  setFormData: React.Dispatch<React.SetStateAction<patientbasicDetailType>>;
};


function Form_start({ category, formData, setFormData }: category) {
  const [countryCode, setCountryCode] = useState<string>('+91');
  const user = useSelector(selectCurrentUser);
  const [title, setTitle] = React.useState("");
  const [cityList, setCityList] = React.useState<string[]>([]);
  const { ptype } = useParams();
  const [doctorList, setDoctorList] = React.useState<staffType[]>([]);
  const [wardList, setWardList] = React.useState<wardType[]>([]);
  const getAllListApi = useRef(true)
  const [, setRelationList] = React.useState<string[]>([]);
  const [ageUnit, setAgeUnit] = useState("");
  const dispatch = useDispatch()
  React.useEffect(() => {
    const stateName = state.indexOf(formData.state.value || "");
    setCityList(city[stateName]);
  }, [formData.state]);
  React.useEffect(() => {
    if (category == "neonate") {
      setTitle("B/O");
    }
    if (category == "child") {
      setTitle("Master");
    } else if (category == "adult") setTitle("Mr.");
  }, []);

  const getMaxWeight = (category: string): number => {
    switch (category) {
      case "adult":
        return 300;
      case "child":
        return 175;
      case "neonate":
        return 8;
      default:
        return 300; // Default to adult if category is not specified
    }
  };

  const getMaxHeight = (category: string): number => {
    switch (category) {
      case "adult":
        return 305;
      case "child":
        return 200;
      case "neonate":
        return 60;
      default:
        return 305; // Default to adult if category is not specified
    }
  };

  const getAllList = async () => {
    const doctorResponse = await authFetch(
      `user/${user.hospitalID}/list/${Role_NAME.doctor}`,
      user.token
    );
    const relationResponse = await authFetch("data/relations", user.token);
    if (relationResponse.message == "success") {
      setRelationList(relationResponse.relations);
    }

    if (doctorResponse.message == "success") {
      setDoctorList(doctorResponse.users);
    }
    const wardResonse = await authFetch(`ward/${user.hospitalID}`, user.token);
    if (wardResonse.message == "success") {
      setWardList(wardResonse.wards);
    }
  };
  // const [postalList, setPostalList] = React.useState<string[]>([]);
  // const getPostalList = async () => {
  //   const res = await authFetch(
  //     `data/pincode/${formData.city.value}`,
  //     user.token
  //   );
  //   if (res.message == "success") {
  //     // console.log("resss", res);
  //     setPostalList(
  //       res.data.length
  //         ? res.data.map((el: { pincode: string }) => el.pincode)
  //         : []
  //     );
  //   }
  // };
  // // console.log("postalList", postalList);
  // React.useEffect(() => {
  //   if (
  //     formData.city.value &&
  //     city.flat().includes(formData.city.value || "")
  //   ) {
  //     getPostalList();
  //   }
  // }, [formData.city.value]);

  React.useEffect(() => {
    if (user.token && getAllListApi.current) {
      getAllListApi.current = false
      getAllList();
    }
  }, [user.token]);
  const handleTitleChange = (event: SelectChangeEvent) => {
    setTitle(event.target.value);
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

    setGender(genderValue); // Assuming setGender updates the gender state

    setFormData((prevFormData) => ({
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
  const handleSelectChange = (event: SelectChangeEvent) => {
    // setAge(event.target.value);

    const isvalid = true;
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    const name = event.target.name;

    setFormData((state) => {
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

    // const today = new Date();
    // const dob = new Date(value);
    // const ageInMs = today.getTime() - dob.getTime();
    // const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);

    // console.log(event.target.validity);
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
    else if (name === "weight") {
      const inputValue = parseInt(event.target.value);
      if (!inputValue) {
        message = "This field is required";
      } else {
        if (category == "adult" && inputValue > 300) {
          message = "Weight should be under 300 kgs";
        } else if (category == "child" && inputValue > 175) {
          message = "Weight should be under 175 kgs";
        } else if (category == "neonate" && inputValue > 8) {
          message = "Weight should be under 8 kgs";
          isvalid = false;
        }
      }
    } else if (name === "dob") {
      const dobValue = event.target.value;
      const dob = new Date(event.target.value);
      const today = new Date();
      // const ageInDays = (today.getTime() - dob.getTime()) / (1000 * 3600 * 24);
      let ageInDays = 0;
      if (dobValue) {
        // Check if the dobValue has year, month, and day parts
        const parts = dobValue.split("-");
        if (parts.length === 3) {
          const [year, month, day] = parts.map(Number);
          if (year > 1900 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            ageInDays = (today.getTime() - dob.getTime()) / (1000 * 3600 * 24);
          } else {
            // Display error if the date is not valid
            isvalid = false;
            showError = true;
            dispatch(setError("Please enter a valid date"));
          }
        } else {
          // Display error if date is incomplete
          isvalid = false;
          showError = true;
          // dispatch(setError("Please enter a complete date (year, month, and day)"));
          message = "Please enter a complete date (year, month, and day)";
          dispatch(setError(message));
        }
      }


      let ageValid = true;

      switch (category) {
        case "neonate":
          if (ageInDays < 0 || ageInDays > 28) {
            ageValid = false;
            dispatch(setError("Neonate age should be between 0 to 28 days"))
          }
          break;
        case "child":
          if (ageInDays <= 28 || ageInDays / 365 > 18) {
            ageValid = false;
            dispatch(setError("Child age should be between 29 days to 18 years"))
          }
          break;
        case "adult":
          if (ageInDays / 365 <= 18) {
            ageValid = false;
            dispatch(setError("Adult age should be more than 18 years"))
          }
          break;
        default:
          ageValid = true;
          break;
      }

      isvalid = ageValid;
      showError = !ageValid;
    }

    else if (name === "height") {
      const inputValue = parseFloat(event.target.value);
      if (!inputValue) {
        message = "This field is required";
      } else {
        if (category == "adult" && inputValue > 305) {
          message = "Height should be under 305 cms";
        } else if (category == "child" && inputValue > 200) {
          message = "Height should be under 200 cms";
        } else if (category == "neonate" && inputValue > 60) {
          message = "Height should be under 60 cms";
        }
      }
    } else if (name == "pName" || name === "guardianName") {
      if (
        nameregex.test(event.target.value) &&
        event.target.value.length < 50
      ) {
        value = event.target.value;
      } else {

        return;
      }
    }
    else if (name === "pUHID") {
      // ABHA ID validation
      const abhaId = event.target.value.replace(/[^0-9]/g, ''); // Remove non-digits (e.g., dashes)
      value = event.target.value; // Retain original input for display
      if (!abhaId) {
        message = "ABHA ID is required";
        isvalid = false;
        showError = true;
      } else if (!/^\d{14}$/.test(abhaId)) {
        message = "ABHA ID must be exactly 14 digits";
        isvalid = false;
        showError = true;
      } else {
        // Format the ABHA ID for display (e.g., XXXX-XXXX-XXXX-XX)
        const formattedAbhaId = abhaId.replace(/(\d{4})(\d{4})(\d{4})(\d{2})/, '$1-$2-$3-$4');
        value = formattedAbhaId;
        isvalid = true;
        showError = false;
        message = "";
      }
    } else if (name == "phoneNumber" || name == "pinCode") {
      value = event.target.value.replace(/\D/g, "");
    }
    else if (name === "email") {
      if (event.target.value === "") {
        isvalid = false;
        showError = true;
      } else if (!event.target.validity.valid) {
        isvalid = false;
        message = "Invalid email format";

      }
    }
    else if (name == "referredBy") {
      message = ""
      if (
        nameregex.test(event.target.value) &&
        event.target.value.length < 50
      ) {
        value = event.target.value;
      } else {
        return;
      }
    }

    setFormData((state) => {
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

  // console.log("state city", formData.city.valid);
  const [, setGender] = React.useState<number>(0);
  const [titleList, setTitleList] = React.useState<string[]>([]);
  React.useEffect(() => {
    // console.log("category", category);
    if (category == "neonate") {
      setTitleList(["B/O"]);
    }
    if (category == "child") {
      setTitleList(["Master", "Miss"]);
    } else if (category == "adult") {
      setTitleList(["Mr.", "Mrs.", "Miss", "Ms."]);
    }
  }, [category]);

  React.useEffect(() => {
    setFormData((prev) => {
      return {
        ...prev,
        insuranceNumber: {
          valid:
            !formData.insurance.value || formData.insuranceNumber.value
              ? true
              : false,
          value: formData.insuranceNumber.value,
          showError: false,
          message: "",
        },
        insuranceCompany: {
          valid:
            !formData.insurance.value || formData.insuranceCompany.value
              ? true
              : false,
          value: formData.insuranceCompany.value,
          showError: false,
          message: "",
        },
      };
    });
  }, [
    formData.insurance,
    formData.insuranceCompany.value,
    formData.insuranceNumber.value,
    setFormData,
  ]);
  // console.log("category", category, title);


  useEffect(() => {
    function generateUniqueId() {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const date = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const uniqueId = `${year}${month}${date}${hours}${minutes}${seconds}`;

      return uniqueId;
    }

    // Example usage
    const value = generateUniqueId();
    const isvalid = true;
    const name = "pID";
    const showError = false;
    const message = "";


    setFormData((state) => {
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


  }, [])


  const handleCountryCodeChange = (event: SelectChangeEvent<string>) => {
    setCountryCode(event.target.value);
  };


  return (
    <Grid container columnSpacing={2} rowSpacing={4}>
      <Grid container xs={12} item>
        <Grid item xs={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Title</InputLabel>
            <Select
              // value={title}
              onChange={handleTitleChange}
              label="Title"
              required
              // value={category=="neonate"?bo":"mr}
              // value={category == "neonate" ? "bo" : "mr"}
              // defaultValue={category == "neonate" ? "bo" : "mr"}
              value={title}
            >
              {titleList.map((el) => {
                return <MenuItem value={el} sx={{ color: "grey" }}>{el}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={9}>
          <TextField
            label="Patient Name"
            //   helperText="Enter your name"
            variant="outlined"
            fullWidth
            required
            name="pName"
            error={!formData.pName.valid && formData.pName.showError}
            onChange={handleTextChange}
            helperText={formData.pName.showError && (formData.pName.message || formData.pName.value === "" && "Please Enter Patient's Name")}
            value={formData.pName.value}
          />
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Patient's ID"
          //   helperText="Enter your name"
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
          label="ABHA ID"
          //   helperText="Enter your name"
          variant="outlined"
          fullWidth
          required
          onChange={handleTextChange}
          error={!formData.pUHID.valid && formData.pUHID.showError}
          helperText={formData.pUHID.showError && (formData.pUHID.message || formData.pUHID.value === null && "Please Enter ABHA ID")}
          name="pUHID"
          value={formData.pUHID.value || ""}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Date of Birth"
          //   helperText="Enter your name"
          variant="outlined"
          fullWidth
          type="date"
          onChange={handleTextChange}
          error={!formData.dob.valid && formData.dob.showError}
          helperText={formData.dob.showError && formData.dob.message}
          name="dob"
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.dob.value}
          inputProps={{
            max: new Date().toISOString().split("T")[0],
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
              onClick={() => handleClick(el.value)}
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
        helperText={formData.age.showError && (formData.age.message || formData.age.value === "" && "Please Enter Age")}
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
            //   helperText="Enter your name"
            variant="outlined"
            fullWidth
            required
            type="number"
            onChange={handleTextChange}
            error={!formData.weight.valid && formData.weight.showError}
            helperText={formData.weight.showError && (formData.weight.message || formData.weight.value === null && "Please Enter Weight")}
            name="weight"
            value={formData.weight.value || ""}
            inputProps={{ min: 0, max: getMaxWeight(category) }}
          // inputProps={{ inputMode: "numeric", pattern: "[0-9]*.[0-9]*" }}
          // Updated pattern
          />
        </Grid>
        <Grid item md={5} xs={4}>
          <FormControl variant="outlined" fullWidth>
            {/* <InputLabel></InputLabel> */}
            <TextField
              variant="outlined"
              value="Kg"
              InputProps={{
                readOnly: true,
              }}
            // Optionally, you can add a label here if needed
            // label="Unit"
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container xs={6} item>
        <Grid item xs={6}>
          <TextField
            label="Height"
            //   helperText="Enter your name"
            variant="outlined"
            fullWidth
            required
            onChange={handleTextChange}
            error={!formData.height.valid && formData.height.showError}
            helperText={formData.height.showError && (formData.height.message || formData.height.value === null && "Please Enter Height")}
            name="height"
            type="number"
            value={formData.height.value || ""}
            inputProps={{ min: 0, max: getMaxHeight(category) }}
          />
        </Grid>
        <Grid item md={5} xs={4}>
          <FormControl variant="outlined" fullWidth>
            {/* <InputLabel></InputLabel> */}
            <TextField
              variant="outlined"
              value="cm"
              InputProps={{
                readOnly: true,
              }}
            // Optionally, you can add a label here if needed
            // label="Unit"
            />
          </FormControl>
        </Grid>

      </Grid>
      {/* <Grid item xs={12}>
        <TextField
          label="Parent's Name"
          //   helperText="Enter your name"
          variant="outlined"
          fullWidth
          required
          onChange={handleTextChange}
          error={!formData.dob.valid && formData.dob.showError}
          helperText={formData.dob.showError}
        />
      </Grid> */}
      <Grid container xs={12} item>
        <Grid item xs={3}>
          <FormControl variant="outlined" fullWidth>
            {/* <InputLabel></InputLabel> */}
            <Select
              value={countryCode}
              onChange={handleCountryCodeChange}
            >
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
            //   helperText="Enter your name"
            variant="outlined"
            fullWidth
            required
            onChange={handleTextChange}
            error={!formData.phoneNumber.valid && formData.phoneNumber.showError}
            helperText={formData.phoneNumber.showError && (formData.phoneNumber.message || formData.phoneNumber.value === "" && "Please Enter Mobile Number")}
            name="phoneNumber"
            value={formData.phoneNumber.value || ""}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 10,
              minLength: 10,
            }}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email ID"
          //   helperText="Enter your name"
          variant="outlined"
          type="email"
          fullWidth
          name="email"
          onChange={handleTextChange}
          error={!formData.email.valid && formData.email.showError}
          helperText={formData.email.showError && formData.email.message}
          value={formData.email.value}

        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Address"
          //   helperText="Enter your name"
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
          helperText={formData.address.showError && (formData.address.message || formData.address.value === "" && "Please Enter Address")}
        />
      </Grid>
      <Grid item xs={4}>
        <FormControl
          variant="outlined"
          fullWidth
          required
          error={formData.state.showError}
        >
          {/* <InputLabel></InputLabel> */}
          <InputLabel>State</InputLabel>
          <Select
            label="State"
            required
            // onChange={handleSelectChange}
            onChange={(event: SelectChangeEvent) => {
              setFormData((prev) => {
                return {
                  ...prev,
                  city: { ...prev.city, valid: false, value: "" },
                };
              });
              handleSelectChange(event);
            }}
            name="state"
            value={formData.state.value || ""}
          >
            {state.map((name) => {
              return <MenuItem value={name}>{name}</MenuItem>;
            })}
          </Select>
          <p style={{ color: "#d84315", fontSize: "12px" }}>
            {formData.state.showError && formData.state.value === "" && "Please Select State"}
          </p>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          freeSolo // Allow the user to input a value that's not in the options list
          value={formData.city.value || null}
          onChange={(_event: unknown, newValue: string | null) => {
            setFormData((pre) => {
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
          inputValue={formData.city.value || undefined}
          onInputChange={(_event, newInputValue) => {
            setFormData((pre) => {
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
              value={formData.city.value || ""}
              error={formData.city.showError}
            />
          )}
        />
        {/* <FormControl variant="outlined" fullWidth required> */}
        {/* <InputLabel></InputLabel> */}
        {/* <InputLabel>City</InputLabel>
          <Select
            label="City"
            required
            name="city"
            onChange={handleSelectChange}
            value={formData.city.value || undefined}
          >
            {cityList.map((name) => {
              return <MenuItem value={name}>{name}</MenuItem>;
            })}
          </Select>
        </FormControl> */}
      </Grid>
      <Grid item xs={4}>
        {/* </Stack> */}
        <TextField
          // required
          id="outlined-required"
          label="Pincode"
          name="pinCode"
          value={formData.pinCode.value || ""}
          error={formData.pinCode.showError && !formData.pinCode.valid}
          helperText={formData.pinCode.showError && formData.pinCode.message}
          onChange={handleTextChange}
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            maxLength: 6,
            minLength: 6,
          }}
          //   defaultValue="Hello World"
          fullWidth
        // sx={{ width: 0.48, mt: "1rem" }}
        />
      </Grid>
      {/* <Grid item xs={4}>
        <Autocomplete
          freeSolo // Allow the user to input a value that's not in the options list
          value={formData.pinCode.value || null}
          onChange={(event: any, newValue: string | null) => {
            setFormData((pre) => {
              return {
                ...pre,
                pinCode: {
                  valid: newValue ? true : false,
                  value: newValue,
                  message: "",
                  showError: !newValue ? true : false,
                },
              };
            });
          }}
          inputValue={formData.pinCode.value || undefined}
          onInputChange={(event, newInputValue) => {
            setFormData((pre) => {
              return {
                ...pre,
                pinCode: {
                  valid: newInputValue ? true : false,
                  value: newInputValue,
                  message: "",
                  showError: !newInputValue ? true : false,
                },
              };
            });
          }}
          options={postalList?.length ? postalList : ["No Option"]}
          renderInput={(params) => (
            <TextField {...params} label="Pincode" required />
          )}
        />
      </Grid> */}

      <Grid item xs={12}>
        <FormControl
          variant="outlined"
          fullWidth
          required
          error={formData.userID.showError}
        >
          {/* <InputLabel></InputLabel> */}
          <InputLabel>Doctor</InputLabel>
          <Select
            label="Doctor"
            required
            onChange={(event: SelectChangeEvent) => {
              setFormData((state) => {
                const departmentID = doctorList.filter(
                  (el) => el.id == Number(event.target.value)
                )[0].departmentID;
                return {
                  ...state,
                  departmentID: {
                    value: departmentID,
                    showError: false,
                    message: "",
                    valid: true,
                  },
                  // userID: {
                  //   value: Number(event.target.value),
                  //   showError: false,
                  //   message: "",
                  //   valid: true,
                  // },
                };
              });
              handleSelectChange(event);
            }}
            name="userID"
            value={String(formData.userID.value) || undefined}
          >
            {doctorList.map((doc) => {
              return (
                <MenuItem value={doc.id}>
                  {doc.firstName
                    ? doc.firstName
                    : "" + doc.lastName
                      ? " " + doc.lastName
                      : ""}
                </MenuItem>
              );
            })}
          </Select>
          <p style={{ color: "#d84315", fontSize: "12px" }}>
            {formData.userID.showError && formData.userID.value === null && "Please Select Doctor"}
          </p>
        </FormControl>
      </Grid>

      {Number(ptype) == patientStatus.inpatient ? (
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth required>
            <InputLabel>Ward</InputLabel>
            <Select
              label="Ward"
              required
              onChange={(event: SelectChangeEvent) => {
                setFormData((state) => {
                  return {
                    ...state,
                    wardID: {
                      value: Number(event.target.value),
                      showError: false,
                      message: "",
                      valid: true,
                    },
                  };
                });
                handleSelectChange(event);
              }}
              name="wardID"
              value={String(formData.wardID.value) || undefined}
            >
              {wardList.map((ward) => {
                return (
                  <MenuItem value={ward.id}>
                    {capitalizeFirstLetter(ward.name)}
                  </MenuItem>
                );
              })}
            </Select>
            <p style={{ color: "#d84315", fontSize: "12px" }}>
              {formData.wardID.showError && formData.wardID.value === null && "Please Select Ward"}
            </p>
          </FormControl>
        </Grid>
      ) : (
        ""
      )}

      <Grid item xs={12}>
        <TextField
          label="Referred by"
          //   helperText="Enter your name"
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
      

      {formData.insurance.value ? (
        <>
          <Grid item xs={12}>
            <TextField
              label="Insurance Number"
              //   helperText="Enter your name"
              variant="outlined"
              type="text"
              fullWidth
              name="insuranceNumber"
              onChange={handleTextChange}
              value={formData.insuranceNumber.value}
              error={formData.insuranceNumber.showError && !formData.insuranceNumber.valid}
              helperText={formData.insuranceNumber.showError && (formData.insuranceNumber.message || formData.insuranceNumber.value === "" && "Please Enter Insurance Number")}
              required={formData.insurance.value ? true : false}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Insurance Company"
              required={formData.insurance.value ? true : false}
              //   helperText="Enter your name"
              variant="outlined"
              type="text"
              fullWidth
              name="insuranceCompany"
              onChange={handleTextChange}
              value={formData.insuranceCompany.value}
              error={formData.insuranceCompany.showError && !formData.insuranceCompany.valid}
              helperText={formData.insuranceCompany.showError && (formData.insuranceCompany.message || formData.insuranceCompany.value === "" && "Please Enter Insurance Company")}
            />
          </Grid>
        </>
      ) : (
        ""
      )}

      <ContactForm/>

      {/* ======================dont delete============ */}
{/* 
      <p style={{ marginTop: '25px' }}>Contact Person</p>

      <Grid item xs={12}>
        <TextField
          label="Guardian Name"
          //   helperText="Enter your name"
          variant="outlined"
          fullWidth
          required
          name="guardianName"
          error={!formData.guardianName.valid && formData.guardianName.showError}
          onChange={handleTextChange}
          helperText={formData.guardianName.showError && formData.guardianName.message}
          value={formData.guardianName.value}
        />
      </Grid>

      <Grid container xs={12} item>
        <Grid item xs={3}>
          <FormControl variant="outlined" fullWidth>
            <Select
              value={countryCode}
              onChange={handleCountryCodeChange}
            >
              <MenuItem value="+91">+91</MenuItem>
              <MenuItem value="+01">+01</MenuItem>
              <MenuItem value="+44">+44</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={9}>
          <TextField
            label="Guardian Mobile Number"
            //   helperText="Enter your name"
            variant="outlined"
            fullWidth
            required
            onChange={handleTextChange}
            error={
              !formData.guardianphoneNumber.valid && formData.guardianphoneNumber.showError
            }
            helperText={
              formData.guardianphoneNumber.showError && formData.guardianphoneNumber.message
            }
            name="guardianphoneNumber"
            value={formData.guardianphoneNumber.value || ""}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 10,
              minLength: 10,
            }}
          />
        </Grid>
       
      </Grid>

      <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth required>
            <InputLabel>Relationship With Patient</InputLabel>
            <Select
              label="Relationship With Patient"
              required
              onChange={(event: SelectChangeEvent) => {
                setFormData((state) => {
                  return {
                    ...state,
                    relationshipwithpatients: {
                      value: event.target.value,
                      showError: false,
                      message: "",
                      valid: true,
                    },
                  };
                });
                handleSelectChange(event);
              }}
              name="relationshipwithpatients"
              value={String(formData.relationshipwithpatients.value) || undefined}
            >
              {relationList.map((el) => (
              <MenuItem value={el} selected>
                {el}
              </MenuItem>
            ))}
            </Select>
          </FormControl>
        </Grid>

      <p style={{ marginTop: '25px' }}>Area of Selection</p>

      <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth required>
            <InputLabel>Ward</InputLabel>
            <Select
              label="Ward"
              required
              onChange={(event: SelectChangeEvent) => {
                setFormData((state) => {
                  return {
                    ...state,
                    wardID: {
                      value: Number(event.target.value),
                      showError: false,
                      message: "",
                      valid: true,
                    },
                  };
                });
                handleSelectChange(event);
              }}
              name="wardID"
              value={String(formData.wardID.value) || undefined}
            >
              {wardList.map((ward) => {
                return (
                  <MenuItem value={ward.id}>
                    {capitalizeFirstLetter(ward.name)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid> */}


     
    </Grid>
  );
}

export default Form_start;
