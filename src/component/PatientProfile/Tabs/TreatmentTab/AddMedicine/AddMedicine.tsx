import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MedicineType } from "../../../../../types";
import {
  CPRData,
  VentilatorData,
  TimeUnit,CentralLineData,UrinaryCatheterData
} from "../../../../../interfaces/procedures";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import styles from "../TreatmentTab.module.scss";
import { selectCurrentUser } from "../../../../../store/user/user.selector";
import { selectTimeline } from "../../../../../store/currentPatient/currentPatient.selector";
import { authPost } from "../../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../../../utility/debounce";
import {
  medicineCategory,
  medicineCategoryType,
} from "../../../../../utility/medicine";
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../../../../../store/error/error.action";
import { useMedicineListStore } from "../../../../../store/zustandstore";
import {
  Checkbox,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  FormControl,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import VentilatorScreenMeasurementCard from "./VentilatorScreenMeasurementCard";
import ScreenForUrinaryCentralLineCatheter from "./ScreenForUrinaryCentralLineCatheter";
import monitoring from "../../../../../assets/treatmentPlan/procedures/ventilator/monitoring.png";
import treatmentPlanBanner from "../../../../../assets/treatmentPlan/treatmentPlanBanner.png";
import MedicationTime from "./MedicationTime";
import SelectComponent from "./SelectComponent";
import {
  dailyMaintainanceCheckList,
  initialDailyMaintainanceCheckListUrinaryCatheter,
  initialProcedureSpecificChecklist,
  initialProcedureSpecificChecklistUrinaryCatheter,
  // initialUrinaryCheckList,
  proceduresOptions,
  ventilationModes,
  ventilatorCheckboxOptions,
  measurementConfig,
  modeConfig,
  timeUnits,
} from "./constant";
import CPRComponent from "./CPRComponent"

type MedicineDialogType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTimeline: React.Dispatch<React.SetStateAction<boolean>>;
  handleLatestMedUpdate?: (medicine: any) => void; // Optional prop
  initialSection?:"addmedicine" | "procedure"
};

