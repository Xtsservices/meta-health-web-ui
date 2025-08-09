import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { durationParameterObj } from "../../../../../utility/role";
import { capitalizeFirstLetter } from "../../../../../utility/global";
import { symptompsElement, symptompstype } from "../../../../../types";

type addStaffProps = {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedList: React.Dispatch<React.SetStateAction<symptompstype[]>>;
  selectedList?: symptompstype[];
};

export default function AddSymptomsDialog({
  // open,
  setOpen,
}: // selectedList,
addStaffProps) {
  const [text, setText] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [durationErrorMsg] = React.useState(false);
  const [textErrorMsg] = React.useState(false);
  const [durationParameter, setDurationParameter] = React.useState("days");
  const fetchSymptomsListRef = React.useRef(true);

  // const [searchList, setSearchList] = React.useState<string[]>([]);
  type selectedListType = {
    name: string;
    duration: string;
    durationParameter: string;
    conceptId: string;
  };
  const [newSelectedList, setNewSelectedList] = React.useState<
    selectedListType[]
  >([]);

  const [symptomList] = React.useState<symptompsElement[]>([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    console.log();
  };

  const handleInputChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newInputValue: string
  ) => {
    console.log("ch2", newInputValue);

    const nameregex = /^[A-Za-z\s]*$/;
    if (nameregex.test(newInputValue)) {
      setText(newInputValue);
      fetchSymptomsListRef.current = true;
    }
  };

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    console.log("ch", newValue);
    // const nameregex = /^[A-Za-z\s]*$/;
    if (typeof newValue === "string") {
      setText(newValue);
      fetchSymptomsListRef.current = true;
    } else {
      setText("");
    }
  };

  return (
    <div>
      <DialogTitle>Add Symptom</DialogTitle>
      <DialogContent>
        <div>
          <Grid
            container
            xs={12}
            style={{ marginTop: "1rem" }}
            alignItems={"center"}
            spacing={2}
          >
            <Grid item xs={4}>
              <Autocomplete
                freeSolo
                value={text}
                onChange={handleChange}
                inputValue={text}
                onInputChange={handleInputChange}
                options={
                  text.length > 0
                    ? symptomList.map((symptom) => symptom.term)
                    : []
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Symptom"
                    placeholder="Enter 3 letters"
                    required
                    inputProps={{
                      ...params.inputProps,
                      inputMode: "text",
                      pattern: "^[A-Za-z\\s]*$",
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                id="outlined-required"
                label="Duration"
                //   defaultValue="Hello World"
                value={duration}
                // error={true}
                name="test"
                fullWidth
                variant="outlined"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const regex = /^\d*$/;
                  // Check if input length is within 20 characters and matches the regex
                  if (
                    (regex.test(event.target.value) ||
                      event.target.value === "") &&
                    event.target.value.length <= 2
                  ) {
                    setDuration(event.target.value);
                  }
                }}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 10,
                  minLength: 10,
                }}
              />
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
              <Button variant="contained" endIcon={<AddIcon />}>
                Add
              </Button>
            </Grid>
            {textErrorMsg && (
              <p style={{ color: "red", textAlign: "center", width: "100vw" }}>
                Please select Symptom
              </p>
            )}
            {durationErrorMsg && (
              <p style={{ color: "red", textAlign: "center", width: "100vw" }}>
                Please select duration
              </p>
            )}
          </Grid>
          <Stack
            direction="row"
            spacing={1}
            rowGap={2}
            sx={{ mt: "10px" }}
            flexWrap={"wrap"}
          >
            {newSelectedList.map((el) => {
              return (
                <Chip
                  label={
                    el.name + ": " + el.duration + " " + el.durationParameter
                  }
                  onDelete={() => {
                    setNewSelectedList((curr) => {
                      return curr.filter((val) => val !== el);
                    });
                  }}
                />
              );
            })}
          </Stack>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </div>
  );
}
