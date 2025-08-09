import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import { MedicineType } from "../../../../../types";
import { timeOfMedication } from "../../../../../utility/list";
import {
  medicineCategory,
  medicineCategoryType,
} from "../../../../../utility/medicine";

type DoseComponentType = {
  length: number;
  setMedicineData: React.Dispatch<React.SetStateAction<MedicineType[]>>;
  index: number;
  medicineData?: MedicineType[];
};

const DoseComponent: React.FC<DoseComponentType> = ({
  length,
  setMedicineData,
  index,
  medicineData,
}) => {
  const [medicationTime, setMedicationTime] = React.useState<string[]>([]);

  useEffect(() => {
    setMedicineData((prevData) => {
      const newData = [...prevData];
      if (newData[index] && medicationTime.includes("As Per Need")) {
        newData[index] = {
          ...newData[index],
          Frequency: 1,
          daysCount: 0,
          medicationTime: "As Per Need",
        };
      } else {
        newData[index] = {
          ...newData[index],
          medicationTime: medicationTime.join(","),
        };
      }
      return newData;
    });
  }, [medicationTime]);

  const handleMedicationTimeClick = (each: string) => {
    if (
      medicineData &&
      medicineData[index] &&
      typeof medicineData[index].Frequency === "number"
    ) {
      const maxSelectable: number = medicineData[index].Frequency;

      setMedicationTime((prev) => {
        const newMedicationTime = [...prev];
        const itemIndex = newMedicationTime.indexOf(each);

        if (itemIndex === -1) {
          // 'each' is not in the array, so add it if not exceeding the frequency limit
          if (newMedicationTime.length < maxSelectable) {
            newMedicationTime.push(each);
          }
        } else {
          // 'each' is in the array, so remove it
          newMedicationTime.splice(itemIndex, 1);
        }

        return newMedicationTime;
      });
    } else {
      console.error("Invalid medicine data or frequency");
    }
  };

  return (
    <>
      {Array.from({ length }).map((_, index1) => (
        <React.Fragment key={index1}>
          <Grid xs={12} style={{ display: "flex" }} item>
            <FormControl fullWidth required>
              <p
                style={{ fontSize: "14px", color: "gray", fontWeight: "100" }}
                id={`demo-multiple-select-label-${index1}`}
              >
                Time of Medication
              </p>
              <Grid xs={12} style={{ display: "flex" }} item>
                {timeOfMedication.map((each, idx) => (
                  <Button
                    key={idx}
                    style={{
                      margin: "3px",
                      fontWeight: 500,
                      fontSize: "10px",
                      color: medicationTime.includes(each) ? "white" : "gray",
                    }}
                    variant={
                      medicationTime.includes(each) ? "contained" : "outlined"
                    }
                    onClick={() => handleMedicationTimeClick(each)}
                  >
                    {each}
                  </Button>
                ))}
              </Grid>
            </FormControl>
          </Grid>
        </React.Fragment>
      ))}
    </>
  );
};

type MedicineDialogType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateLatestData: (param: string) => void;
};

