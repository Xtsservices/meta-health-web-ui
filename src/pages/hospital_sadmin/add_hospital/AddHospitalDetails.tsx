import React, { useState } from "react";
import styles from "./AddHospitalDetails.module.scss";
import form_1_icon from "./../../../../src/assets/addPatient/form_1_icon.gif";
import dummy_icon from "./../../../../src/assets/addPatient/dummy_pic_icon.png";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  Stack,
  SelectChangeEvent,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { state } from "../../../utility/state";
import { city } from "../../../utility/state";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { setError, setSuccess } from "../../../store/error/error.action";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authFetch } from "../../../axios/useAuthFetch";
import { SCOPE_LIST, SCOPE_LIST_Type } from "../../../utility/role";
import { capitalizeFirstLetter } from "../../../utility/global";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface AdminDetails {
  firstName: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  lastName: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  email: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  address: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  city: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  state: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  pinCode: {
    valid: boolean;
    value: number | null;
    showError: boolean;
    message: string;
  };
  phoneNo: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  dob: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  gender: {
    valid: boolean;
    value: number | null;
    showError: boolean;
    message: string;
  };
  password: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  confirmPassword: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  scope: {
    valid: boolean;
    showError: boolean;
    value: string[];
    message: string;
    name: string;
  };
}
const genderList = [
  { value: "Male", key: 1 },
  { value: "Female", key: 2 },
];

