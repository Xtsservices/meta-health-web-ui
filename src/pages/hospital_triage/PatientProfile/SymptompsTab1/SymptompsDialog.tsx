import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./../../../hospital_admin/addDepartment/addDepartment.module.scss";
// import search_icon from "./../../../../../src/assets/sidebar/search_icon.png";
// import { ChangeEventHandler } from "react";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import * as React from "react";
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
  // const [searchList, setSearchList] = React.useState<string[]>([]);
  const [newSelectedList, setNewSelectedList] = React.useState<string[]>([]);
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
  // React.useEffect(() => {
  //   if (!search) {
  //     setSearchList(sympptompList);
  //   } else {
  //     console.log(
  //       sympptompList.filter((el) =>
  //         el.toLowerCase().includes(search.toLowerCase())
  //       )
  //     );
  //     setSearchList(
  //       sympptompList.filter((el) =>
  //         el.toLowerCase().includes(search.toLowerCase())
  //       )
  //     );
  //   }
  // }, [search, sympptompList]);
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };
  // const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
  //   e.preventDefault();
  //   setSearch(e.target.value);
  // };
  // const handleCheckBoxClicked: (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => void = (event) => {
  //   if (event.target.checked) {
  //     setNewSelectedList((prevValue) => {
  //       return [...prevValue, event.target.value];
  //     });
  //   } else {
  //     setNewSelectedList((prevValue) => {
  //       return prevValue.filter((el) => el != event.target.value);
  //     });
  //   }
  // };
  const handleSave = async () => {
    const symptomps = newSelectedList.map((symptom) => {
      return {
        symptom,
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
          {/* <div className={styles.dialog_search}>
            <img src={search_icon} alt="" />
            <input
              type="text"
              placeholder="Search"
              onChange={handleSearch}
              value={search}
            />
            <IconButton aria-label="delete" onClick={() => setSearch("")}>
              <CleaningServicesIcon />
            </IconButton>
          </div> */}
          {/* <div className={styles.dialog_list}>
            {searchList?.slice(0, 5).map((element) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleCheckBoxClicked}
                      value={element}
                      checked={newSelectedList.includes(element)}
                      id={element}
                    />
                  }
                  label={element}
                />
              );
            })}
          </div> */}
          <Grid
            container
            xs={12}
            style={{ marginTop: "1rem" }}
            alignItems={"center"}
            spacing={2}
          >
            <Grid item xs={10}>
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
                  if (text && !newSelectedList.includes(text)) {
                    setNewSelectedList((prev) => [text, ...prev]);
                  }
                  setText("");
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
                  label={el}
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
