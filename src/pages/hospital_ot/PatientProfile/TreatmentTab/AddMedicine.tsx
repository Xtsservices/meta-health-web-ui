import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  MedicineType,
  prescriptionDataType,
  prescriptionFormDataType,
} from "../../../../types";
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
// import {
//   useMedicineListStore,
//   // useMedicineStore,
// } from "../../../../store/zustandstore";
import Autocomplete from "@mui/material/Autocomplete";
import { makeStyles } from "@mui/styles";
import Chip from "@mui/material/Chip";
import { setCurrPatient } from "../../../../store/currentPatient/currentPatient.action";
import { timeOfMedication } from "../../../../utility/list";
// import Autocomplete from '@mui/material/Autocomplete';
// import { splitArrayWithComma } from "../../../../utility/global";
// import TextField from "@mui/material/TextField";

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
// type doseComponentType = {
//   length: number;
//   setMedicineData: React.Dispatch<React.SetStateAction<MedicineType[]>>;
//   index: number;
//   medicineData?: MedicineType[];
// };
// const DoseComponent = ({
//   length,
//   setMedicineData,
//   index,
// }: // medicineData,
// doseComponentType) => {
//   console.log(length);
//   const [time, setTime] = React.useState<(string | null)[]>([]);
//   const [comment, setComment] = React.useState<(string | null)[]>([]);
//   const array = new Array(length);
//   array.fill(null);
//   React.useEffect(() => {
//     setMedicineData((mediData) => {
//       mediData[index].doseTimings = time.join(",");
//       mediData[index].notes = comment.join(",");
//       return [...mediData];
//     });
//   }, [time, comment]);
//   // console.log("new value",formD)
//   //   console.log(time);
//   return (
//     <>
//       {array.map((el, index1) => {
//         console.log(el ? "" : "");
//         return (
//           <>
//             {/* Hello */}
//             <Grid xs={12} item>
//               <TextField
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//                 required
//                 id="outlined-required"
//                 label="Time"
//                 variant="outlined"
//                 type="time"
//                 value={time[index1]}
//                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
//                   //   medicineData[index].medicineName = event.target.value;
//                   setTime((prev) => {
//                     prev[index1] = event.target.value;
//                     return [...prev];
//                   });
//                 }}
//                 fullWidth
//                 inputProps={{
//                   inputMode: "numeric", // This will change the time picker to numeric input
//                 }}
//               />
//             </Grid>
//             <Grid xs={12} item>
//               <TextField
//                 id="outlined-required"
//                 label="Notes"
//                 variant="outlined"
//                 multiline
//                 rows={3}
//                 value={comment[index1]}
//                 onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
//                   //   medicineData[index].medicineName = event.target.value;
//                   setComment((prev) => {
//                     prev[index1] = event.target.value;
//                     return [...prev];
//                   });
//                 }}
//                 fullWidth
//               />
//             </Grid>
//           </>
//         );
//       })}
//     </>
//   );
// };
// const DoseTime=()
type MedicineDialogType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPrescriptionLit: React.Dispatch<
    React.SetStateAction<prescriptionDataType[]>
  >;
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
  setPrescriptionLit,
}: MedicineDialogType) {
  const timeline = useSelector(selectTimeline);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  // const { setNewMedicineReminder } = useMedicineStore();
  // const { setNewMedicineList } = useMedicineListStore();
  const [disableAddMedicine, setDisableAddMedicine] = React.useState(true);
  const [testList, setTestList] = React.useState<string[]>([]);
  const classes = useStyles();
  const [formData, setFormData] = React.useState<prescriptionFormDataType>({
    diet: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    advice: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    followUp: {
      valid: false,
      value: 0,
      showError: false,
      message: "",
    },
    followUpDate: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    medicine: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    medicineType: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    medicineTime: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    medicineDuration: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    medicineFrequency: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    medicineNotes: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    test: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    notes: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
    diagnosis: {
      valid: false,
      value: "",
      showError: false,
      message: "",
    },
  });
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

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
  const getAllMedicineList = async () => {
    const response = await authFetch(
      `medicine/${user.hospitalID}/getMedicines`,
      user.token
    );
    if (response.message == "success") {
      setMedicineListData(response.medicines);
    }
  };
  ////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  const getAllTestList = async () => {
    const response = await authFetch("data/getAllTests", user.token);
    // console.log("ressssss", response);

    if (response.message === "success") {
      const testData: { name: string }[] = response.data as { name: string }[];
      const uniqueTests = Array.from(new Set(testData.map((el) => el.name)));
      setTestList(uniqueTests);
    }
  };
  // console.log("test list---", testList);
  /////////////////////////////////////////////////////////////////////
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isvalid = event.target.validity.valid;
    // console.log(event.target.validity);
    const message = isvalid ? "" : "This field is required";
    const showError = !isvalid;
    const name = event.target.name;

    let value: string | number | null;
    if (name == "phoneNo" || name == "pinCode") {
      value = event.target.value.replace(/\D/g, "");
    } else value = event.target.value;
    setFormData((state) => {
      return {
        ...state,
        [name]: {
          valid: isvalid,
          showError,
          value,
          message,
          name,
        },
      };
    });
  };
  // console.log("formData=-------------", formData.test.value);
  /////////////////////////////////////////////////////////////////
  const handleClose = () => {
    setMedicineData([medicineInitialState]);
    setOpen(false);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // console.log(medicineData);
    e.preventDefault();
    //type
    type finalMedicineResponseType = {
      medicineType: number | null;
      medicineName: string;
      daysCount: number | null;
      doseCount: number | null;
      medicationTime: string;
      doseTimings: string;
      notes: string | null;
    };
    const splitArrayWithComma = (
      data: Array<finalMedicineResponseType>,
      name: keyof finalMedicineResponseType
    ) => data.map((el) => el[name]).join(",");
    const finalMedicineData: finalMedicineResponseType[] = medicineData.map(
      (el) => {
        return {
          medicineType: el.medicineType,
          medicineName: el.medicineName,
          daysCount: el.daysCount,
          doseCount: el.doseCount,
          medicationTime: el.medicationTime,
          doseTimings: el.doseTimings,
          notes: el.notes || null,
        };
      }
    );
    // console.log(finalData);
    const finalData = {
      medicine: splitArrayWithComma(finalMedicineData, "medicineName"),
      medicineType: splitArrayWithComma(finalMedicineData, "medicineType"),
      medicineTime: splitArrayWithComma(finalMedicineData, "medicationTime"),
      medicineDuration: splitArrayWithComma(finalMedicineData, "daysCount"),
      medicineFrequency: splitArrayWithComma(finalMedicineData, "doseCount"),
      medicineNotes: splitArrayWithComma(finalMedicineData, "notes"),
      doseTiming: splitArrayWithComma(finalMedicineData, "doseTimings"),
      test: formData.test.value,
      notes: formData.notes.value,
      diagnosis: formData.diagnosis.value,
      timeLineID: timeline.id,
      patientID: timeline.patientID,
      userID: user.id,
      diet: formData.diet.value,
      advice: formData.advice.value,
      followUp: formData.followUp.value,
      followUpDate: formData.followUpDate.value,
    };
    const response = await authPost(
      `prescription/${user.hospitalID}`,
      finalData,
      user.token
    );

    if (response.message == "success") {
      // response.prescription.date = new Date();
      setPrescriptionLit((prev) => {
        return [response.prescription, ...prev];
      });
      dispatch(setCurrPatient({ currentPatient: response.patient }));
      dispatch(setSuccess("Priscription successfully added"));
      handleClose();
    } else {
      dispatch(setError(response.message));
    }
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);
  React.useEffect(() => {
    getAllMedicineList();
    getAllTestList();
  }, [user]);

  React.useEffect(() => {
    const previousMedicine = medicineData.slice(-1)[0];
    // console.log("medicine data", medicineData);
    setDisableAddMedicine(true);
    if (
      previousMedicine.medicineName &&
      previousMedicine.daysCount &&
      previousMedicine.doseCount &&
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
          <DialogTitle>Add Prescription</DialogTitle>
          <DialogContent>
            <Grid xs={12} container spacing={2} sx={{ mt: "20px" }}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="outlined-required"
                  label="Diagnosis"
                  //   defaultValue="Hello World"
                  value={formData.diagnosis.value}
                  // error={true}
                  error={
                    formData.diagnosis.showError && !formData.diagnosis.valid
                  }
                  helperText={formData.diagnosis.message}
                  name="diagnosis"
                  fullWidth
                  variant="outlined"
                  onChange={handleChangeInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="outlined-required"
                  label="Notes"
                  //   defaultValue="Hello World"
                  value={formData.notes.value}
                  // error={true}
                  error={formData.notes.showError && !formData.notes.valid}
                  helperText={formData.notes.message}
                  name="notes"
                  fullWidth
                  variant="outlined"
                  onChange={handleChangeInput}
                  multiline
                  rows={3}
                />
              </Grid>
              {medicineData.map((medicine, index) => {
                return (
                  <>
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
                        onChange={(
                          _event: unknown,
                          newValue: string | null
                        ) => {
                          setMedicineData((prev) => {
                            prev[index].medicineName = newValue || "";
                            return [...prev];
                          });
                        }}
                        inputValue={medicine.medicineName || undefined}
                        onInputChange={(_event, newInputValue) => {
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
                          <TextField
                            {...params}
                            label="Medicine Name"
                            required
                          />
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

                    {/* ///////////////Dose component//////////////// */}
                    {/* <DoseComponent
                      length={medicine.doseCount || 0}
                      setMedicineData={setMedicineData}
                      index={index}
                      medicineData={medicineData}
                    /> */}

                    {/* <p
                    style={{ width: "100%", borderTop: "1px solid black" }}
                  ></p> */}
                  </>
                );
              })}
              <Grid item xs={12}>
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
                  Add More Medicines
                </Button>
              </Grid>
              <Grid item xs={12}>
                {/* <TextField
                  required
                  id="outlined-required"
                  label="Test"
                  //   defaultValue="Hello World"
                  value={formData.test.value}
                  // error={true}
                  error={formData.test.showError && !formData.test.valid}
                  helperText={formData.test.message}
                  name="test"
                  fullWidth
                  variant="outlined"
                  onChange={handleChangeInput}
                /> */}
                <Autocomplete
                  multiple
                  id="tags-filled"
                  options={testList}
                  defaultValue={
                    formData?.test?.value ? formData.test.value?.split(",") : []
                  }
                  freeSolo
                  renderTags={(value: readonly string[], getTagProps) => {
                    // console.log("new value", value);
                    return value.map((option: string, index: number) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ));
                  }}
                  onChange={(_, newValue) => {
                    // console.log("onchange", newValue);
                    setFormData((prev) => {
                      return {
                        ...prev,
                        test: { ...prev.test, value: newValue.join(",") },
                      };
                    });
                    //
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // variant="filled"
                      label="Test"
                      placeholder="Favorites"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="outlined-required"
                  label="Advice"
                  //   defaultValue="Hello World"
                  value={formData.advice.value}
                  // error={true}
                  error={formData.advice.showError && !formData.advice.valid}
                  helperText={formData.advice.message}
                  name="advice"
                  fullWidth
                  variant="outlined"
                  onChange={handleChangeInput}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-helper-label">
                    Follow up required?
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label="Follow up required?"
                    name="followUp"
                    onChange={(event: SelectChangeEvent) => {
                      setFormData((data) => {
                        return {
                          ...data,
                          followUp: {
                            value: Number(event.target.value) as 0 | 1,
                            valid: true,
                            message: "",
                            showError: false,
                          },
                        };
                      });
                    }}
                    value={String(formData.followUp.value)}
                  >
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </Select>
                  {/* <FormHelperText>{formData.role.message}</FormHelperText> */}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id="outlined-required"
                  label="Follow up Date"
                  variant="outlined"
                  fullWidth
                  disabled={formData.followUp.value ? false : true}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((data) => {
                      return {
                        ...data,
                        followUpDate: {
                          value: event.target.value,
                          valid: true,
                          message: "",
                          showError: false,
                        },
                      };
                    });
                  }}
                  type="date"
                  value={formData.followUpDate.value}
                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                />
              </Grid>
            </Grid>
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
