import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./IPD_Registration.module.scss";
import {
  getCities,
  getCountries,
  getStates,
} from "../../../utility/LocationData";

const IPDRegistration: React.FC = () => {
  const [patientId, setPatientId] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [doctor, setDoctor] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [referralName, setReferralName] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [age, setAge] = useState<number | string>("");
  const [gender, setGender] = useState<number>();

  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const randomId = Math.floor(10000000 + Math.random() * 90000000).toString();
    setPatientId(randomId);

    // Fetch countries data when component mounts
    setCountries(getCountries());
  }, []);

  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
    setState(""); // Reset state and city when country changes
    setCity("");
    setStates(getStates(selectedCountry));
  };

  const handleStateChange = (event: SelectChangeEvent<string>) => {
    const selectedState = event.target.value;
    setState(selectedState);
    setCity(""); // Reset city when state changes
    setCities(getCities(selectedState));
  };

  const handleCityChange = (event: SelectChangeEvent<string>) => {
    setCity(event.target.value);
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

    setGender(genderValue);
  };

  const genderList = [
    { value: "Male", key: 1 },
    { value: "Female", key: 2 },
    { value: "Others", key: 3 },
  ];

  return (
    <div className={styles.container}>
      <TextField
        label="Patient ID"
        value={patientId}
        InputProps={{ readOnly: true }}
        className={styles.textField}
      />
      <FormControl className={styles.formControl}>
        <InputLabel>Department</InputLabel>
        <Select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <MenuItem value="Orthopaedic">Orthopaedic</MenuItem>
          <MenuItem value="Gynaecology">Gynaecology</MenuItem>
        </Select>
      </FormControl>

      <FormControl className={styles.formControl}>
        <InputLabel>Doctors</InputLabel>
        <Select value={doctor} onChange={(e) => setDoctor(e.target.value)}>
          <MenuItem value="Dr. Kumar">Dr. Kumar</MenuItem>
          <MenuItem value="Dr. Manoj">Dr. Manoj</MenuItem>
          <MenuItem value="Dr. Hari">Dr. Hari</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Patient Name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        className={styles.textField}
      />

      <TextField
        label="Referral Name"
        value={referralName}
        onChange={(e) => setReferralName(e.target.value)}
        className={styles.textField}
      />

      <TextField
        label="Mobile Number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        className={styles.textField}
      />

      <Stack direction="row" spacing={2} className={styles.formControl}>
        <FormControl className={styles.formControl}>
          <InputLabel>Country</InputLabel>
          <Select value={country} onChange={handleCountryChange}>
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={styles.formControl} disabled={!country}>
          <InputLabel>State</InputLabel>
          <Select value={state} onChange={handleStateChange}>
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={styles.formControl} disabled={!state}>
          <InputLabel>City</InputLabel>
          <Select value={city} onChange={handleCityChange}>
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <TextField
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={styles.textField}
      />

      <TextField
        label="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className={styles.textField}
      />

      <Stack direction="row" spacing={1} alignItems="center" columnGap={2}>
        Gender*
        {genderList.map((el) => (
          <Chip
            key={el.key}
            label={el.value}
            onClick={() => handleClick(el.value)}
            color={gender === el.key ? "primary" : "default"}
            sx={{ boxSizing: "border-box", padding: "10px 20px" }}
          />
        ))}
      </Stack>

      <div className={styles.submitButton__container}>
        <Button
          variant="contained"
          color="primary"
          className={styles.submitButton}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default IPDRegistration;
