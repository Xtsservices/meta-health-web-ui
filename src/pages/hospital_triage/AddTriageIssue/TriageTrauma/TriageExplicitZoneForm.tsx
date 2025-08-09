import { useCallback, useContext, useState } from "react";
import styles from "./TriageExplicitZoneForm.module.scss";
import TriageFormContext from "../contexts/TriageFormContext";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { zoneType } from "../../../../utility/role";
import { useNavigate } from "react-router-dom";
import { wardType } from "../../../../types";
import React from "react";
import { authFetch } from "../../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { capitalizeFirstLetter } from "../../../../utility/global";

const PillColors = {
  [zoneType.red]: {
    color: "#a30a0a",
    backgroundColor: "#ffd9d9",
  },
  [zoneType.yellow]: {
    color: "#997b00 ",
    backgroundColor: "#fff3c4",
  },
  [zoneType.green]: {
    color: "#006605 ",
    backgroundColor: "#c1ffc4",
  },
};

const getZoneNameByNumber = (number: number) => {
  for (const [key, value] of Object.entries(zoneType)) {
    if (value === number) {
      return key;
    }
  }
  return "Unknown Zone";
};


const TriageExplicitZoneForm = () => {
  const { formData, setFormData } = useContext(TriageFormContext);
  const [zoneError, setZoneError] = useState(false);
  const [wardError, setWardError] = useState(false);
  const [wards, setWards] = React.useState<wardType[]>([]);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const back = () => navigate(-1);


  React.useEffect(() => {
    const getWardData = async () => {
      const wardResonse = await authFetch(
        `ward/${user.hospitalID}`,
        user.token
      );
      console.log("wardResonse", wardResonse)
      if (wardResonse.message == "success") {
        setWards(wardResonse.wards);
      }
    };
    if (user?.token) {
      getWardData();
    }
  }, [user.hospitalID, user.token]);

  const handleZoneChange = useCallback(
    (e: SelectChangeEvent) => {
      const value = Number(e.target.value);
      setFormData((prev) => ({ ...prev, zone: value }));
      setZoneError(false);
    },
    [setFormData]
  );


  // const handleWardChange = useCallback((e: SelectChangeEvent) => {
  //     const value = e.target.value;
  //     const data = wards.filter((each)=> each.name === value)
  //     const wardid = data
  //     console.log("wardid",wardid)
  //     console.log("wardid",wards)
  //     setFormData((prev) => ({ ...prev, ward: value ,wardID: wardid}));
  //     setWardError(false);
  //   },
  //   [setFormData]
  // );



  const handleSubmit = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!formData.ward) setWardError(true);
      if (!formData.zone) setZoneError(true);
      if (!formData.ward || !formData.zone) return;

      console.log("formata==",formData)
      
      navigate("./../zone");
    },
    [formData, setWardError, setZoneError, navigate]
  );
  console.log("formData1", formData)
  return (
    <div className={styles.container}>
      <form className={styles.container_grids}>
        {formData.zone && (
          <div
            className={styles.suggestion_pill}
            style={PillColors[formData.zone]}
          >
            System Suggests {capitalizeFirstLetter(getZoneNameByNumber(formData.zone))} Zone. Kindly Change the Selection if Needed.
          </div>
        )}
        <div className={styles.grid}>
          <div className={styles.gridItem}>
            <FormControl fullWidth required>
              <InputLabel>Zone</InputLabel>
              <Select
                label="Zone"
                value={String(formData.zone)}
                onChange={handleZoneChange}
                name="zone"
                error={zoneError}
              >
                <MenuItem value={zoneType.red}>Red</MenuItem>
                <MenuItem value={zoneType.yellow}>Yellow</MenuItem>
                <MenuItem value={zoneType.green}>Green</MenuItem>
              </Select>
              {zoneError && (
                <FormHelperText error>This field is required.</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className={styles.gridItem}>
            <FormControl fullWidth required>
              <InputLabel>Ward</InputLabel>
              <Select
               label="Ward"
                labelId="ward-select-label"
                value={formData.ward}
                onChange={(e)=>{
                  const value = e.target.value;
                  const ward = wards.find((each) => each.name === value);
              
                  if (ward) {
                    const wardid = ward.id;
                    console.log("Selected ward ID:", wardid);
                    console.log("All wards:", wards);
              
                    setFormData((prev) => ({
                      ...prev,
                      ward: value,
                      wardID: wardid,
                    }));
                    setWardError(false);
                  } else {
                    // Handle the case where the ward is not found
                    console.error("Ward not found:", value);
                    setFormData((prev) => ({
                      ...prev,
                      ward: value,
                      wardID: undefined, // or some appropriate default value
                    }));
                    setWardError(true);
                  }
                }}
                name="ward"
                displayEmpty
              >
                {wards.map((el) => (
                  <MenuItem key={el.id} value={el.id.toString()}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
              {wardError && (
                <FormHelperText error>This field is required.</FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
      </form>
      <div className={styles.container_bottom}>
        <button onClick={back}>Back</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default TriageExplicitZoneForm;