export const AddHospitalDetails = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileFile, setProfileFile] = React.useState<File | undefined>();
  const image_ref = React.useRef<HTMLImageElement>(null);
  const label_ref = React.useRef<HTMLLabelElement>(null);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [gender, setGender] = React.useState<number>(0);
  const [cityList, setCityList] = React.useState<string[]>([]);
  // const scope_required = [Role_NAME.doctor, Role_NAME.nurse, Role_NAME.staff];
  const [adminInfo, setAdminInfo] = useState<AdminDetails>({
    firstName: {
      valid: true,
      value: "",
      showError: false,
      message: "",
    },
    lastName: {
      valid: true,
      value: "",
      showError: false,
      message: "",
    },
    email: {
      valid: true,
      value: "  ",
      showError: false,
      message: "",
    },
    phoneNo: {
      valid: true,
      value: "",
      showError: false,
      message: "",
    },
    pinCode: {
      valid: true,
      value: null,
      showError: false,
      message: "",
    },
    city: {
      valid: true,
      value: "",
      showError: false,
      message: "",
    },
    state: {
      valid: true,
      value: "",
      showError: false,
      message: "",
    },
    password: {
      valid: true,
      value: "",
      showError: false,
      message: "",
    },
    confirmPassword: {
      valid: true,
      value: "",
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
    address: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    scope: {
      valid: false,
      showError: false,
      value: [],
      message: "",
      name: "scope",
    },
  });

  // const handleChange = (event: SelectChangeEvent) => {
  //   // setAge(event.target.value);

  //   const isvalid = true;
  //   const message = isvalid ? "" : "This field is required";
  //   const showError = !isvalid;
  //   const name = event.target.name;

  //   setAdminInfo((state) => {
  //     return {
  //       ...state,
  //       [name]: {
  //         valid: isvalid,
  //         showError,
  //         value: event.target.value,
  //         message,
  //         name,
  //       },
  //     };
  //   });
  // };
  const handleChangeCheckMarks = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const isValid = value.length > 0;
    setAdminInfo((state) => {
      return {
        ...state,
        ["scope"]: {
          valid: isValid,
          showError: !isValid,
          value: typeof value === "string" ? value.split(",") : value,
          message: "This field is required",
          name: "scope",
        },
      };
    });
  };

  // const roleListArray: Array<keyof Role_list_Type> = Object.keys(
  //   Role_list
  // ) as unknown as Array<keyof Role_list_Type>;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    console.log("name", name, "value", value);
    if (name === "password") {
      const hasCapitalLetter = /[A-Z]/.test(value);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isValidPassword = hasCapitalLetter && hasSymbol;

      setAdminInfo((prevInfo) => ({
        ...prevInfo,
        password: {
          ...prevInfo.password,
          value,
          valid: value === "" || isValidPassword,
          message:
            value === ""
              ? ""
              : "Password must contain at least one capital letter and one symbol.",
          showError: value !== "" && !isValidPassword,
        },
      }));
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
      setAdminInfo((prevInfo) => ({
        ...prevInfo,
        confirmPassword: {
          ...prevInfo.confirmPassword,
          valid: true,
          message: "",
          showError: false,
        },
      }));
    } else {
      setAdminInfo((prevInfo) => ({
        ...prevInfo,
        [name]: {
          ...prevInfo[name as keyof AdminDetails],
          value,
        },
      }));
    }
  };

  const handleTogglePassword = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(
        (prevShowConfirmPassword) => !prevShowConfirmPassword
      );
    }
  };

  const handleClick = (value: string) => {
    if (value == "Male") {
      setGender(1);
      setAdminInfo((state) => {
        return {
          ...state,
          gender: { value: 1, message: "", valid: true, showError: false },
        };
      });
    } else {
      setGender(2);
      setAdminInfo((state) => {
        return {
          ...state,
          gender: { value: 2, message: "", valid: true, showError: false },
        };
      });
    }
  };

  const handleDateChange = (date: string) => {
    setAdminInfo((prevInfo) => ({
      ...prevInfo,
      dob: {
        ...prevInfo.dob,
        value: date,
      },
    }));
  };

  const handleStateChange = (event: SelectChangeEvent) => {
    const selectedState = event.target.value as string;
    const stateIndex = state.indexOf(selectedState);
    if (stateIndex !== -1) {
      setCityList(city[stateIndex]);
    }

    setAdminInfo((prevInfo) => ({
      ...prevInfo,
      state: {
        ...prevInfo.state,
        value: selectedState,
      },
    }));
  };

  const fetchHospitalList = async () => {
    try {
      const hospitalListResponse = await authFetch(`hospital`, user.token);
      console.log("HospitalList Response:", hospitalListResponse);

      if (
        hospitalListResponse &&
        hospitalListResponse.hospitals &&
        hospitalListResponse.hospitals.length > 0
      ) {
        const lastHospital =
          hospitalListResponse.hospitals[
            hospitalListResponse.hospitals.length - 1
          ];

        const hospitalId = lastHospital.id;
        console.log("Last Hospital ID:", hospitalId);

        return hospitalId;
      }

      return null;
    } catch (error) {
      console.error("Error fetching hospital list:", error);
      return null;
    }
  };

  // const fetchHospitalList = async () => {
  //   try {
  //     const hospitalListResponse = await authFetch(`hospital`, user.token);
  //     console.log("HospitalList Response:", hospitalListResponse);

  //     if (
  //       hospitalListResponse &&
  //       hospitalListResponse.hospitals &&
  //       hospitalListResponse.hospitals.length > 0
  //     ) {
  //       const firstHospital = hospitalListResponse.hospitals[0];
  //       const hospitalId = firstHospital.id;

  //       console.log("Hospital ID:", hospitalId);

  //       return hospitalId;
  //     }

  //     return null;
  //   } catch (error) {
  //     console.error("Error fetching hospital list:", error);
  //     return null;
  //   }
  // };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalId = await fetchHospitalList();
        console.log("Hospitalddd ID:", hospitalId);
      } catch (error) {
        console.error("Error fetching hospital list:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (adminInfo.password.value !== confirmPassword) {
      setAdminInfo((prevInfo) => ({
        ...prevInfo,
        confirmPassword: {
          ...prevInfo.confirmPassword,
          valid: false,
          message: "Passwords do not match.",
          showError: true,
        },
      }));
      return;
    }

    try {
      const adminBasicDetailform = new FormData();

      if (profileFile) {
        adminBasicDetailform.append("photo", profileFile);
      }

      adminBasicDetailform.append("firstName", adminInfo.firstName.value);
      adminBasicDetailform.append("lastName", adminInfo.lastName.value);
      adminBasicDetailform.append("phoneNo", adminInfo.phoneNo.value);
      adminBasicDetailform.append("address", adminInfo.address.value);
      adminBasicDetailform.append("city", adminInfo.city.value);
      adminBasicDetailform.append("email", adminInfo.email.value);
      adminBasicDetailform.append("state", adminInfo.state.value);
      adminBasicDetailform.append("pinCode", String(adminInfo.pinCode.value));
      adminBasicDetailform.append("dob", adminInfo.dob.value);
      adminBasicDetailform.append("password", adminInfo.password.value);
      adminBasicDetailform.append("gender", String(adminInfo.gender.value));
      adminBasicDetailform.append("scope", adminInfo.scope.value.join("#"));

      const hospitalId = await fetchHospitalList();

      if (!hospitalId) {
        console.error("Hospital ID not found.");
        return;
      }

      const response = await authPost(
        `/hospital/${hospitalId}/admin`,
        adminBasicDetailform,
        user.token
      );

      console.log("Response from server:", response);

      if (
        response &&
        (response.message === "success" || response.data?.message === "success")
      ) {
        dispatch(setSuccess("Admin Successfully Added"));
        navigate("/sadmin/view-hospital");
      } else if (
        response &&
        (response.message === "Account Exists" ||
          response.data?.message === "Account Exists")
      ) {
        dispatch(setError("Account Exists. Use Another Email Id"));
      } else if (
        response &&
        (response.message === `"password" is not allowed to be empty` ||
          response.data?.message === `"password" is not allowed to be empty`)
      ) {
        dispatch(setError("Please Enter Password"));
      } else {
        console.error("Error: Invalid response format.");
        dispatch(setError("Error adding admin. Please try again later."));
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      dispatch(setError("Error adding admin. Please try again later."));
    }
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);

  React.useEffect(() => {
    const stateName = state.indexOf(adminInfo.state.value || "Jharkhand");
    setCityList(city[stateName]);
  }, [adminInfo.state]);

  React.useEffect(() => {
    label_ref.current?.addEventListener("dragover", (event) => {
      event.preventDefault();
      console.log("dragover", event);
    });
    // label_ref.current?.addEventListener("dragleave", (event) => {
    //   console.log("dragleave", event);
    // });
    label_ref.current?.addEventListener("drop", (event) => {
      event.preventDefault();
      // event.stopPropagation();
      // console.log("drop", event.dataTransfer?.files[0]);
      setProfileFile(event.dataTransfer?.files[0]);

      const file = event.dataTransfer?.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageData = reader.result as string | null;
          if (imageData) {
            image_ref.current?.setAttribute("src", imageData);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, [label_ref]);

  return (
    <div className={styles.container}>
      <div className={styles.container_formRight}>
        <img src={form_1_icon} alt="" />
      </div>
      <div className={styles.container_formCenter}>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              debouncedHandleSubmit(e);
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  required
                  name="firstName"
                  value={adminInfo.firstName.value}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  name="lastName"
                  value={adminInfo.lastName.value}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  variant="outlined"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={adminInfo.dob.value}
                  onChange={(event) => handleDateChange(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  name="phoneNo"
                  fullWidth
                  required
                  value={adminInfo.phoneNo.value}
                  onChange={handleInputChange}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 10,
                    minLength: 10,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems={"center"}
                  columnGap={2}
                >
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
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  variant="outlined"
                  name="address"
                  value={adminInfo.address.value}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>State</InputLabel>
                  <Select
                    label="State"
                    required
                    onChange={handleStateChange}
                    name="state"
                    value={adminInfo.state.value || ""}
                  >
                    {state.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>City</InputLabel>
                  <Select
                    label="City"
                    required
                    onChange={(event) => {
                      const selectedCity = event.target.value as string;
                      setAdminInfo((prevInfo) => ({
                        ...prevInfo,
                        city: {
                          ...prevInfo.city,
                          value: selectedCity,
                        },
                      }));
                    }}
                    name="city"
                    value={adminInfo.city.value || ""}
                  >
                    {cityList.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Pincode"
                  variant="outlined"
                  fullWidth
                  name="pinCode"
                  value={adminInfo.pinCode.value}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  required
                  variant="outlined"
                  name="email"
                  type="email"
                  value={adminInfo.email.value}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Set Password"
                  variant="outlined"
                  name="password"
                  value={adminInfo.password.value}
                  onChange={handleInputChange}
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleTogglePassword("password")}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={adminInfo.password.showError}
                  helperText={
                    adminInfo.password.showError && adminInfo.password.message
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            handleTogglePassword("confirmPassword")
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={adminInfo.confirmPassword.showError}
                  helperText={
                    adminInfo.confirmPassword.showError &&
                    adminInfo.confirmPassword.message
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-checkbox-label">
                    Scope
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={adminInfo.scope.value}
                    onChange={handleChangeCheckMarks}
                    input={<OutlinedInput label="Scope" />}
                    renderValue={(selected) =>
                      selected
                        .map((el) => {
                          const index = Object.values(SCOPE_LIST).indexOf(
                            Number(el)
                          );
                          return capitalizeFirstLetter(
                            Object.keys(SCOPE_LIST)[index] || ""
                          );
                        })
                        .join(", ")
                    }
                    MenuProps={MenuProps}
                  >
                    {Object.keys(SCOPE_LIST).map((name, index) => (
                      <MenuItem
                        key={index}
                        value={String(Object.values(SCOPE_LIST)[index])}
                      >
                        <Checkbox
                          checked={
                            adminInfo.scope.value.indexOf(
                              String(SCOPE_LIST[name as keyof SCOPE_LIST_Type])
                            ) > -1
                          }
                        />
                        <ListItemText primary={capitalizeFirstLetter(name)} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
      <div className={styles.container_formLeft}>
        <div className={styles.image_container}>
          Upload image
          <input
            type="file"
            id="profile_pic"
            accept="image/*"
            className={styles.profile_pic}
            onChange={(e) => {
              const reader = new FileReader();
              reader.onloadend = function (e) {
                const result = e.target?.result as string | null;
                if (result) {
                  image_ref.current?.setAttribute("src", result);
                }
              };

              const file = e.target.files?.[0];
              setProfileFile(file);
              if (file) {
                reader.readAsDataURL(file);
              }
            }}
          />
          <label
            htmlFor="profile_pic"
            className={styles.profile_pic_label}
            ref={label_ref}
          >
            {profileFile && (
              <img
                src=""
                alt=""
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
                ref={image_ref}
              />
            )}
            {!profileFile && (
              <>
                <img src={dummy_icon} alt="" />
                <p>Drag & Drop</p>
                <p>or Browse</p>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};
