import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { patientbasicDetailType } from "../../../../types";
import { state } from "../../../../utility/state";
import { city } from "../../../../utility/state";
// import { useSelector } from "react-redux";
// import { selectCurrPatient } from "../../../../store/currentPatient/currentPatient.selector";
import Autocomplete from "@mui/material/Autocomplete";
import { validateAgeAndUnit } from "../../../../utility/ageValidation";
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
  // const user = useSelector(selectCurrentUser);
  // console.log("category123", category);
  // console.log(formData);
  const [title, setTitle] = React.useState("");
  const [cityList, setCityList] = React.useState<string[]>([]);
  const [gender, setGender] = React.useState<number>(0);
  const [ageUnit, setAgeUnit] = React.useState("");
  // const currentPatient = useSelector(selectCurrPatient);
  // console.log("form data", formData);
  React.useEffect(() => {
    if (formData.gender.value) {
      setGender(formData.gender.value);
    }
  }, [formData]);
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
  
  React.useEffect(() => {
    const stateName = state.indexOf(formData.state.value || "");
    setCityList(city[stateName]);
  }, [formData.state]);
  React.useEffect(() => {
    if (category == "neonate") {
      setTitle("bo");
    } else setTitle("Mr.");
  }, []);
  // console.log("formData", formData);

  ///////////////////////////////////////
  //////////////////////////////
  const handleTitleChange = (event: SelectChangeEvent) => {
    setTitle(event.target.value);
  };
  const handleClick = (value: string) => {
    // setGender(e.target);
    if (value == "Male") {
      setGender(1);
      setFormData((state) => {
        return {
          ...state,
          gender: { value: 1, message: "", valid: true, showError: false },
        };
      });
    } else if (value == "Female") {
      setGender(2);
      setFormData((state) => {
        return {
          ...state,
          gender: { value: 2, message: "", valid: true, showError: false },
        };
      });
    } else {
      setGender(3);
      setFormData((state) => {
        return {
          ...state,
          gender: { value: 3, message: "", valid: true, showError: false },
        };
      });
    }
    // setGender(value);
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

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let isvalid = event.target.validity.valid;
    // console.log("validity", event.target.validity);
    if (event.target.validity.stepMismatch) {
      isvalid = true;
    }
    // console.log(event.target.validity);
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    const name = event.target.name;

    let value: string | number;
    value = event.target.value;

    const nameregex = /^[A-Za-z\s]*$/;
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
    else if (name == "height" || name == "weight") {
      if (parseInt(event.target.value) < 301) {
        value = event.target.value;
      } else {
        return;
      }
    } else if (name == "pName" || name == "referredBy") {
      if (
        nameregex.test(event.target.value) &&
        event.target.value.length < 50
      ) {
        value = event.target.value;
      } else {
        return;
      }
    } else if (name === "phoneNumber" && !/^[0-9]*$/.test(event.target.value)) {
      return;
    } else if (name === "pinCode" && !/^[0-9]*$/.test(event.target.value)) {
      return;
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
  }, [formData.insurance]);
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
              <MenuItem value="bo">B/O</MenuItem>
              <MenuItem value="Mr.">Mr.</MenuItem>
              <MenuItem value="Mrs.">Mrs.</MenuItem>
              <MenuItem value="Miss.">Miss.</MenuItem>
              <MenuItem value="Ms.">Ms.</MenuItem>
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
            helperText={formData.pName.showError && formData.pName.message}
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
          onChange={handleTextChange}
          error={!formData.pID.valid && formData.pID.showError}
          helperText={formData.pID.showError && formData.pID.message}
          name="pID"
          value={formData.pID.value || ""}
          disabled
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="UHID"
          //   helperText="Enter your name"
          InputLabelProps={{
            shrink: true,
          }}
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
        <Stack direction="row" spacing={1} alignItems={"center"} columnGap={2}>
          Gender*
          {genderList.map((el) => {
            return (
              <Chip
                label={el.value}
                onClick={() => handleClick(el.value)}
                color={gender == el.key ? "primary" : "default"}
                sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              />
            );
          })}
        <TextField
        label="Age"
        variant="outlined"
        type="number"
        name="age"
        value={formData.age.value.split(" ")[0] || ""}
        onChange={handleTextChange}
        inputProps={{ min: 0 }}
        error={!formData.age.valid && formData.age.showError}
        helperText={formData.age.showError && formData.age.message}
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
      </Grid>
      <Grid container xs={5} item>
        <Grid item xs={6}>
          <TextField
            label="Weight"
            //   helperText="Enter your name"
            inputProps={{ min: 0, max: 300 }}
            variant="outlined"
            fullWidth
            required
            type="number"
            onChange={handleTextChange}
            error={!formData.weight.valid && formData.weight.showError}
            helperText={formData.weight.showError && formData.weight.message}
            name="weight"
            value={formData.weight.value || ""}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item md={5} xs={4}>
          <FormControl variant="outlined" fullWidth>
            {/* <InputLabel></InputLabel> */}
            <Select
              //   value={title}
              onChange={handleTitleChange}
              //   label="Title"
              required
              value="kg"
            >
              <MenuItem value="kg" selected>
                Kg
              </MenuItem>
              {/* <MenuItem value="gram">Gram</MenuItem> */}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container xs={5} item>
        <Grid item xs={6}>
          <TextField
            label="Height"
            //   helperText="Enter your name"
            inputProps={{ min: 0, max: 300 }}
            variant="outlined"
            fullWidth
            required
            onChange={handleTextChange}
            error={!formData.height.valid && formData.height.showError}
            helperText={formData.height.showError && formData.height.message}
            name="height"
            type="number"
            value={formData.height.value || ""}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item md={5} xs={4}>
          <FormControl variant="outlined" fullWidth>
            {/* <InputLabel></InputLabel> */}
            <Select
              //   value={title}
              onChange={handleTitleChange}
              //   label="Title"
              defaultValue="cm"
              required
              value="cm"
            >
              <MenuItem value="cm" selected>
                cm
              </MenuItem>
              {/* <MenuItem value="meter">meter</MenuItem> */}
            </Select>
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
              //   value={title}
              //   onChange={handleTitleChange}
              //   label="Title"
              //   defaultValue="cm"
              required
              value="+91"
            >
              <MenuItem value="+91" selected>
                +91
              </MenuItem>
              {/* <MenuItem value="+01">+01</MenuItem> */}
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
            error={
              !formData.phoneNumber.valid && formData.phoneNumber.showError
            }
            helperText={
              formData.phoneNumber.showError && formData.phoneNumber.message
            }
            name="phoneNumber"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 10,
              minLength: 10,
            }}
            value={formData.phoneNumber.value || ""}
            InputLabelProps={{
              shrink: true,
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
      {/* <Grid item xs={4}>
        <FormControl variant="outlined" fullWidth required>
          <InputLabel>Country</InputLabel>
          <Select
            label="country"
            required
            onChange={handleSelectChange}
            name="country"
          >
            <MenuItem value="India" selected>
              India
            </MenuItem>
            <MenuItem value="Australia">Australia</MenuItem>
          </Select>
        </FormControl>
      </Grid> */}
      <Grid item xs={6}>
        <FormControl variant="outlined" fullWidth required>
          {/* <InputLabel></InputLabel> */}
          <InputLabel>State</InputLabel>
          <Select
            label="State"
            required
            onChange={handleSelectChange}
            name="state"
            value={formData.state.value || ""}
          >
            {state.map((name) => {
              return <MenuItem value={name}>{name}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <Autocomplete
          freeSolo // Allow the user to input a value that's not in the options list
          value={formData.city.value || null}
          onChange={(_event: unknown, newValue: string | null) => {
            setFormData((pre) => {
              return {
                ...pre,
                city: {
                  valid: newValue ? true : false,
                  value: newValue || "",
                  message: "",
                  showError: !newValue ? true : false,
                },
              };
            });
          }}
          inputValue={formData.city.value || undefined}
          onInputChange={(_, newInputValue) => {
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
            <TextField {...params} label="City" required />
          )}
        />
      </Grid>
      <Grid item xs={8}>
        <TextField
          label="Address"
          //   helperText="Enter your name"
          variant="outlined"
          type="text"
          fullWidth
          required
          name="address"
          onChange={handleTextChange}
          value={formData.address.value}
          error={formData.address.showError && !formData.address.valid}
          helperText={formData.address.message}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Pincode"
          //   helperText="Enter your name"
          variant="outlined"
          type="text"
          fullWidth
          required
          name="pinCode"
          onChange={handleTextChange}
          value={formData.pinCode.value}
          error={formData.pinCode.showError && !formData.pinCode.valid}
          helperText={formData.pinCode.message}
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            maxLength: 6,
          }}
        />
      </Grid>
      {/* <Grid item xs={12}>
        <FormControl variant="outlined" fullWidth required>
          <InputLabel>Depatment Name</InputLabel>
          <Select label="Depatment Name" required>
            <MenuItem value="India" selected>
              India
            </MenuItem>
            <MenuItem value="Australia">Australia</MenuItem>
          </Select>
        </FormControl>
      </Grid> */}
      {/* <Grid item xs={12}>
        <TextField
          label="Doctor's Name"
          //   helperText="Enter your name"
          variant="outlined"
          type="text"
          fullWidth
          required
          name="Doctors Name"
          onChange={handleTextChange}
          value={formData.doctorsName.value}
          error={formData.doctorsName.showError && !formData.doctorsName.valid}
          helperText={formData.doctorsName.message}
        />
      </Grid> */}
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
      <Grid item xs={12}>
        <FormControl variant="outlined" fullWidth required>
          {/* <InputLabel></InputLabel> */}
          <InputLabel>Insurance</InputLabel>
          <Select
            label="Insurance"
            required
            onChange={(event: SelectChangeEvent) => {
              // console.log()
              setFormData((state) => {
                return {
                  ...state,
                  insurance: {
                    value: Number(event.target.value) as 0 | 1,
                    showError: false,
                    message: "",
                    valid: true,
                  },
                };
              });
              // handleSelectChange(event);
            }}
            name="insurance"
            value={String(formData.insurance.value)}
          >
            <MenuItem value={"1"}>Yes</MenuItem>
            <MenuItem value={"0"}>No</MenuItem>
          </Select>
        </FormControl>
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
              error={
                formData.insuranceNumber.showError &&
                !formData.insuranceNumber.valid
              }
              helperText={formData.insuranceNumber.message}
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
              error={
                formData.insuranceCompany.showError &&
                !formData.insuranceCompany.valid
              }
              helperText={formData.insuranceCompany.message}
            />
          </Grid>
        </>
      ) : (
        ""
      )}
    </Grid>
  );
}

export default Form_start;