export default function AddMedicine({
  open,
  setOpen,
  setIsTimeline,
  handleLatestMedUpdate,
  initialSection
}: MedicineDialogType) {
  const timeline = useSelector(selectTimeline);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const { setNewMedicineList } = useMedicineListStore();
  const [, setDisableAddMedicine] = React.useState(true);

  const handleClose = () => {
    setMedicineData([medicineInitialState]);
    setProcedure("");
    setTreatmentPlan(initialSection);
    setOpen(false);
    setCprData(CPRDataInitialState);
    setVentilatorData(initialVentilatorData);
    // setCentralLineCheckList(dailyMaintainanceCheckList);
    // setpocedureSpecicficList(initialProcedureSpecificChecklist)
    // setProcedureSpecificChecklistUrinaryCatheter(initialProcedureSpecificChecklistUrinaryCatheter)
    // seturinarycheckList(initialUrinaryCheckList);
    // setCatheterList(initialDailyMaintainanceCheckListUrinaryCatheter);
    setCentralLineData(initialCentralLineData)
    setUrinaryCatheterData(initialUrinaryCatheterData)
  };

  console.log(initialSection,"initial")

  const onClickHandleBack = () => {
    setProcedure("");
    setTreatmentPlan(initialSection);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const getCurrentTime = () => {
      const now = new Date();
      return now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const finalData = medicineData.map((el) => ({
      timeLineID: timeline.id,
      patientID: timeline.patientID,
      userID: user.id,
      medicineType: el.medicineType,
      medicineName: el.medicineName,
      daysCount: el.daysCount || 1,
      doseCount: el.doseCount || 0,
      Frequency: el.Frequency,
      medicationTime: el.medicationTime,
      doseTimings: getCurrentTime(),
      notes: el.notes,
    }));

    if (finalData[0]?.medicineType == 0) {
      dispatch(setError("Please select MedicineType"));
      return;
    }
    if (
      !finalData[0] ||
      finalData[0].medicationTime?.split(",").length <
        (finalData[0].Frequency ?? 0)
    ) {
      dispatch(setError("Please select Time of Medication"));
      return;
    }

    if (
      !finalData[0] ||
      finalData[0].medicationTime.split(",").length >
        (finalData[0].Frequency ?? 0)
    ) {
      if (!finalData[0].medicationTime.includes("As Per Need")) {
        dispatch(
          setError(`Please Select ${finalData[0].Frequency} Time of Medication`)
        );
        return;
      }
    }

    const response = await authPost(
      `medicine`,
      { medicines: finalData },
      user.token
    );

    if (response.message === "success") {
      dispatch(setSuccess("Medicine successfully added"));
      setMedicineData([medicineInitialState]);
      setNewMedicineList(response.medicines);
      // Update the latest medicine through the prop
      handleLatestMedUpdate?.(response.medicines);

      setIsTimeline(false);
      handleClose();
    } else {
      dispatch(setError(response.message));
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
  };

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
    const previousMedicine = medicineData?.slice(-1)[0];
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

  const [treatmentPlan, setTreatmentPlan] = useState(initialSection);
  const [procedureSelected, setProcedure] = useState("");

  // const handleDropDownOption = (event: any) => {
  //   setTreatmentPlan(event.target.value);
  //   setProcedure("");
  // };

  useEffect(() => {
    setTreatmentPlan(initialSection);
  }, [initialSection]);
  const onChangeProcedure = (event: any) => {
    setProcedure(event.target.value);
  };

  // handling CPR data
  const CPRDataInitialState: CPRData = {
    customCPR: false,
    cprDuration: "",
    cprNote: "",
  };
  const [cprData, setCprData] = useState<CPRData>(CPRDataInitialState);
  const handleChangeForCPR = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setCprData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const initialVentilatorData: VentilatorData = {
    duration: 0,
    durationFormat: "",
    selectedMode: "",
    checkedItems: ventilatorCheckboxOptions.map(() => false),
    showOptionsForCheckbox: false,
    ventilatorMeasurements: {
      FIO2: 0,
      IFR: 0,
      tidalVolume: 0,
      PSL: 0,
      RR: 0,
      PEEP: 0,
      LPL: 0,
      HPL: 0,
      THP: 0,
      TLP: 0,
      TMV: 0,
      PIP: 0,
    },
  };

  const [ventilatorData, setVentilatorData] = useState<VentilatorData>(
    initialVentilatorData
  );

  const handleVentilatorCheckboxChange = (index: number) => {
    setVentilatorData((prevData: VentilatorData) => {
      const newCheckedItemsInVentilator = [...prevData.checkedItems];
      newCheckedItemsInVentilator[index] = !newCheckedItemsInVentilator[index];

      const updatedData = {
        ...prevData,
        checkedItems: newCheckedItemsInVentilator,
      };
      return updatedData;
    });
  };

  const handleChange = (
    title: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value === "" ? 0 : Number(event.target.value);
    setVentilatorData((prevState: VentilatorData) => ({
      ...prevState,
      ventilatorMeasurements: {
        ...prevState.ventilatorMeasurements,
        [title]: newValue,
      },
    }));
  };

  const handleVentilatorParameterChange = (event: any) => {
    const { name, value } = event.target;
    if (name == "duration") {
      const checkDuration = parseInt(value);
      setVentilatorData((prevData) => ({
        ...prevData,
        [name]: checkDuration,
      }));
    } else {
      setVentilatorData((prevData: VentilatorData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCheckBoxShowOrNot = () => {
    setVentilatorData((prevData: VentilatorData) => ({
      ...prevData,
      showOptionsForCheckbox: !prevData.showOptionsForCheckbox,
    }));
  };

  // handling central line Inseration and Urinary catheter Insertion 
  const initialCentralLineData: CentralLineData = {
    patientPreparation: "",
    insertionSite: "",
    lumenType: "",
    localAnesthesiaGuidewireInsertion: "",
    dailyChecklistItems: dailyMaintainanceCheckList,
    procedureSpecificCheckList: initialProcedureSpecificChecklist,
    days:0 
  };
  const initialUrinaryCatheterData: UrinaryCatheterData = {
    catheterSizes: "",
    typesOfUrinaryCatheter: "",
    patientPositioningAsepticSetup: "",
    dailyChecklistItems: initialDailyMaintainanceCheckListUrinaryCatheter,
    procedureSpecificCheckList: initialProcedureSpecificChecklistUrinaryCatheter,
    days:0
  };

  const [centralLineData, setCentralLineData]= useState<CentralLineData>(initialCentralLineData)
  const [urinaryCatheterData, setUrinaryCatheterData] = useState<UrinaryCatheterData>(initialUrinaryCatheterData)
  console.log(centralLineData, "data")
  const handleCentralLineChange = (field: keyof CentralLineData, value: string) => {
    setCentralLineData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleDaysChange = (value:number) => {
    setCentralLineData((prevData) => ({
      ...prevData,
      days: value,
    }));
  };
  
  const handleCentralLineCheckboxChange = (id: number) => {
    setCentralLineData((prevData) => ({
      ...prevData,
      dailyChecklistItems: prevData.dailyChecklistItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
      procedureSpecificCheckList: prevData.procedureSpecificCheckList.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  


  //for urinary catheter data
  const handleUrinaryCatheterChange = (field: keyof UrinaryCatheterData, value: string) => {
    setUrinaryCatheterData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
 
  const handleDaysChangeUrinary = (value:number) => {
    setUrinaryCatheterData((prevData) => ({
      ...prevData,
      days: value,
    }));
  };
  const handleUrinaryCatheterCheckboxChange = (id: number) => {
    setUrinaryCatheterData((prevData) => ({
      ...prevData,
      dailyChecklistItems: prevData.dailyChecklistItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
      procedureSpecificCheckList: prevData.procedureSpecificCheckList.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  // const [centralLineCheckList, setCentralLineCheckList] = useState(
  //   dailyMaintainanceCheckList
  // );
  // const [pocedureSpecicficList,setpocedureSpecicficList] = useState(initialProcedureSpecificChecklist)
  // const [procedureSpecificChecklistUrinaryCatheter, setProcedureSpecificChecklistUrinaryCatheter] = useState(initialProcedureSpecificChecklistUrinaryCatheter)
  // const [urinarychecklist, seturinarycheckList] = useState(
  //   initialUrinaryCheckList
  // );

  // const [catheterList, setCatheterList] = useState(initialDailyMaintainanceCheckListUrinaryCatheter);

  // const handleCheckboxChange = (id: number) => {
  //   if (procedureSelected === "Urinary Catheter Insertion") {
  //     setCatheterList((prevChecklist) => {
  //       const updatedChecklist = prevChecklist.map((item) =>
  //         item.id === id ? { ...item, checked: !item.checked } : item
  //       );
  //       return updatedChecklist;
  //     });
  //     setProcedureSpecificChecklistUrinaryCatheter((prevChecklist)=> {
  //       const updatedChecklist = prevChecklist.map((item)=> 
  //       item.id===id ? {...item, checked:!item.checked}: item );
  //       return updatedChecklist
  //     })
  //   } else if (procedureSelected === "Central Line Insertion") {
  //     setCentralLineCheckList((prevChecklist) => {
  //       const updatedChecklist = prevChecklist.map((item) =>
  //         item.id === id ? { ...item, checked: !item.checked } : item
  //       );
       
  //       return updatedChecklist;
  //     });

  //     setpocedureSpecicficList((prevChecklist) => {
  //       const updatedChecklist = prevChecklist.map((item) =>
  //         item.id === id ? { ...item, checked: !item.checked } : item
  //       );
  //       return updatedChecklist;
  //     });
  //   } else if (procedureSelected === "Urinary check list") {
  //     seturinarycheckList((prevChecklist) => {
  //       const updatedChecklist = prevChecklist.map((item) =>
  //         item.id === id ? { ...item, checked: !item.checked } : item
  //       );
  //       return updatedChecklist;
  //     });
  //   }
    
  // };

  useEffect(() => {
    setVentilatorData((prevData) => {
      let { durationFormat, duration } = prevData;

      // Extract the unit (Hour, Day, Week) from durationFormat
      let unit = durationFormat.replace(/s$/, ""); // Remove trailing 's' if exists

      // Update based on duration
      let updatedFormat = duration === 1 ? unit : `${unit}s`;

      // Prevent unnecessary updates
      if (durationFormat === updatedFormat) return prevData;

      return { ...prevData, durationFormat: updatedFormat };
    });
  }, [ventilatorData.duration]);

  const commonMenuProps = {
    PaperProps: {
      sx: {
        py: 0, // Ensures no extra padding at the top/bottom of the dropdown
        borderRadius: "10px",
      },
    },
    MenuListProps: {
      sx: {
        py: 0, // Removes extra padding from the dropdown list itself
      },
    },
  };

  // Based on selection of modes ventilator screen cards will be displayed
  const selectedModeCardsDisplay = (selectedMode: string) => {
    const measurements =
      modeConfig[selectedMode as keyof typeof modeConfig] || [];
    return measurements.map((key) => {
      const measurement = measurementConfig.find((item) => item.key == key);

      return (
        measurement && (
          <VentilatorScreenMeasurementCard
            key={measurement.key}
            title={measurement.title}
            unit={measurement.unit}
            imageSrc={measurement.imageSrc}
            altText={measurement.altText || "Default Alt Text"}
            value={ventilatorData.ventilatorMeasurements[measurement.key]}
            onChange={(event) => handleChange(measurement.key, event)}
            style={styles.ventilator_each_card_design}
            bgColor={measurement.bgColor}
          />
        )
      );
    });
  };

  //dynamically changing timings singular or plural
  const getDurationLabel = (duration: number, unit: TimeUnit) =>
    duration > 1 ? unit.plural : unit.singular;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: procedureSelected == "Ventilator Management" ? "72%" : "900px",
          maxWidth: "90%",
        },
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          debouncedHandleSubmit(e);
        }}
      >
        {!procedureSelected && (
          <DialogContent
            sx={{
              minHeight: treatmentPlan !== "addmedicine" ? "600px" : "",
              minWidth: procedureSelected == "Ventilator Management" ? "1000px" : "800px",
            }}
          >
            <Box display="flex" alignItems="center">
              <h3
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginLeft: "35%",
                  fontSize: "25px",
                }}
              >
                {initialSection=="addmedicine"? "Medication Plan" : "Procedures Plan"}
              </h3>
              <img
                src={treatmentPlanBanner}
                className={styles.backgroundImage}
              />
            </Box>

            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
              style={{ marginTop: "50px" }}
            >
              {/* <Grid item xs={treatmentPlan === "procedure" ? 4 : 12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="demo-treatment-plan-type">
                    Treatment Plan Type
                  </InputLabel>

                  <Select
                    onChange={handleDropDownOption}
                    label="Treatment Plan Type"
                    value={treatmentPlan}
                    fullWidth
                    MenuProps={commonMenuProps}
                    sx={{
                      borderRadius: "2px",
                      "& .MuiSelect-icon": {
                        color: "#1977F3",
                      },
                    }}
                  >
                    <MenuItem
                      value="procedure"
                      style={{
                        borderBottom: "1px solid #A19F9F",
                        padding: "15px",
                        paddingLeft: "25px",
                      }}
                    >
                      Procedures
                    </MenuItem>
                    <MenuItem
                      value="addmedicine"
                      style={{ padding: "15px", paddingLeft: "25px" }}
                    >
                      Medications
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}

              {treatmentPlan === "procedure" && (
                <Grid item xs={12}>
                  <SelectComponent label ="Select Procedures" 
                      name = "procedure" 
                      value = {procedureSelected} 
                      MenuProps={commonMenuProps}
                      onChange= {onChangeProcedure}
                      options={proceduresOptions}

                  />
                  
                </Grid>
              )}
            </Grid>
          </DialogContent>
        )}

        {procedureSelected === "Cardiopulmonary Resuscitation (CPR)" && (
          // when CPR is selected
          <CPRComponent procedureSelected={procedureSelected}
              handleProcedure={onChangeProcedure}
              proceduresOptions= { proceduresOptions} 
              commonMenuProps={commonMenuProps} 
              cprData={cprData} 
              handleChangeForCPR={handleChangeForCPR}  />
          
        )}

        {procedureSelected === "Ventilator Management" && (
          <DialogContent sx={{ minHeight: "500px" }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              style={{ marginBottom: "20px" }}
            >
              <h3
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginLeft: "40%",
                }}
              >
                Add Ventilator Parameters
              </h3>
            </Box>

            <Grid
              container
              spacing={2}
              alignItems="flex-start"
              justifyContent="space-between"
              style={{
                display: "flex",
                flexWrap: "nowrap",
                width: "100%",
                margin: "0 auto",
              }}
            >
              <Grid
                container
                item
                spacing={1}
                xs={9}
                direction="row"
                alignItems="center"
              >
                <Grid item xs={5}>
                    <SelectComponent  label = "Treatment Type" 
                    name = "procedure" 
                    value ={procedureSelected} 
                    onChange= {onChangeProcedure} 
                    options={proceduresOptions}
                    MenuProps= {commonMenuProps}
                  />         
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Duration"
                    type="number"
                    onChange={handleVentilatorParameterChange}
                    value={ventilatorData.duration}
                    name="duration"
                    defaultValue={0}
                    inputProps={{
                      min: 0,
                      step: 1,
                      style: { fontSize: "16px" },
                    }}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl variant="outlined" fullWidth required>
                    <InputLabel id="Duration-type-label">
                      Duration Type
                    </InputLabel>
                    <Select
                      labelId="Duration-type-label"
                      label="Duration Type"
                      name="durationFormat"
                      onChange={handleVentilatorParameterChange}
                      MenuProps={commonMenuProps}
                      value={ventilatorData.durationFormat}
                    >
                      {timeUnits.map((unit, index) => (
                    <MenuItem key={index} value={getDurationLabel(ventilatorData.duration, unit)}>
                      {getDurationLabel(ventilatorData.duration, unit)}
                    </MenuItem>
                  ))}
                             
                    </Select>
                  </FormControl>
                </Grid>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#000000",
                    marginTop: "35px",
                  }}
                >
                  Select the Mode
                </p>
                <RadioGroup
                  row
                  name="selectedMode"
                  onChange={handleVentilatorParameterChange}
                  value={ventilatorData.selectedMode || ""}
                >
                  <Grid container spacing={1}>
                    {[0, 1].map((col) => (
                      <Grid item xs={5} key={col}>
                        {ventilationModes
                          .slice(col * 3, col * 3 + 3)
                          .map((mode: any) => (
                            <FormControlLabel
                              key={mode}
                              value={mode}
                              control={
                                <Radio
                                  sx={{
                                    "& .MuiSvgIcon-root": { color: "#FF9900" }, // Applies yellow to the radio icon
                                    "&.Mui-checked .MuiSvgIcon-root": {
                                      color: "#FF9900",
                                    }, // Ensures checked state is yellow
                                  }}
                                />
                              }
                              label={mode}
                              sx={{
                                color:
                                  ventilatorData.selectedMode === mode
                                    ? "#1977F3"
                                    : "default",
                              }}
                            />
                          ))}
                      </Grid>
                    ))}
                    <Grid
                      item
                      xs={2}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={monitoring}
                        alt="select mode background image"
                        className={styles.background_monitor}
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>

                {/* showing selected cards here by calling function */}
                <div style={{ height: "400px", padding: "15px" }}>
                  {ventilatorData.selectedMode && (
                    <ul className={styles.unorder_list_selection_mode}>
                      {selectedModeCardsDisplay(ventilatorData.selectedMode)}
                    </ul>
                  )}
                </div>
              </Grid>

              {!ventilatorData.showOptionsForCheckbox && (
                <Grid item>
                  <Box
                    sx={{
                      height: "40rem",
                      width: "1px",
                      borderRight: "2px solid #ccc",
                    }}
                  />
                </Grid>
              )}

              <Grid
                item
                xs={ventilatorData.showOptionsForCheckbox ? 4 : 3} // Dynamically change width
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginLeft: "5px",
                }}
              >
                <div
                  className={styles.preventionCheckList}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTopLeftRadius:"12px", 
                    borderTopRightRadius:"12px",
                    color: ventilatorData.showOptionsForCheckbox ? "white" : "",
                    backgroundColor: ventilatorData.showOptionsForCheckbox
                      ? "#3DA39C"
                      : "transparent",
                  }}
                >
                  <p
                    className={styles.bundle_prevention_text}
                    style={{
                      color: ventilatorData.showOptionsForCheckbox
                        ? "white"
                        : "black",
                    }}
                  >
                    VAP Prevention Bundle Checklist
                  </p>
                  <Checkbox
                    checked={ventilatorData.showOptionsForCheckbox}
                    onChange={handleCheckBoxShowOrNot}
                    name="showOptionsForCheckbox"
                    size="small"
                    style={{ height: "50px" }}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        backgroundColor: ventilatorData.showOptionsForCheckbox
                          ? "white"
                          : "transparent",
                      },
                      "&.Mui-checked": {
                        color: "white", // Changes checkmark color when checked
                      },
                    }}
                  />
                </div>
                {ventilatorData.showOptionsForCheckbox && (
                  <div
                    style={{
                      fontSize: "11px",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "15px",
                      width: "30%",
                      height: "80%",
                      position: "absolute",
                      top: 165,
                    }}
                    className={styles.checkbox_options_main_container}
                  >
                    {ventilatorCheckboxOptions.map((label, index) => (
                      <div
                        key={index}
                        className={styles.checkbox_options_layout}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "14px",
                              width: "60%",
                              fontWeight: 400,
                            }}
                          >
                            {label}
                          </label>
                          <Checkbox
                            checked={
                              ventilatorData.checkedItems[index] || false
                            }
                            name="checkedItems"
                            onChange={() =>
                              handleVentilatorCheckboxChange(index)
                            }
                          />
                        </div>
                        <hr
                          style={{
                            width: "100%",
                            borderTop: "0.1px solid #918B8B",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Grid>
            </Grid>
          </DialogContent>
        )}
        {/* {procedureSelected === "Urinary check list" && (
          <ScreenForUrinaryCentralLineCatheter
            title="Urinary check list"
            checklistItems={urinarychecklist}
            procedureSelected={procedureSelected}
            onChangeProcedure={onChangeProcedure}
            onCheckboxChange={handleCheckboxChange}
            MenuProps={commonMenuProps}
          />
        )} */}

        {procedureSelected === "Central Line Insertion" && (
          <ScreenForUrinaryCentralLineCatheter
          title="Central Line Insertion"
          dailyChecklistItems={centralLineData.dailyChecklistItems}
          procedureSpecificCheckList={centralLineData.procedureSpecificCheckList}
          procedureSelected={procedureSelected}
          onChangeProcedure={onChangeProcedure}
          onCheckboxChange={handleCentralLineCheckboxChange}
          MenuProps={commonMenuProps}
          patientPreparation={centralLineData.patientPreparation}
          insertionSite={centralLineData.insertionSite}
          lumenType={centralLineData.lumenType}
          localAnesthesiaGuidewireInsertion={centralLineData.localAnesthesiaGuidewireInsertion}
          onFieldChange={(field, value) =>
            handleCentralLineChange(field as keyof CentralLineData, value)
          }
          days={centralLineData.days}
          onDaysChange={handleDaysChange}
          />
        )}

        {procedureSelected === "Urinary Catheter Insertion" && (
          <ScreenForUrinaryCentralLineCatheter
            title="Urinary Catheter Insertion"
            dailyChecklistItems={urinaryCatheterData.dailyChecklistItems}
            procedureSelected={procedureSelected}
            procedureSpecificCheckList= {urinaryCatheterData.procedureSpecificCheckList}
            onChangeProcedure={onChangeProcedure}
            onCheckboxChange={handleUrinaryCatheterCheckboxChange}
            MenuProps={commonMenuProps}
            catheterSizes={urinaryCatheterData.catheterSizes}
            typesOfUrinaryCatheter={urinaryCatheterData.typesOfUrinaryCatheter}
            patientPositioningAsepticSetup={urinaryCatheterData.patientPositioningAsepticSetup}
            onFieldChange={(field, value)=> handleUrinaryCatheterChange(field as keyof UrinaryCatheterData, value)}
            days={urinaryCatheterData.days}
            onDaysChange={handleDaysChangeUrinary}
          />
        )}

        {treatmentPlan === "addmedicine" && (
          <>
            <DialogContent>
              {medicineData.map((medicine, index) => {
                return (
                  <Grid
                    xs={12}
                    container
                    spacing={2}
                    sx={{ mt: "0px" }}
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
                                  ? "IV Line=="
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
                          fetchMedicineList(newInputValue, index);
                        }}
                        options={
                          medicine.medicineName && medicine.medicineList
                            ? medicine.medicineList.filter((e) =>
                                e
                                  .toLowerCase()
                                  .startsWith(
                                    medicine.medicineName.toLowerCase()
                                  )
                              )
                            : []
                        }
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
                        fullWidth
                        inputProps={{ min: 1 }}
                        placeholder="Enter Dose"
                        value={medicineData[index].doseCount}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const newValue = parseFloat(event.target.value);
                          if (newValue < 1) {
                            dispatch(setError("Please Enter Positive Number"));
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

                    <MedicationTime
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
                    <p
                      style={{
                        width: "100%",
                        borderTop: "1px solid black",
                        margin: "10px",
                      }}
                    ></p>
                  </Grid>
                );
              })}
            </DialogContent>
          </>
        )}

        <DialogActions
          style={{
            padding: "30px",
            width: procedureSelected == "Ventilator Management" || procedureSelected=="Central Line Insertion" || procedureSelected=="Urinary Catheter Insertion" ? "50%" : "",
          }}
          sx={{
            padding: "30px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              width: procedureSelected == "Ventilator Management" ? "95%" : "100%",
              justifyContent: "space-between",
            }}
          >
            {proceduresOptions.some((option) => option.procedureType === procedureSelected) ||
            treatmentPlan === "addmedicine" ? 
            
            (
              <Button
                variant="contained"
                onClick={onClickHandleBack}
                style={{
                  background: "#b4b5b6",
                  alignSelf: "flex-start",
                  color: "white",
                  visibility:"hidden"
                  
                }}
              >
                Back
              </Button>
            ) : 
            (
              <Button
                variant="contained"
                onClick={onClickHandleBack}
                style={{
                  background: "#b4b5b6",
                  alignSelf: "center",
                  color: "white",
                  visibility: "hidden", // Make it invisible but occupy space
                }}
              >
                Back
              </Button>
            )}
            <div
              style={{
                width: 210,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 30,
                marginRight: 20,
              }}
            >
              <Button
                onClick={handleClose}
                style={{
                  border:
                    procedureSelected == "Ventilator Management"
                      ? "1px solid #1977F3"
                      : "",
                  color:
                    procedureSelected == "Ventilator Management" ? "#1977F3" : "#5C5C5C",
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </div>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
}
