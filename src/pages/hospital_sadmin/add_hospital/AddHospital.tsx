import React, { useState,ChangeEvent, useRef } from "react";
import styles from "./../../dashboard_super_admin/dashboard.module.scss";
import super_admin_styles from "./../../../component/sidebar/super_admin_styles.module.scss";
import admin_styles from "./../../../component/sidebar/admin_styles.module.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import { Select, SelectChangeEvent } from "@mui/material";
import { state, city,District } from "../../../utility/state";
import Lottie from "lottie-react";
import hospital from "./hospitalGif.json";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../../../store/error/error.action";
import { useSeachStore } from "../../../store/zustandstore";
import search_icon from "./../../../assets/sidebar/search_icon.png";
import PopperMenu from "../../../component/Popper";


const countryOptions: { value: string; label: string }[] = [
  { value: "SelectCountry", label: "Select Country" },
  { value: "India", label: "India" },
];

interface HospitalInfo {
  name: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  parent: {
    valid: boolean;
    value: string | null;
    showError: boolean;
    message: string;
  };
  email: {
    valid: boolean;
    value: string | null;
    showError: boolean;
    message: string;
  };
  address: {
    valid: boolean;
    value: string | null;
    showError: boolean;
    message: string;
  };
  website: {
    valid: boolean;
    value: string | null;
    showError: boolean;
    message: string;
  };
  city: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  district: {
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
  country: {
    valid: boolean;
    value: string | null;
    showError: boolean;
    message: string;
  };
  pinCode: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  phoneNo: {
    valid: boolean;
    value: number | null;
    showError: boolean;
    message: string;
  };
}

function AddHospital() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cityList, setCityList] = React.useState<string[]>([]);
  const [districtList, setDistrictList] = React.useState<string[]>([]);
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo>({
    parent: { valid: true, value: null, showError: false, message: "" },
    name: { valid: true, value: "", showError: false, message: "" },
    email: { valid: true, value: null, showError: false, message: "" },
    phoneNo: { valid: true, value: null, showError: false, message: "" },
    pinCode: { valid: true, value: "", showError: false, message: "" },
    district:{ valid: true, value: "", showError: false, message: "" },
    city: { valid: true, value: "", showError: false, message: "" },
    state: { valid: true, value: "", showError: false, message: "" },
    country: { valid: true, value: "", showError: false, message: "" },
    address: { valid: false, value: "", showError: false, message: "" },
    website: { valid: true, value: null, showError: false, message: "" },
  });

  const [openMenu, setOpenMenu] = useState(false);
     const anchorRef = useRef<HTMLDivElement>(null);
       const {  setSearchText } = useSeachStore();
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const isWebsiteValid = /^(ftp|http|https):\/\/[^ "]+$/.test(value);
    if (!(name in hospitalInfo)) {
      return;
    }
    setHospitalInfo((prevInfo) => ({
      ...prevInfo,
      [name]: {
        ...prevInfo[name as keyof HospitalInfo],
        value: name === "name" ? value.toString() : value,
        valid:
          name === "website"
            ? isWebsiteValid
            : prevInfo[name as keyof HospitalInfo]?.valid,
      },
    }));
  };

  const handleStateChange = (event: SelectChangeEvent) => {
    const selectedState = event.target.value as string;
    const stateIndex = state.indexOf(selectedState);
    if (stateIndex !== -1) {
      setCityList(city[stateIndex]);
      setDistrictList(District[stateIndex])
    }
    setHospitalInfo((prevInfo) => ({
      ...prevInfo,
      state: {
        ...prevInfo.state,
        value: selectedState,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requestData = {
      name: hospitalInfo.name.value,
      parent: hospitalInfo.parent.value,
      phoneNo: hospitalInfo.phoneNo.value,
      address: hospitalInfo.address.value,
      city: hospitalInfo.city.value,
      district: hospitalInfo.district.value,
      email: hospitalInfo.email.value,
      website: hospitalInfo.website.value,
      state: hospitalInfo.state.value,
      pinCode: hospitalInfo.pinCode.value,
      country: hospitalInfo.country.value,
    };
    if (
      hospitalInfo.website.value !== null &&
      hospitalInfo.website.value !== ""
    ) {
      requestData.website = hospitalInfo.website.value;
    }
    if (hospitalInfo.email.value !== null && hospitalInfo.email.value !== "") {
      requestData.email = hospitalInfo.email.value;
    }

    if (
      hospitalInfo.parent.value !== null &&
      hospitalInfo.parent.value !== ""
    ) {
      requestData.parent = hospitalInfo.parent.value;
    }
    try {
      const response = await authPost("/hospital", requestData, user.token);

      if (
        response &&
        (response.data?.message === "success" || response.message === "success")
      ) {
        dispatch(setSuccess("Hospital successfully added"));
        navigate("/sadmin/add-hospital/form");
      } else {
        console.error("Error: Invalid response format.");
        dispatch(setError("Error adding hospital. Please try again later."));
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      dispatch(setError("Error adding hospital. Please try again later."));
    }
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);

  React.useEffect(() => {
    const stateName = state.indexOf(hospitalInfo.state.value || "Jharkhand");
    setCityList(city[stateName]);
  }, [hospitalInfo.state]);

  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };

  return (
    <>

        <div className={admin_styles.main_header}>
                    <div className={admin_styles.main_header_top}>
                      <div className={admin_styles.main_header_top_search}>
                        <img src={search_icon} alt="" className="" />
                        <input
                          type="text"
                          className="input_search"
                          placeholder="Search"
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setSearchText(event.target.value);
                          }}
                        />
                      </div>
            
                      <div
                        className={admin_styles.header_profile}
                        // onClick={() => navigate("/inpatient/admin/profile")}
                        ref={anchorRef}
                        onClick={handleToggle}
                      >
                        {user.imageURL ? (
                          <img src={user.imageURL} alt="" className="" />
                        ) : (
                          <AccountCircleIcon fontSize="large" />
                        )}
                        {/* <img src={profile_pic} alt="" className="" /> */}
                      </div>
                      <PopperMenu
                        setOpen={setOpenMenu}
                        open={openMenu}
                        url={"/sadmin/profile"}
                        anchorRef={anchorRef}
                        color={"#c0e4ff"}
                      />
                    </div>
                  </div>
      <div className={super_admin_styles.main_header}>
        
        <div className={super_admin_styles.main_header_bottom}>
          <div className={super_admin_styles.welcome}>
            <h1 className={super_admin_styles.header_heading}>Add Hospital</h1>
            {/* <p>Your dashboard</p> */}
          </div>
        </div>
      </div>
      <div className={super_admin_styles.main_info_right}>
        <div className={styles.container}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              debouncedHandleSubmit(e);
            }}
            className={styles.add_hospital}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Hospital Name"
                  variant="outlined"
                  name="name"
                  value={hospitalInfo.name.value}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Hospital Group"
                  variant="outlined"
                  name="parent"
                  value={hospitalInfo.parent.value}
                  onChange={handleInputChange}
                  fullWidth
                  // required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Address"
                  variant="outlined"
                  name="address"
                  required
                  value={hospitalInfo.address.value}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Country</InputLabel>
                  <Select
                    label="country"
                    required
                    onChange={(event) => {
                      setHospitalInfo((prevInfo) => ({
                        ...prevInfo,
                        country: {
                          ...prevInfo.country,
                          value: event.target.value as string,
                        },
                      }));
                    }}
                    name="country"
                    value={hospitalInfo.country.value || ""}
                  >
                    {countryOptions.map((country) => (
                      <MenuItem key={country.value} value={country.value}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>State</InputLabel>
                  <Select
                    label="State"
                    required
                    onChange={handleStateChange}
                    name="state"
                    value={hospitalInfo.state.value || ""}
                  >
                    {state.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>District</InputLabel>
                  <Select
                    label="district"
                    required
                    onChange={(event) => {
                      const selectedDistrict = event.target.value as string;
                      setHospitalInfo((prevInfo) => ({
                        ...prevInfo,
                        district: {
                          ...prevInfo.district,
                          value: selectedDistrict,
                        },
                      }));
                    }}
                    name="district"
                    value={hospitalInfo.district.value || ""}
                  >
                    {districtList.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>City</InputLabel>
                  <Select
                    label="City"
                    required
                    onChange={(event) => {
                      const selectedCity = event.target.value as string;
                      setHospitalInfo((prevInfo) => ({
                        ...prevInfo,
                        city: {
                          ...prevInfo.city,
                          value: selectedCity,
                        },
                      }));
                    }}
                    name="city"
                    value={hospitalInfo.city.value || ""}
                  >
                    {cityList.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Pincode"
                  required
                  variant="outlined"
                  name="pinCode"
                  value={hospitalInfo.pinCode.value}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  name="phoneNo"
                  required
                  value={hospitalInfo.phoneNo.value}
                  onChange={handleInputChange}
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 10,
                    minLength: 10,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Email"
                  variant="outlined"
                  type="email"
                  name="email"
                  value={hospitalInfo.email.value}
                  onChange={handleInputChange}
                  fullWidth
                  // required
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Website"
                  variant="outlined"
                  name="website"
                  value={hospitalInfo.website.value}
                  error={
                    !hospitalInfo.website.valid &&
                    hospitalInfo.website.value !== ""
                  }
                  helperText={
                    !hospitalInfo.website.valid &&
                    hospitalInfo.website.value !== ""
                      ? "Please enter a valid website URL"
                      : ""
                  }
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  // onClick={handleNext}
                  color="primary"
                  style={{
                    marginLeft: "80%",
                  }}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
          <div
            style={{ width: "130%", marginLeft: "38rem", marginTop: "20rem" }}
          >
            <Lottie animationData={hospital} />
          </div>
        </div>
      </div>
    </>
  );
}

export default AddHospital;
