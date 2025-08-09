import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { MedicineType, prescriptionDataType } from "../../../../types";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Stack, Chip } from "@mui/material";
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
import { useMedicineListStore } from "../../../../store/zustandstore";
import Autocomplete from "@mui/material/Autocomplete";
import { makeStyles } from "@mui/styles";
import { timeOfMedication } from "../../../../utility/list";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { authFetch } from "../../../../axios/useAuthFetch";

type MedicineDialogType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateLatestData: (param: string) => void;
};

interface DuplicateDetails {
  medicine: string;
  medicineTime: string;
}

const useStyles = makeStyles({
  dialogPaper: {
    width: "800px",
    minWidth: "800px",
  },
});

// interface VentilationFormProps {
//   index: number;
//   medicine: MedicineType; // You can adjust this type based on your actual data structure
// }

// const VentilationForm: React.FC<VentilationFormProps> = ({
//   index,
//   medicine
// }) => {
//   const [mode, setMode] = useState<string>("VCV"); // Default mode: Volume-Controlled Ventilation
//   const [formData, setFormData] = useState<any>({});

//   // Handle form input change
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
//   ) => {
//     const { name, value } = e.target;

//     if (name) {
//       // Ensure 'name' is a valid string
//       setFormData((prevState: any) => ({
//         ...prevState,
//         [name]: value
//       }));
//     }
//   };

//   // Handle ventilation mode change
//   const handleModeChange = (e: SelectChangeEvent<string>) => {
//     setMode(e.target.value);
//     setFormData({}); // Reset form data when mode changes
//   };

//   console.log("index==", index, medicine);
//   return (
//     <form>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <FormControl fullWidth sx={{ mt: 2 }}>
//             <InputLabel>Ventilation Mode</InputLabel>
//             <Select
//               value={mode}
//               onChange={handleModeChange}
//               label="Ventilation Mode"
//             >
//               <MenuItem value="VCV">
//                 Volume-Controlled Ventilation (VCV)
//               </MenuItem>
//               <MenuItem value="PCV">
//                 Pressure-Controlled Ventilation (PCV)
//               </MenuItem>
//               <MenuItem value="PSV">
//                 Pressure Support Ventilation (PSV)
//               </MenuItem>
//               <MenuItem value="SIMV">
//                 Synchronized Intermittent Mandatory Ventilation (SIMV)
//               </MenuItem>
//               <MenuItem value="APRV">
//                 Airway Pressure Release Ventilation (APRV)
//               </MenuItem>
//               <MenuItem value="ASV">
//                 Adaptive Support Ventilation (ASV)
//               </MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>

//         {mode === "VCV" && (
//           <>
//             <Grid item xs={6}>
//               <TextField
//                 label="Tidal Volume (Vt) [mL]"
//                 name="tidalVolume"
//                 value={formData.tidalVolume || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Respiratory Rate (RR) [bpm]"
//                 name="respiratoryRate"
//                 value={formData.respiratoryRate || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Inspiratory Flow Rate (IFR) [L/min]"
//                 name="inspiratoryFlowRate"
//                 value={formData.inspiratoryFlowRate || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="I:E Ratio"
//                 name="ieRatio"
//                 value={formData.ieRatio || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="PEEP [cm H2O]"
//                 name="peep"
//                 value={formData.peep || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="FiO2 [%]"
//                 name="fio2"
//                 value={formData.fio2 || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//           </>
//         )}

//         {mode === "PCV" && (
//           <>
//             <Grid item xs={6}>
//               <TextField
//                 label="Peak Inspiratory Pressure (PIP) [cm H2O]"
//                 name="pip"
//                 value={formData.pip || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="PEEP [cm H2O]"
//                 name="peep"
//                 value={formData.peep || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="I:E Ratio"
//                 name="ieRatio"
//                 value={formData.ieRatio || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="FiO2 [%]"
//                 name="fio2"
//                 value={formData.fio2 || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//           </>
//         )}

//         {mode === "PSV" && (
//           <>
//             <Grid item xs={6}>
//               <TextField
//                 label="Pressure Support Level [cm H2O]"
//                 name="pressureSupportLevel"
//                 value={formData.pressureSupportLevel || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="PEEP [cm H2O]"
//                 name="peep"
//                 value={formData.peep || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="FiO2 [%]"
//                 name="fio2"
//                 value={formData.fio2 || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//           </>
//         )}

