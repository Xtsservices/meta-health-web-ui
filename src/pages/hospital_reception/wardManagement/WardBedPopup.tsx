import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./WardBedpopup.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { getCities, getStates } from "../../../utility/LocationData";

type ClockPopupProps = {
  open: boolean;
  onClose: () => void;
};

const WardBedPopup: React.FC<ClockPopupProps> = ({ open, onClose }) => {
  const [roomNumber] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [guradianName] = useState<string>("");
  const [patientDOB] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [relation, setRelation] = useState("");
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [gender, setGender] = useState<number>();
  const [countries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [mobileNumber, setMobileNumber] = useState<string>("");

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent className={styles.dialogContent}>
        <TextField
          label="Room Number"
          value={roomNumber}
          //   InputProps={{ readOnly: true }}
          className={styles.textField}
        />
        <TextField
          label="Patient Name*"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          className={styles.textField}
        />
        <TextField
          label="Patient DOB*"
          value={patientDOB}
          onChange={(e) => setPatientName(e.target.value)}
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
          label="Guardian Name*"
          value={guradianName}
          onChange={(e) => setPatientName(e.target.value)}
          className={styles.textField}
        />

        <TextField
          label="Mobile Number*"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className={styles.textField}
        />

        <FormControl className={styles.formControl}>
          <InputLabel>Relation</InputLabel>
          <Select
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
          >
            <MenuItem value="father">Father</MenuItem>
            <MenuItem value="mother">Mother</MenuItem>
            <MenuItem value="familyMember">Family Member</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <div className={styles.dialogActions__divs}>
          <DeleteIcon className={styles.deleteIcon} />
          <Button onClick={onClose}>Delete</Button>
        </div>
        <div className={styles.dialogActions__divs}>
          <Button>Clear All</Button>
          <Button color="primary" variant="contained">
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default WardBedPopup;
