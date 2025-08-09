import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import ImageField from "../../../component/ImageField/imageField";
import { authPatch } from "../../../axios/usePatch";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "./../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { CityType, DistrictType, StateType } from "../../../types";
import { useDispatch } from "react-redux/es/exports";
import { setError, setLoading, setSuccess } from "../../../store/error/error.action";
import { CustomerCareUser } from "../../../utility/formTypes";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { Stack } from "@mui/material";
import { RestartAltRounded } from "@mui/icons-material";

// Define staffFormType
interface staffFormType {
  firstName: string;
  lastName: string;
  multiState: string;
  multiDist: string;
  multiCity: string;
  phoneNo: number | null;
  gender: string;
  dob: string;
  address: string;
  pinCode: number | null;
  email: string;
  password: string;
}

export type formDataCustomerCare = {
  firstName: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
  lastName: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
  multiState: {
    valid: boolean;
    showError: boolean;
    value: string[];
    message: string;
    name: string;
  };
  multiDist: {
    valid: boolean;
    showError: boolean;
    value: string[];
    message: string;
    name: string;
  };
  multiCity: {
    valid: boolean;
    showError: boolean;
    value: string[];
    message: string;
    name: string;
  };
  phoneNo: {
    valid: boolean;
    showError: boolean;
    value: number | null;
    message: string;
    name: string;
  };
  gender: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
  dob: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
  pinCode: {
    valid: boolean;
    showError: boolean;
    value: number | null;
    message: string;
    name: string;
  };
  address: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };

  email: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
  password: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
};

type CustomerCareFormProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "edit" | "view";
  userData: CustomerCareUser;
  type: "customercare";
  onSuccess?: () => void;
};

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

function checkLength(number: number | null, size: number): boolean {
  if (number === null) return false;
  const numberStr = String(number);
  return numberStr.length === size;
}