//         {mode === "SIMV" && (
//           <>
//             <Grid item xs={6}>
//               <TextField
//                 label="Respiratory Rate (RR) [bpm]"
//                 name="respiratoryRate"
//                 value={formData.respiratoryRate || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Tidal Volume (Vt) [mL]"
//                 name="tidalVolume"
//                 value={formData.tidalVolume || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="PEEP [cm H2O]"
//                 name="peep"
//                 value={formData.peep || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Pressure Support Level [cm H2O]"
//                 name="pressureSupportLevel"
//                 value={formData.pressureSupportLevel || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="FiO2 [%]"
//                 name="fio2"
//                 value={formData.fio2 || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//           </>
//         )}

//         {mode === "APRV" && (
//           <>
//             <Grid item xs={6}>
//               <TextField
//                 label="High Pressure Level [cm H2O]"
//                 name="highPressureLevel"
//                 value={formData.highPressureLevel || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Low Pressure Level [cm H2O]"
//                 name="lowPressureLevel"
//                 value={formData.lowPressureLevel || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Time at High Pressure [s]"
//                 name="timeAtHighPressure"
//                 value={formData.timeAtHighPressure || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Time at Low Pressure [s]"
//                 name="timeAtLowPressure"
//                 value={formData.timeAtLowPressure || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="FiO2 [%]"
//                 name="fio2"
//                 value={formData.fio2 || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//           </>
//         )}

//         {mode === "ASV" && (
//           <>
//             <Grid item xs={6}>
//               <TextField
//                 label="Target Tidal Volume [mL]"
//                 name="targetTidalVolume"
//                 value={formData.targetTidalVolume || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Target Minute Ventilation [L/min]"
//                 name="targetMinuteVentilation"
//                 value={formData.targetMinuteVentilation || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Respiratory Rate [bpm]"
//                 name="respiratoryRate"
//                 value={formData.respiratoryRate || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="PEEP [cm H2O]"
//                 name="peep"
//                 value={formData.peep || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="FiO2 [%]"
//                 name="fio2"
//                 value={formData.fio2 || ""}
//                 onChange={handleInputChange}
//                 fullWidth
//                 type="number"
//               />
//             </Grid>
//           </>
//         )}
//       </Grid>
//     </form>
//   );
// };

