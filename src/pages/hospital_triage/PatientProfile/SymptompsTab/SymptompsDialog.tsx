import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./../../../hospital_admin/addDepartment/addDepartment.module.scss";
import { useSelector } from "react-redux";
import {
  // selectCurrPatient,
  selectTimeline,
} from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authPost } from "../../../../axios/useAuthPost";
// import Box from "@mui/material/Box";
import { symptompstype } from "../../../../types";
import { authFetch } from "../../../../axios/useAuthFetch";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
// import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { durationParameterObj } from "../../../../utility/role";
import { capitalizeFirstLetter } from "../../../../utility/global";
import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';
type addStaffProps = {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedList: React.Dispatch<React.SetStateAction<symptompstype[]>>;
  selectedList?: symptompstype[];
};

export default function AddSymptomsDialog({
  // open,
  setOpen,
  setSelectedList,
}: // selectedList,
addStaffProps) {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const [text, setText] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [durationParameter, setDurationParameter] = React.useState("days");
  // const [searchList, setSearchList] = React.useState<string[]>([]);
  type selectedListType = {
    name: string;
    duration: string;
    durationParameter: string;
  };
  const [newSelectedList, setNewSelectedList] = React.useState<
    selectedListType[]
  >([]);
  const [sympptompList, setSympptompList] = React.useState<string[]>([]);
  const getSymptomData = async () => {
    const response = await authFetch(`data/symptoms`, user.token);
    if (response.message == "success") {
      setSympptompList(response.symptoms);
    }
    // console.log("response symptomps data", response);
  };
  React.useEffect(() => {
    getSymptomData();
  }, [user]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    const symptomps = newSelectedList.map((symptom) => {
      return {
        symptom: symptom.name,
        duration: symptom.duration,
        durationParameter: symptom.durationParameter,
      };
    });
    const body = {
      timeLineID: timeline.id,
      userID: timeline.userID,
      symptoms: symptomps,
      patientID:timeline.patientID
    };
    const response = await authPost(`symptom`, body, user.token);
    // console.log("symptomp response", response);
    if (response.message == "success") {
      setSelectedList((prevList) => {
        return [...prevList, ...response.symptoms];
      });
    }
    handleClose();
    // if (response.message == "success") {
    // }
    // const response=
  };
  const debouncedHandleSave = debounce(handleSave, DEBOUNCE_DELAY);
  return (
    <div>
      <DialogTitle>Add Symptom</DialogTitle>
      <DialogContent>
        <div className={styles.department_dialog}>
          <Grid
            container
            xs={12}
            style={{ marginTop: "1rem" }}
            alignItems={"center"}
            spacing={2}
          >
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
                options={sympptompList}
                renderInput={(params) => (
                  <TextField {...params} label="Symptom" required />
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
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>{
                  const regex = /^\d*$/;
                  // Check if input length is within 20 characters and matches the regex
                  if ((regex.test(event.target.value) || event.target.value === '') && event.target.value.length <= 2) {
                    setDuration(event.target.value)

                  }
                }
                }
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
              <Button
                variant="contained"
                onClick={() => {
                  if (
                    text &&
                    duration &&
                    !newSelectedList.find((list) => list.name == text)
                  ) {
                    setNewSelectedList((prev) => [
                      { duration, name: text, durationParameter },
                      ...prev,
                    ]);
                  }
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
            {newSelectedList.map((el) => {
              return (
                <Chip
                  label={
                    el.name + ": " + el.duration + " " + el.durationParameter
                  }
                  onDelete={() => {
                    setNewSelectedList((curr) => {
                      return curr.filter((val) => val != el);
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
        <Button onClick={debouncedHandleSave} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </div>
  );
}