export default function CustomerCareForm({ open, setOpen, mode, userData, type, onSuccess }: CustomerCareFormProps) {
  const [image, setImage] = React.useState<File | undefined>();
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [states, setStates] = React.useState<StateType[]>([]);
  const [districts, setDistricts] = React.useState<DistrictType[]>([]);
  const [cities, setCities] = React.useState<CityType[]>([]);
  const [distList, setDistList] = React.useState<DistrictType[]>([]);
  const [cityList, setCityList] = React.useState<CityType[]>([]);

  console.log("User Data",userData.phoneNo);
  console.log("Type of user data", typeof Number( userData.phoneNo))

  // Initialize formData and obj before useEffect
  const initialFormData: formDataCustomerCare = {
    firstName: { valid: !!userData.firstName, showError: false, value: userData.firstName || "", message: "", name: "firstName" },
    lastName: { valid: !!userData.lastName, showError: false, value: userData.lastName || "", message: "", name: "lastName" },
    multiState: { valid: !!userData.multiState?.length, showError: false, value: userData.multiState || [], message: "", name: "multiState" },
    multiDist: { valid: !!userData.multiDist?.length, showError: false, value: userData.multiDist || [], message: "", name: "multiDist" },
    multiCity: { valid: !!userData.multiCity?.length, showError: false, value: userData.multiCity || [], message: "", name: "multiCity" },
    phoneNo: { valid: !!userData.phoneNo && checkLength(Number(userData.phoneNo), 10), showError: false, value: Number(userData.phoneNo) || null, message: "", name: "phoneNo" },
    gender: { valid: !!userData.gender, showError: false, value: userData.gender ? String(userData.gender) : "", message: "", name: "gender" },
    dob: {
      valid: !!userData.dob && new Date(userData.dob) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      showError: false,
      value: userData.dob ? new Date(userData.dob).toISOString().split("T")[0] : "",
      message: "",
      name: "dob",
    },
    address: { valid: true, showError: false, value: userData.address || "", message: "", name: "address" },
    pinCode: { valid: userData.pinCode ? checkLength(userData.pinCode, 6) : true, showError: false, value: userData.pinCode || null, message: "", name: "pinCode" },
    email: { valid: !!userData.email && emailRegex.test(userData.email), showError: false, value: userData.email || "", message: "", name: "email" },
    password: { valid: false, showError: false, value: "", message: "", name: "password" },
  };

  const [formData, setFormData] = React.useState<formDataCustomerCare>(initialFormData);

  const emptyFormData: formDataCustomerCare = {
    firstName: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "firstName",
    },
    lastName: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "lastName",
    },
    multiState: {
      valid: false,
      showError: false,
      value: [],
      message: "",
      name: "multiState",
    },
    multiDist: {
      valid: false,
      showError: false,
      value: [],
      message: "",
      name: "multiDist",
    },
    multiCity: {
      valid: false,
      showError: false,
      value: [],
      message: "",
      name: "multiCity",
    },
    phoneNo: {
      valid: false,
      showError: false,
      value: null,
      message: "",
      name: "phoneNo",
    },
    gender: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "gender",
    },
    dob: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "dob",
    },
    address: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "address",
    },
    pinCode: {
      valid: false,
      showError: false,
      value: null,
      message: "",
      name: "pinCode",
    },
    email: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "email",
    },
    password: {
      valid: true,
      showError: false,
      value: "",
      message: "",
      name: "password",
    },
  };

  const emptyObj: staffFormType = {
    firstName: "",
    lastName: "",
    multiState: "",
    multiDist: "",
    multiCity: "",
    phoneNo: null,
    gender: "",
    dob: "",
    address: "",
    pinCode: null,
    email: "",
    password: "",
  };

  const initialObj: staffFormType = {
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    multiState: Array.isArray(userData.multiState) ? userData.multiState.join("#") : "",
    multiDist: Array.isArray(userData.multiDist) ? userData.multiDist.join("#") : "",
    multiCity: Array.isArray(userData.multiCity) ? userData.multiCity.join("#") : "",
    phoneNo: Number(userData.phoneNo) || null,
    gender: userData.gender ? String(userData.gender) : "",
    dob: userData.dob ? new Date(userData.dob).toISOString().split("T")[0] : "",
    address: userData.address || "",
    pinCode: userData.pinCode || null,
    email: userData.email || "",
    password: "",
  };

  const [obj, setObj] = React.useState<staffFormType>(initialObj);

  // Debug: Log props
  React.useEffect(() => {
    console.log("CustomerCareForm props:", { open, mode, userData, type });
  }, [open, mode, userData, type]);

  // Fetch administrative data
  React.useEffect(() => {
    const fetchAdministrativeData = async () => {
      try {
        const response = await authFetch(`data/administrativeRegions`, currentUser.token);
        const { states, districts, cities } = response;
        setStates(states);
        setDistricts(districts);
        setCities(cities);
      } catch (error) {
        console.error("Failed to fetch administrative data:", error);
        dispatch(setError("Failed to fetch administrative data"));
      }
    };
    fetchAdministrativeData();
  }, [currentUser.token, dispatch]);

  // Filter districts based on selected states
  React.useEffect(() => {
    const filtered = districts.filter((d) => formData.multiState.value.includes(d.state));
    setDistList(filtered);
    setCityList([]);
  }, [formData.multiState.value, districts]);

  // Filter cities based on selected districts
  React.useEffect(() => {
    const filtered = cities.filter((c) => formData.multiDist.value.includes(c.district));
    setCityList(filtered);
  }, [formData.multiDist.value, cities]);

  const handleChange = (event: SelectChangeEvent) => {
    const isValid = !!event.target.value;
    const message = isValid ? "" : "This field is required";
    const showError = !isValid;
    const name = event.target.name;

    setFormData((state: formDataCustomerCare) => ({
      ...state,
      [name]: {
        valid: isValid,
        showError,
        value: event.target.value,
        message,
        name,
      },
    }));
    setObj((prev: staffFormType) => ({
      ...prev,
      [name]: event.target.value,
    }));
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = event.target;
    let isValid = !!inputValue;
    let message = isValid ? "" : "This field is required";
    let showError = !isValid;
    let value: string | number | null = inputValue;

    if (name === "email") {
      if (inputValue) {
        isValid = emailRegex.test(inputValue);
        message = isValid ? "" : "Invalid email format";
        showError = !isValid;
      }
    } else if (name === "phoneNo") {
      const numericValue = inputValue.replace(/\D/g, "");
      value = numericValue ? Number(numericValue) : null;
      isValid = value !== null && checkLength(value, 10);
      message = isValid ? "" : "Phone number must be 10 digits";
      showError = !isValid;
    } else if (name === "pinCode") {
      const numericValue = inputValue.replace(/\D/g, "");
      value = numericValue ? Number(numericValue) : null;
      isValid = value === null || checkLength(value, 6);
      message = isValid ? "" : "Pincode must be 6 digits";
      showError = !isValid;
    } else if (name === "dob") {
      isValid = !!inputValue && new Date(inputValue) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18));
      message = isValid ? "" : "Age must be at least 18 years";
      showError = !isValid;
    } else if (name === "password") {
      if (!inputValue) {
        isValid = false;
        message = "Password is required";
        showError = true;
      } else {
        isValid = strongPasswordRegex.test(inputValue);
        message = isValid ? "" : "Not a strong password";
        showError = !isValid;
      }
    }

    setFormData((state: formDataCustomerCare) => ({
      ...state,
      [name]: {
        valid: isValid,
        showError,
        value,
        message,
        name,
      },
    }));
    setObj((prev: staffFormType) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeStatesCheckMarks = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const isValid = value.length > 0;
    setFormData((state: formDataCustomerCare) => ({
      ...state,
      multiState: {
        valid: isValid,
        showError: !isValid,
        value: typeof value === "string" ? value.split(",") : value,
        message: isValid ? "" : "This field is required",
        name: "multiState",
      },
      multiDist: {
        valid: false,
        showError: false,
        value: [],
        message: "",
        name: "multiDist",
      },
      multiCity: {
        valid: false,
        showError: false,
        value: [],
        message: "",
        name: "multiCity",
      },
    }));
    setObj((prev: staffFormType) => ({
      ...prev,
      multiState: typeof value === "string" ? value.split(",").join("#") : value.join("#"),
    }));
  };

  const handleChangeDistrictsCheckMarks = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const isValid = value.length > 0;
    setFormData((state: formDataCustomerCare) => ({
      ...state,
      multiDist: {
        valid: isValid,
        showError: !isValid,
        value: typeof value === "string" ? value.split(",") : value,
        message: isValid ? "" : "This field is required",
        name: "multiDist",
      },
      multiCity: {
        valid: false,
        showError: false,
        value: [],
        message: "",
        name: "multiCity",
      },
    }));
    setObj((prev: staffFormType) => ({
      ...prev,
      multiDist: typeof value === "string" ? value.split(",").join("#") : value.join("#"),
    }));
  };

  const handleChangeCitiesCheckMarks = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const isValid = value.length > 0;
    setFormData((state: formDataCustomerCare) => ({
      ...state,
      multiCity: {
        valid: isValid,
        showError: !isValid,
        value: typeof value === "string" ? value.split(",") : value,
        message: isValid ? "" : "This field is required",
        name: "multiCity",
      },
    }));
    setObj((prev: staffFormType) => ({
      ...prev,
      multiCity: typeof value === "string" ? value.split(",").join("#") : value.join("#"),
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setImage(undefined);
    setFormData(initialFormData);
    setObj(initialObj);
  };

  const handleReset = () => {
    console.log("Reset Clicked");
    setFormData(emptyFormData);
    setObj(emptyObj);
    setImage(undefined);
    setDistList([]);
    setCityList([]);
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const requiredFields = ["firstName", "lastName", "multiState", "multiDist", "multiCity", "phoneNo", "gender", "dob", "email", "password"];
    const newFormData = { ...formData };
    let hasError = false;

    requiredFields.forEach((field) => {
      const fieldData = formData[field as keyof formDataCustomerCare];
      let isValid = false;
      let message = "This field is required";

      if (field === "phoneNo") {
        isValid = fieldData.value !== null && checkLength(Number(fieldData.value), 10);
        message = isValid ? "" : "Phone number must be 10 digits";
      } else if (field === "email") {
        isValid = !!fieldData.value && emailRegex.test(fieldData.value as string);
        message = isValid ? "" : fieldData.value ? "Invalid email format" : "This field is required";
      } else if (field === "multiState" || field === "multiDist" || field === "multiCity") {
        isValid = (fieldData.value as string[]).length > 0;
        message = isValid ? "" : "This field is required";
      } else if (field === "password") {
        isValid = !!fieldData.value && strongPasswordRegex.test(fieldData.value as string);
        message = isValid ? "" : fieldData.value ? "Not a strong password" : "Password is required";
      } else {
        isValid = !!fieldData.value;
      }

      newFormData[field as keyof formDataCustomerCare].valid = isValid;
      newFormData[field as keyof formDataCustomerCare].showError = !isValid;
      newFormData[field as keyof formDataCustomerCare].message = message;

      if (!isValid) hasError = true;
    });

    if (obj.pinCode !== null && !checkLength(obj.pinCode, 6)) {
      newFormData.pinCode = {
        ...newFormData.pinCode,
        valid: false,
        showError: true,
        message: "Pincode must be 6 digits",
      };
      hasError = true;
    }

      const dobisValid = obj.dob && new Date(obj.dob) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18));
      if (!dobisValid) {
        newFormData.dob = {
          value: formData.dob.value,
          name: formData.dob.name,
          valid: false,
          showError: true,
          message: "Age should be at least 18 years",
        };
        hasError = true;
      }

    setFormData(newFormData);

    if (hasError) {
      dispatch(setLoading(false));
      return;
    }

    const forms = new FormData();
    const keyArray: Array<keyof staffFormType> = Object.keys(obj) as Array<keyof staffFormType>;

    keyArray.forEach((el: keyof staffFormType) => {
      if (el === "multiState" && obj.multiState) {
        const states = obj.multiState.split("#");
        states.forEach((state: string) => forms.append("multiState[]", state));
      } else if (el === "multiDist" && obj.multiDist) {
        const districts = obj.multiDist.split("#");
        districts.forEach((district: string) => forms.append("multiDist[]", district));
      } else if (el === "multiCity" && obj.multiCity) {
        const cities = obj.multiCity.split("#");
        cities.forEach((city: string) => forms.append("multiCity[]", city));
      } else if (obj[el] !== null && obj[el] !== undefined) {
        forms.append(el, String(obj[el]));
      }
    });

    if (image) {
      forms.append("photo", image);
    }

    const path = `user/editCustomerCareUser/${userData.id}`;
    const data = await authPatch(path, forms, currentUser.token);
    if (data.message === "success") {
      dispatch(setSuccess("Customer care user updated successfully"));
      setTimeout(() => {
        handleClose();
        if (onSuccess) {
          onSuccess(); // Call onSuccess to trigger refresh
        }
      }, 1000);
    } else {
      setFormData((prev) => ({
        ...prev,
        email: {
          ...prev.email,
          valid: false,
          showError: true,
          message: data.message.includes("email") ? data.message : "Submission failed",
        },
      }));
    }
    dispatch(setLoading(false));
  };

  const debouncedHandleSubmit = debounce(handleFormSubmit, DEBOUNCE_DELAY);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form
        onSubmit={(e) => {
          if (mode === "edit") {
            e.preventDefault();
            debouncedHandleSubmit(e);
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" sx={{ position: "relative" }}>
            <span style={{ flexGrow: 1, textAlign: "center" }}>
              {mode === "edit" ? "Edit" : "View"} Customer Care Details
            </span>
            {mode === "edit" && (
              <Button
                onClick={handleReset}
                variant="outlined"
                size="small"
                startIcon={<RestartAltRounded />}
                aria-label="Reset form fields"
                sx={{ position: "absolute", right: 0 }}
              >
                Reset
              </Button>
            )}
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: "2rem" }}>
            <Grid item xs={6}>
              <TextField
                required
                id="firstName"
                label="First Name"
                value={formData.firstName.value}
                error={
                  formData.firstName.showError ||
                  formData.firstName.value === ""
                }
                helperText={
                  (formData.firstName.showError
                    ? formData.firstName.message
                    : "") ||
                  (formData.firstName.value === ""
                    ? "This field is required"
                    : "")
                }
                name="firstName"
                fullWidth
                variant="outlined"
                onChange={handleChangeInput}
                disabled={mode === "view"}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                id="lastName"
                label="Last Name"
                name="lastName"
                value={formData.lastName.value}
                error={
                  formData.lastName.showError || formData.lastName.value === ""
                }
                helperText={
                  (formData.lastName.showError
                    ? formData.lastName.message
                    : "") ||
                  (formData.lastName.value === ""
                    ? "This field is required"
                    : "")
                }
                onChange={handleChangeInput}
                fullWidth
                disabled={mode === "view"}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                error={
                  formData.multiState.showError && !formData.multiState.valid
                }
                disabled={mode === "view"}
              >
                <InputLabel id="multi-state-select-label">State</InputLabel>
                <Select
                  labelId="multi-state-select-label"
                  id="multi-state-select"
                  multiple
                  value={formData.multiState.value}
                  label="State"
                  onChange={handleChangeStatesCheckMarks}
                  name="multiState"
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {states.map((el) => (
                    <MenuItem key={el.state} value={el.state}>
                      <Checkbox
                        checked={formData.multiState.value.includes(el.state)}
                      />
                      <ListItemText primary={el.state} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {formData.multiState.showError
                    ? formData.multiState.message
                    : ""}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                error={
                  formData.multiDist.showError && !formData.multiDist.valid
                }
                disabled={
                  mode === "view" || formData.multiState.value.length === 0
                }
              >
                <InputLabel id="multi-dist-select-label">District</InputLabel>
                <Select
                  labelId="multi-dist-select-label"
                  id="multi-dist-select"
                  multiple
                  value={formData.multiDist.value}
                  label="District"
                  onChange={handleChangeDistrictsCheckMarks}
                  name="multiDist"
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {distList.map((el) => (
                    <MenuItem key={el.district} value={el.district}>
                      <Checkbox
                        checked={formData.multiDist.value.includes(el.district)}
                      />
                      <ListItemText primary={el.district} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {formData.multiDist.showError
                    ? formData.multiDist.message
                    : ""}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                error={
                  formData.multiCity.showError && !formData.multiCity.valid
                }
                disabled={
                  mode === "view" || formData.multiDist.value.length === 0
                }
              >
                <InputLabel id="multi-city-select-label">City</InputLabel>
                <Select
                  labelId="multi-city-select-label"
                  id="multi-city-select"
                  multiple
                  value={formData.multiCity.value}
                  label="City"
                  onChange={handleChangeCitiesCheckMarks}
                  name="multiCity"
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {cityList.map((el) => (
                    <MenuItem key={el.city} value={el.city}>
                      <Checkbox
                        checked={formData.multiCity.value.includes(el.city)}
                      />
                      <ListItemText primary={el.city} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {formData.multiCity.showError
                    ? formData.multiCity.message
                    : ""}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                id="phoneNo"
                label="Phone Number"
                name="phoneNo"
                value={formData.phoneNo.value ?? ""}
                error={
                  formData.phoneNo.showError || formData.phoneNo.value === null
                }
                helperText={
                  (formData.phoneNo.showError
                    ? formData.phoneNo.message
                    : "") ||
                  (formData.phoneNo.value === null
                    ? "This field is required"
                    : "")
                }
                onChange={handleChangeInput}
                fullWidth
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 10,
                  minLength: 10,
                }}
                disabled={mode === "view"}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                error={formData.gender.showError && !formData.gender.valid}
                required
                disabled={mode === "view"}
              >
                <InputLabel id="gender-select-label">Gender</InputLabel>
                <Select
                  labelId="gender-select-label"
                  id="gender-select"
                  value={formData.gender.value}
                  label="Gender"
                  onChange={handleChange}
                  name="gender"
                  error={(formData.gender.showError || formData.gender.value === "") && !formData.gender.valid}
                >
                  <MenuItem value="1">Male</MenuItem>
                  <MenuItem value="2">Female</MenuItem>
                </Select>
                <FormHelperText>
                  {formData.gender.showError ? formData.gender.message : ""}
                </FormHelperText>
              </FormControl>
              <p style={{ color: "#d84315", fontSize: "12px" }}>
                {
                  formData.gender.value === "" &&
                  "Please Enter Gender"}
              </p>
            </Grid>
            <Grid item xs={6}>
              <TextField
                InputLabelProps={{ shrink: true }}
                label="DOB"
                required
                id="dob"
                type="date"
                name="dob"
                value={formData.dob.value}
                error={formData.dob.showError || formData.dob.value === ""}
                helperText={(formData.dob.showError ? formData.dob.message : "") || (formData.dob.value === "" ? "This field is required" : "")}
                onChange={handleChangeInput}
                fullWidth
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                disabled={mode === "view"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="address"
                label="Home Address"
                name="address"
                value={formData.address.value}
                error={formData.address.showError}
                helperText={
                  formData.address.showError ? formData.address.message : ""
                }
                onChange={handleChangeInput}
                multiline
                rows={4}
                fullWidth
                disabled={mode === "view"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="pinCode"
                label="Pincode"
                name="pinCode"
                value={formData.pinCode.value ?? ""}
                error={formData.pinCode.showError}
                helperText={
                  formData.pinCode.showError ? formData.pinCode.message : ""
                }
                onChange={handleChangeInput}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 6,
                  minLength: 6,
                }}
                fullWidth
                disabled={mode === "view"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="email"
                label="Email ID"
                name="email"
                value={formData.email.value}
                error={formData.email.showError || formData.email.value === ""}
                helperText={(formData.email.showError ? formData.email.message : "") || (formData.email.value === "" ? "This field is required" : "")}
                onChange={handleChangeInput}
                type="email"
                fullWidth
                disabled={mode === "view"}
              />
            </Grid>
            {mode === "edit" && (
              <Grid item xs={12}>
                <TextField
                  required
                  id="password"
                  label="Set Password"
                  name="password"
                  value={formData.password.value}
                  error={formData.password.showError}
                  helperText={
                    formData.password.showError ? formData.password.message : ""
                  }
                  onChange={handleChangeInput}
                  type="password"
                  fullWidth
                />
              </Grid>
            )}
            <Grid item xs={12}>
              {mode === "edit" && <ImageField image={image} setImage={setImage} />}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{mode === "view" ? "Close" : "Cancel"}</Button>
          {mode === "edit" && (
            <Button type="submit" variant="contained">
              Save
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}