export default function AddMedicine({
  open,
  setOpen,
  updateLatestData,
}: MedicineDialogType) {
  const timeline = useSelector(selectTimeline);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const { setNewMedicineList } = useMedicineListStore();
  const [, setDisableAddMedicine] = React.useState(true);
  const classes = useStyles();
  const [medicationTime, setMedicationTime] = React.useState<string[]>([]);
  const [medIndex, setMedIndex] = React.useState<number>(-1);
  const handleClose = () => {
    setMedicineData([medicineInitialState]);
    setOpen(false);
  };

  const [copyData, setCopyData] = React.useState<string | null>(null);
  const [testList, setTestList] = React.useState<string[]>([]);
  const [addedTests, setAddedTests] = React.useState<string[]>([]);
  const [searchTest, setSearchTest] = React.useState<string | null>(null);
  const [prescriptionList, setPrescriptionList] = useState<
    prescriptionDataType[]
  >([]);
  let duplicateDetails: DuplicateDetails | null = null;

  useEffect(() => {
    const getAllMedicine = async () => {
      const response = await authFetch(
        `prescription/${user.hospitalID}/${timeline.id}/${timeline.patientID}`,
        user.token
      );
      if (response.message === "success") {
        setPrescriptionList(response.prescriptions);
      }
    };
    if (user.token && timeline.id) {
      getAllMedicine();
    }
  }, [user, timeline]);

  const initializeMedicineList = (prefillData: any[]) => {
    // Extract only medicine names for updating setIsMedInDb
    const prefilledMedicineNames = prefillData?.map((data) => ({
      Medicine_Name: data.medicineName,
    }));

    // Update setIsMedInDb with only the extracted medicine names
    setIsMedInDb(prefilledMedicineNames);
  };

  // Call this during initialization if prefillData exists
  useEffect(() => {
    if (copyData === "true") {
      initializeMedicineList(medicineData);
    }
  }, [copyData]);

  React.useEffect(() => {
    setMedicineData((prev) => {
      if (prev.length === 0) return prev; // If no medicines, return as is

      const updatedData = [...prev];
      const lastMedicineIndex = updatedData.length - 1;

      // Update only the test field for the last medicine
      updatedData[lastMedicineIndex] = {
        ...updatedData[lastMedicineIndex],
        test: addedTests.join("# "),
      };

      return updatedData;
    });
  }, [addedTests]);

 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const getCurrentDate = () => {
      const now = new Date();
      return now.toISOString().split("T")[0];
    };

    // Separate entries with and without medicines
    const medicines = medicineData.filter(
      (item) => item.medicineName.trim() !== ""
    );
    const testsOnly = medicineData.filter(
      (item) => item.medicineName.trim() === "" && item.test?.trim() !== ""
    );

    if (medicines.length === 0 && testsOnly.length === 0) {
      return dispatch(setError("Please add at least one medicine or test."));
    }

    // Validation for medicines
    if (medicines.length > 0) {
      // Check if each medicineName exists in the database
      const medicineNamesInArray = isMedInDb.map(
        (item: { Medicine_Name: string }) => item.Medicine_Name
      );

      const medicineNameExists = medicines.some(
        (each) => !medicineNamesInArray.includes(each?.medicineName)
      );

      if (medicineNameExists) {
        return dispatch(setError("Select a medicine name from the options"));
      }

      // Check for duplicate entries
      const isDuplicateEntry = medicines?.some((newMedicine) => {
        const duplicate = prescriptionList?.find((existingMedicine) => {
          const startDate = new Date(existingMedicine.medicineStartDate);
          const newStartDate = new Date(
            newMedicine.medicineStartDate || getCurrentDate()
          );

          // Calculate the end date based on duration
          const existingEndDate = new Date(startDate);
          existingEndDate.setDate(
            existingEndDate.getDate() +
              parseInt(existingMedicine.medicineDuration || "0") -
              1
          );

          // Check for overlapping dates and matching medicine name and time
          const isDateOverlap =
            newStartDate >= startDate && newStartDate <= existingEndDate;

          const isTimeOverlap = existingMedicine.medicineTime
            .split(",")
            .some((existingTime) =>
              newMedicine.medicationTime
                .split(",")
                .some((newTime: any) => existingTime.trim() === newTime.trim())
            );

          return (
            existingMedicine.status === 1 &&
            existingMedicine.medicine === newMedicine.medicineName &&
            Number(existingMedicine.medicineType) ===
              newMedicine.medicineType &&
            isDateOverlap &&
            isTimeOverlap
          );
        });

        if (duplicate) {
          duplicateDetails = {
            medicine: duplicate.medicine,
            medicineTime: duplicate.medicineTime,
          };
          return true;
        }

        return false;
      });

      if (isDuplicateEntry && duplicateDetails) {
        return dispatch(
          setError(
            `A prescription with the same medicine ${duplicateDetails.medicine} and time of medication ${duplicateDetails.medicineTime} already exists within the specified duration.`
          )
        );
      }

      // Validation for medicines
      medicines.find((med) => {
        if (med.medicineType === 0) {
          dispatch(setError("Please select MedicineType"));
          return;
        }
        if (med.doseCount === 0) {
          dispatch(setError("Please Enter dosage Positive Number"));
          return;
        }
        if (!med.doseUnit || med.doseUnit.trim() === "") {
          dispatch(setError("Please select a valid dosage unit."));
          return;
        }
        if (!med.daysCount || med.daysCount <= 0) {
          dispatch(
            setError("Please enter a positive number for the number of days.")
          );
          return;
        }

        if (
          !med.medicationTime ||
          med.medicationTime.split(",").length <
            (parseInt(med.Frequency.toString()) || 0)
        ) {
          dispatch(
            setError(`Please Select ${med.Frequency} Time of Medication`)
          );
          return;
        }

        if (
          med.medicationTime.split(",").length >
            parseInt(med.Frequency.toString() || "0") &&
          !med.medicationTime.includes("As Per Need")
        ) {
          dispatch(
            setError(
              `Please Select ${finalData[0].medicineFrequency} Time of Medication`
            )
          );
          return;
        }
      });
    }

    // Map the data for API submission
    const finalData = medicineData.map((el) => ({
      timeLineID: timeline.id,
      patientID: timeline.patientID,
      userID: user.id,
      medicineType: el.medicineType?.toString(),
      medicine: el.medicineName,
      medicineDuration: el.daysCount?.toString(),
      meddosage: el.doseCount || 0,
      medicineFrequency: el.Frequency.toString(),
      medicineTime: el.medicationTime,
      test: el.test,
      advice: el.advice,
      followUp: el.followUp,
      followUpDate: el.followUpDate,
      medicineStartDate: el.medicineStartDate || getCurrentDate(),
      dosageUnit: el.doseUnit,
    }));

    // Ensure at least one test or medicine is present
    if (finalData.every((item) => !item.medicine && !item.test)) {
      return dispatch(setError("Please add at least one test or medicine."));
    }

    // Handle the API call
    const copy = copyData === "true";
    console.log("finalData=", finalData, copy);

    try {
      const response = await authPost(
        `prescription/${user.hospitalID}?copy=${copy}`,
        { finalData },
        user.token
      );

      handleClose();
      updateLatestData("update");

      if (response.message === "success") {
        dispatch(setSuccess("Medicine successfully added"));
        setMedicineData([medicineInitialState]);
        setNewMedicineList(response.prescriptions);
      } else {
        dispatch(setError(response.message));
      }
    } catch (error) {
      dispatch(setError("An error occurred while adding the prescription."));
    }
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);

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

  const mapPrefillDataToMedicineData = (data: any[]) =>
    data.map((item) => ({
      ...medicineInitialState,
      medicineType: item?.medicineType || "",
      medicineName: item?.medicine || "",
      daysCount: item?.medicineDuration || 0,
      doseCount: item?.meddosage || 0,
      Frequency: Number(item?.medicineFrequency) || 1,
      medicationTime: item?.medicineTime || "",
      doseUnit: item?.dosageUnit || "",
      advice: item?.advice || "",
      test: item?.test || "",
      notes: item?.medicineNotes || "",
      followUp: item?.followUp || 0,
      followUpDate: item?.followUpDate || "",
      medicineStartDate: item?.medicineStartDate || "",
    }));

  type MedicineItem = {
    Medicine_Name: string;
  };

  const [isMedInDb, setIsMedInDb] = useState<MedicineItem[]>([]);

  // const [medicineData, setMedicineData] = React.useState(() => {
  //   // Initialize with prefillData if available, otherwise use the default state
  //   return prefillData?.length > 0
  //     ? mapPrefillDataToMedicineData(prefillData)
  //     : [medicineInitialState];
  // });
  const [medicineData, setMedicineData] = React.useState([
    medicineInitialState,
  ]);

  const medicineCategoryList: Array<keyof medicineCategoryType> = Object.keys(
    medicineCategory
  ) as Array<keyof medicineCategoryType>;

  const fetchMedicineList = async (text: string, index: number) => {
    if (text.length >= 1) {
      const response = await authPost(
        `medicine/${user.hospitalID}/getMedicines`,
        { text },
        user.token
      );

      if (response.message === "success") {
        // Update the previous medicines with the new fetched medicines
        setIsMedInDb((prevMed) => {
          // Merge the previous medicines and the new response
          const updatedMedicines = [...prevMed, ...response.medicines];
          return updatedMedicines;
        });
        setMedicineData((prev) => {
          const newData = [...prev];
          newData[index].medicineList = response.medicines?.map(
            (medicine: { Medicine_Name: string }) => medicine.Medicine_Name
          );
          return newData;
        });
      }
    }
  };

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
      if (medicine.medicineType == 0) return;
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

  async function getAllTestList(text: string) {
    const response = await authPost(`data/lionicCode/${user.hospitalID}`, { text }, user.token);
    if (response.message === "success") {
      const testData: { LOINC_Name: string }[] = response.data as {
        LOINC_Name: string;
      }[];
      const uniqueTests = Array.from(
        new Set(testData.map((el) => el.LOINC_Name))
      );
      const filteredTests = uniqueTests.filter((test) =>
        test.toLowerCase().startsWith(text.toLowerCase())
      );
      setTestList(filteredTests);
    }
  }

  const formatDateToYYYYMMDD = (dateString: string) => {
    const date = new Date(dateString);

    // Get the local date parts: year, month, day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so we add 1
    const day = String(date.getDate()).padStart(2, "0"); // Ensures day is two digits

    return `${year}-${month}-${day}`; // Returns the date in YYYY-MM-DD format
  };

  const handleAddMore = () => {
    setMedicineData((prevData) => [
      ...prevData,
      {
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
      },
    ]);
  };

 

  const handleMedicationTimeClick = (index: number, each: string) => {
    setMedIndex(index);
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

  useEffect(() => {
    if (medIndex >= 0) {
      setMedicineData((prevData) => {
        const newData = [...prevData];
        if (newData[medIndex] && medicationTime.includes("As Per Need")) {
          newData[medIndex] = {
            ...newData[medIndex],
            Frequency: 1,
            daysCount: 0,
            medicationTime: "As Per Need",
          };
        } else {
          newData[medIndex] = {
            ...newData[medIndex],
            medicationTime: medicationTime.join(","),
          };
        }
        return newData;
      });
    }
  }, [medicationTime, medIndex]);

  const handleCopyPrescription = () => {
    const copyPrescription = prescriptionList?.filter((e) => e.status === 1);
    const mappedData = mapPrefillDataToMedicineData(copyPrescription).filter(
      (item) => item.medicineName.trim() !== ""
    ); // Filter out items without medicineName

    setMedicineData(mappedData);
    const filteredPrescriptions = copyPrescription?.filter(
      (item) => item.test?.trim() !== ""
    );
    // Extract all test data and combine into `addedTests`
    const allTests = filteredPrescriptions
      .map(
        (item) => item.test?.split("#").map((test: string) => test.trim()) || []
      )
      .flat();

    setAddedTests(allTests);
    // setMedicineData(mapPrefillDataToMedicineData(copyPrescription));
    setCopyData("true");
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            debouncedHandleSubmit(e);
          }}
        >
          <DialogTitle>Add Prescription</DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              mt: 2,
              pl: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handleCopyPrescription}
              // disabled={!prescriptionList.some((e) => e.status === 1)}
              disabled={
                !prescriptionList.some((e) => e.status === 1 && (e.medicine.trim() !== "" ))
              }
            >
              Copy Prescription
            </Button>
          </Box>

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
                  {/* Add Delete Button */}

                  {medicineData?.length > 1 && (
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <IconButton
                        color="error"
                        onClick={() => {
                          setMedicineData((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                        size="small"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Grid>
                  )}

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
                  {/* {medicine.medicineType === 10 && (
                  <VentilationForm index={index} medicine={medicine} />
                )} */}

                  <Grid xs={8} item>
                    <Autocomplete
                      freeSolo
                      value={medicine.medicineName}
                      onChange={(_, newValue: string | null) => {
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
                        fetchMedicineList(newInputValue, index);
                      }}
                      options={medicine.medicineList || []} // Provide all options initially
                      // Custom filter options based on input value
                      filterOptions={(options, { inputValue }) => {
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
                          //required
                          helperText={medicine.medicineList?.length ? "" : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid xs={4} item>
                    <TextField
                      label={"Dosage"}
                      type="number"
                      inputProps={{ min: 0 }}
                      placeholder="Enter Dose"
                      value={medicineData[index].doseCount}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const newValue = parseFloat(event.target.value);
                        // if (newValue < 1) {
                        //   dispatch(setError("Please Enter Positive Number"));
                        //   return;
                        // }

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
                        // required
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
                      inputProps={{ min: 0 }}
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
                  {/* ==============medication time============ */}
                  <React.Fragment key={index}>
                    <Grid xs={12} style={{ display: "flex" }} item>
                      <FormControl fullWidth required>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "gray",
                            fontWeight: "100",
                          }}
                          id={`demo-multiple-select-label-${index}`}
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
                                color: medicine?.medicationTime.includes(each)
                                  ? "white"
                                  : "gray",
                              }}
                              variant={
                                medicine?.medicationTime.includes(each)
                                  ? "contained"
                                  : "outlined"
                              }
                              onClick={() =>
                                handleMedicationTimeClick(index, each)
                              }
                            >
                              {each}
                            </Button>
                          ))}
                        </Grid>
                      </FormControl>
                    </Grid>
                  </React.Fragment>
                  {/* <DoseComponent
                    length={1}
                    setMedicineData={setMedicineData}
                    index={index}
                    medicineData={medicineData}
                  /> */}

                  <Grid xs={6} item>
                    <TextField
                      label={"Days"}
                      fullWidth
                      type="number"
                      disabled={
                        medicineData[index].medicationTime.includes(
                          "As Per Need"
                        )
                          ? true
                          : false
                      }
                      inputProps={{ min: 0 }}
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
                      // value={medicine.medicineStartDate}
                      value={
                        medicine?.medicineStartDate
                          ? formatDateToYYYYMMDD(medicine?.medicineStartDate) // Adjust for timezone
                          : ""
                      }
                      inputProps={{
                        min: new Date().toISOString().split("T")[0],
                      }}
                    />
                  </Grid>

                  <p
                    style={{ width: "100%", borderTop: "1px solid black", margin:'10px' }}
                  ></p>

                  {medicineData.length === index + 1 && (
                    <>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 1 }}
                          onClick={handleAddMore}
                        >
                          Add More
                        </Button>
                      </Grid>
                    </>
                  )}

                  {medicineData.length - 1 === index && (
                    <>
                      {/* ======test============start================ */}

                      <Grid item xs={8}>
                        <Autocomplete
                          freeSolo
                          value={searchTest || ""} // Bind to a separate state for the search input
                          onInputChange={(_, newInputValue) => {
                            setSearchTest(newInputValue || ""); // Update only the search input
                            getAllTestList(newInputValue); // Trigger API to fetch test options
                          }}
                          // options={testList.filter(
                          //   (test) =>
                          //     !medicineData[index]?.test?.split("#").includes(test)
                          // )}
                          options={testList.filter(
                            (test) => !addedTests.includes(test)
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Test"
                              placeholder="Enter 3 letters for search"
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{ mt: 1 }}
                          // onClick={() => {
                          //   if (searchTest) {
                          //     // Update the medicineData state
                          //     setMedicineData((prev) =>
                          //       prev.map((medicine, i) => {
                          //         if (i === index) {
                          //           const existingTests = medicine.test
                          //             ? medicine.test.split("#")
                          //             : [];
                          //           if (!existingTests.includes(searchTest)) {
                          //             existingTests.push(searchTest);
                          //           }
                          //           return {
                          //             ...medicine,
                          //             test: existingTests.join("#"),
                          //           };
                          //         }
                          //         return medicine;
                          //       })
                          //     );
                          //     // Clear the search input field after adding
                          //     setSearchTest("");
                          //   }
                          // }}

                          onClick={() => {
                            if (
                              searchTest &&
                              !addedTests.includes(searchTest)
                            ) {
                              // Add the test to the addedTests array
                              setAddedTests((prevTests) => [
                                ...prevTests,
                                searchTest,
                              ]);
                              // Clear the test input field
                              setSearchTest("");
                              setMedicineData((prev) => {
                                // Create a copy of the current medicineData
                                const newData = [...prev];

                                // Check if there are any medicines in the list
                                if (newData.length > 0) {
                                  // Get the last medicine entry
                                  const lastMedicine =
                                    newData[newData.length - 1];

                                  // Update the `test` field for the last medicine
                                  const existingTests = lastMedicine.test
                                    ? lastMedicine.test.split("#")
                                    : [];
                                  if (!existingTests.includes(searchTest)) {
                                    existingTests.push(searchTest);
                                  }

                                  // Assign the updated tests back to the last medicine
                                  lastMedicine.test = existingTests.join("#");
                                }

                                return newData; // Return the updated medicine data
                              });
                            }
                          }}
                        >
                          Add
                        </Button>
                      </Grid>

                      {/* Display the added tests */}
                     
                      <Grid item xs={12}>
                        <Stack
                          direction="row"
                          spacing={1}
                          rowGap={2}
                          sx={{ mt: "10px" }}
                          flexWrap={"wrap"}
                        >
                          {addedTests.map((test: string, idx: number) => (
                            <Chip
                              key={idx}
                              label={test}
                              onDelete={() => {
                                // Remove the test from the addedTests array
                                setAddedTests((prevTests) =>
                                  prevTests.filter((_, index) => index !== idx)
                                );
                              }}
                              sx={{
                                backgroundColor: "#f1f1f1", // Light background color
                                color: "black", // Text color for visibility
                                padding: "6px 12px", // Optional padding to make it more clickable
                              }}
                            />
                          ))}
                        </Stack>
                      </Grid>

                      {/* test============end================ */}

                      <Grid item xs={12}>
                        <TextField
                          id="outlined-required"
                          label="Advice"
                          value={
                            copyData === "true"
                              ? medicineData[0]?.advice
                              : medicine?.advice
                          }
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
                            value={
                              copyData === "true"
                                ? medicineData[0]?.followUp
                                : medicine?.followUp
                            }
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
                          disabled={
                            copyData === "true"
                              ? !medicineData[0]?.followUp
                              : !medicine?.followUp
                          }
                          onChange={(e) => {
                            setMedicineData((prev) => {
                              const newData = [...prev];
                              newData[index].followUpDate = e.target.value;
                              return newData;
                            });
                          }}
                          type="date"
                          value={
                            copyData === "true"
                              ? medicineData[0].followUpDate
                                ? new Date(medicineData[0].followUpDate)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                              : medicine.followUpDate
                              ? new Date(medicine.followUpDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          inputProps={{
                            min: new Date().toISOString().split("T")[0],
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              );
            })}

            <p style={{ width: "100%", borderTop: "1px solid black" ,marginTop:'10px'}}></p>
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
