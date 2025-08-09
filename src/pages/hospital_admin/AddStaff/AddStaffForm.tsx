import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// import * as React from "react";
import {
  Role_NAME,
  Role_list,
  Role_list_Type,
  SCOPE_LIST,
  SCOPE_LIST_Type,
} from "../../../utility/role";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import ImageField from "../../../component/ImageField/imageField";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "./../../../store/user/user.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { CityType, departmentType, DistrictType, headNurseType, StateType } from "../../../types";
import { useDispatch } from "react-redux/es/exports";
import { setNewStaff } from "../../../store/staff/staff.action";
import {
  setError,
  setLoading,
  setSuccess,
} from "../../../store/error/error.action";
import { formDataStaff, staffFormType } from "../../../utility/formTypes";
import Autocomplete from "@mui/material/Autocomplete";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { capitalizeFirstLetter } from "../../../utility/global";
type addStaffProps = {
  type: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
};

const styles = {
  disabledMenuItem: {
    color: "black", // Lighter text color for disabled option
    fontStyle: "italic", // Italic style for disabled option
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    fontSize: "0.75rem",
    marginTop: "4px",
  },
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

function checkLength(number: number, size: number): boolean {
  // Convert the number to a string
  const numberStr = String(number);

  // Check if the string has exactly 10 digits
  return numberStr.length === size;
}

export default function AddStaffForm({ setOpen, type, onSuccess }: addStaffProps) {
  const [image, setImage] = React.useState<File | undefined>();
  const [departmentList, setDepartmentList] = React.useState<departmentType[]>(
    []
  );
  const [headNurseList, setHeadNurseList] = React.useState<headNurseType[]>([]);
  const strongPasswordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  // const scopeIds = user.scope.split("#").map(Number);

  // const filteredScopeList = Object.fromEntries(
  //   Object.entries(SCOPE_LIST).filter(([, value]) => scopeIds.includes(value))
  // );
  const [formData, setFormdata] = React.useState<formDataStaff>({
    firstName: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "firstname",
    },
    lastName: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "lastName",
    },
    role: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "role",
    },
    hospitalIds: {
      valid: false,
      showError: false,
      value: [],
      message: "",
      name: "hospitalIds",
    },
    multiState: {
      valid: false,
      showError: false,
      value: [],
      message: "",
      name: "hospitalIds",
    },
    multiDist: {
      valid: false,
      showError: false,
      value: [],
      message: "",
      name: "hospitalIds",
    },
    multiCity: {
      valid: false,
      showError: false,
      value: [],
      message: "",
      name: "hospitalIds",
    },
    scope: {
      valid: false,
      showError: false,
      value: [],
      message: "",
      name: "role",
    },
    departmentID: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "department",
    },
    reportTo: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "department",
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
    city: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "city",
    },
    state: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "state",
    },
    pinCode: {
      valid: false,
      showError: false,
      value: null,
      message: "",
      name: "pinCode",
    },
    address: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "address",
    },

    email: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "email",
    },
    password: {
      valid: false,
      showError: false,
      value: "",
      message: "",
      name: "password",
    },
  });

  const [cityList, setCityList] = React.useState<CityType[]>([]);
  const [DistList, setDistList] = React.useState<DistrictType[]>([]);

  const [states, setStates] = React.useState<StateType[]>([]);
  const [districts, setDistricts] = React.useState<DistrictType[]>([]);
  const [cities, setCities] = React.useState<CityType[]>([]);

  console.log("states",states)
  React.useEffect(() => {
    const fetchAdministrativeData = async () => {
      try {
        const response = await authFetch(
          `data/administrativeRegions`,
          user.token
        );

        console.log("objectresponse",response)
       
        const { states, districts, cities } = response;
        setStates(states);
        setDistricts(districts);
        setCities(cities);
      } catch (error) {
        console.error('Failed to fetch administrative data:', error);
      }
    };

    fetchAdministrativeData();
  }, [user.token]);

// Filter districts when multiple states are selected
React.useEffect(() => {
  let filtered ;
  if(formData.multiState.value.length > 0){  
   filtered = districts.filter(d => formData.multiState.value.includes(d.state));
  }else{
    filtered = districts.filter(d => formData.state.value.includes(d.state));
  }
  setDistList(filtered);
  setCityList([]);
}, [formData.multiState, formData.state]);

