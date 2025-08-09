import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authPatch } from "../../../axios/usePatch";
import { debounce, DEBOUNCE_DELAY } from '../../../utility/debounce';
import { useDispatch } from "react-redux";
import {
  setError,
  setSuccess,
  setLoading,
} from "../../../store/error/error.action";
import React, { useRef } from "react";
import styles from "./profile.module.scss";
// import { MutableRefObject } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
// import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
// import { authPost } from "../../../axios/useAuthPost";
import PersonIcon from "@mui/icons-material/Person";
// import IconButton from "@mui/material/IconButton";
import {
  profileFormDataObj,
  profileFormDataType,
} from "../../../utility/formTypes";
import { state, city } from "../../../utility/state";
import Autocomplete from "@mui/material/Autocomplete";
// import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog from "./ClearProfileDialog";
import { IconButton } from "@mui/material";
import { departmentType, staffType } from "../../../types";
import { authFetch } from "../../../axios/useAuthFetch";
import { selectAllStaff } from "../../../store/staff/staff.selector";
import { setAllStaff } from "../../../store/staff/staff.action";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Role_NAME, Role_list, Role_list_Type } from "../../../utility/role";
const useStyles = makeStyles({
  dialogPaper: {
    // width: "600px",
    minWidth: "1000px",
  },
});
type DialogEditProfile = {
  editProfileDialog: boolean;
  setEditProfileDialog: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
};
function DialogEditProfile({
  editProfileDialog,
  setEditProfileDialog,
  id,
}: DialogEditProfile) {
  const classes = useStyles();
  const image_ref = useRef<HTMLImageElement>(null);
  const [file, setFile] = React.useState<any>();
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [staff, setStaff] = React.useState<staffType | null>(null);
  const staffList = useSelector(selectAllStaff);
  const [isHover, setIsHover] = React.useState(false);
  const [departmentList, setDepartmentList] = React.useState<departmentType[]>(
    []
  );
  React.useEffect(() => {
    if (staff?.email) setEmail(staff?.email);
  }, [staff]);

  const getAllDepartment = async () => {
    const data = await authFetch(`department/${user.hospitalID}`, user.token);
    if (data.departments.length) {
      setDepartmentList(data.departments);
    }
  };
  React.useEffect(() => {
    getAllDepartment();
  }, [user]);

  React.useEffect(() => {

    if (image_ref?.current) {
      image_ref.current.addEventListener("mouseenter", () => {
        setIsHover(true);
      });
      image_ref.current.addEventListener("mouseout", () => {
        setIsHover(false);
      });
    }
  }, [staff?.imageURL]);

  const getStaffDetail = async () => {
    const response = await authFetch(
      `user/${user.hospitalID}/${id}`,
      user.token
    );
    if (response.message == "success") {
      
      setStaff(response.user);
    }
  };

  React.useEffect(() => {
    getStaffDetail();
  }, [user, id]);
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
  const [formDataAddition, setFormDataAddition] = React.useState({
    departmentID: {
      valid: false,
      showError: false,
      value: 0,
      message: "",
      name: "department",
    },
    role: {
      valid: false,
      showError: false,
      value: 0,
      message: "",
      name: "role",
    },
  });
  const roleListArray: Array<keyof Role_list_Type> = Object.keys(
    Role_list
  ) as unknown as Array<keyof Role_list_Type>;

  React.useEffect(() => {
    if (staff) {
      setFormDataAddition((prev) => {
        return {
          departmentID: {
            ...prev.departmentID,
            value: staff.departmentID || 0,
          },
          role: { ...prev.role, value: staff.role || 0 },
        };
      });
    }
  }, [staff]);
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
        firstName: { ...currentValue.firstName, value: staff?.firstName || "" },
        lastName: { ...currentValue.lastName, value: staff?.lastName || "" },
        city: { ...currentValue.city, value: staff?.city || "" },
        state: { ...currentValue.state, value: staff?.state || "" },
        address: { ...currentValue.address, value: staff?.address || "" },
        pinCode: { ...currentValue.pinCode, value: staff?.pinCode || null },
        dob: { ...currentValue.dob, value: staff?.dob?.split("T")[0] || "" },
        gender: { ...currentValue.gender, value: staff?.gender || -1 },
        phoneNo: {
          ...currentValue.phoneNo,
          value: staff?.phoneNo || null,
        },
      };
    });
  }, [staff]);

  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isvalid = event.target.validity.valid;
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    const name = event.target.name;

    let value: string | number;
    if (name == "phoneNo" || name == "pinCode") {
      value = Number(event.target.value) || 0;
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

  const handleChangeAddition = (event: SelectChangeEvent) => {
    // setAge(event.target.value);

    const isvalid = true;
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    const name = event.target.name;

    setFormDataAddition((state) => {
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
    if (file) {
      forms.append("photo", file);
    }
    forms.append("image", "any text");
    dispatch(setLoading(true));

    const data = await authPatch(
      `user/${user.hospitalID}/editStaff/${id}`,
      forms,
      user.token
    );
    dispatch(setLoading(false));

    if (data.message == "success") {
      dispatch(setSuccess("Profile successfully updated"));
      dispatch(
        setAllStaff(
          staffList.map((staff) => {
            if (staff.id == id) {
              return data.user;
            } else return staff;
          })
        )
      );

      handleClose();
    } else {
      dispatch(setError(data.message));
    }

  };
  const debouncedHandleSubmit = debounce(handleFormSubmit,DEBOUNCE_DELAY);
  React.useEffect(() => {
    if (file?.size) debouncedHandleSubmit();
  }, [file]);

  const handleClose = () => {
    setEditProfileDialog(false);
  };
  return (
    <>
      <Dialog
        open={editProfileDialog}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {/* <DialogContentText></DialogContentText> */}
          <div className={styles.container}>
            <div className={styles.container_profile}>
              <div className={styles.image_container}>
                <h3>Profile Info</h3>

                {staff?.imageURL || file ? (
                  <div className={styles.image_container_image}>
                    <img
                      src={staff?.imageURL || URL.createObjectURL(file)}
                      // src={staff?.imageURL}
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
                      label={"First Name"}
                      //   helperText="Enter your name"
                      // defaultValue={user.firstName}
                      required
                      value={formData.firstName.value}
                      variant="outlined"
                      fullWidth
                      name="firstName"
                      onChange={handleChangeForm}
                      error={
                        formData.firstName.showError &&
                        !formData.firstName.valid
                      }
                      helperText={
                        formData.firstName.showError &&
                        formData.firstName.message
                      }

                      // placeholder={user.firstName}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      id="outlined-required"
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName.value}
                      error={
                        formData.lastName.showError && !formData.lastName.valid
                      }
                      helperText={formData.lastName.message}
                      onChange={handleChangeForm}
                      //   defaultValue="Hello World"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {/* <Stack direction="column" sx={{ width: 0.48, mt: "1rem" }}> */}
                    <FormControl
                      fullWidth
                      error={
                        formDataAddition.role.showError &&
                        !formDataAddition.role.valid
                      }
                      required
                    >
                      <InputLabel id="demo-simple-select-helper-label">
                        Role
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={String(formDataAddition.role.value)}
                        label="Age"
                        onChange={handleChangeAddition}
                        name="role"
                        required
                      >
                        {roleListArray.map(
                          (el: keyof Role_list_Type) =>
                            el != Role_NAME.sAdmin &&
                            el != Role_NAME.admin && (
                              <MenuItem value={el}>
                                {" "}
                                {Role_list[el].slice(0, 1).toUpperCase() +
                                  Role_list[el].slice(1).toLowerCase()}{" "}
                              </MenuItem>
                            )
                        )}
                      </Select>
                      <FormHelperText>
                        {formDataAddition.role.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl
                      fullWidth
                      error={
                        formDataAddition.departmentID.showError &&
                        !formDataAddition.departmentID.valid
                      }
                      required
                    >
                      <InputLabel id="demo-simple-select-helper-label">
                        Department
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={String(formDataAddition.departmentID.value)}
                        label="Department"
                        onChange={handleChangeAddition}
                        name="departmentID"
                      >
                        {departmentList.length == 0 ? (
                          <MenuItem disabled value="">
                            No departments available
                          </MenuItem>
                        ) : (
                          departmentList.map((el) => (
                            <MenuItem key={el.id} value={el.id}>
                              {el.name.slice(0, 1).toUpperCase() +
                                el.name.slice(1).toLowerCase()}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      <FormHelperText>
                        {formDataAddition.departmentID.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label={"Phone Number"}
                      // defaultValue={user.phoneNo}
                      //   helperText="Enter your name"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      fullWidth
                      required
                      name="phoneNo"
                      value={formData.phoneNo.value || ""}
                      error={
                        formData.phoneNo.showError && !formData.phoneNo.valid
                      }
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
                      error={
                        formData.gender.showError && !formData.gender.valid
                      }
                      required
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
                      value={formData.city?.value || null}
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
                        <TextField {...params} label="City" required />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    {/* </Stack> */}
                    <TextField
                      // required
                      id="outlined-required"
                      label="Pincode"
                      name="pinCode"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formData.pinCode.value || ""}
                      error={
                        formData.pinCode.showError && !formData.pinCode.valid
                      }
                      helperText={formData.pinCode.message}
                      onChange={handleChangeForm}
                      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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
                      error={
                        formData.address.showError && !formData.address.valid
                      }
                      helperText={formData.address.message}
                      onChange={handleChangeForm}
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
                    >
                      Update Changes
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
            <AlertDialog
              open={open}
              setOpen={setOpen}
              id={id}
              setStaff={setStaff}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DialogEditProfile;
