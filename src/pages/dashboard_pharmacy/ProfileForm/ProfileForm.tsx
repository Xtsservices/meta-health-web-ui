import React, { useRef } from "react";
import styles from "./profile.module.scss";
import UploadIcon from "@mui/icons-material/Upload";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";

import Autocomplete from "@mui/material/Autocomplete";
import AlertDialog from "./ClearProfileDialog";
import {
  profileFormDataObj,
  profileFormDataType,
} from "../../../utility/formTypes";
import { city, state } from "../../../utility/state";

function ProfileForm() {
  const image_ref = useRef<HTMLImageElement>(null);
  const [file, setFile] = React.useState<any>();
  const [isEditing, setIsEditing] = React.useState(false);
  const [email] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const [formPasswordData, setFormPasswordData] = React.useState({
    password: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    confirmPassword: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
  });

  const handlePasswordFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isvalid = event.target.validity.valid;
    // console.log(event.target.validity);
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    const name = event.target.name;

    let value: string | number;
    if (name === "phoneNo" || name === "pinCode") {
      value = Number(event.target.value);
    } else value = event.target.value;
    setFormPasswordData((state) => {
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
  const handlePasswordFormSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async (event) => {
    event.preventDefault();
    // console.log("formsubmit");
    if (
      formPasswordData.password.value !== formPasswordData.confirmPassword.value
    ) {
      setFormPasswordData((prev) => {
        return {
          ...prev,
          confirmPassword: {
            ...prev.confirmPassword,
            valid: false,
            showError: true,
            message: "Password didn't match",
          },
        };
      });
      // console.log("did not match");
      console.log("Password did not match");
    }
  };

  const [formData, setFormData] = React.useState<profileFormDataType>({
    firstName: {
      valid: false,
      showError: false,
      value: "",
      message: "",
    },
    lastName: {
      valid: false,
      showError: false,
      value: "",
      message: "",
    },
    phoneNo: {
      valid: false,
      showError: false,
      value: null,
      message: "",
    },
    gender: {
      valid: false,
      showError: false,
      value: -1,
      message: "",
    },
    dob: {
      valid: false,
      showError: false,
      value: "",
      message: "",
    },
    city: {
      valid: false,
      showError: false,
      value: "",
      message: "",
    },
    state: {
      valid: false,
      showError: false,
      value: "",
      message: "",
    },
    pinCode: {
      valid: false,
      showError: false,
      value: null,
      message: "",
    },
    address: {
      valid: false,
      showError: false,
      value: "",
      message: "",
    },
  });
  const [cityList, setCityList] = React.useState<string[]>([]);
  React.useEffect(() => {
    const stateName = state.indexOf(formData.state.value);
    setCityList(city[stateName]);
  }, [formData.state]);

  const [, setObj] = React.useState<profileFormDataObj>({
    firstName: "",
    lastName: "",
    phoneNo: null,
    gender: -1,
    dob: "",
    city: "",
    state: "",
    pinCode: null,
    address: "",
  });
  React.useEffect(() => {
    setObj({
      firstName: formData.firstName.value,
      lastName: formData.lastName.value,
      phoneNo: formData.phoneNo.value,
      gender: formData.gender.value,
      dob: formData.dob.value,
      city: formData.city.value,
      state: formData.state.value,
      pinCode: formData.pinCode.value,
      address: formData.address.value,
    });
  }, [formData]);

  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isvalid = event.target.validity.valid;
    // console.log(event.target.validity);
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    const name = event.target.name;

    let value: string | number;

    if (name === "firstName" || name === "lastName") {
      if (/^[A-Za-z\s]*$/.test(event.target.value)) {
        value = event.target.value;
      } else {
        return;
      }
    }

    if (name === "phoneNo" || name === "pinCode") {
      value = event.target.value.replace(/\D/g, "");
      // value = Number(event.target.value);
    } else value = event.target.value;
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
    setObj((prev) => {
      return { ...prev, [name]: event.target.value };
    });
  };

  const handleChange = (event: SelectChangeEvent) => {
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
    setObj((prev) => {
      return { ...prev, [name]: event.target.value };
    });
  };

  // const handleFormSubmit = async () => {};

  React.useEffect(() => {
    if (file?.size) handleFormSubmit();
  }, [file]);

  function handleFormSubmit() {
    throw new Error("Function not implemented.");
  }

  return (
    <div className={styles.container} style={{ marginTop: "35px" }}>
      <div className={styles.container_profile}>
        <div className={styles.image_container}>
          <h3>Profile Info</h3>

          <div className={styles.profile}>
            <PersonIcon />
          </div>

          <input
            type="file"
            className={styles.input_image}
            accept="image/*"
            id="input_image"
            alt="img"
            onChange={(e) => {
              const reader = new FileReader();
              reader.onloadend = function (e) {
                // console.log("reader", e.target);
                const result = e.target?.result as string | null; // Add type assertion
                if (result) {
                  image_ref.current?.setAttribute("src", result);
                }
              };
              //   reader.readAsDataURL(e.target.files[0]);
              const file = e.target.files?.[0]; // Use optional chaining to access the first file
              setFile(file);
              if (file) {
                reader.readAsDataURL(file);
              }
            }}
          />

          <label htmlFor="input_image">
            <UploadIcon sx={{ mr: "5px" }} color="primary" />
            Update Image
          </label>

          {/* <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            sx={{ width: "10rem", ml: "auto", mr: "auto" }}
            color="error"
            onClick={() => setOpen(true)}
          >
            Clear Image
          </Button> */}
        </div>
        <form
          className={styles.profile_form}
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleFormSubmit();
          }}
        >
          <Grid
            container
            columnSpacing={2}
            rowSpacing={4}
            alignItems="center"
            sx={{ mt: "10px" }}
          >
            <Grid xs={6} item>
              <TextField
                label={"Enter First Name"}
                //   helperText="Enter your name"
                // defaultValue={user.firstName}
                required
                value={formData.firstName.value}
                variant="outlined"
                fullWidth
                name="firstName"
                onChange={handleChangeForm}
                disabled={!isEditing}
                error={
                  formData.firstName.showError && !formData.firstName.valid
                }
                helperText={
                  formData.firstName.showError && formData.firstName.message
                }

                // placeholder={user.firstName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                id="outlined-required"
                label="Enter Last Name"
                name="lastName"
                value={formData.lastName.value}
                error={formData.lastName.showError && !formData.lastName.valid}
                helperText={formData.lastName.message}
                onChange={handleChangeForm}
                disabled={!isEditing}
                //   defaultValue="Hello World"
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label={"Phone Number"}
                // defaultValue={user.phoneNo}
                //   helperText="Enter your name"
                variant="outlined"
                fullWidth
                required
                name="phoneNo"
                value={formData.phoneNo.value || ""}
                error={formData.phoneNo.showError && !formData.phoneNo.valid}
                disabled={!isEditing}
                helperText={
                  formData.phoneNo.showError && formData.phoneNo.message
                }
                onChange={handleChangeForm}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 10,
                  minLength: 10,
                }}
                //   sx={{ width: 0.5 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                error={formData.gender.showError && !formData.gender.valid}
              >
                <InputLabel id="demo-simple-select-helper-label--gender">
                  Gender
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={String(formData.gender.value)}
                  label="Gender"
                  onChange={handleChange}
                  name="gender"
                  disabled={!isEditing}
                >
                  <MenuItem value={1}>Male</MenuItem>
                  <MenuItem value={2}>Female</MenuItem>
                  {/* <MenuItem value={"others"}>Others</MenuItem> */}
                </Select>
                <FormHelperText>{formData.gender.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              {/* </Stack> */}

              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                label="DOB"
                required
                id="outlined-required"
                type="date"
                //   defaultValue="Hello World"
                name="dob"
                value={formData.dob.value}
                error={formData.dob.showError && !formData.dob.valid}
                helperText={formData.dob.message}
                onChange={handleChangeForm}
                fullWidth
                disabled={!isEditing}
                // sx={{ width: 0.48, mt: "1rem" }}
              />
            </Grid>
            <Grid item xs={6}>
              {/* </Stack> */}
              {/* <TextField
              required
              id="outlined-required"
              label="State"
              name="state"
              value={formData.state.value}
              error={formData.state.showError && !formData.firstName.valid}
              helperText={formData.state.message}
              onChange={handleChangeForm}
              //   defaultValue="Hello World"
              fullWidth
              // sx={{ width: 0.48, mt: "1rem" }}
            /> */}
              <FormControl
                fullWidth
                error={formData.state.showError && !formData.state.valid}
                // sx={{ width: 0.48, mt: "1rem" }}
              >
                <InputLabel id="demo-simple-select-helper-label">
                  State
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={String(formData.state.value)}
                  label="State"
                  onChange={(event: SelectChangeEvent) => {
                    setFormData((prev) => {
                      return {
                        ...prev,
                        city: { ...prev.city, valid: false, value: " " },
                      };
                    });
                    handleChange(event);
                  }}
                  name="state"
                  disabled={!isEditing}
                >
                  {state.map((el) => (
                    <MenuItem value={el}> {el} </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formData.state.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              {/* </Stack> */}
              {/* <TextField
              required
              id="outlined-required"
              label="City"
              name="city"
              value={formData.city.value}
              error={formData.city.showError && !formData.firstName.valid}
              helperText={formData.city.message}
              onChange={handleChangeForm}
              //   defaultValue="Hello World"
              fullWidth
              // sx={{ width: 0.48, mt: "1rem" }}
            /> */}
              <Autocomplete
                freeSolo // Allow the user to input a value that's not in the options list
                value={formData.city?.value || ""}
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
                disabled={!isEditing}
                inputValue={formData.city?.value || ""}
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
                    error={formData.city.showError && !formData.city.valid}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              {/* </Stack> */}
              <TextField
                required
                id="outlined-required"
                label="Pincode"
                name="pinCode"
                value={formData.pinCode.value || ""}
                error={formData.pinCode.showError && !formData.pinCode.valid}
                helperText={formData.pinCode.message}
                onChange={handleChangeForm}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 6,
                  minLength: 6,
                }}
                disabled={!isEditing}
                //   defaultValue="Hello World"
                fullWidth
                // sx={{ width: 0.48, mt: "1rem" }}
              />
            </Grid>
            <Grid xs={12} item>
              <TextField
                // label="Email"
                type="email"
                //  label={user.}
                //   helperText="Enter your name"
                disabled
                variant="outlined"
                fullWidth
                defaultValue={email}
                value={email}
                // value={user.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-multiline-static"
                label="Home Address"
                name="address"
                value={formData.address.value}
                error={formData.address.showError && !formData.address.valid}
                helperText={formData.address.message}
                onChange={handleChangeForm}
                disabled={!isEditing}
                multiline
                rows={4}
                // sx={{ mt: "1rem" }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ ml: "auto", mb: "10px" }}
                type="submit"
                disabled={!isEditing}
              >
                Update Changes
              </Button>
            </Grid>
          </Grid>
        </form>
        <Button
          variant="contained"
          sx={{ ml: "auto" }}
          type="submit"
          style={{ alignSelf: "flex-start" }}
          color={isEditing ? "warning" : "primary"}
          onClick={() => setIsEditing((el) => !el)}
        >
          Edit
        </Button>
      </div>
      <div className={styles.container_password}>
        <div className={styles.password_margin}></div>
        <form
          className={styles.password_form}
          onSubmit={handlePasswordFormSubmit}
        >
          {" "}
          <Grid
            container
            columnSpacing={2}
            rowSpacing={4}
            alignItems="center"
            sx={{ mt: "10px" }}
          >
            <Grid xs={12} item>
              <TextField
                label="New Password"
                //   helperText="Enter your name"
                variant="outlined"
                fullWidth
                required
                type="password"
                value={formPasswordData.password.value}
                sx={{ width: 0.5 }}
                name="password"
                onChange={handlePasswordFormChange}
              />
            </Grid>
            <Grid xs={12} item>
              <TextField
                label="Confirm Password"
                type="text"
                //   helperText="Enter your name"
                value={formPasswordData.confirmPassword.value}
                variant="outlined"
                fullWidth
                required
                name="confirmPassword"
                onChange={handlePasswordFormChange}
                sx={{ width: 0.5 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" sx={{ ml: "auto" }} type="submit">
                Update Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <AlertDialog open={open} setOpen={setOpen} />
    </div>
  );
}

export default ProfileForm;
