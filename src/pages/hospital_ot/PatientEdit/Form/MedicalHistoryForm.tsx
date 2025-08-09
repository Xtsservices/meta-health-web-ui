import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import Input from "@mui/material/Input";
// import InputAdornment from "@mui/material/InputAdornment";
// import SearchIcon from "@mui/icons-material/Search";
import { medicalHistoryFormType } from "../../../../types";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import { heriditaryList, infectionList } from "../../../../utility/list";
import { OutlinedInput } from "@mui/material";
// import
// const heartProblemList = ["Chills & Shivering", "Abdominal Pain"];
const addictionList = ["Alcohol", "Tobbaco", "Drugs"];
const mentalProblemList = [
  "Anxiety Disorders",
  "Mood Disorders",
  "Schizophrenia Spectrum and Other Psychotic Disorders",
  "Obsessive-Compulsive and Related Disorders",
  "Trauma- and Stressor-Related Disorders",
  "Dissociative Disorders",
  "Somatic Symptom and Related Disorders",
  "Feeding and Eating Disorders",
  "Sleep-Wake Disorders",
  "Substance-Related and Addictive Disorders",
  "Personality Disorders",
  "Neurodevelopmental Disorders",
  "Neurocognitive Disorders",
  "Impulse Control Disorders",
];

