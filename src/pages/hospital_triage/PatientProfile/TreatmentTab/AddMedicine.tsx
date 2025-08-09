import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MedicineType } from "../../../../types";
import Grid from "@mui/material/Grid";
import styles from "./TreatmentTab.module.scss";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
// import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
// import Stack from "@mui/material/Stack";
// import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
// import search_icon from "./../../../../src/assets/sidebar/search_icon.png";
// import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { authPost } from "../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../../utility/debounce";
import {
  medicineCategory,
  medicineCategoryType,
} from "../../../../utility/medicine";
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../../../../store/error/error.action";
import { authFetch } from "../../../../axios/useAuthFetch";
import {
  useMedicineListStore,
  // useMedicineStore,
} from "../../../../store/zustandstore";
import Autocomplete from "@mui/material/Autocomplete";
import { makeStyles } from "@mui/styles";
import { timeOfMedication } from "../../../../utility/list";
// import FormControlLabel from "@mui/material/FormControlLabel";
type InputnumberType = {
  setMedicineData: React.Dispatch<React.SetStateAction<MedicineType[]>>;
  medicineData: MedicineType[];
  index: number;
};
const InputNumberDoses = ({
  setMedicineData,
  medicineData,
  index,
}: InputnumberType) => {
  //   const [number, setNumber] = React.useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={styles.datatable_addSubtractInput}>
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() =>
            setMedicineData((prev) => {
              prev[index].doseCount = (prev[index].doseCount || 0) + 1;
              return [...prev];
            })
          }
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
        <input
          type="number"
          value={medicineData[index].doseCount || 0}
          min={1}
        />
        <IconButton
          aria-label="delete"
          size="small"
          // disabled={number == 0}
          onClick={() =>
            setMedicineData((prev) => {
              prev[index].doseCount = (prev[index].doseCount || 1) - 1;
              return [...prev];
            })
          }
        >
          <RemoveIcon fontSize="inherit" />
        </IconButton>
      </div>
      <p style={{ margin: 0 }}> Doses</p>
    </div>
  );
};
const InputNumberDays = ({
  setMedicineData,
  medicineData,
  index,
}: InputnumberType) => {
  //   const [number, setNumber] = React.useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={styles.datatable_addSubtractInput}>
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() =>
            setMedicineData((prev) => {
              prev[index].daysCount = (prev[index].daysCount || 0) + 1;
              return [...prev];
            })
          }
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
        <input
          type="number"
          value={medicineData[index].daysCount || 0}
          min={1}
        />
        <IconButton
          aria-label="delete"
          size="small"
          // disabled={number == 0}
          onClick={() =>
            setMedicineData((prev) => {
              prev[index].daysCount = (prev[index].daysCount || 1) - 1;
              return [...prev];
            })
          }
        >
          <RemoveIcon fontSize="inherit" />
        </IconButton>
      </div>
      <p style={{ margin: 0 }}>Days</p>
    </div>
  );
};
type doseComponentType = {
  length: number;
  setMedicineData: React.Dispatch<React.SetStateAction<MedicineType[]>>;
  index: number;
  medicineData?: MedicineType[];
};
const DoseComponent = ({
  length,
  setMedicineData,
  index,
}: // medicineData,
doseComponentType) => {
  console.log(length);
  const [time, setTime] = React.useState<(string | null)[]>([]);
  const [comment, setComment] = React.useState<(string | null)[]>([]);
  const array = new Array(length);
  array.fill(null);
  //   React.useEffect(() => {
  //     console.log(array);
  //     setTime([]);
  //     setComment([]);
  //     setTime(array);
  //     setComment(array);
  //   }, [medicineData]);
  React.useEffect(() => {
    setMedicineData((mediData) => {
      mediData[index].doseTimings = time.join(",");
      mediData[index].notes = comment.join(",");
      return [...mediData];
    });
  }, [time, comment, setMedicineData, index]);

  //   console.log(time);
  return (
    <>
      {array.map((el, index1) => {
        console.log(el ? "" : "");
        return (
          <>
            {/* Hello */}
            <Grid xs={12} item>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                required
                id="outlined-required"
                label="Time"
                variant="outlined"
                type="time"
                value={time[index1]}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  //   medicineData[index].medicineName = event.target.value;
                  setTime((prev) => {
                    prev[index1] = event.target.value;
                    return [...prev];
                  });
                }}
                fullWidth
                inputProps={{
                  inputMode: "numeric", // This will change the time picker to numeric input
                }}
              />
            </Grid>
            <Grid xs={12} item>
              <TextField
                id="outlined-required"
                label="Notes"
                variant="outlined"
                multiline
                rows={3}
                value={comment[index1]}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  //   medicineData[index].medicineName = event.target.value;
                  setComment((prev) => {
                    prev[index1] = event.target.value;
                    return [...prev];
                  });
                }}
                fullWidth
              />
            </Grid>
          </>
        );
      })}
    </>
  );
};
// const DoseTime=()
type MedicineDialogType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTimeline: React.Dispatch<React.SetStateAction<boolean>>;
};

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
const useStyles = makeStyles({
  dialogPaper: {
    width: "800px",
    minWidth: "800px",
  },
});

