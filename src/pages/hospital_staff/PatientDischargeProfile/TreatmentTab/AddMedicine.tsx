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
import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';
import {
  medicineCategory,
  medicineCategoryType,
} from "../../../../utility/medicine";
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
          min={0}
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
          min={0}
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
}: doseComponentType) => {
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
  }, [time, comment]);
  return (
    <>
      {array.map((el, index1) => {
        console.log(el ? "" : "");
        return (
          <>
            {/* Hello */}
            <Grid xs={6} item>
              <TextField
                required
                id="outlined-required"
                label="Time"
                variant="outlined"
                value={time[index1]}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  //   medicineData[index].medicineName = event.target.value;
                  setTime((prev) => {
                    prev[index1] = event.target.value;
                    return [...prev];
                  });
                }}
                fullWidth
              />
            </Grid>
            <Grid xs={6} item>
              <TextField
                required
                id="outlined-required"
                label="Note"
                variant="outlined"
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
};

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
export default function AddMedicine({ open, setOpen }: MedicineDialogType) {
  const timeline = useSelector(selectTimeline);
  const user = useSelector(selectCurrentUser);
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async () => {
    console.log(medicineData);
    //
    const finalData = medicineData.map((el) => {
      return { ...el, timeLineID: timeline.id, userID: timeline.userID };
    });
    // console.log(finalData);
    const response = await authPost(
      `medicine`,
      { medicines: finalData },
      user.token
    );
    // console.log(response);
    if (response.status == "success") {
      console.log("success");
      handleClose();
    }
    handleClose();
  };
  const debouncedHandleSubmit = debounce(handleSubmit,DEBOUNCE_DELAY)
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
    Frequency: 0,
  };

  const [medicineData, setMedicineData] = React.useState<MedicineType[]>([
    medicineInitialState,
  ]);
  const medicineCategoryList: Array<keyof medicineCategoryType> = Object.keys(
    medicineCategory
  ) as Array<keyof medicineCategoryType>;
  //   console.log(medicineInitialState);
  //   console.log("re-render the medicine");
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Medicine</DialogTitle>
        <DialogContent>
          {medicineData.map((medicine, index) => {
            return (
              <Grid xs={12} container spacing={2} sx={{ mt: "20px" }}>
                <Grid xs={8} item>
                  <TextField
                    required
                    id="outlined-required"
                    label="Medicine Name"
                    variant="outlined"
                    value={medicine.medicineName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      //   medicineData[index].medicineName = event.target.value;
                      setMedicineData((prev) => {
                        prev[index].medicineName = event.target.value;
                        return [...prev];
                      });
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid xs={4} item>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-helper-label">
                      Medicine Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      label="Medicine Type"
                      name="reason"
                      onChange={(event: SelectChangeEvent) => {
                        setMedicineData((prev) => {
                          prev[index].medicineType = Number(event.target.value);
                          return [...prev];
                        });
                      }}
                      value={String(medicine.medicineType || 0)}
                    >
                      {medicineCategoryList.map(
                        (el: keyof medicineCategoryType) => {
                          return (
                            <MenuItem value={medicineCategory[el]}>
                              {el}
                            </MenuItem>
                          );
                        }
                      )}
                    </Select>
                    {/* <FormHelperText>{formData.role.message}</FormHelperText> */}
                  </FormControl>
                </Grid>
                <Grid xs={6} item>
                  <FormControl fullWidth>
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
                <p style={{ width: "100%", borderTop: "1px solid black" }}></p>
              </Grid>
            );
          })}
          <Button
            variant="outlined"
            sx={{ mt: "10px" }}
            onClick={() => {
              setMedicineData((pre) => {
                pre.push(medicineInitialState);
                return [...medicineData];
              });
            }}
          >
            Add Medicine
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={debouncedHandleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
