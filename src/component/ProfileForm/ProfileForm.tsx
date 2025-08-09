import React, { useRef } from "react";
import styles from "./Profile.module.scss";
import UploadIcon from "@mui/icons-material/Upload";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { selectCurrentUser } from "../../store/user/user.selector";
import { useSelector } from "react-redux";
import { authPatch } from "../../axios/usePatch";
import { debounce, DEBOUNCE_DELAY } from "../../utility/debounce";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/user/user.action";
import PersonIcon from "@mui/icons-material/Person";
import {
  setError,
  setLoading,
  setSuccess,
} from "../../store/error/error.action";
import {
  profileFormDataObj,
  profileFormDataType,
} from "../../utility/formTypes";
import { state, city } from "../../utility/state";
import Autocomplete from "@mui/material/Autocomplete";
import AlertDialog from "./ClearProfileDialog";
import { IconButton, InputAdornment } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import CryptoJS from "crypto-js";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const secretKey: string | undefined = import.meta.env.SECRET_KEY;
const key = secretKey || "a1f0d31b6e4c2a8f79eacb10d1453e3f";

function checkLength(number: number, size: number): boolean {
  // Convert the number to a string
  const numberStr = String(number);

  // Check if the string has exactly 10 digits
  return numberStr.length === size;
}
// import { FamilyRestroomRounded } from "@mui/icons-material";
function ProfileForm() {
  const image_ref = useRef<HTMLImageElement>(null);
  const [file, setFile] = React.useState<any>();
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [isHover, setIsHover] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (user.email) setEmail(user.email);
  }, [user]);
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
  React.useEffect(() => {
    // console.log("image ref", image_ref);

    if (image_ref?.current) {
      image_ref.current.addEventListener("mouseenter", () => {
        setIsHover(true);
      });
      image_ref.current.addEventListener("mouseout", () => {
        setIsHover(false);
      });
    }
  }, [user.imageURL]);
  const handlePasswordFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isvalid = event.target.validity.valid;
    // console.log(event.target.validity);
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    const name = event.target.name;

    let value: string | number;
    if (name == "phoneNo" || name == "pinCode") {
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
      formPasswordData.password.value != formPasswordData.confirmPassword.value
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
      dispatch(setError("Password did not match"));
    } else {
      dispatch(setLoading(true));
      const response = await authPatch(
        `user/${user.hospitalID}/changePassword/${user.id}`,
        { password: formPasswordData.password.value },
        user.token
      );
      dispatch(setLoading(false));

      // console.log(response);
      if (response.message == "success") {
        dispatch(setSuccess("Password changed successfully"));
        setFormPasswordData(() => {
          return {
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
          };
        });
      } else {
        dispatch(setError(response.message));
      }
    }
  };
  const debouncedHandlePasswordSubmit = debounce(
    handlePasswordFormSubmit,
    DEBOUNCE_DELAY
  );

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

  const [obj, setObj] = React.useState<profileFormDataObj>({
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

  function handleResetData() {
    console.log("triggere reset")
    setFormData({
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
    setObj({
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
  }

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
  React.useEffect(() => {
    setFormData((currentValue) => {
      return {
        ...currentValue,
        firstName: { ...currentValue.firstName, value: user.firstName || "" },
        lastName: { ...currentValue.lastName, value: user.lastName || "" },
        city: { ...currentValue.city, value: user.city || "" },
        state: { ...currentValue.state, value: user.state || "" },
        address: { ...currentValue.address, value: user.address || "" },
        pinCode: { ...currentValue.pinCode, value: user.pinCode || null },
        dob: { ...currentValue.dob, value: user.dob?.split("T")[0] || "" },
        gender: { ...currentValue.gender, value: user.gender || -1 },
        phoneNo: {
          ...currentValue.phoneNo,
          value: user.phoneNo || 0,
        },
      };
    });
  }, [user]);

  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isvalid = event.target.validity.valid;
    // console.log(event.target.validity);
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    const name = event.target.name;

    let value: string | number;

    if (name == "firstName" || name == "lastName") {
      if (/^[A-Za-z\s]*$/.test(event.target.value)) {
        value = event.target.value;
      } else {
        return;
      }
    }

    if (name == "phoneNo" || name == "pinCode") {
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

  const handleFormSubmit = async () => {
    const index: Array<keyof profileFormDataType> = Object.keys(
      formData
    ) as Array<keyof profileFormDataType>;
    index.forEach((el: keyof profileFormDataType) => {
      if (formData[el].value == undefined) {
        alert("Please fill all data");
      }
      setObj((prev) => {
        return { ...prev, [el]: formData[el].value };
      });
    });

    const forms = new FormData();
    const keyArray: Array<keyof profileFormDataObj> = Object.keys(obj) as Array<
      keyof profileFormDataObj
    >;
    keyArray.forEach((el: keyof profileFormDataObj) => {
      forms.append(el, obj[el] as string | Blob);
    });
    // console.log("file", file);
    if (obj.phoneNo === null || !checkLength(obj.phoneNo, 10))
      return dispatch(setError("Mobile number must be 10 digits long "));
    if (obj.pinCode === null || !checkLength(obj.pinCode, 6))
      return dispatch(setError("PinCode must be 6 digits long "));
    if (file) {
      forms.append("photo", file);
    }
    forms.append("image", "any text");
    // console.log(obj, forms);
    dispatch(setLoading(true));
const hospitalID = user.hospitalID || -9
console.log("hospitalID",hospitalID)
    const data = await authPatch(
      `user/${hospitalID}/${user.id}`,
      forms,
      user.token
    );
    dispatch(setLoading(false));

    if (data.message == "success") {
      // console.log(data);
      dispatch(
        setCurrentUser({
          ...data.data,
          token: user.token,
          photo: data.data.photo || user.photo,
          imageURL: data.data.imageURL || user.imageURL,
        })
      );

      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify({
          ...user,
          ...data.data,
          imageURL: data.data.imageURL || user.imageURL,
          photo: data.data.photo || user.photo,
          isLoggedIn: true,
          token: user.token,
        }),
        key
      ).toString();
      localStorage.setItem("user", encryptedData);

      setIsEditing(false);
      dispatch(setSuccess("Profile successfully updated"));
    } else {
      dispatch(setError(data.message));
    }

    // console.log(data);
  };
  const debouncedHandleSubmit = debounce(handleFormSubmit, DEBOUNCE_DELAY);

  React.useEffect(() => {
    if (file?.size) debouncedHandleSubmit();
  }, [file]);

  return (
    <div className={styles.container} style={{ marginTop: "35px" }}>
      <div className={styles.container_profile}>
        <div className={styles.image_container}>
          <h3>Profile Info</h3>

          {user.imageURL || file ? (
            <div className={styles.image_container_image}>
              <img
                src={user.imageURL}
                alt="profile_pic"
                className={styles.img_show}
                ref={image_ref}
                style={{ filter: isHover ? "blur(1px)" : "blur(0px)" }}
              />
              {isHover && (
                <IconButton
                  color="error"
                  style={{ transform: "translate(60%,60%)" }}
                  onClick={() => setOpen(true)}
                  onMouseEnter={() => {
                    setIsHover(true);
                  }}
                  onMouseLeave={() => {
                    setIsHover(false);
                  }}
                >
                  <RemoveCircleIcon fontSize="large" />
                </IconButton>
              )}
            </div>
          ) : (
            <div className={styles.profile}>
              <PersonIcon />
            </div>
          )}

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
                <InputLabel
                  id="demo-simple-select-helper-label--gender"
                  className={!isEditing ? "Mui-disabled" : ""}
                >
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
                  style={{ color: !isEditing ? "grey" : "inherit" }}
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
                <InputLabel
                  id="demo-simple-select-helper-label"
                  className={!isEditing ? "Mui-disabled" : ""}
                >
                  State
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={String(formData.state.value)}
                  label="Select"
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
                  style={{ color: !isEditing ? "grey" : "inherit" }}
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
            {formData.address.value && (
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
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ ml: "auto", mb: "10px", mr: "8px" }}
                type="button"
                disabled={!isEditing}
                onClick={handleResetData}
              >
                Reset
              </Button>

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
          {isEditing ? "Cancle" : "Edit"}
        </Button>
      </div>
      <div className={styles.container_password}>
        <div className={styles.password_margin}></div>
        <form
          className={styles.password_form}
          onSubmit={debouncedHandlePasswordSubmit}
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
                type={showPassword ? "text" : "password"}
                value={formPasswordData.password.value}
                sx={{ width: 0.5 }}
                name="password"
                onChange={handlePasswordFormChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
