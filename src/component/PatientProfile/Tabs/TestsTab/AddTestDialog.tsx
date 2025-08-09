import * as React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Stack,
  Autocomplete,
  TextField,
  Grid,
} from "@mui/material";
import styles from "./../../../../pages/hospital_admin/addDepartment/addDepartment.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authPost } from "../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';
import AddIcon from "@mui/icons-material/Add";
import { setError } from "../../../../store/error/error.action";
import { testType } from "../../../../types";

type selectedListType = {
  testID:number | string;
  loinc_num_: string;
  name: string;
  department: string;
};

type addStaffProps = {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedList: React.Dispatch<React.SetStateAction<testType[]>>;
  selectedList?: testType[];
};

export default function AddTestsDialog({
  setOpen,
  setSelectedList,
}: addStaffProps) {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const [selectedItem, setSelectedItem] =
    React.useState<selectedListType | null>(null);
  const [testList, setTestsList] = React.useState<selectedListType[]>([]);
  const [newSelectedList, setNewSelectedList] = React.useState<
    selectedListType[]
  >([]);

  const dispatch = useDispatch();

  React.useEffect(() => {
    const getTestsData = async () => {
      const response = await authPost(
        `data/lionicCode/${user.hospitalID}`,
        { text: selectedItem?.name || "" },
        user.token
      );
      if (response.message === "success") {
        const testData = response.data;
        const uniqueTests: selectedListType[] = Array.from(
          new Set(
            testData.map(
              (el: {
                id:number;
                LOINC_Code: string;
                LOINC_Name: string;
                Department: string;
              }) => ({
                testID:el.id,
                loinc_num_: el.LOINC_Code,
                name: el.LOINC_Name,
                department: el.Department,
              })
            )
          )
        );
        setTestsList(uniqueTests);
      }
    };
    if (selectedItem && selectedItem.name && selectedItem.name.length >= 1) {
      getTestsData();
    } else {
      setTestsList([]);
    }
  }, [user, selectedItem?.name, selectedItem]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    const tests = newSelectedList.length
      ? newSelectedList.map((test) => ({
          testID: test.testID,
          loinc_num_: test.loinc_num_,
          test: test.name,
          department: test.department,
        }))
      : selectedItem &&
        testList.some((test) => test.loinc_num_ === selectedItem.loinc_num_)
      ? [
          {
            testID:selectedItem.testID,
            loinc_num_: selectedItem.loinc_num_,
            test: selectedItem.name,
            department: selectedItem.department,
          },
        ]
      : [];

    // If the tests array is empty, show an error message
    if (tests.length === 0) {
      dispatch(setError("Please select a valid test from the list."));
      return;
    }

    const body = {
      timeLineID: timeline.id,
      userID: user.id,
      tests: tests,
      patientID: timeline.patientID,
    };

    const response = await authPost(
      `test/${user.hospitalID}`,
      body,
      user.token
    );
   
    if (response.message === "success") {
      setSelectedList((prevList) => [...prevList, ...response.tests]);
    } else if (response.status === "error") {
      dispatch(setError(response.message));
    }
    handleClose();
  };
  const debouncedHandleSave = debounce(handleSave, DEBOUNCE_DELAY);

  return (
    <div>
      <DialogTitle>Add Test</DialogTitle>
      <DialogContent>
        <div className={styles.department_dialog}>
          <Grid
            container
            xs={12}
            style={{ marginTop: "1rem" }}
            alignItems={"center"}
            spacing={2}
          >
            <Grid item xs={8}>
              <Autocomplete
                freeSolo={false}
                value={selectedItem}
                onChange={(_, newValue: selectedListType | null) => {
                  setSelectedItem(newValue);
                }}
                inputValue={selectedItem?.name || ""}
                onInputChange={(_, newInputValue) => {
                  const regex = /^[a-zA-Z][a-zA-Z\s]*$/;
                  if (
                    (regex.test(newInputValue) || newInputValue === "") &&
                    newInputValue.length <= 20
                  ) {
                    setSelectedItem({
                      testID:"",
                      loinc_num_: "",
                      name: newInputValue,
                      department: "",
                    });
                  }
                }}
                options={testList}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.loinc_num_ === value.loinc_num_
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Test"
                    placeholder="Enter 3 letters for search"
                    required
                  />
                )}
              />
            </Grid>

            <Grid xs={3} item>
              <Button
                variant="contained"
                onClick={() => {
                  if (
                    selectedItem &&
                    selectedItem.name &&
                    testList.some((test) => test.name === selectedItem.name) &&
                    !newSelectedList.some(
                      (list) => list.name === selectedItem.name
                    )
                  ) {
                    setNewSelectedList((prev) => [selectedItem, ...prev]);
                    setSelectedItem(null);
                  } else {
                    dispatch(
                      setError("Please select a valid test from the list.")
                    );
                  }
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
            {newSelectedList.map((el) => (
              <Chip
                key={el.loinc_num_}
                label={el.name}
                onDelete={() => {
                  setNewSelectedList((curr) =>
                    curr.filter((val) => val.loinc_num_ !== el.loinc_num_)
                  );
                }}
              />
            ))}
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