// Filter cities when multiple districts are selected
React.useEffect(() => {
  const filtered = cities.filter(c => formData.multiDist.value.includes(c.district));
  setCityList(filtered);
}, [formData.multiDist]);



  const scope_required = [
    Role_NAME.doctor,
    Role_NAME.nurse,
    Role_NAME.staff,
    Role_NAME.headNurse,
    Role_NAME.hod,
  ];

  // Add new function to fetch head nurses
  const getHeadNurses = React.useCallback(async () => {
    try {
      const res = await authFetch(
        `nurse/getheadnurse/${user.hospitalID}`,
        user.token
      );
      const data = res?.data;
      if (data && Array.isArray(data)) {
        setHeadNurseList(data);
      } else {
        console.error("Expected an array but got:", data);
        setHeadNurseList([]);
      }
    } catch (error) {
      console.error("Error fetching head nurses:", error);
      dispatch(setError("Failed to fetch head nurses"));
    }
  }, [user.hospitalID, user.token, dispatch]);

  

  React.useEffect(() => {
    getHeadNurses();
  }, [ getHeadNurses]);

  const getDepartmentNameById = (departmentID: number): string => {
    const department = departmentList.find((dept) => dept.id === departmentID);
    return department ? department.name : "Unknown Department";
  };

  const getScopeNames = (scopeNumbers: string): string => {
    const scopeIds = scopeNumbers.split("#").map(Number);
    const scopeNames = scopeIds.map((id) => {
      const scopeName = Object.keys(SCOPE_LIST).find(
        (key) => SCOPE_LIST[key as keyof SCOPE_LIST_Type] === id
      );
      return scopeName ? capitalizeFirstLetter(scopeName) : "Unknown Scope";
    });
    return scopeNames.join(", ");
  };
  const handleChange = (event: SelectChangeEvent) => {
    // setAge(event.target.value);

    const isvalid = true;
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    const name = event.target.name;

    setFormdata((state) => {
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

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = event.target;
  
    // HTML5 validity check for required fields
    let isValid = event.target.validity.valid;
    let message = isValid ? "" : "This field is required";
    let showError = !isValid;
    let value: string | number | null = inputValue;
  
    // Email-specific validation
    if (name === "email") {
      if (inputValue) {
        // Regular expression for email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        isValid = emailRegex.test(inputValue);
        message = isValid ? "" : "Invalid email format";
        showError = !isValid;
      } else {
        // Empty email field (handled by required check)
        isValid = event.target.validity.valid;
        message = isValid ? "" : "This field is required";
        showError = !isValid;
      }
    }
  
    // Handle value transformation for specific fields
    if (name === "phoneNo" || name === "pinCode") {
      value = inputValue.replace(/\D/g, "");
    }
  
    // Update formdata state
    setFormdata((state) => ({
      ...state,
      [name]: {
        valid: isValid,
        showError,
        value,
        message,
        name,
      },
    }));
  
    // Update obj state
    setObj((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };



  const getAllDepartment = React.useCallback(async () => {
    const data = await authFetch(`department/${user.hospitalID}`, user.token);
    console.log("datanj", data);
    if (data.departments.length) {
      setDepartmentList(data.departments);
    }
  }, [user.hospitalID, user.token]);

  React.useEffect(() => {
    getAllDepartment();
  }, [getAllDepartment]);

  const handleClose = () => {
    setOpen(false);
  };
  const [obj, setObj] = React.useState<staffFormType>({
    firstName: "",
    lastName: "",
    role: "",
    departmentID: "",
    hospitalIds: "",
    multiState: "",
    multiDist: "",
    multiCity: "",
    phoneNo: null,
    gender: "",
    dob: "",
    city: "",
    state: "",
    pinCode: null,
    address: "",
    email: "",
    password: "",
    scope: "",
  });

const handleFormSubmit: React.FormEventHandler<HTMLFormElement> | undefined = async (e) => {
  e.preventDefault();
  dispatch(setLoading(true));

  const requiredFields = type === "customercare"
    ? ["firstName", "lastName", "phoneNo", "gender", "dob", "email", "password"]
    : ["firstName", "lastName", "role", "phoneNo", "gender", "dob", "state", "city", "email", "password", "pinCode"];

  const newFormData = { ...formData };
  let hasError = false;

  requiredFields.forEach((field) => {
    const fieldData = formData[field as keyof formDataStaff]; // Use formData to avoid mutating newFormData prematurely
    let isValid = false;
    let message = "This field is required";

    if (field === "phoneNo") {
      isValid = !!fieldData.value && checkLength(Number(fieldData.value), 10);
      message = isValid ? "" : "Mobile number must be 10 digits";
    } else if (field === "pinCode") {
      isValid = !!fieldData.value && checkLength(Number(fieldData.value), 6);
      message = isValid ? "" : "Pincode must be 6 digits";
    } else if (field === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      isValid = !!fieldData.value && emailRegex.test(fieldData.value as string);
      message = isValid ? "" : fieldData.value ? "Invalid email format" : "This field is required";
    } else {
      isValid = !!fieldData.value;
    }

    newFormData[field as keyof formDataStaff].valid = isValid;
    newFormData[field as keyof formDataStaff].showError = !isValid;
    newFormData[field as keyof formDataStaff].message = message;

    if (!isValid) hasError = true;
  });

  if (type !== "customercare" && scope_required.includes(Number(formData.role.value))) {
    const isScopeValid = formData.scope.value.length > 0;
    newFormData.scope = {
      value: formData.scope.value,
      name: formData.scope.name,
      valid: isScopeValid,
      showError: !isScopeValid,
      message: isScopeValid ? "" : "This field is required",
    };
    if (!isScopeValid) hasError = true;
  }

  const isValidPassword = strongPasswordRegex.test(obj.password);
  if (!isValidPassword) {
    newFormData.password = {
      value: formData.password.value,
      name: formData.password.name,
      valid: false,
      showError: true,
      message: "Not a strong password",
    };
    hasError = true;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailRegex.test(obj.email);
  if (!isValidEmail) {
    newFormData.email = {
      value: formData.email.value,
      name: formData.email.name,
      valid: false,
      showError: true,
      message: "Invalid Email",
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

  setFormdata(newFormData);

  if (hasError) {
    dispatch(setLoading(false));
    return;
  }

    const forms = new FormData();
    const keyArray: Array<keyof staffFormType> = Object.keys(obj) as Array<
      keyof staffFormType
    >;

    keyArray.forEach((el: keyof staffFormType) => {
      if (el === "multiState" && obj.multiState) {
        // Split the multiState and append each one
        const states = obj.multiState.split("#"); // ["AndhraPradesh", "Telangana"]
        states.forEach((state) => {
          forms.append("multiState[]", state);
        });

      } else if (el === "multiDist" && obj.multiDist) {
        // Split the multiDist and append each one
        const districts = obj.multiDist.split("#"); // ["Visakhapatnam", "Guntur"]
        districts.forEach((district) => {
          forms.append("multiDist[]", district);
        });

      } else if (el === "multiCity" && obj.multiCity) {
        // Split the multiCity and append each one
        const cities = obj.multiCity.split("#"); // ["Vizag", "Secunderabad"]
        cities.forEach((city) => {
          forms.append("multiCity[]", city);
        });
        
      } else if (obj[el]) {
        forms.append(el, obj[el] as string | Blob);
      }
    });

    if (image) {
      forms.append("photo", image);
    }

  const path = type === "Staff" ? `user/${user.hospitalID}/createStaff` : `user/addCustomerCareUser`;
  const data = await authPost(path, forms, user.token);
  if (data.message === "success") {
    dispatch(setNewStaff(data.data));
    dispatch(setSuccess("Staff successfully Added"));
    setTimeout(() => {
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    }, 1000);
  } else {
    setFormdata((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        valid: false,
        showError: true,
        message: data.message,
      },
    }));
  }
  dispatch(setLoading(false));
};
  const debouncedHandleSubmit = debounce(handleFormSubmit, DEBOUNCE_DELAY);
  const roleListArray: Array<keyof Role_list_Type> = Object.keys(
    Role_list
  ) as unknown as Array<keyof Role_list_Type>;

  // const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChangeCheckMarks = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const isValid = value.length > 0;
    setFormdata((state) => {
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
    setObj((prev) => {
      return {
        ...prev,
        scope:
          typeof value === "string"
            ? value.split(",").join("#")
            : value.join("#"),
      };
    });
  };

  console.log("formData", formData);

  const handleChangeStatesCheckMarks = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const isValid = value.length > 0;
    setFormdata((state) => ({
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
    setObj((prev) => ({
      ...prev,
      multiState:
        typeof value === "string"
          ? value.split(",").join("#")
          : value.join("#"),
    }));
  };

  const handleChangeDistrictsCheckMarks = (
    event: SelectChangeEvent<string[]>
  ) => {
    const {
      target: { value },
    } = event;
    const isValid = value.length > 0;
    setFormdata((state) => ({
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
    setObj((prev) => ({
      ...prev,
      multiDist:
        typeof value === "string"
          ? value.split(",").join("#")
          : value.join("#"),
    }));
  };

  const handleChangeCitiesCheckMarks = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const isValid = value.length > 0;
    setFormdata((state) => ({
      ...state,
      multiCity: {
        valid: isValid,
        showError: !isValid,
        value: typeof value === "string" ? value.split(",") : value,
        message: isValid ? "" : "This field is required",
        name: "multiCity",
      },
    }));
    setObj((prev) => ({
      ...prev,
      multiCity:
        typeof value === "string"
          ? value.split(",").join("#")
          : value.join("#"),
    }));
  };
console.log("user============",user)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        debouncedHandleSubmit(e);
      }}
    >
      <DialogTitle>
        Add {type === "customercare" ? "Customer Care Executive" : type} Details
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: "2rem" }}>
          <Grid item xs={6}>
            <TextField
              id="outlined-required"
              label="First Name *"
              value={formData.firstName.value}
              name="firstName"
              fullWidth
              variant="outlined"
              onChange={handleChangeInput}
            />
            {formData.firstName.showError && (
              <div style={styles.errorText}>{formData.firstName.message}</div>
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="outlined-required"
              label="Last Name *"
              name="lastName"
              value={formData.lastName.value}
              onChange={handleChangeInput}
              fullWidth
            />
            {formData.lastName.showError && (
              <div style={styles.errorText}>{formData.lastName.message}</div>
            )}
          </Grid>

          {type === "customercare" ? (
            <>
              <Grid item xs={6}>
                <FormControl fullWidth>
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
                </FormControl>
                {formData.multiState.showError && (
                  <div style={styles.errorText}>{formData.multiState.message}</div>
                )}
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
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
                    disabled={formData.multiState.value.length === 0}
                  >
                    {DistList?.map((el) => (
                      <MenuItem key={el.district} value={el.district}>
                        <Checkbox
                          checked={formData.multiDist.value.includes(el.district)}
                        />
                        <ListItemText primary={el.district} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formData.multiDist.showError && (
                  <div style={styles.errorText}>{formData.multiDist.message}</div>
                )}
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
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
                    disabled={formData.multiDist.value.length === 0}
                  >
                    {cityList?.map((el) => (
                      <MenuItem key={el.city} value={el.city}>
                        <Checkbox
                          checked={formData.multiCity.value.includes(el.city)}
                        />
                        <ListItemText primary={el.city} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formData.multiCity.showError && (
                  <div style={styles.errorText}>{formData.multiCity.message}</div>
                )}
              </Grid>
            </>
          ) : (
            <>
              {/* =======State======= */}
              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  // sx={{ width: 0.48, mt: "1rem" }}
                >
                   <TextField
              id="outlined-required"
              label="State *"
              name="state"
              value={formData.state.value}
              onChange={handleChangeInput}
              fullWidth
            />
                  {/* <InputLabel id="demo-simple-select-helper-label">
                    State
                  </InputLabel> */}
                  {/* <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={String(formData.state.value)}
                    label="State *"
                    onChange={(event: SelectChangeEvent) => {
                      setFormdata((prev) => ({
                        ...prev,
                        city: { ...prev.city, valid: false, value: "", showError: false, message: "" },
                      }));
                      handleChange(event);
                    }}
                    name="state"
                  >
                    {states.map((el) => (
                      <MenuItem key={el.state} value={el.state}>{el.state}</MenuItem>
                    ))}
                  </Select> */}
                </FormControl>
                {formData.state.showError && (
                  <div style={styles.errorText}>{formData.state.message}</div>
                )}
              </Grid>

              {/* =======City======= */}
              <Grid item xs={6}>
                <TextField
              id="outlined-required"
              label="City *"
              name="city"
              value={formData.city.value}
              onChange={handleChangeInput}
              fullWidth
            />
                {/* <Autocomplete
                  freeSolo // Allow the user to input a value that's not in the options list
                  value={formData.city.value || null}
                  onChange={(_event: unknown, newValue: string | null) => {
                    setFormdata((pre) => ({
                      ...pre,
                      city: {
                        valid: newValue ? true : false,
                        value: newValue || "",
                        message: newValue ? "" : "This field is required",
                        showError: !newValue,
                        name: "city",
                      },
                    }));
                    setObj((prev) => ({ ...prev, city: newValue || "" }));
                  }}
                  inputValue={formData.city.value || undefined}
                  onInputChange={(_event, newInputValue) => {
                    setFormdata((pre) => ({
                      ...pre,
                      city: {
                        valid: newInputValue ? true : false,
                        value: newInputValue || "",
                        message: newInputValue ? "" : "This field is required",
                        showError: !newInputValue,
                        name: "city",
                      },
                    }));
                    setObj((prev) => ({ ...prev, city: newInputValue }));
                  }}
                  options={DistList?.length ? DistList.map((d) => d.district) : ["No Option"]}
                  renderInput={(params) => (
                    <TextField {...params} label="City *" />
                  )}
                /> */}
                {formData.city.showError && (
                  <div style={styles.errorText}>{formData.city.message}</div>
                )}
              </Grid>
            </>
          )}
          {/* =============================================== */}
          {type !== "customercare" && (
            <>
              <Grid item xs={6}>
                {/* <Stack direction="column" sx={{ width: 0.48, mt: "1rem" }}> */}
                <FormControl
                  fullWidth
                >
                  <InputLabel id="demo-simple-select-helper-label">
                    Role
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={String(formData.role.value)}
                    label="Role *"
                    onChange={handleChange}
                    name="role"
                  >
                    {roleListArray.map(
                      (el: keyof Role_list_Type) =>
                        el != Role_NAME.sAdmin &&
                        el != Role_NAME.admin  &&
                        el != Role_NAME.customerCare && (
                          <MenuItem value={el}>
                            {" "}
                            {Role_list[el].slice(0, 1).toUpperCase() +
                              Role_list[el].slice(1).toLowerCase()}{" "}
                          </MenuItem>
                        )
                    )}
                  </Select>
                </FormControl>
                {formData.role.showError && (
                  <div style={styles.errorText}>{formData.role.message}</div>
                )}
              </Grid>
              {/* scope */}
              {formData?.role?.value != Role_NAME.nurse && (
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    disabled={!scope_required.includes(Number(formData.role.value))}
                  >
                    <InputLabel id="scope-checkbox-label">
                      Scope {scope_required.includes(Number(formData.role.value)) ? "*" : ""}
                    </InputLabel>
                    <Select
                      labelId="scope-checkbox-label"
                      id="scope-checkbox"
                      multiple
                      value={formData.scope.value}
                      onChange={handleChangeCheckMarks}
                      input={<OutlinedInput label={`Scope ${scope_required.includes(Number(formData.role.value)) ? "*" : ""}`} />}
                      renderValue={(selected) =>
                        selected
                          .map((el) => {
                            const index = Object.values(SCOPE_LIST).indexOf(Number(el));
                            return capitalizeFirstLetter(Object.keys(SCOPE_LIST)[index] || "");
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
                              formData.scope.value.indexOf(
                                String(
                                  SCOPE_LIST[name as keyof SCOPE_LIST_Type]
                                )
                              ) > -1
                            }
                          />
                          <ListItemText primary={capitalizeFirstLetter(name)} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {formData.scope.showError && (
                    <div style={styles.errorText}>{formData.scope.message}</div>
                  )}
                </Grid>
              )}
              {formData?.role?.value == 2003 ? (
                // headnurse
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                  >
                    <InputLabel id="demo-simple-select-helper-label">
                      Head Nurses
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={String(formData.reportTo.value)}
                      label="Head Nurses"
                      onChange={handleChange}
                      name="reportTo"
                    >
                      {Array.isArray(headNurseList) &&
                      headNurseList.length === 0 ? (
                        <MenuItem
                          disabled
                          value=""
                          style={styles.disabledMenuItem}
                        >
                          No Head Nurses available
                        </MenuItem>
                      ) : (
                        headNurseList.map((el) => {
                          const departmentName = getDepartmentNameById(
                            el.departmentID
                          );
                          const scopeNames = getScopeNames(el.scope);
                          return (
                            <MenuItem key={el.userId} value={el.userId}>
                              {el.name.slice(0, 1).toUpperCase() +
                                el.name.slice(1).toLowerCase()}{" "}
                              ({departmentName}) ({scopeNames})
                            </MenuItem>
                          );
                        })
                      )}
                    </Select>
                  </FormControl>
                  {formData.reportTo.showError && (
                    <div style={styles.errorText}>{formData.reportTo.message}</div>
                  )}
                </Grid>
              ) : (
                // departmrnt
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                  >
                    <InputLabel id="demo-simple-select-helper-label">
                      Department
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={String(formData.departmentID.value)}
                      label="Department"
                      onChange={handleChange}
                      name="departmentID"
                    >
                      {departmentList.length == 0 ? (
                        <MenuItem
                          disabled
                          value=""
                          style={styles.disabledMenuItem}
                        >
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
                  </FormControl>
                  {formData.departmentID.showError && (
                    <div style={styles.errorText}>{formData.departmentID.message}</div>
                  )}
                </Grid>
              )}
            </>
          )}

          {/* Phone Number */}
          <Grid item xs={6}>
            <TextField
              id="outlined-required"
              label="Phone Number *"
              name="phoneNo"
              value={formData.phoneNo.value || ""}
              onChange={handleChangeInput}
              fullWidth
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 10,
                minLength: 10,
              }}
            />
            {formData.phoneNo.showError && (
              <div style={styles.errorText}>{formData.phoneNo.message}</div>
            )}
          </Grid>

          <Grid item xs={6}>
            <FormControl
              fullWidth
            >
              <InputLabel id="demo-simple-select-helper-label--gender">
                Gender *
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={String(formData.gender.value)}
                label="Gender *"
                onChange={handleChange}
                name="gender"
              >
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={2}>Female</MenuItem>
              </Select>
            </FormControl>
            {formData.gender.showError && (
              <div style={styles.errorText}>{formData.gender.message}</div>
            )}
          </Grid>
          <Grid item xs={6}>
            {/* </Stack> */}

            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              label="DOB *"
              id="outlined-required"
              type="date"
              name="dob"
              value={formData.dob.value}
              onChange={handleChangeInput}
              fullWidth
              inputProps={{
                max: new Date().toISOString().split("T")[0],
              }}
              // sx={{ width: 0.48, mt: "1rem" }}
            />
            {formData.dob.showError && (
              <div style={styles.errorText}>{formData.dob.message}</div>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="outlined-multiline-static"
              label="Home Address"
              name="address"
              value={formData.address.value}
              onChange={handleChangeInput}
              multiline
              rows={4}
              fullWidth
            />
            {formData.address.showError && (
              <div style={styles.errorText}>{formData.address.message}</div>
            )}
          </Grid>

          <Grid item xs={12}>
            {/* </Stack> */}
            <TextField
              // required
              id="outlined-required"
              label={type === "customercare" ? "Pincode" :"Pincode *"}
              name="pinCode"
              value={formData.pinCode.value || ""}
              onChange={handleChangeInput}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 6,
                minLength: 6,
              }}
              fullWidth
            />
            {formData.pinCode.showError && (
              <div style={styles.errorText}>{formData.pinCode.message}</div>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              label="Email ID *"
              name="email"
              value={formData.email.value}
              onChange={handleChangeInput}
              type="email"
              fullWidth
            />
            {formData.email.showError && (
              <div style={styles.errorText}>{formData.email.message}</div>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="outlined-password"
              label="Set Password *"
              name="password"
              value={formData.password.value}
              onChange={handleChangeInput}
              type="password"
              fullWidth
            />
            {formData.password.showError && (
              <div style={styles.errorText}>{formData.password.message}</div>
            )}
          </Grid>
          <Grid item xs={12}>
            <ImageField image={image} setImage={setImage} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </DialogActions>
    </form>
  );
}



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { StateType, DistrictType, CityType } from './types';

// const AdministrativeData: React.FC = () => {
//   const [states, setStates] = useState<StateType[]>([]);
//   const [districts, setDistricts] = useState<DistrictType[]>([]);
//   const [cities, setCities] = useState<CityType[]>([]);

//   useEffect(() => {
//     const fetchAdministrativeData = async () => {
//       try {
//         const response = await axios.get('/api/administrativeRegions'); // Adjust endpoint path if needed
//         const { states, districts, cities } = response.data;
//         setStates(states);
//         setDistricts(districts);
//         setCities(cities);
//       } catch (error) {
//         console.error('Failed to fetch administrative data:', error);
//       }
//     };

//     fetchAdministrativeData();
//   }, []);

  
// };

// export default AdministrativeData;