type medicalHistoryPropType = {
  medicalHistoryData: medicalHistoryFormType;
  setMedicalHistoryData: React.Dispatch<
    React.SetStateAction<medicalHistoryFormType>
  >;
};
function EditMedicalHistoryForm({
  setMedicalHistoryData,
  medicalHistoryData,
}: medicalHistoryPropType) {
  const handleBloodGrp = (value: string) => {
    // setGender(e.target);
    setBloodGrp(value);
  };
  const user = useSelector(selectCurrentUser);
  const [giveBy, setGiveBy] = React.useState(medicalHistoryData.givenName);
  const [phoneNumber, setPhoneNumber] = React.useState<null | number>(
    Number(medicalHistoryData.givenPhone)
  );
  const [relation, setRelation] = React.useState(
    medicalHistoryData.givenRelation
  );
  const [bloodPressure, setBloodPressure] = React.useState<boolean | null>(
    medicalHistoryData.bloodPressure == "Yes" ? true : false
  );
  const [bloodGrp, setBloodGrp] = React.useState(medicalHistoryData.bloodGroup);
  const [disease, setDisease] = React.useState<string[]>(
    medicalHistoryData.disease ? medicalHistoryData.disease.split(",") : []
  );
  // const [mentalProblemList, setMentalProblemList] = React.useState<string[]>(
  //   []
  // );
  const [BloodList, setBloodList] = React.useState<string[]>([]);
  const [heartProblemList, setHeartProblemList] = React.useState<string[]>([]);
  const [foodAlergyList, setFoodAlergyList] = React.useState<string[]>([]);
  const [formDisabled, setFormDisabled] = React.useState(false);
  React.useEffect(() => {
    if (giveBy && phoneNumber && relation) {
      setFormDisabled(false);
    } else {
      setFormDisabled(true);
    }
  }, [giveBy, phoneNumber, relation]);
  // const [medicineAllergyList, setMedicineAllergyList] = React.useState<
  //   string[]
  // >([]);
  const getAllData = async () => {
    const foodAllerrgyResponse = await authFetch(
      `data/foodAllergies`,
      user.token
    );
    // const mentalResponse = await authFetch(`data/foodAllergies`, user.token);
    const heartResponse = await authFetch(`data/heartProblems`, user.token);
    const bloodResponse = await authFetch(`data/bloodGroups`, user.token);

    if (foodAllerrgyResponse.message == "success") {
      setFoodAlergyList(foodAllerrgyResponse.foodAllergies);
    }
    if (heartResponse.message == "success") {
      setHeartProblemList(heartResponse.boneProblems);
      // console.log(bloodResponse);
      // setHeartProblemList()
    }
    if (bloodResponse.message == "success") {
      setBloodList(bloodResponse.bloodGroups);
    }
  };
  // console.log("food allergy list", foodAlergyList);
  React.useEffect(() => {
    getAllData();
  }, [user]);
  const [relationList, setRelationList] = React.useState<string[]>([]);
  const [medicineList, setMedicineList] = React.useState<string[]>([]);
  const getAllList = async () => {
    const relationResponse = await authFetch("data/relations", user.token);
    if (relationResponse.message == "success") {
      setRelationList(relationResponse.relations);
    }
    const Medicineresponse = await authFetch(
      `medicine/${user.hospitalID}/getMedicines`,
      user.token
    );
    if (Medicineresponse.message == "success") {
      setMedicineList(Medicineresponse.medicines);
    }
  };
  React.useEffect(() => {
    getAllList();
  }, [user]);
  type searchListType = {
    searchedList: string[];
    selectedList: string[];
    search: string;
    istrue: boolean;
  };
  const [foodAlergy, setFoodAlergy] = React.useState<searchListType>({
    searchedList: [],
    selectedList: medicalHistoryData.foodAllergy
      ? medicalHistoryData.foodAllergy.split(",")
      : [],
    search: "",
    istrue: medicalHistoryData.foodAllergy ? true : false,
  });
  const [medicineAllergy, setMedicineAllergy] = React.useState<searchListType>({
    searchedList: [],
    selectedList: medicalHistoryData.medicineAllergy
      ? medicalHistoryData.medicineAllergy.split(",")
      : [],
    search: "",
    istrue: medicalHistoryData.medicineAllergy ? true : false,
  });
  const [isAnethesia, setIsAnesthesia] = React.useState<boolean | null>(
    medicalHistoryData.anaesthesia == "Yes" ? true : false
  );
  type prescribedMedicine = {
    searchedList: string[];
    selectedList: string[];
    search: string;
    istrue: boolean;
    text: string;
  };
  // const [prescribedMedicine, setPrescribedMedicine] =
  //   React.useState<prescribedMedicine>({
  //     isTrue: false,
  //     value: [],
  //     text: "",
  //   });

  const [isChestPain, setIsChestPain] = React.useState<boolean | null>(
    medicalHistoryData.chestCondition == "Yes"
  );
  const [isNeuro, setIsNeuro] = React.useState<boolean | null>(
    medicalHistoryData.neurologicalDisorder == "Yes"
  );
  const [heartProblem, setHeartProblem] = React.useState<searchListType>({
    searchedList: [],
    selectedList: medicalHistoryData.heartProblems
      ? medicalHistoryData.heartProblems.split(",")
      : [],
    search: "",
    istrue: medicalHistoryData.heartProblems ? true : false,
  });
  const [prescribedMedicine, setPrescribedMedicine] =
    React.useState<prescribedMedicine>({
      searchedList: [],
      selectedList: medicalHistoryData.meds
        ? medicalHistoryData.meds.split(",")
        : [],
      search: "",
      istrue: medicalHistoryData.meds ? true : false,
      text: "",
    });
  const [selfPrescrined, setSelfPrescribed] =
    React.useState<prescribedMedicine>({
      searchedList: [],
      selectedList: medicalHistoryData.selfMeds
        ? medicalHistoryData.selfMeds.split(",")
        : [],
      search: "",
      istrue: medicalHistoryData.selfMeds ? true : false,
      text: "",
    });
  const [mentalProblem, setMentalProblem] = React.useState<searchListType>({
    searchedList: [],
    selectedList: medicalHistoryData.mentalHealth
      ? medicalHistoryData.mentalHealth.split(",")
      : [],
    search: "",
    istrue: medicalHistoryData.mentalHealth ? true : false,
  });
  const [addiction, setAddiction] = React.useState<searchListType>({
    searchedList: [],
    selectedList: medicalHistoryData.drugs
      ? medicalHistoryData.drugs.split(",")
      : [],
    search: "",
    istrue: medicalHistoryData.drugs ? true : false,
  });
  const [infection, setInfection] = React.useState<searchListType>({
    searchedList: infectionList,
    selectedList: medicalHistoryData.infections
      ? medicalHistoryData.infections.split(",")
      : [],
    search: "",
    istrue: medicalHistoryData.infections ? true : false,
  });
  const [heriditary, setHeriditary] = React.useState<searchListType>({
    searchedList: heriditaryList,
    selectedList: medicalHistoryData.hereditaryDisease
      ? medicalHistoryData.hereditaryDisease.split(",")
      : [],
    search: "",
    istrue: medicalHistoryData.infections ? true : false,
  });
  const [isPregnant, setIsPregnant] = React.useState<boolean | null>(
    medicalHistoryData.pregnant == "Yes"
  );
  const [isLumps, setIsLumps] = React.useState<boolean | null>(
    medicalHistoryData.lumps == "Yes"
  );
  const [isCancer, setIsCancer] = React.useState<boolean | null>(
    medicalHistoryData.cancer == "Yes"
  );

  React.useEffect(() => {
    if (!foodAlergy.search) {
      setFoodAlergy((prevvalue) => {
        return { ...prevvalue, searchedList: [...foodAlergyList] };
      });
    } else {
      setFoodAlergy((prevValue) => {
        return {
          ...prevValue,
          searchedList: [
            ...foodAlergyList.filter((el) =>
              el.toLowerCase().includes(foodAlergy.search.toLowerCase())
            ),
          ],
        };
      });
    }
  }, [foodAlergy.search, foodAlergyList]);
  React.useEffect(() => {
    if (!medicineAllergy.search) {
      setMedicineAllergy((prevvalue) => {
        return { ...prevvalue, searchedList: [...medicineList] };
      });
    } else {
      setMedicineAllergy((prevValue) => {
        return {
          ...prevValue,
          searchedList: [
            ...medicineList.filter((el) =>
              el.toLowerCase().includes(medicineAllergy.search.toLowerCase())
            ),
          ],
        };
      });
    }
  }, [medicineAllergy.search, medicineList]);

  //////////////////////////Prescribed medicine Problem///////////////////////////////////////////
  React.useEffect(() => {
    if (!prescribedMedicine.search) {
      setPrescribedMedicine((prevvalue) => {
        return { ...prevvalue, searchedList: [...medicineList] };
      });
    } else {
      setPrescribedMedicine((prevValue) => {
        return {
          ...prevValue,
          searchedList: [
            ...medicineList.filter((el) =>
              el.toLowerCase().includes(prescribedMedicine.search.toLowerCase())
            ),
          ],
        };
      });
    }
  }, [prescribedMedicine.search, medicineList]);

  //////////////////////////Self Prescribed medicine Problem///////////////////////////////////////////
  React.useEffect(() => {
    if (!selfPrescrined.search) {
      setSelfPrescribed((prevvalue) => {
        return { ...prevvalue, searchedList: [...medicineList] };
      });
    } else {
      setSelfPrescribed((prevValue) => {
        return {
          ...prevValue,
          searchedList: [
            ...medicineList.filter((el) =>
              el.toLowerCase().includes(selfPrescrined.search.toLowerCase())
            ),
          ],
        };
      });
    }
  }, [selfPrescrined.search, medicineList]);

  //////////////////////////Heart Problem///////////////////////////////////////////
  React.useEffect(() => {
    if (!heartProblem.search) {
      setHeartProblem((prevvalue) => {
        return { ...prevvalue, searchedList: [...heartProblemList] };
      });
    } else {
      setHeartProblem((prevValue) => {
        return {
          ...prevValue,
          searchedList: [
            ...heartProblemList.filter((el) =>
              el.toLowerCase().includes(heartProblem.search.toLowerCase())
            ),
          ],
        };
      });
    }
  }, [heartProblem.search, heartProblemList]);

  ///////////////////////////////Tobaco Addiction///////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  React.useEffect(() => {
    if (!addiction.search) {
      setAddiction((prevvalue) => {
        return { ...prevvalue, searchedList: [...addictionList] };
      });
    } else {
      setAddiction((prevValue) => {
        return {
          ...prevValue,
          searchedList: [
            ...addictionList.filter((el) =>
              el.toLowerCase().includes(addiction.search.toLowerCase())
            ),
          ],
        };
      });
    }
  }, [addiction.search]);
  const handleTobacoAdditionChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    if (event.target.checked) {
      setAddiction((prevValue) => {
        return {
          ...prevValue,
          selectedList: [...prevValue.selectedList, event.target.value],
        };
      });
    } else {
      setAddiction((prevValue) => {
        return {
          ...prevValue,
          selectedList: [
            ...prevValue.selectedList.filter((el) => el != event.target.value),
          ],
        };
      });
    }
  };
  const handleHeriditaryChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    if (event.target.checked) {
      setHeriditary((prevValue) => {
        return {
          ...prevValue,
          selectedList: [...prevValue.selectedList, event.target.value],
        };
      });
    } else {
      setHeriditary((prevValue) => {
        return {
          ...prevValue,
          selectedList: [
            ...prevValue.selectedList.filter((el) => el != event.target.value),
          ],
        };
      });
    }
  };

  const handleInfectionChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    if (event.target.checked) {
      setInfection((prevValue) => {
        return {
          ...prevValue,
          selectedList: [...prevValue.selectedList, event.target.value],
        };
      });
    } else {
      setInfection((prevValue) => {
        return {
          ...prevValue,
          selectedList: [
            ...prevValue.selectedList.filter((el) => el != event.target.value),
          ],
        };
      });
    }
  };

  // ///////////////////////////////////Mental Problem List//////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  React.useEffect(() => {
    if (!mentalProblem.search) {
      setMentalProblem((prevvalue) => {
        return { ...prevvalue, searchedList: [...mentalProblemList] };
      });
    } else {
      setMentalProblem((prevValue) => {
        return {
          ...prevValue,
          searchedList: [
            ...mentalProblemList.filter((el) =>
              el.toLowerCase().includes(mentalProblem.search.toLowerCase())
            ),
          ],
        };
      });
    }
  }, [mentalProblem.search]);

  React.useEffect(() => {
    setMedicalHistoryData({
      patientID: 0,
      userID: user.id,
      givenName: giveBy,
      givenPhone: String(phoneNumber),
      givenRelation: relation,
      bloodGroup: bloodGrp,
      bloodPressure: bloodPressure ? "Yes" : "No",
      disease: disease.join(","),
      foodAllergy: foodAlergy.selectedList.join(","),
      medicineAllergy: medicineAllergy.selectedList.join(","),
      anaesthesia: isAnethesia ? "Yes" : "No",
      meds: prescribedMedicine.selectedList.join(","),
      selfMeds: selfPrescrined.selectedList.join(","),
      chestCondition: isChestPain ? "Chest Pain" : "No Chest Pain",
      neurologicalDisorder: isNeuro ? "Yes" : "No",
      heartProblems: heartProblem.selectedList.join(","),
      infections: infection.istrue ? infection.selectedList.join(",") : "",
      mentalHealth: mentalProblem.selectedList.join(","),
      drugs: addiction.selectedList.join(","),
      pregnant: isPregnant ? "Yes" : "No",
      hereditaryDisease: heriditary.istrue
        ? heriditary.selectedList.join(",")
        : "",
      lumps: isLumps ? "Yes" : "No",
      cancer: isCancer ? "Yes" : "No",
      familyDisease: "",
    });
  }, [
    user,
    giveBy,
    phoneNumber,
    relation,
    bloodGrp,
    bloodPressure,
    disease,
    foodAlergy,
    medicineAllergy,
    isAnethesia,
    prescribedMedicine,
    selfPrescrined,
    isChestPain,
    infection,
    heriditary,
    isLumps,
    isCancer,
    addiction,
    isNeuro,
    isPregnant,
  ]);

  // console.log("medical history data", medicalHistoryData);
  // console.log(medicalHistoryData`1234567890-)
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////Food Allergy////////////////////////////////////////////////////////////

  return (
    <Grid
      container
      columnSpacing={2}
      rowSpacing={4}
      //   alignItems="center"
      //   sx={{ height: "800px" }}
    >
      <Grid item xs={12}>
        <TextField
          label="History Given By "
          value={giveBy}
          variant="outlined"
          fullWidth
          required
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const inputVal = event.target.value;
            const regex = /^[a-zA-Z][a-zA-Z\s]*$/;
            if (regex.test(inputVal) || inputVal === "") {
              setGiveBy(inputVal);
            }
          }}
          inputProps={{ maxLength: 50 }}
        />
      </Grid>
      <Grid container xs={12} item>
        <Grid item xs={2}>
          <FormControl variant="outlined" fullWidth>
            <Select required value="+91">
              <MenuItem value="+91" selected>
                +91
              </MenuItem>
              <MenuItem value="+01">+01</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={10}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-phone">
              Mobile Number
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-phone"
              label=" Mobile Number"
              placeholder="Mobile Number"
              onChange={(event) => {
                const input = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
                if (input.length <= 10) {
                  setPhoneNumber(input ? Number(input) : null);
                }
              }}
              value={phoneNumber || null}
              fullWidth
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 10,
                minLength: 10,
              }}
              required
              style={{
                border: "1px solid rgba(0, 0, 0, 0.23)",
                borderRadius: "4px",
              }} // Adding border
            />
          </FormControl>
        </Grid>
      </Grid>
      {/* <Grid container xs={12} item>
        <Grid item xs={2}></Grid>
      </Grid> */}
      <Grid item xs={12}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Relationship With Patient</InputLabel>
          <Select
            //   value={title}
            //   label="Title"
            label="Relationship With Patient"
            required
            onChange={(event: SelectChangeEvent) => {
              setRelation(event.target.value);
            }}
            value={relation}
          >
            {relationList.map((el) => (
              <MenuItem value={el} selected>
                {el}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ color: "#1977F3", fontWeight: "600" }}>
        Past History
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} direction="column" sx={{ fontWeight: "600" }}>
          Blood Group
          <Stack
            // spacing={2}
            direction="row"
            sx={{ mt: "10px" }}
            flexWrap={"wrap"}
            rowGap={1}
            columnGap={1}
          >
            {BloodList.map((el) => {
              return (
                <Chip
                  label={el}
                  onClick={() => handleBloodGrp(el)}
                  color={bloodGrp == el ? "primary" : "default"}
                  sx={{ boxSizing: "border-box", padding: "10px 20px" }}
                  disabled={formDisabled}
                />
              );
            })}
          </Stack>
        </Stack>
      </Grid>
      <Grid xs={12} item>
        {/* ///////////////////Anesthesia Allergy////////////////////////////// */}
        <Stack spacing={2} direction="column" rowGap={2}>
          Blood Pressure
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() => setBloodPressure(true)}
              color={bloodPressure ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() => setBloodPressure(false)}
              color={!bloodPressure ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
        </Stack>
      </Grid>
      <Grid xs={12} item>
        <Stack spacing={0} direction="column">
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.checked) {
                    setDisease((el) => {
                      return [...el, "diabetes"];
                    });
                  }
                  if (!event.target.checked) {
                    setDisease((el) => {
                      return el.filter((dis) => dis != "diabetes");
                    });
                  }
                }}
                defaultChecked={disease.includes("diabetes")}
                disabled={formDisabled}
              />
            }
            label="Diabetes"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.checked) {
                    setDisease((el) => {
                      return [...el, "Been Through any Surgery"];
                    });
                  }
                  if (!event.target.checked) {
                    setDisease((el) => {
                      return el.filter(
                        (dis) => dis != "Been Through any Surgery"
                      );
                    });
                  }
                }}
                defaultChecked={disease.includes("Been Through any Surgery")}
                disabled={formDisabled}
              />
            }
            label="Been Through any Surgery"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.checked) {
                    setDisease((el) => {
                      return [...el, "Hyper Lipidaemia / Dyslipidaemia"];
                    });
                  }
                  if (!event.target.checked) {
                    setDisease((el) => {
                      return el.filter(
                        (dis) => dis != "Hyper Lipidaemia / Dyslipidaemia"
                      );
                    });
                  }
                }}
                defaultChecked={disease.includes(
                  "Hyper Lipidaemia / Dyslipidaemia"
                )}
                disabled={formDisabled}
              />
            }
            label="Hyper Lipidaemia / Dyslipidaemia"
          />
        </Stack>
      </Grid>
      <Grid xs={12} item>
        {/* ///////////////////Food Allergy////////////////////////////// */}
        <Stack spacing={2} direction="column" rowGap={2}>
          Any Food Allergy?
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() =>
                setFoodAlergy((pre) => {
                  return { ...pre, istrue: true };
                })
              }
              color={foodAlergy.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() =>
                setFoodAlergy((pre) => {
                  return { ...pre, istrue: false, selectedList: [] };
                })
              }
              color={!foodAlergy.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
          {foodAlergy.istrue ? (
            <Grid container xs={12} alignItems={"center"} spacing={2}>
              <Grid item xs={10}>
                <Autocomplete
                  freeSolo // Allow the user to input a value that's not in the options list
                  value={foodAlergy.search}
                  onChange={(_, newValue: string | null) => {
                    setFoodAlergy((prev) => ({
                      ...prev,
                      search: newValue || "",
                    }));
                  }}
                  inputValue={foodAlergy.search || undefined}
                  onInputChange={(_, newInputValue) => {
                    setFoodAlergy((prev) => ({
                      ...prev,
                      search: newInputValue || "",
                    }));
                  }}
                  options={foodAlergyList}
                  renderInput={(params) => (
                    <TextField {...params} label="Food Name" required />
                  )}
                />
              </Grid>
              <Grid xs={2} item>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (
                      foodAlergy.search &&
                      !foodAlergy.selectedList.includes(foodAlergy.search)
                    ) {
                      setFoodAlergy((prev) => ({
                        ...prev,
                        selectedList: [...prev.selectedList, foodAlergy.search],
                      }));
                    }
                    setFoodAlergy((prev) => ({ ...prev, search: "" }));
                  }}
                  endIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          {/* ////////////////////////Food allergy End/////////////////////// */}
          {/*
           */}
        </Stack>

        <Grid item xs={12}>
          <Stack
            direction="row"
            spacing={1}
            rowGap={2}
            flexWrap={"wrap"}
            sx={{ mt: "10px" }}
          >
            {foodAlergy.selectedList.map((el) => {
              return (
                <Chip
                  label={el}
                  onDelete={() => {
                    setFoodAlergy((curr) => {
                      return {
                        ...curr,
                        selectedList: curr.selectedList.filter(
                          (val) => val != el
                        ),
                      };
                    });
                  }}
                  disabled={formDisabled}
                />
              );
            })}
          </Stack>
        </Grid>
      </Grid>
      {/* ////////////////////Medicine Allergy///////////////////////////////// */}
      <Grid xs={12} item>
        {/* ///////////////////Medicine Allergy////////////////////////////// */}
        <Stack spacing={2} direction="column" rowGap={2}>
          Any Medicine Allergy?
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() =>
                setMedicineAllergy((pre) => {
                  return { ...pre, istrue: true };
                })
              }
              color={medicineAllergy.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() =>
                setMedicineAllergy((pre) => {
                  return { ...pre, istrue: false, selectedList: [] };
                })
              }
              color={!medicineAllergy.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
          {medicineAllergy.istrue ? (
            <Grid container xs={12} alignItems={"center"} spacing={2}>
              <Grid item xs={10}>
                <Autocomplete
                  freeSolo // Allow the user to input a value that's not in the options list
                  value={medicineAllergy.search}
                  onChange={(_, newValue: string | null) => {
                    setMedicineAllergy((prev) => ({
                      ...prev,
                      search: newValue || "",
                    }));
                  }}
                  inputValue={medicineAllergy.search || undefined}
                  onInputChange={(_, newInputValue) => {
                    setMedicineAllergy((prev) => ({
                      ...prev,
                      search: newInputValue || "",
                    }));
                  }}
                  options={medicineList}
                  renderInput={(params) => (
                    <TextField {...params} label="Medicine Name" required />
                  )}
                />
              </Grid>
              <Grid xs={2} item>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (
                      medicineAllergy.search &&
                      !medicineAllergy.selectedList.includes(
                        medicineAllergy.search
                      )
                    ) {
                      setMedicineAllergy((prev) => ({
                        ...prev,
                        selectedList: [
                          ...prev.selectedList,
                          medicineAllergy.search,
                        ],
                      }));
                    }
                    setMedicineAllergy((prev) => ({ ...prev, search: "" }));
                  }}
                  endIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
        </Stack>
        <Grid item xs={12}>
          <Stack
            direction="row"
            spacing={1}
            rowGap={2}
            sx={{ mt: "10px" }}
            flexWrap={"wrap"}
          >
            {medicineAllergy.selectedList.map((el) => {
              return (
                <Chip
                  label={el}
                  onDelete={() => {
                    setMedicineAllergy((curr) => {
                      return {
                        ...curr,
                        selectedList: curr.selectedList.filter(
                          (val) => val != el
                        ),
                      };
                    });
                  }}
                  disabled={formDisabled}
                />
              );
            })}
          </Stack>
        </Grid>
        {/* ////////////////////////Medicinal allergy End/////////////////////// */}
        {/*
         */}
      </Grid>
      <Grid xs={12} item>
        {/* ///////////////////Anesthesia Allergy////////////////////////////// */}
        <Stack spacing={2} direction="column" rowGap={2}>
          Any Known Anaesthesia Allergy?
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() => setIsAnesthesia(true)}
              color={isAnethesia ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() => setIsAnesthesia(false)}
              color={!isAnethesia ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
        </Stack>
      </Grid>

      {/* ///////////////////////////////// Prescribed Medicine////////////////////////////////////////*/}

      <Grid xs={12} item>
        {/* /////////////////// prescribed medicine////////////////////////////// */}
        <Stack spacing={2} direction="column" rowGap={2}>
          Taking Any Prescribed Medicines?
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() =>
                setPrescribedMedicine((pre) => {
                  return { ...pre, istrue: true };
                })
              }
              color={prescribedMedicine.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() =>
                setPrescribedMedicine((pre) => {
                  return { ...pre, istrue: false, selectedList: [] };
                })
              }
              color={!prescribedMedicine.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
          {prescribedMedicine.istrue ? (
            <Grid container xs={12} alignItems={"center"} spacing={2}>
              <Grid item xs={10}>
                <Autocomplete
                  freeSolo // Allow the user to input a value that's not in the options list
                  value={prescribedMedicine.search}
                  onChange={(_, newValue: string | null) => {
                    setPrescribedMedicine((prev) => ({
                      ...prev,
                      search: newValue || "",
                    }));
                  }}
                  inputValue={prescribedMedicine.search || undefined}
                  onInputChange={(_, newInputValue) => {
                    setPrescribedMedicine((prev) => ({
                      ...prev,
                      search: newInputValue || "",
                    }));
                  }}
                  options={medicineList}
                  renderInput={(params) => (
                    <TextField {...params} label="Medicine Name" required />
                  )}
                />
              </Grid>
              <Grid xs={2} item>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (
                      prescribedMedicine.search &&
                      !prescribedMedicine.selectedList.includes(
                        prescribedMedicine.search
                      )
                    ) {
                      setPrescribedMedicine((prev) => ({
                        ...prev,
                        selectedList: [
                          ...prev.selectedList,
                          prescribedMedicine.search,
                        ],
                      }));
                    }
                    setPrescribedMedicine((prev) => ({ ...prev, search: "" }));
                  }}
                  endIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
        </Stack>
        {prescribedMedicine.istrue ? (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: "10px" }}
                rowGap={2}
                flexWrap={"wrap"}
              >
                {prescribedMedicine.selectedList.map((el) => {
                  return (
                    <Chip
                      label={el}
                      onDelete={() => {
                        setPrescribedMedicine((curr) => {
                          return {
                            ...curr,
                            value: curr.selectedList.filter((val) => val != el),
                          };
                        });
                      }}
                      disabled={formDisabled}
                    />
                  );
                })}
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>

      {/* //////////////////////////////Self Prescribed Medicine/////////////////////////////////////// */}
      <Grid xs={12} item>
        {/* /////////////////// self prescribed medicine////////////////////////////// */}
        <Stack spacing={2} direction="column" rowGap={2}>
          Taking Any Self Prescribed Medicines?
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() =>
                setSelfPrescribed((pre) => {
                  return { ...pre, istrue: true };
                })
              }
              color={selfPrescrined.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() =>
                setSelfPrescribed((pre) => {
                  return { ...pre, istrue: false, selectedList: [] };
                })
              }
              color={!selfPrescrined.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
          {selfPrescrined.istrue ? (
            <Grid container xs={12} alignItems={"center"} spacing={2}>
              <Grid item xs={10}>
                <Autocomplete
                  freeSolo // Allow the user to input a value that's not in the options list
                  value={selfPrescrined.search}
                  onChange={(_, newValue: string | null) => {
                    setSelfPrescribed((prev) => ({
                      ...prev,
                      search: newValue || "",
                    }));
                  }}
                  inputValue={selfPrescrined.search || undefined}
                  onInputChange={(_, newInputValue) => {
                    setSelfPrescribed((prev) => ({
                      ...prev,
                      search: newInputValue || "",
                    }));
                  }}
                  options={medicineList}
                  renderInput={(params) => (
                    <TextField {...params} label="Medicine Name" required />
                  )}
                />
              </Grid>
              <Grid xs={2} item>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (
                      selfPrescrined.search &&
                      !selfPrescrined.selectedList.includes(
                        selfPrescrined.search
                      )
                    ) {
                      setSelfPrescribed((prev) => ({
                        ...prev,
                        selectedList: [
                          ...prev.selectedList,
                          selfPrescrined.search,
                        ],
                      }));
                    }
                    setSelfPrescribed((prev) => ({ ...prev, search: "" }));
                  }}
                  endIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
        </Stack>
        {selfPrescrined.istrue ? (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: "10px" }}
                rowGap={2}
                flexWrap={"wrap"}
              >
                {selfPrescrined.selectedList.map((el) => {
                  return (
                    <Chip
                      label={el}
                      onDelete={() => {
                        setSelfPrescribed((curr) => {
                          return {
                            ...curr,
                            value: curr.selectedList.filter((val) => val != el),
                          };
                        });
                      }}
                      disabled={formDisabled}
                    />
                  );
                })}
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
      {/* /////////////////////////Chest Condition/////////////////////////////////////////////// */}
      <Grid xs={12} item>
        <Stack spacing={2} direction="column" rowGap={2}>
          Any Chest Condition?
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() => setIsChestPain(true)}
              color={isChestPain ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() => setIsChestPain(false)}
              color={!isChestPain ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
        </Stack>
      </Grid>

      {/* ////////////////////////Neurology Disorder/////////////////////////////////////////////////// */}
      <Grid xs={12} item>
        <Stack spacing={2} direction="column" rowGap={2}>
          Epilepsy or other Neurological Disorder?
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() => setIsNeuro(true)}
              color={isNeuro ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() => setIsNeuro(false)}
              color={!isNeuro ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
        </Stack>
      </Grid>

      {/* /////////////////////////////////////Heart Problem//////////////////////////////////// */}
      <Grid xs={12} item>
        <Stack spacing={2} direction="column" rowGap={2}>
          Any Heart Problems?
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() =>
                setHeartProblem((pre) => {
                  return { ...pre, istrue: true };
                })
              }
              color={heartProblem.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() =>
                setHeartProblem((pre) => {
                  return { ...pre, istrue: false, selectedList: [] };
                })
              }
              color={!heartProblem.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
          <Stack direction={"column"}>
            {heartProblem.istrue ? (
              <Grid container xs={12} alignItems={"center"} spacing={2}>
                <Grid item xs={10}>
                  <Autocomplete
                    freeSolo // Allow the user to input a value that's not in the options list
                    value={heartProblem.search}
                    onChange={(_, newValue: string | null) => {
                      setHeartProblem((prev) => ({
                        ...prev,
                        search: newValue || "",
                      }));
                    }}
                    inputValue={heartProblem.search || undefined}
                    onInputChange={(_, newInputValue) => {
                      setHeartProblem((prev) => ({
                        ...prev,
                        search: newInputValue || "",
                      }));
                    }}
                    options={heartProblemList}
                    renderInput={(params) => (
                      <TextField {...params} label="Heart Problem" required />
                    )}
                  />
                </Grid>
                <Grid xs={2} item>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (
                        heartProblem.search &&
                        !heartProblem.selectedList.includes(heartProblem.search)
                      ) {
                        setHeartProblem((prev) => ({
                          ...prev,
                          selectedList: [
                            ...prev.selectedList,
                            heartProblem.search,
                          ],
                        }));
                      }
                      setHeartProblem((prev) => ({
                        ...prev,
                        search: "",
                      }));
                    }}
                    endIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            ) : (
              ""
            )}
          </Stack>
          {heartProblem.istrue ? (
            <Grid item xs={12}>
              <Stack
                direction="row"
                spacing={1}
                rowGap={2}
                flexWrap={"wrap"}
                sx={{ mt: "10px" }}
              >
                {heartProblem.selectedList.map((el) => {
                  return (
                    <Chip
                      label={el}
                      onDelete={() => {
                        setHeartProblem((curr) => {
                          return {
                            ...curr,
                            selectedList: curr.selectedList.filter(
                              (val) => val != el
                            ),
                          };
                        });
                      }}
                    />
                  );
                })}
              </Stack>
            </Grid>
          ) : (
            <></>
          )}
          {/* ////////////////////////Heart Problem End/////////////////////// */}
          {/*
           */}
        </Stack>
      </Grid>
      {/* /////////////////////////////////Mental Problem///////////////////////////// */}
      <Grid xs={12} item>
        <Stack spacing={2} direction="column" rowGap={2}>
          Any Mental Health Problems?*
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() =>
                setMentalProblem((pre) => {
                  return { ...pre, istrue: true };
                })
              }
              color={mentalProblem.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() =>
                setMentalProblem((pre) => {
                  return { ...pre, istrue: false, selectedList: [] };
                })
              }
              color={!mentalProblem.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
          {mentalProblem.istrue ? (
            <Grid container xs={12} alignItems={"center"} spacing={2}>
              <Grid item xs={10}>
                <Autocomplete
                  freeSolo // Allow the user to input a value that's not in the options list
                  value={mentalProblem.search}
                  onChange={(_, newValue: string | null) => {
                    setMentalProblem((prev) => ({
                      ...prev,
                      search: newValue || "",
                    }));
                  }}
                  inputValue={mentalProblem.search || undefined}
                  onInputChange={(_, newInputValue) => {
                    setMentalProblem((prev) => ({
                      ...prev,
                      search: newInputValue || "",
                    }));
                  }}
                  options={mentalProblemList}
                  renderInput={(params) => (
                    <TextField {...params} label="Mental Problem" required />
                  )}
                />
              </Grid>
              <Grid xs={2} item>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (
                      mentalProblem.search &&
                      !mentalProblem.selectedList.includes(mentalProblem.search)
                    ) {
                      setMentalProblem((prev) => ({
                        ...prev,
                        selectedList: [
                          ...prev.selectedList,
                          mentalProblem.search,
                        ],
                      }));
                    }
                    setMentalProblem((prev) => ({ ...prev, search: "" }));
                  }}
                  endIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          {mentalProblem.istrue ? (
            <Grid item xs={12}>
              <Stack
                direction="row"
                spacing={1}
                rowGap={2}
                flexWrap={"wrap"}
                sx={{ mt: "10px" }}
              >
                {mentalProblem.selectedList.map((el) => {
                  return (
                    <Chip
                      label={el}
                      onDelete={() => {
                        setMentalProblem((curr) => {
                          return {
                            ...curr,
                            selectedList: curr.selectedList.filter(
                              (val) => val != el
                            ),
                          };
                        });
                      }}
                    />
                  );
                })}
              </Stack>
            </Grid>
          ) : (
            ""
          )}
          {/* ////////////////////////Mental  Problem End/////////////////////// */}
          {/*
           */}
        </Stack>
      </Grid>

      {/* ////////////////////////Hepatisis Conditio/////////////////////////////////////////////////// */}

      <Grid xs={12} item>
        <Stack spacing={2} direction="column" rowGap={2}>
          Do You Have/Had Infections Hepatitis B, Hepatitis C or HIV?
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() =>
                setInfection((pre) => {
                  return { ...pre, istrue: true };
                })
              }
              color={infection.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() =>
                setInfection((pre) => {
                  return { ...pre, istrue: false, selectedList: [] };
                })
              }
              color={!infection.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
          <Stack direction={"column"}>
            {infection.istrue &&
              infection.searchedList?.map((element) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleInfectionChange}
                        value={element}
                        checked={infection.selectedList.includes(element)}
                        id={element}
                      />
                    }
                    label={element}
                  />
                );
              })}
          </Stack>
          {/* ////////////////////////Addiction End/////////////////////// */}
          {/*
           */}
        </Stack>
      </Grid>

      
      {/* ////////////////////////////////////////Addiction//////////////////////////// */}
      <Grid xs={12} item>
        <Stack spacing={2} direction="column" rowGap={2}>
          Drug, Tobacco or Alcohol addiction?
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() =>
                setAddiction((pre) => {
                  return { ...pre, istrue: true };
                })
              }
              color={addiction.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() =>
                setAddiction((pre) => {
                  return { ...pre, istrue: false, selectedList: [] };
                })
              }
              color={!addiction.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
          <Stack direction={"column"}>
            {addiction.istrue &&
              addiction.searchedList?.map((element) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleTobacoAdditionChange}
                        value={element}
                        checked={addiction.selectedList.includes(element)}
                        id={element}
                      />
                    }
                    label={element}
                  />
                );
              })}
          </Stack>
          {/* ////////////////////////Addiction End/////////////////////// */}
          {/*
           */}
        </Stack>
      </Grid>
      {/* ////////////////////////Pregnant  Condition/////////////////////////////////////////////////// */}
      <Grid xs={12} item>
        <Stack spacing={2} direction="column" rowGap={2}>
          Pregnant/ Been pregnant?
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() => setIsPregnant(true)}
              color={isPregnant ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() => setIsPregnant(false)}
              color={!isPregnant ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
        </Stack>
      </Grid>
      {/* ////////////////////////heriditary Conditio/////////////////////////////////////////////////// */}
      <Grid xs={12} item>
        <Stack spacing={2} direction="column" rowGap={2}>
          Any Known Disease Mother/Father is Suffering / Suffered?
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() =>
                setHeriditary((pre) => {
                  return { ...pre, istrue: true };
                })
              }
              color={heriditary.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() =>
                setHeriditary((pre) => {
                  return { ...pre, istrue: false, selectedList: [] };
                })
              }
              color={!heriditary.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
          <Stack direction={"column"}>
            {heriditary.istrue &&
              heriditary.searchedList?.map((element) => {
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleHeriditaryChange}
                        value={element}
                        checked={heriditary.selectedList.includes(element)}
                        id={element}
                      />
                    }
                    label={element}
                  />
                );
              })}
          </Stack>
          {/* ////////////////////////Addiction End/////////////////////// */}
          {/*
           */}
        </Stack>
      </Grid>
      {/* ////////////////////////Lumpps Conditio/////////////////////////////////////////////////// */}
      <Grid xs={12} item>
        <Stack spacing={2} direction="column" rowGap={2}>
          Any Lumps Found in Physical Examination*
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() => setIsLumps(true)}
              color={isLumps ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() => setIsLumps(false)}
              color={!isLumps ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
        </Stack>
      </Grid>
      {/* ////////////////////////Hepatisis Conditio/////////////////////////////////////////////////// */}
      <Grid xs={12} item>
        <Stack spacing={2} direction="column" rowGap={2}>
          Been Through Cancer?*
          <Stack
            direction="row"
            spacing={2}
            alignItems={"center"}
            columnGap={4}
          >
            <Chip
              label={"Yes"}
              onClick={() => setIsCancer(true)}
              color={isCancer ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() => setIsCancer(false)}
              color={!isCancer ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default EditMedicalHistoryForm;