export default function AddMedicine({
  open,
  setOpen,
  setIsTimeline,
}: MedicineDialogType) {
  const timeline = useSelector(selectTimeline);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  // const { setNewMedicineReminder } = useMedicineStore();
  const { setNewMedicineList } = useMedicineListStore();
  const [disableAddMedicine, setDisableAddMedicine] = React.useState(true);
  const classes = useStyles();
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  const handleClose = () => {
    console.log("");
    setMedicineData([medicineInitialState]);
    setOpen(false);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // console.log(medicineData);
    e.preventDefault();
    //
    const finalData = medicineData.map((el) => {
      return {
        timeLineID: timeline.id,
        userID: user.id,
        medicineType: el.medicineType,
        medicineName: el.medicineName,
        daysCount: el.daysCount,
        doseCount: el.doseCount,
        medicationTime: el.medicationTime,
        doseTimings: el.doseTimings,
        notes: el.notes,
      };
    });
    // console.log(finalData);
    const response = await authPost(
      `medicine`,
      { medicines: finalData },
      user.token
    );
    // console.log("medicine", response);
    if (response.message == "success") {
      console.log("success");
      dispatch(setSuccess("Medicine successfully added"));
      setMedicineData([medicineInitialState]);
      // setNewMedicineReminder(response.medicines);
      setNewMedicineList(response.medicines);
      setIsTimeline(false);
      handleClose();
    } else {
      dispatch(setError(response.message));
    }
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);
  const medicineInitialState = {
    timeLineID: 0,
    userID: 0,
    medicineType: 0,
    medicineName: "",
    daysCount: 0,
    doseCount: 0,
    medicationTime: "",
    doseTimings: "",
    notes: "",
    isOther: false,
    Frequency: 0,
  };

  const [medicineData, setMedicineData] = React.useState<MedicineType[]>([
    medicineInitialState,
  ]);

  const medicineCategoryList: Array<keyof medicineCategoryType> = Object.keys(
    medicineCategory
  ) as Array<keyof medicineCategoryType>;
  const [medicineListData, setMedicineListData] = React.useState<string[]>([]);
  const getAllMedicineList = React.useCallback(async () => {
    const response = await authFetch(
      `medicine/${user.hospitalID}/getMedicines`,
      user.token
    );
    if (response.message == "success") {
      setMedicineListData(response.medicines);
    }
  }, [user.token]);
  React.useEffect(() => {
    getAllMedicineList();
  }, [getAllMedicineList, user]);

  React.useEffect(() => {
    const previousMedicine = medicineData.slice(-1)[0];
    setDisableAddMedicine(true);
    if (
      previousMedicine.medicineName &&
      previousMedicine.daysCount &&
      previousMedicine.doseCount &&
      previousMedicine.doseTimings &&
      previousMedicine.medicineType
    ) {
      setDisableAddMedicine(false);
    }
  }, [medicineData]);
  //   console.log(medicineInitialState);
  //   console.log("re-render the medicine");
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            debouncedHandleSubmit(e);
          }}
        >
          <DialogTitle>Add Medicine</DialogTitle>
          <DialogContent>
            {medicineData.map((medicine, index) => {
              return (
                <Grid xs={12} container spacing={2} sx={{ mt: "20px" }}>
                  <Grid xs={medicine.isOther ? 12 : 8} item>
                    {/* <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-helper-label">
                        Medicine Name
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Medicine Name"
                        name="reason"
                        onChange={(event: SelectChangeEvent) => {
                          medicineData[index].medicineName = event.target.value;
                          if (event.target.value == "other") {
                            medicineData[index].isOthers = true;
                          } else {
                            medicineData[index].isOthers = false;
                          }
                          setMedicineData((prev) => {
                            prev[index].medicineName = event.target.value;
                            return [...prev];
                          });
                        }}
                        value={medicine.medicineName}
                        fullWidth
                      >
                        <MenuItem value={"other"} sx={{ color: "blue" }}>
                          Other
                        </MenuItem>
                        {medicineListData.map((el: string) => {
                          return <MenuItem value={el}>{el}</MenuItem>;
                        })}
                      </Select>
                    </FormControl> */}
                    <Autocomplete
                      freeSolo // Allow the user to input a value that's not in the options list
                      value={medicine.medicineName}
                      onChange={(event: unknown, newValue: string | null) => {
                        console.log(event && "");
                        setMedicineData((prev) => {
                          prev[index].medicineName = newValue || "";
                          return [...prev];
                        });
                      }}
                      inputValue={medicine.medicineName || undefined}
                      onInputChange={(event, newInputValue) => {
                        console.log(event && "");
                        setMedicineData((prev) => {
                          prev[index].medicineName = newInputValue || "";
                          return [...prev];
                        });
                      }}
                      options={
                        medicineListData?.length
                          ? medicineListData
                          : ["No Option"]
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Medicine Name" required />
                      )}
                    />
                  </Grid>
                  {/* {medicine.isOthers && (
                    <Grid xs={8} item>
                      <TextField
                        id="outlined-required"
                        label="Medicine Name"
                        name="Medicine"
                        required
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          medicineData[index].medicineName = event.target.value;
                          setMedicineData((prev) => {
                            prev[index].medicineName = event.target.value;
                            return [...prev];
                          });
                        }}
                        //   defaultValue="Hello World"
                        fullWidth
                        // sx={{ width: 0.48, mt: "1rem" }}
                      />
                    </Grid>
                  )} */}

                  <Grid xs={4} item>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-helper-label">
                        Medicine Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Time of Medication"
                        name="reason"
                        onChange={(event: SelectChangeEvent) => {
                          setMedicineData((prev) => {
                            prev[index].medicineType = Number(
                              event.target.value
                            );
                            return [...prev];
                          });
                        }}
                        required
                        value={
                          medicine.medicineType
                            ? String(medicine.medicineType)
                            : ""
                        }
                      >
                        {medicineCategoryList.map(
                          (el: keyof medicineCategoryType) => {
                            return (
                              <MenuItem value={medicineCategory[el]}>
                                {el.toLowerCase() == "ivline"
                                  ? "IV Line"
                                  : el.slice(0, 1).toUpperCase() +
                                    el.slice(1).toLowerCase()}
                              </MenuItem>
                            );
                          }
                        )}
                      </Select>
                      {/* <FormHelperText>{formData.role.message}</FormHelperText> */}
                    </FormControl>
                  </Grid>
                  <Grid xs={6} item>
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-helper-label">
                        Time of Medication
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Time of Medication"
                        name="reason"
                        onChange={(event: SelectChangeEvent) => {
                          setMedicineData((prev) => {
                            prev[index].medicationTime = event.target.value;
                            return [...prev];
                          });
                        }}
                        value={medicine.medicationTime}
                      >
                        {timeOfMedication.map((each: string) => (
                          <MenuItem key={each} value={each}>
                            {each}
                          </MenuItem>
                        ))}
                      </Select>
                      {/* <FormHelperText>{formData.role.message}</FormHelperText> */}
                    </FormControl>
                  </Grid>
                  <Grid xs={3} item>
                    <InputNumberDoses
                      setMedicineData={setMedicineData}
                      medicineData={medicineData}
                      index={index}
                    />
                  </Grid>
                  <Grid xs={3} item>
                    <InputNumberDays
                      setMedicineData={setMedicineData}
                      medicineData={medicineData}
                      index={index}
                    />
                  </Grid>
                  <DoseComponent
                    length={medicine.doseCount || 0}
                    setMedicineData={setMedicineData}
                    index={index}
                    medicineData={medicineData}
                  />
                  <p
                    style={{ width: "100%", borderTop: "1px solid black" }}
                  ></p>
                </Grid>
              );
            })}
            <Button
              variant="outlined"
              sx={{ mt: "10px" }}
              onClick={() => {
                setMedicineData((pre) => {
                  pre.push(medicineInitialState);

                  return [...pre];
                });
              }}
              disabled={disableAddMedicine}
            >
              Add Medicine
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