export default function AddMedicine({ open, setOpen }: MedicineDialogType) {
  const [, setDisableAddMedicine] = React.useState(true);

  const handleClose = () => {
    setMedicineData([medicineInitialState]);
    setOpen(false);
  };

  const [testList] = React.useState<string[]>([]);
  const [searchTest, setSearchTest] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const medicineInitialState: MedicineType = {
    timeLineID: 0,
    userID: 0,
    medicineType: 0,
    medicineName: "",
    daysCount: 0,
    doseCount: 0,
    Frequency: 1,
    medicationTime: "",
    doseUnit: "",
    doseTimings: "",
    notes: "",
    isOther: false,
    medicineList: [],
    test: "",
    advice: "",
    followUp: 0,
    followUpDate: "",
    medicineStartDate: "",
  };

  const [medicineData, setMedicineData] = React.useState([
    medicineInitialState,
  ]);
  const medicineCategoryList: Array<keyof medicineCategoryType> = Object.keys(
    medicineCategory
  ) as Array<keyof medicineCategoryType>;

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

  function updateDosgeUnit() {
    medicineData.forEach((medicine, index) => {
      if (medicine.medicineType === 0) return;
      else if (medicine.medicineType === 1 || medicine.medicineType === 3) {
        setMedicineData((prev) => {
          const newData = [...prev];
          newData[index].doseUnit = "mg";
          return newData;
        });
      } else if (medicine.medicineType === 6) {
        setMedicineData((prev) => {
          const newData = [...prev];
          newData[index].doseUnit = "g";
          return newData;
        });
      } else {
        setMedicineData((prev) => {
          const newData = [...prev];
          newData[index].doseUnit = "ml";
          return newData;
        });
      }
    });
  }

  const dialogPaperStyles = {
    width: "800px",
    minWidth: "800px",
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: dialogPaperStyles,
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Prescription </DialogTitle>
          <DialogContent>
            {medicineData.map((medicine, index) => {
              return (
                <Grid
                  xs={12}
                  container
                  spacing={2}
                  sx={{ mt: "20px" }}
                  key={index}
                >
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
                        required
                        onChange={(event: SelectChangeEvent) => {
                          setMedicineData((prev) => {
                            const newData = [...prev];
                            newData[index].medicineType = Number(
                              event.target.value
                            );
                            return newData;
                          });
                          updateDosgeUnit();
                        }}
                        value={String(medicine.medicineType) || ""}
                      >
                        {medicineCategoryList.map(
                          (el: keyof medicineCategoryType) => (
                            <MenuItem key={el} value={medicineCategory[el]}>
                              {el.toLowerCase() === "ivline"
                                ? "IV Line"
                                : el.slice(0, 1).toUpperCase() +
                                  el.slice(1).toLowerCase()}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid xs={8} item>
                    <Autocomplete
                      freeSolo
                      value={medicine.medicineName}
                      onChange={(_, newValue: string | null) => {
                        // No need to check for "No Option" since it won't be in options
                        setMedicineData((prev) => {
                          const newData = [...prev];
                          newData[index].medicineName = newValue || "";
                          return newData;
                        });
                      }}
                      inputValue={medicine.medicineName || ""}
                      onInputChange={(_, newInputValue) => {
                        setMedicineData((prev) => {
                          const newData = [...prev];
                          newData[index].medicineName = newInputValue || "";
                          return newData;
                        });
                      }}
                      options={medicine.medicineList || []} // Provide all options initially
                      // Custom filter options based on input value
                      filterOptions={(options, { inputValue }) => {
                        console.log("options", options);
                        console.log("opinput", inputValue);
                        if (!inputValue) {
                          return options; // Return all options if no input value
                        }
                        const lowerCaseInput = inputValue.toLowerCase();
                        return options.filter((option) =>
                          option.toLowerCase().startsWith(lowerCaseInput)
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Medicine Name"
                          placeholder="Enter 3 letters for search"
                          required
                          helperText={medicine.medicineList?.length ? "" : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid xs={4} item>
                    <TextField
                      label={"Dosage"}
                      type="number"
                      inputProps={{ min: 1 }}
                      placeholder="Enter Dose"
                      value={medicineData[index].doseCount}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const newValue = parseFloat(event.target.value);
                        if (newValue < 1) {
                          // dispatch(setError("Please Enter Positive Number"));
                          return;
                        }

                        if (newValue.toString().length > 3) return;
                        if (!isNaN(newValue)) {
                          setMedicineData((prev) => {
                            const newData = [...prev];
                            newData[index].doseCount = newValue;
                            return newData;
                          });
                        } else
                          setMedicineData((prev) => {
                            const newData = [...prev];
                            newData[index].doseCount = null;
                            return newData;
                          });
                      }}
                    />
                  </Grid>

                  <Grid xs={4} item>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-helper-label">
                        Dosage Unit
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Dose of Medication"
                        name="doseUnit"
                        required
                        onChange={(event: SelectChangeEvent) => {
                          setMedicineData((prev) => {
                            const newData = [...prev];
                            newData[index].doseUnit = String(
                              event.target.value.toString()
                            );
                            return newData;
                          });
                        }}
                        value={String(medicine.doseUnit) || ""}
                      >
                        <MenuItem value={"μg"}>μg</MenuItem>
                        <MenuItem value={"mg"}>mg</MenuItem>
                        <MenuItem value={"g"}>g</MenuItem>
                        <MenuItem value={"ml"}>ml</MenuItem>
                        <MenuItem value={"l"}>l</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid xs={4} item>
                    <TextField
                      label={"Frequency"}
                      inputProps={{ min: 1 }}
                      disabled={
                        medicineData[index].medicationTime.includes(
                          "As Per Need"
                        )
                          ? true
                          : false
                      }
                      type="number"
                      value={medicineData[index].Frequency}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const newValue = parseInt(event.target.value);
                        console.log("Frequency", newValue);

                        if (isNaN(newValue) || newValue > 6) return;
                        else if (!isNaN(newValue)) {
                          setMedicineData((prev) => {
                            const newData = [...prev];
                            newData[index].Frequency = newValue;
                            return newData;
                          });
                        } else
                          setMedicineData((prev) => {
                            const newData = [...prev];
                            newData[index].Frequency = 0;
                            return newData;
                          });
                      }}
                    />
                  </Grid>

                  <DoseComponent
                    length={1}
                    setMedicineData={setMedicineData}
                    index={index}
                    medicineData={medicineData}
                  />

                  <Grid xs={4} item>
                    <TextField
                      label={"Days"}
                      type="number"
                      disabled={
                        medicineData[index].medicationTime.includes(
                          "As Per Need"
                        )
                          ? true
                          : false
                      }
                      inputProps={{ min: 1 }}
                      value={medicineData[index].daysCount}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const newValue = parseFloat(event.target.value);
                        if (newValue.toString().length > 3) return;
                        if (!isNaN(newValue)) {
                          setMedicineData((prev) => {
                            const newData = [...prev];
                            newData[index].daysCount = newValue;
                            return newData;
                          });
                        } else
                          setMedicineData((prev) => {
                            const newData = [...prev];
                            newData[index].daysCount = null;
                            return newData;
                          });
                      }}
                    />
                  </Grid>

                  <Grid item xs={8}>
                    <Autocomplete
                      freeSolo
                      value={searchTest}
                      onChange={(_, newValue) => {
                        setSearchTest(newValue);
                      }}
                      inputValue={medicine.test || ""}
                      onInputChange={(_, newInputValue) => {
                        setMedicineData((prev) => {
                          const newData = [...prev];
                          newData[index].test = newInputValue || "";
                          return newData;
                        });
                      }}
                      options={testList}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Test"
                          placeholder="Enter 3 letters for search"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      id="outlined-required"
                      label="Advice"
                      value={medicine.advice}
                      name="advice"
                      fullWidth
                      variant="outlined"
                      onChange={(e) => {
                        setMedicineData((prev) => {
                          const newData = [...prev];
                          newData[index].advice = e.target.value;
                          return newData;
                        });
                      }}
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
                        value={medicine.followUp}
                        onChange={(e) => {
                          const newValue = Number(e.target.value);
                          setMedicineData((prev) => {
                            const newData = [...prev];
                            newData[index].followUp = newValue;
                            return newData;
                          });
                        }}
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
                      disabled={medicine.followUp ? false : true}
                      onChange={(e) => {
                        setMedicineData((prev) => {
                          const newData = [...prev];
                          newData[index].followUpDate = e.target.value;
                          return newData;
                        });
                      }}
                      type="date"
                      value={medicine.followUpDate}
                      inputProps={{
                        min: new Date().toISOString().split("T")[0],
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      id="outlined-required"
                      label="Medicine Start Date"
                      variant="outlined"
                      fullWidth
                      onChange={(e) => {
                        setMedicineData((prev) => {
                          const newData = [...prev];
                          newData[index].medicineStartDate = e.target.value;
                          return newData;
                        });
                      }}
                      type="date"
                      value={medicine.medicineStartDate}
                      inputProps={{
                        min: new Date().toISOString().split("T")[0],
                      }}
                    />
                  </Grid>

                  <p
                    style={{ width: "100%", borderTop: "1px solid black" }}
                  ></p>
                </Grid>
              );
            })}
            {/* <Button
                variant="outlined"
                sx={{ mt: "10px" }}
                onClick={() => {
                  setMedicineData((prev) => [...prev, medicineInitialState]);
                }}
                disabled={disableAddMedicine}
              >
                Add Medicine
              </Button> */}
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
