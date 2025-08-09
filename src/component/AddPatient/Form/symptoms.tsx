import React from "react";
import styles from "./symptomp.module.scss";
import { useSelector } from "react-redux";
// import { selectCurrentUser } from "../../../../store/user/user.selector";
// import { authFetch } from "../../../../axios/useAuthFetch";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { selectCurrentUser } from "../../../store/user/user.selector";
// import { authFetch } from "../../../axios/useAuthFetch";
import {patientbasicDetailType, selectedListType, symptompsElement } from "../../../types";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { durationParameterObj } from "../../../utility/role";
import { capitalizeFirstLetter } from "../../../utility/global";
import { authPost } from "../../../axios/useAuthPost";

// import { selectedListType } from "../../../../types";
type symptompspropType = {
  setSelectedList: React.Dispatch<React.SetStateAction<selectedListType[]>>;
  selectedList: selectedListType[];
  formData: patientbasicDetailType;

};
function Symptomps({ setSelectedList, selectedList}: symptompspropType) {
  const [text, setText] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [showChips, setShowChips] = React.useState(false);
  const [durationParameter, setDurationParameter] = React.useState("days");
  const user = useSelector(selectCurrentUser);

  const [symptomList, setSymptomsList] = React.useState<symptompsElement[]>([]);
  const durationList = Array.from({ length: 31 }, (_, index) => ({
    label: `${index + 1}`,
    value: `${index + 1}`,
  }));

  const fetchSymptomsList = async (text: string) => {
    if (text.length == 3) {
      const response = await authPost("data/symptoms", { text }, user.token);

      if (response.message === "success") {
        setSymptomsList(response.symptoms);
      }
    }
  };

  React.useEffect(() => {
    if (!selectedList.length) {
      setShowChips(false);
    }
  }, [selectedList]);

  React.useEffect(() => {
    if (!showChips && selectedList.length >= 1 && text && duration) {
     
      setSelectedList([{ name: text, duration: duration, durationParameter }]);
    }
  }, [text, duration, durationParameter]);

  React.useEffect(() => {
    if (selectedList.length) {
      setShowChips(true);
    }
  }, []);

  const handleDurationChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setDuration(event.target.value as string);
  };

  React.useEffect(() => {
    if (text.length == 3) fetchSymptomsList(text);
  }, [user, text]);

  return (
    <div className={styles.department_dialog}>
      <Grid container xs={12} alignItems={"center"} spacing={2}>
        <Grid item xs={4}>
          <Autocomplete
            freeSolo // Allow the user to input a value that's not in the options list
            value={text}
            onChange={(_, newValue: string | null) => {
              setText(newValue || "");
            }}
            inputValue={text || undefined}
            onInputChange={(_, newInputValue) => {
              setText(newInputValue || "");
            }}
            options={symptomList.map((symptom) => symptom.term)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter 3 letters"
                label="Symptom"
                required
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            required
            id="outlined-required"
            label="Duration"
            select
            fullWidth
            variant="outlined"
            value={duration}
            onChange={handleDurationChange}
          >
            {durationList.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-helper-label">
              Duration Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={durationParameter}
              label="Department"
              onChange={(event: SelectChangeEvent) =>
                setDurationParameter(event.target.value)
              }
              name="departmentID"
            >
              {Object.keys(durationParameterObj).map((el, index) => (
                <MenuItem key={index} value={el}>
                  {capitalizeFirstLetter(el)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={2} item>
          <Button
            variant="contained"
            onClick={() => {
              if (
                text &&
                duration &&
                !selectedList.find((list) => list.name == text) &&
                selectedList.length >= 1
              ) {
                setSelectedList((prev) => [
                  { duration, name: text, durationParameter },
                  ...prev,
                ]);
              }
              setShowChips(true);
              setText("");
              setDuration("");
            }}
            endIcon={<AddIcon />}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <Stack
        direction="row"
        spacing={1}
        rowGap={2}
        sx={{ mt: "10px" }}
        flexWrap={"wrap"}
      >
        {showChips
          ? selectedList.map((el) => {
              return (
                <Chip
                  label={
                    el.name + ": " + el.duration + " " + el.durationParameter
                  }
                  onDelete={() => {
                    setSelectedList((curr) => {
                      return curr.filter((val) => val != el);
                    });
                  }}
                />
              );
            })
          : ""}
      </Stack>
    </div>
  );
}

export default Symptomps;
