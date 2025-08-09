import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./SymptomDialog.module.scss";
import { useSelector } from "react-redux";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authPost } from "../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';
import { symptompsElement, symptompstype } from "../../../../types";
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
import { durationParameterObj } from "../../../../utility/role";
import { capitalizeFirstLetter } from "../../../../utility/global";
// import { setError } from "../../../../store/error/error.action";
import { setError } from "../../../../store/error/error.action";
import { useDispatch } from "react-redux";

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
  const [durationErrorMsg, setDurationErrorMsg] = React.useState(false);
  const [textErrorMsg, setTextErrorMsg] = React.useState(false);
  const [durationParameter, setDurationParameter] = React.useState("days");
  const dispatch = useDispatch();
  const fetchSymptomsListRef = React.useRef(true)
console.log("timelinelk",timeline)
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

  const [symptomList, setSymptomsList] = React.useState<symptompsElement[]>([]);
  interface Symptom {
    id: number;
    concept_id: string;
    type_id: string;
    term: string;
  }
  function removeDuplicatesAndFilter(
    symptoms: Symptom[],
    prefix: string
  ): Symptom[] {
    
    // Step 1: Remove duplicates based on 'term'
    const uniqueSymptomsMap = new Map<string, Symptom>();
    symptoms.forEach((symptom) => {
      uniqueSymptomsMap.set(symptom.term.toLowerCase(), symptom);
    });
  
    // Convert the map values to an array of symptoms
    const uniqueSymptoms = Array.from(uniqueSymptomsMap.values());
  
    // Step 2: Filter symptoms based on 'prefix'
    const filteredSymptoms = uniqueSymptoms.filter((symptom) =>
      symptom.term.toLowerCase().startsWith(prefix.toLowerCase())
    );
  
    return filteredSymptoms;
  }
  

  const fetchSymptomsList = async (text: string) => {
    if (text.length >= 1) {
      const response = await authPost("data/symptoms", { text }, user.token);
      fetchSymptomsListRef.current = false
      if (response.message === "success") {
        // const fil = response.symptoms.filter((each) => each.term.toLowerCase().startsWith(text.toLowerCase()))
        const uniqueSortedSymptoms = removeDuplicatesAndFilter(
          response.symptoms,
          text
        );

        setSymptomsList(uniqueSortedSymptoms);
      }
    }
  };

  React.useEffect(() => {
    if (text.length >= 2 && fetchSymptomsListRef.current) {

      fetchSymptomsList(text);
    }
  }, [text]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    let conceptId = "";
    if ((!text || !duration) && newSelectedList.length < 1) {
      if (!text) {
        setTextErrorMsg(true);
        return;
      } else {
        setTextErrorMsg(false);
      }

      if (!duration) {
        setDurationErrorMsg(true);
        return;
      } else {
        setDurationErrorMsg(false);
      }

      return;
    }

    if (newSelectedList.length == 0) {
      const filterConceptID = symptomList.filter((each) => each.term === text);
      if(filterConceptID.length===0) return dispatch( setError("Please select from dropdown list"));

      conceptId = filterConceptID[0].concept_id;
    }
    let symptomps: Array<{
      symptom: string;
      duration: string;
      durationParameter: string;
      conceptID: string;
    }> = [];
    if (newSelectedList.length) {
      symptomps = newSelectedList.map((symptom) => {
        return {
          symptom: symptom.name,
          duration: symptom.duration,
          durationParameter: symptom.durationParameter,
          conceptID: symptom.conceptId,
        };
      });
    } else if (text && duration) {
      // console.log("symptomps", symptomps)
      if (durationParameter === "year" && parseInt(duration) > 5) {
        dispatch(setError("Year should be less than or equal to 5"));
        return;
      } else {
        symptomps.push({
          symptom: text,
          duration: duration,
          durationParameter: durationParameter,
          conceptID: conceptId,
        });
      }
    }
    const body = {
      timeLineID: timeline.id,
      userID: user.id,
      symptoms: symptomps,
      patientID:timeline.patientID

    };
    const response = await authPost(`symptom`, body, user.token);
    if (response.message == "success") {
      setSelectedList((prevList) => {
        return [...prevList, ...response.symptoms];
      });
    }

    setDurationErrorMsg(false);
    setTextErrorMsg(false);
    handleClose();
  };
  const debouncedHandleSave = debounce(handleSave, DEBOUNCE_DELAY);
  // console.log("symptomList", text)
  // console.log("symptomList", symptomList)

  const handleInputChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newInputValue: string
  ) => {

    const nameregex = /^[A-Za-z\s]*$/;
    if (nameregex.test(newInputValue)) {
      setText(newInputValue);
      fetchSymptomsListRef.current = true
    }
  };

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    // const nameregex = /^[A-Za-z\s]*$/;
    if (typeof newValue === "string") {
      setText(newValue);
      fetchSymptomsListRef.current = true
    } else {
      setText("");
    }
  };


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
              {/* <IconButton
                aria-label="delete"
                size="large"
                onClick={() => {
                  if (text && !newSelectedList.includes(text)) {
                    setNewSelectedList((prev) => [text, ...prev]);
                  }
                  setText("");
                }}
              >
                <AddIcon />
              </IconButton> */}
              <Button
                variant="contained"
                onClick={() => {
                  if (
                    text &&
                    duration &&
                    !newSelectedList.find((list) => list.name == text)
                  ) {
                    const filterConceptID = symptomList.filter(
                      (each) => each.term === text
                    );
                    if(filterConceptID.length===0) return dispatch( setError("Please select from dropdown list"));
                    if (
                      durationParameter === "year" &&
                      parseInt(duration) > 5
                    ) {
                      dispatch(
                        setError("Year should be less than or equal to 5")
                      );
                    } else {
                      setNewSelectedList((prev) => [
                        {
                          duration,
                          name: text,
                          durationParameter,
                          conceptId: filterConceptID[0].concept_id,
                        },
                        ...prev,
                      ]);
                    }
                  }
                  setText("");
                  setDuration("");
                  setDurationErrorMsg(false);
                  setTextErrorMsg(false);
                  setSymptomsList([])
                }}
                endIcon={<AddIcon />}
              >
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
