import React, { useEffect, useState } from "react";
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
import { authPost } from "../../../../axios/useAuthPost";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { selectCurrPatient } from "../../../../store/currentPatient/currentPatient.selector";
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
  const currentPatient = useSelector(selectCurrPatient);

  const [giveBy, setGiveBy] = React.useState(medicalHistoryData?.givenName);
  const [phoneNumber, setPhoneNumber] = React.useState<null | number>(
    Number(medicalHistoryData?.givenPhone)
  );
  const [relation, setRelation] = React.useState(
    medicalHistoryData?.givenRelation
  );
  const [bloodPressure, setBloodPressure] = React.useState<boolean | null>(
    medicalHistoryData?.bloodPressure == "Yes" ? true : false
  );
  const [bloodGrp, setBloodGrp] = React.useState(
    medicalHistoryData?.bloodGroup
  );
  const [disease, setDisease] = React.useState<string[]>(
    medicalHistoryData?.disease ? medicalHistoryData?.disease.split(",") : []
  );
  const [, setDiseaseName] = React.useState("");

  const [dates, setDates] = React.useState<{ [key: string]: string | Date }>(
    {}
  );
  const [surgeryText, setSurgeryText] = useState<string>("");

  const [checkedDiseases, setCheckedDiseases] = useState<Set<string>>(
    new Set(
      medicalHistoryData?.disease
        ? medicalHistoryData.disease
            .split(",")
            .map((dis) => dis.split(":")[0].trim())
        : []
    )
  );

  const handleDateChange = (diseaseName: string, newDate: Date | null) => {
    if (newDate) {
      const formattedDate = newDate.toISOString().split("T")[0];
      setDates((prev) => ({ ...prev, [diseaseName]: formattedDate }));

      setDisease((prev) => {
        const filteredDiseases = prev.filter(
          (dis) => !dis.startsWith(diseaseName)
        );
        // Update disease array to include surgeryText along with date for "Been Through any Surgery"
        if (diseaseName === "Been Through any Surgery" && surgeryText) {
          return [
            ...filteredDiseases,
            `${diseaseName}: ${surgeryText} | ${formattedDate}`,
          ];
        }
        return [...filteredDiseases, `${diseaseName}:${formattedDate}`];
      });
    }
  };
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
  const getAllData = React.useCallback(async () => {
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
  }, [user.token]);

  // console.log("food allergy list", foodAlergyList);
  React.useEffect(() => {
    getAllData();
  }, [getAllData, user]);

  const [relationList, setRelationList] = React.useState<string[]>([]);
  const [medicineList, setMedicineList] = React.useState<string[]>([]);

  const getAllList = React.useCallback(async () => {
    const relationResponse = await authFetch("data/relations", user.token);
    if (relationResponse.message == "success") {
      setRelationList(relationResponse.relations);
    }
    // const Medicineresponse = await authFetch("data/medicines", user.token);
    // if (Medicineresponse.message == "success") {
    //   setMedicineList(Medicineresponse.medicines);
    // }
  }, [user.token]);

  React.useEffect(() => {
    if (user.token) {
      getAllList();
    }
  }, [getAllList, user]);

  type searchListType = {
    searchedList: string[];
    selectedList: string[];
    search: string;
    istrue: boolean;
    date: any;
  };
  type hereditaryType = {
    searchedList: string[];
    selectedList: string[];
    search: string;
    istrue: boolean;
    date: any;
  };
  const [foodAlergy, setFoodAlergy] = React.useState<searchListType>({
    searchedList: [],
    selectedList: medicalHistoryData?.foodAllergy
      ? medicalHistoryData.foodAllergy.split(",").map((item) => item.trim())
      : [],
    search: "",
    istrue: medicalHistoryData?.foodAllergy ? true : false,
    date: null,
  });
  const [medicineAllergy, setMedicineAllergy] = React.useState<searchListType>({
    searchedList: [],
    selectedList: medicalHistoryData?.medicineAllergy
      ? medicalHistoryData.medicineAllergy.split(",").map((item) => item.trim())
      : [],
    search: "",
    istrue: medicalHistoryData?.medicineAllergy ? true : false,
    date: null,
  });
  const [isAnethesia, setIsAnesthesia] = React.useState<boolean | null>(
    medicalHistoryData?.anaesthesia == "Yes" ? true : false
  );
  type prescribedMedicine = {
    searchedList: string[];
    selectedList: {
      name: string;
      date: Date | null; // Storing date as a string
    }[];
    search: string;
    istrue: boolean;
    text: string;
    dosage: string;
    dosageUnit: string;
    frequency: string;
    duration: {
      number: string;
      unit: string;
    };
    date: Date | null;
  };
  // const [prescribedMedicine, setPrescribedMedicine] =
  //   React.useState<prescribedMedicine>({
  //     isTrue: false,
  //     value: [],
  //     text: "",
  //   });

  // const [isChestPain, setIsChestPain] = React.useState<boolean | null>(
  //   medicalHistoryData.chestCondition == "Yes"
  // );

  const chestConditionsList = [
    "Asthma",
    "Chronic Obstructive Pulmonary Disease (COPD)",
    "Pneumonia",
    "Bronchitis",
    "Tuberculosis",
    "Pulmonary Embolism",
    "Pleural Effusion",
    "Pneumothorax",
    "Lung Cancer",
    "Chest Pain (unspecified)",
    "Cough",
    "Shortness of breath",
    "Wheezing",
    "Hemoptysis",
    "Chest Wall Pain",
  ];

  const [chestCondition, setChestCondition] = React.useState<searchListType>({
    searchedList: chestConditionsList,
    selectedList: medicalHistoryData?.chestCondition
      ? medicalHistoryData.chestCondition.split(",").map((item) => item.trim())
      : [],
    search: "",
    istrue: medicalHistoryData?.chestCondition ? true : false,
    date: null,
  });

  // const [isNeuro, setIsNeuro] = React.useState<boolean | null>(
  //   medicalHistoryData.neurologicalDisorder == "Yes"
  // );

  const neurologicalDisordersList = [
    "Migraine",
    "Diabetic neuropathy",
    "Guillain-Barré syndrome",
    "Tension headache",
    "Cluster headache",
    "Epilepsy",
    "Febrile seizures",
    "Parkinson's disease",
    "Huntington's disease",
    "Dystonia",
    "Tremor",
    "Dementia",
    "Alzheimer's disease",
    "Delirium",
    "Learning disabilities",
    "Depression",
    "Bipolar disorder",
    "Anxiety disorders",
    "Insomnia",
    "Sleep apnea",
    "Narcolepsy",
    "Multiple Sclerosis",
    "Brain Tumors",
    "Stroke",
    "Meningitis",
    "Encephalitis",
    "Muscular dystrophy",
    "Myasthenia gravis",
    "Neuralgia",
    "Fibromyalgia",
    "Autism Spectrum Disorder (ASD)",
    "Attention Deficit Hyperactivity Disorder (ADHD)",
    "Amyotrophic Lateral Sclerosis (ALS)",
    "Chronic pain",
    "Back pain",
  ];

  const [neurologicalDisorder, setNeurologicalDisorder] =
    React.useState<searchListType>({
      searchedList: neurologicalDisordersList, // Initialize with all conditions
      selectedList: medicalHistoryData?.neurologicalDisorder
        ? medicalHistoryData.neurologicalDisorder
            .split(",")
            .map((item) => item.trim())
        : [],
      search: "",
      istrue: medicalHistoryData?.neurologicalDisorder ? true : false,
      date: null,
    });

  const [heartProblem, setHeartProblem] = React.useState<searchListType>({
    searchedList: [],
    selectedList: medicalHistoryData?.heartProblems
      ? medicalHistoryData.heartProblems.split(",").map((item) => item.trim())
      : [],
    search: "",
    istrue: medicalHistoryData?.heartProblems ? true : false,
    date: null,
  });

  const [prescribedMedicine, setPrescribedMedicine] =
    React.useState<prescribedMedicine>({
      searchedList: [],
      selectedList: medicalHistoryData?.meds
        ? medicalHistoryData?.meds.split(",").map((med) => ({
            name: med,
            date: null,
          }))
        : [],
      search: "",
      istrue: medicalHistoryData?.meds ? true : false,
      text: "",
      dosage: "",
      dosageUnit: "mg",
      frequency: "",
      duration: {
        number: "",
        unit: "month",
      },
      date: null,
    });
  const [selfPrescribed, setSelfPrescribed] =
    React.useState<prescribedMedicine>({
      searchedList: [],
      selectedList: medicalHistoryData?.selfMeds
        ? medicalHistoryData?.selfMeds.split(",").map((med) => ({
            name: med,
            date: null,
          }))
        : [],
      search: "",
      istrue: medicalHistoryData?.selfMeds ? true : false,
      text: "",
      dosage: "",
      dosageUnit: "mg",
      frequency: "",
      duration: {
        number: "",
        unit: "month", // Default value for unit; can be "month" or "year"
      },
      date: null,
    });
  const [mentalProblem, setMentalProblem] = React.useState<searchListType>({
    searchedList: [],
    selectedList: medicalHistoryData?.mentalHealth
      ? medicalHistoryData.mentalHealth.split(",").map((item) => item.trim())
      : [],
    search: "",
    istrue: medicalHistoryData?.mentalHealth ? true : false,
    date: null,
  });
  const [addiction, setAddiction] = React.useState<searchListType>({
    searchedList: [],
    selectedList: medicalHistoryData?.drugs
      ? medicalHistoryData.drugs.split(",").map((item) => item.trim())
      : [],
    search: "",
    istrue: medicalHistoryData?.drugs ? true : false,
    date: null,
  });
  const [infection, setInfection] = React.useState<searchListType>({
    searchedList: infectionList,
    selectedList: medicalHistoryData?.infections
      ? medicalHistoryData.infections.split(",").map((item) => item.trim())
      : [],
    search: "",
    istrue: medicalHistoryData?.infections ? true : false,
    date: null,
  });
  const [heriditary, setHeriditary] = React.useState<hereditaryType>({
    searchedList: heriditaryList,
    selectedList: medicalHistoryData?.hereditaryDisease
      ? medicalHistoryData?.hereditaryDisease
          .split(",")
          .filter((item) => !item.startsWith("Date:"))
          .map((disease) => disease.trim())
      : [],
    search: "",
    istrue: medicalHistoryData?.infections ? true : false,
    date: medicalHistoryData?.hereditaryDisease
      ? new Date(
          medicalHistoryData.hereditaryDisease
            .split(",")
            .find((item) => item.startsWith("Date:"))
            ?.split("Date: ")[1]
            .trim() || ""
        )
      : "",
  });

  interface PregnancyDetails {
    numberOfPregnancies: string;
    liveBirths: string;
    date: any;
  }

  const [isPregnant, setIsPregnant] = React.useState<boolean>(
    medicalHistoryData?.pregnant ? true : false
  );
  const [pregnancyDetails, setPregnancyDetails] =
    React.useState<PregnancyDetails>({
      numberOfPregnancies: "",
      liveBirths: "",
      date: "",
    });
  // const [isPregnant, setIsPregnant] = React.useState<boolean | null>(
  //   medicalHistoryData.pregnant == "Yes"
  // );

  const locations = [
    "Thyroid",
    "Lymph nodes - neck",
    "Lymph nodes - jaw",
    "Lymph nodes - ear",
    "Salivary glands",
    "Breast",
    "Lung",
    "Liver",
    "Spleen",
    "Kidneys",
    "Ovaries",
    "Lymph nodes - abdominal",
    "Lymph nodes - axillary",
    "Arms",
    "Legs",
  ];

  const sizes = ["Small", "Medium", "Large"];
  const consistencies = ["Soft", "Firm", "Hard"];
  interface LumpDetails {
    location: string;
    size: string;
    consistency: string;
    date: any;
  }

  interface LumpsState {
    istrue: boolean;
    details: LumpDetails;
  }

  const [lumps, setLumps] = React.useState<LumpsState>({
    istrue: medicalHistoryData?.lumps ? true : false,
    details: {
      location: "",
      size: "",
      consistency: "",
      date: "",
    },
  });

  // const [isLumps, setIsLumps] = React.useState<boolean | null>(
  //   medicalHistoryData.lumps == "Yes"
  // );

  interface CancerDetails {
    type: string;
    stage: string;
    date: any;
  }

  // List of cancer types
  const cancerTypes = [
    "Breast Cancer",
    "Lung Cancer",
    "Prostate Cancer",
    "Colorectal Cancer",
    "Leukemia",
    "Lymphoma",
    "Other",
  ];

  const [isCancer, setIsCancer] = React.useState<boolean>(
    medicalHistoryData?.cancer ? true : false
  );
  const [cancerDetails, setCancerDetails] = React.useState<CancerDetails>({
    type: "",
    stage: "",
    date: "",
  });

  // const [isCancer, setIsCancer] = React.useState<boolean | null>(
  //   medicalHistoryData.cancer == "Yes"
  // );

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

  //filter medicineAllergy.search
  React.useEffect(() => {
    const filteredList = medicineAllergy.search
      ? medicineList.filter((el) =>
          el.toLowerCase().startsWith(medicineAllergy.search.toLowerCase())
        )
      : [...medicineList];

    setMedicineAllergy((prevValue) => ({
      ...prevValue,
      searchedList: filteredList,
    }));
  }, [medicineAllergy.search, medicineList]);

  interface Medicine {
    Medicine_Name: string;
  }

  async function fetchMedicineList(text: string) {
    if (text?.length >= 1) {
      try {
        const response = await authPost(
          `medicine/${user.hospitalID}/getMedicines`,
          { text },
          user.token
        );

        if (response.message === "success") {
          const medList = response.medicines?.map(
            (medicine: Medicine) => medicine.Medicine_Name
          );
          const uniqueMedList = Array.from(new Set(medList)) as string[];
          setMedicineList(uniqueMedList || []);
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    }
  }

  //////////////////////////Prescribed medicine Problem///////////////////////////////////////////
  React.useEffect(() => {
    const filteredList = prescribedMedicine.search
      ? medicineList.filter((el) =>
          el.toLowerCase().startsWith(prescribedMedicine.search.toLowerCase())
        )
      : [...medicineList];

    setPrescribedMedicine((prevValue) => ({
      ...prevValue,
      searchedList: filteredList,
    }));
  }, [prescribedMedicine.search, medicineList]);

  //////////////////////////Self Prescribed medicine Problem///////////////////////////////////////////

  React.useEffect(() => {
    const filteredList = selfPrescribed.search
      ? medicineList.filter((el) =>
          el.toLowerCase().startsWith(selfPrescribed.search.toLowerCase())
        )
      : [...medicineList];

    setSelfPrescribed((prevValue) => ({
      ...prevValue,
      searchedList: filteredList,
    }));
  }, [selfPrescribed.search, medicineList]);

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

  useEffect(() => {
    if (
      medicalHistoryData.pregnant != "" &&
      medicalHistoryData?.pregnant !== "No"
    ) {
      // Extract number of pregnancies and live births from the data
      const pregnancyInfo = medicalHistoryData.pregnant.split(", ");
      const numberOfPregnancies = pregnancyInfo[0].split(": ")[1];
      const liveBirths = pregnancyInfo[1].split(": ")[1];
      const dateString =
        pregnancyInfo.length > 2 ? pregnancyInfo[2].split(": ")[1] : null;
      const date = dateString ? new Date(dateString) : null;

      // Update the state
      setPregnancyDetails({
        numberOfPregnancies,
        liveBirths,
        date,
      });
    }

    if (
      medicalHistoryData &&
      medicalHistoryData?.lumps != "" &&
      medicalHistoryData?.lumps !== "No"
    ) {
      // Extract lump details from the data
      const lumpsInfo = medicalHistoryData?.lumps.split(", ");
      const location = lumpsInfo[0].split(": ")[1].replace(/'/g, "");
      const size = lumpsInfo[1].split(": ")[1].replace(/'/g, "");
      const consistency = lumpsInfo[2].split(": ")[1].replace(/'/g, "");
      // Extract and parse the date, if present
      const dateString =
        lumpsInfo.length > 3 ? lumpsInfo[3].split(": ")[1] : null;
      const date = dateString ? new Date(dateString) : null;

      // Update the state
      setLumps({
        istrue: true,
        details: {
          location,
          size,
          consistency,
          date,
        },
      });
    } else {
      // Handle case where there are no lumps
      setLumps({
        istrue: false,
        details: {
          location: "",
          size: "",
          consistency: "",
          date: "",
        },
      });
    }
    if (
      medicalHistoryData?.cancer != "" &&
      medicalHistoryData?.cancer != "No"
    ) {
      // Extract cancer type and stage from the data
      const cancerInfo = medicalHistoryData?.cancer.split(", ");
      const type = cancerInfo[0].split(": ")[1];
      const stage = cancerInfo[1].split(": ")[1];
      const dateString =
        cancerInfo.length > 2 ? cancerInfo[2].split(": ")[1] : null;
      const date = dateString ? new Date(dateString) : null;

      // Update the state
      setCancerDetails({
        type,
        stage,
        date,
      });
    } else {
      // If no cancer information, ensure state reflects this
      setCancerDetails({
        type: "",
        stage: "",
        date: "",
      });
    }
    if (medicalHistoryData && medicalHistoryData?.familyDisease) {
      // Extract the disease name from the data
      setDiseaseName(medicalHistoryData.familyDisease);
    } else {
      // Handle case where there is no disease information
      setDiseaseName("");
    }
  }, []);

  const [diseaseNames, setDiseaseNames] = useState<{ [key: string]: string }>(
    {}
  );

  const handleDiseaseNameChange = (element: string, value: string) => {
    setDiseaseNames((prevDiseaseNames) => ({
      ...prevDiseaseNames,
      [element]: value,
    }));
  };

  useEffect(() => {
    const familyDisease = medicalHistoryData?.familyDisease;

    console.log("familyDisease:", familyDisease); // Log the input data

    if (familyDisease) {
      // Split the string by commas to get individual key-value pairs
      const pairs = familyDisease.split(",").map((pair) => pair.trim());
      const diseaseNamesObject: { [key: string]: string } = {};

      pairs.forEach((pair) => {
        // Split each pair by the colon to separate key and value
        const [key, value] = pair.split(":").map((part) => part.trim());
        if (key && value) {
          diseaseNamesObject[key] = value;
        }
      });

      // Set the state with the transformed object
      setDiseaseNames(diseaseNamesObject);
    }
  }, []); // Include medicalHistoryData as a dependenc

  React.useEffect(() => {
    if (medicalHistoryData?.hereditaryDisease) {
      const hereditaryInfo = medicalHistoryData.hereditaryDisease.split(",");
      const selectedList = hereditaryInfo
        .filter((item) => !item.startsWith("Date:"))
        .map((disease) => disease.trim()); // Trim spaces for consistency
      const dateString = hereditaryInfo.find((item) =>
        item.startsWith("Date:")
      );
      const date = dateString
        ? new Date(dateString.split("Date: ")[1].trim())
        : null;

      setHeriditary((prev) => ({
        ...prev,
        searchedList: heriditaryList, // Predefined list of options
        selectedList, // Update with parsed selected diseases
        search: "",
        istrue: true,
        date,
      }));
    } else {
      setHeriditary((prev) => ({
        ...prev,
        searchedList: heriditaryList,
        selectedList: [],
        search: "",
        istrue: false,
        date: null,
      }));
    }
  }, [medicalHistoryData?.hereditaryDisease, heriditaryList]);

  // console.log("medical history data", medicalHistoryData);
  // console.log(medicalHistoryData`1234567890-)
  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////Food Allergy////////////////////////////////////////////////////////////

  React.useEffect(() => {
    const filteredList = chestCondition?.search
      ? chestConditionsList.filter((el) =>
          el.toLowerCase().startsWith(chestCondition.search.toLowerCase())
        )
      : chestConditionsList;

    setChestCondition((prevValue) => ({
      ...prevValue,
      searchedList: filteredList,
    }));
  }, [chestCondition.search]);

  React.useEffect(() => {
    const filteredList = neurologicalDisorder?.search
      ? neurologicalDisordersList.filter((el) =>
          el.toLowerCase().includes(neurologicalDisorder.search.toLowerCase())
        )
      : neurologicalDisordersList;

    setNeurologicalDisorder((prevValue) => ({
      ...prevValue,
      searchedList: filteredList,
    }));
  }, [neurologicalDisorder.search]);

  useEffect(() => {
    // Initialize diseases and dates
    const diseaseArray = medicalHistoryData?.disease
      ? medicalHistoryData.disease.split(",")
      : [];
    const updatedDates: { [key: string]: string | Date } = {};

    diseaseArray.forEach((entry) => {
      const [diseaseName, date] = entry.split(":");
      if (date) {
        updatedDates[diseaseName] = new Date(date.trim());
      }
    });

    setDates(updatedDates);

    // Check for surgeryText
    const surgeryEntry = diseaseArray.find((entry) =>
      entry.startsWith("Been Through any Surgery")
    );
    if (surgeryEntry) {
      const surgeryDetails = surgeryEntry.split(":")[1]?.split("|")[0]?.trim();
      if (surgeryDetails) {
        setSurgeryText(surgeryDetails);
      }
    }
  }, [medicalHistoryData]);

  React.useEffect(() => {
    setMedicalHistoryData({
      patientID: 0,
      userID: user.id,
      givenName: giveBy,
      givenPhone: String(phoneNumber),
      givenRelation: relation,
      bloodGroup: bloodGrp,
      bloodPressure: bloodPressure ? "Yes" : "No",
      disease: disease.filter((item) => item.trim() !== "").join(","),
      foodAllergy: foodAlergy.selectedList.join(","),
      medicineAllergy: medicineAllergy?.selectedList.join(","),
      anaesthesia: isAnethesia ? "Yes" : "No",
      meds: prescribedMedicine.selectedList
        .map((med) => {
          const formattedDate = med.date
            ? new Date(med.date).toLocaleDateString("en-GB")
            : "No date";
          return `${med.name} (Date: ${formattedDate})`;
        })
        .join(", "),

      selfMeds: selfPrescribed.selectedList
        .map((med) => {
          const formattedDate = med.date
            ? new Date(med.date).toLocaleDateString("en-GB")
            : "No date";
          return `${med.name} (Date: ${formattedDate})`;
        })
        .join(", "),

      chestCondition: chestCondition.selectedList.join(","),
      neurologicalDisorder: neurologicalDisorder?.selectedList.join(","),
      // neurologicalDisorder: isNeuro ? "Yes" : "No",
      heartProblems: heartProblem.selectedList.join(","),
      infections: infection.istrue ? infection.selectedList.join(",") : "",
      mentalHealth: mentalProblem.selectedList.join(","),
      drugs: addiction.selectedList.join(","),
      // pregnant: isPregnant ? "Yes" : "No",
      pregnant: isPregnant
        ? `Number of Pregnancies: ${pregnancyDetails?.numberOfPregnancies}, Live Births: ${pregnancyDetails?.liveBirths}, Date: ${pregnancyDetails?.date}`
        : "No",

      hereditaryDisease: heriditary.istrue
        ? `${heriditary.selectedList.join(",")}${
            heriditary.date ? `,Date: ${heriditary.date}` : ""
          }`
        : "",
      lumps: lumps.istrue
        ? `Location: ${lumps?.details.location}, Size: ${lumps?.details.size}, Consistency: ${lumps?.details.consistency}, Date: ${lumps?.details.date}`
        : "",

      // cancer: isCancer ? "Yes" : "No",
      cancer: isCancer
        ? `Type: ${cancerDetails?.type}, Stage: ${cancerDetails?.stage}, Date: ${cancerDetails?.date}`
        : "",
      familyDisease: Object.entries(diseaseNames)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", "),
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
    // prescribedMedicine,
    selfPrescribed,
    // isChestPain,
    chestCondition,
    infection,
    heriditary,

    lumps,

    cancerDetails,
    addiction,

    neurologicalDisorder,

    pregnancyDetails,
    setMedicalHistoryData,
    heartProblem.selectedList,
    mentalProblem.selectedList,
    diseaseNames,
  ]);
  console.log("dates==", dates);
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
              {/* <MenuItem value="+01">+01</MenuItem> */}
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
              placeholder="Mobile Number"
              onChange={(event) => {
                const input = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
                if (input.length <= 10) {
                  setPhoneNumber(input ? Number(input) : null);
                }
              }}
              label="Mobile Number"
              value={phoneNumber || null}
              fullWidth
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 10,
                minLength: 10,
              }}
              required
              // style={{
              //   border: "1px solid rgba(0, 0, 0, 0.23)",
              //   borderRadius: "4px",
              // }} // Adding border
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
        <Stack spacing={2} direction="column">
          <Stack spacing={2} direction="row" rowGap={4}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const diseaseName = "Diabetes";
                    if (event.target.checked) {
                      setCheckedDiseases((prev) =>
                        new Set(prev).add(diseaseName)
                      );
                    } else {
                      setCheckedDiseases((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(diseaseName);
                        return newSet;
                      });
                      setDisease((prev) =>
                        prev.filter((dis) => !dis.startsWith(diseaseName))
                      );
                      setDates((prev) => {
                        const newDates = { ...prev };
                        delete newDates[diseaseName];
                        return newDates;
                      });
                    }
                  }}
                  checked={checkedDiseases.has("Diabetes")}
                  disabled={formDisabled}
                />
              }
              label="Diabetes"
            />
            {checkedDiseases.has("Diabetes") && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={dates["Diabetes"] ? new Date(dates["Diabetes"]) : null}
                  onChange={(newDate) => handleDateChange("Diabetes", newDate)}
                  maxDate={new Date()}
                />
              </LocalizationProvider>
            )}
          </Stack>
          <Stack spacing={2} direction="row" columnGap={2}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const diseaseName = "Been Through any Surgery";

                    if (event.target.checked) {
                      setCheckedDiseases((prev) =>
                        new Set(prev).add(diseaseName)
                      );
                      setDisease((prev) => {
                        const updatedDiseases = prev.filter(
                          (dis) => !dis.startsWith(diseaseName)
                        );
                        return [...updatedDiseases, diseaseName];
                      });
                    } else {
                      setCheckedDiseases((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(diseaseName);
                        return newSet;
                      });
                      setDisease((prev) =>
                        prev.filter((dis) => !dis.startsWith(diseaseName))
                      );
                      setDates((prev) => {
                        const newDates = { ...prev };
                        delete newDates[diseaseName];
                        return newDates;
                      });
                      setSurgeryText(""); // Clear text when unchecked
                    }
                  }}
                  checked={checkedDiseases.has("Been Through any Surgery")}
                  disabled={formDisabled}
                />
              }
              label="Been Through any Surgery"
            />
            {checkedDiseases.has("Been Through any Surgery") && (
              <>
                <TextField
                  label="Enter Surgery Details"
                  value={surgeryText}
                  onChange={(event) => setSurgeryText(event.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Date"
                    value={
                      dates["Been Through any Surgery"]
                        ? new Date(dates["Been Through any Surgery"])
                        : null
                    }
                    onChange={(newDate) =>
                      handleDateChange("Been Through any Surgery", newDate)
                    }
                    maxDate={new Date()}
                  />
                </LocalizationProvider>
              </>
            )}
          </Stack>
          <Stack spacing={2} direction="row" columnGap={2}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const diseaseName = "Hyper Lipidaemia / Dyslipidaemia";

                    if (event.target.checked) {
                      setCheckedDiseases((prev) =>
                        new Set(prev).add(diseaseName)
                      );
                      setDisease((prev) => {
                        const updatedDiseases = prev.filter(
                          (dis) => !dis.startsWith(diseaseName)
                        );
                        return [...updatedDiseases, diseaseName];
                      });
                    } else {
                      setCheckedDiseases((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(diseaseName);
                        return newSet;
                      });
                      setDisease((prev) =>
                        prev.filter((dis) => !dis.startsWith(diseaseName))
                      );
                      setDates((prev) => {
                        const newDates = { ...prev };
                        delete newDates[diseaseName];
                        return newDates;
                      });
                    }
                  }}
                  checked={checkedDiseases.has(
                    "Hyper Lipidaemia / Dyslipidaemia"
                  )}
                  disabled={formDisabled}
                />
              }
              label="Hyper Lipidaemia / Dyslipidaemia"
            />
            {checkedDiseases.has("Hyper Lipidaemia / Dyslipidaemia") && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={
                    dates["Hyper Lipidaemia / Dyslipidaemia"]
                      ? new Date(dates["Hyper Lipidaemia / Dyslipidaemia"])
                      : null
                  }
                  onChange={(newDate) =>
                    handleDateChange(
                      "Hyper Lipidaemia / Dyslipidaemia",
                      newDate
                    )
                  }
                  maxDate={new Date()}
                />
              </LocalizationProvider>
            )}
          </Stack>
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
            <Grid container xs={20} alignItems={"center"} spacing={2}>
              <Stack spacing={2} direction="row" rowGap={2}>
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
                      <TextField {...params} label="Food Name" />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date"
                      value={foodAlergy.date || null}
                      onChange={(date) =>
                        setFoodAlergy((prev) => ({
                          ...prev,
                          searchedList: prev.searchedList,
                          selectedList: prev.selectedList,
                          search: prev.search,
                          istrue: prev.istrue,
                          date: date,
                        }))
                      }
                      disabled={!foodAlergy.istrue || formDisabled}
                      maxDate={new Date()}
                      slots={{ textField: TextField }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: { maxWidth: 250 },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Stack>
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
                        selectedList: [
                          ...prev.selectedList,
                          `${foodAlergy.search.trim()}:${
                            foodAlergy.date
                              ? foodAlergy.date.toLocaleDateString("en-GB")
                              : ""
                          }`,
                        ],
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
            <Grid container xs={20} alignItems={"center"} spacing={2}>
              <Stack spacing={2} direction="row" rowGap={2}>
                <Grid item xs={10}>
                  <Autocomplete
                    freeSolo
                    value={medicineAllergy.search}
                    onChange={(_, newValue) => {
                      setMedicineAllergy((prev) => ({
                        ...prev,
                        search: newValue || "",
                      }));
                    }}
                    inputValue={medicineAllergy.search}
                    onInputChange={(_, newInputValue) => {
                      setMedicineAllergy((prev) => ({
                        ...prev,
                        search: newInputValue || "",
                      }));
                      fetchMedicineList(newInputValue);
                    }}
                    //  options={medicineList}
                    options={medicineAllergy.searchedList}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Medicine Name"
                        placeholder="Enter 3 letters for Search"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date"
                      value={medicineAllergy.date || null}
                      onChange={(date) =>
                        setMedicineAllergy((prev) => ({
                          ...prev,
                          searchedList: prev.searchedList,
                          selectedList: prev.selectedList,
                          search: prev.search,
                          istrue: prev.istrue,
                          date: date,
                        }))
                      }
                      disabled={!medicineAllergy.istrue || formDisabled}
                      maxDate={new Date()}
                      slots={{ textField: TextField }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: { maxWidth: 250 },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Stack>

              <Grid item xs={2}>
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
                          `${medicineAllergy.search.trim()}:${
                            medicineAllergy.date
                              ? medicineAllergy.date.toLocaleDateString("en-GB")
                              : ""
                          }`,
                        ],
                      }));
                    }
                    setMedicineAllergy((prev) => ({ ...prev, search: "" }));
                    setMedicineList([]);
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

      <Grid xs={18} item>
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
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Autocomplete
                  freeSolo // Allow the user to input a value that's not in the options list
                  value={prescribedMedicine.search}
                  onChange={(_, newValue: string | null) => {
                    setPrescribedMedicine((prev) => ({
                      ...prev,
                      search: newValue || "",
                    }));
                  }}
                  inputValue={prescribedMedicine.search}
                  onInputChange={(_, newInputValue) => {
                    setPrescribedMedicine((prev) => ({
                      ...prev,
                      search: newInputValue || "",
                    }));
                    fetchMedicineList(newInputValue);
                  }}
                  // options={medicineList}
                  options={prescribedMedicine.searchedList}
                  renderInput={(params) => (
                    <TextField {...params} label="Medicine Name" />
                  )}
                />
              </Grid>

              <Grid item xs={1}>
                <TextField
                  label="Dosage"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={prescribedMedicine.dosage}
                  onChange={(e) =>
                    setPrescribedMedicine((prev) => ({
                      ...prev,
                      dosage: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <FormControl fullWidth>
                  <InputLabel>Dosage Unit</InputLabel>
                  <Select
                    value={prescribedMedicine.dosageUnit}
                    onChange={(e) =>
                      setPrescribedMedicine((prev) => ({
                        ...prev,
                        dosageUnit: e.target.value,
                      }))
                    }
                    label="Dosage Unit"
                  >
                    <MenuItem value="mg">mg</MenuItem>
                    <MenuItem value="ml">ml</MenuItem>
                    <MenuItem value="g">g</MenuItem>
                    <MenuItem value="μg">μg</MenuItem>
                    <MenuItem value="l">l</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={1}>
                <TextField
                  label="Frequency"
                  type="number"
                  inputProps={{ min: 1, max: 6 }}
                  value={prescribedMedicine.frequency}
                  onChange={(e) =>
                    setPrescribedMedicine((prev) => ({
                      ...prev,
                      frequency: e.target.value,
                    }))
                  }
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={4}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Duration"
                    type="number"
                    value={prescribedMedicine.duration.number}
                    onChange={(e) =>
                      setPrescribedMedicine((prev) => ({
                        ...prev,
                        duration: {
                          ...prev.duration,
                          number: e.target.value,
                        },
                      }))
                    }
                    InputProps={{ inputProps: { min: 1, max: 11 } }} // Ensure the number is positive
                    sx={{ width: 100 }}
                  />
                  <FormControl sx={{ width: 120 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={prescribedMedicine.duration.unit}
                      onChange={(e) =>
                        setPrescribedMedicine((prev) => ({
                          ...prev,
                          duration: {
                            ...prev.duration,
                            unit: e.target.value,
                          },
                        }))
                      }
                      label="Unit"
                    >
                      <MenuItem value="month">Month</MenuItem>
                      <MenuItem value="year">Year</MenuItem>
                      <MenuItem value="day">Day</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={prescribedMedicine.date || null}
                    onChange={(date) =>
                      setPrescribedMedicine((prev) => ({
                        ...prev,
                        searchedList: prev.searchedList,
                        selectedList: prev.selectedList,
                        search: prev.search,
                        istrue: prev.istrue,
                        date: date,
                      }))
                    }
                    disabled={!prescribedMedicine.istrue || formDisabled}
                    maxDate={new Date()}
                    slots={{ textField: TextField }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { maxWidth: 250 },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid xs={2} item>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (
                      prescribedMedicine.search &&
                      !prescribedMedicine.selectedList.some(
                        (med) => med.name === prescribedMedicine.search
                      )
                    ) {
                      setPrescribedMedicine((prev) => ({
                        ...prev,
                        selectedList: [
                          ...prev.selectedList,
                          {
                            name: `${prescribedMedicine.search} (Dosage: ${prescribedMedicine.dosage} ${prescribedMedicine.dosageUnit} | Frequency: ${prescribedMedicine.frequency} | Duration: ${prescribedMedicine.duration.number} ${prescribedMedicine.duration.unit})`,
                            date: prescribedMedicine.date,
                          },
                        ],
                        search: "",
                        dosage: "",
                        dosageUnit: "mg",
                        frequency: "",
                        duration: {
                          number: "",
                          unit: "month",
                        },
                        date: prescribedMedicine.date,
                      }));
                    }
                    setMedicineList([]);
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
                  const label = `${el.name} (${
                    el.date
                      ? new Date(el.date).toLocaleDateString("en-GB")
                      : "No Date"
                  })`;
                  return (
                    <Chip
                      label={label}
                      onDelete={() => {
                        setPrescribedMedicine((curr) => {
                          return {
                            ...curr,
                            selectedList: curr.selectedList.filter(
                              (val) => val !== el
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
        ) : (
          <></>
        )}
      </Grid>

      {/* //////////////////////////////Self Prescribed Medicine/////////////////////////////////////// */}
      <Grid xs={18} item>
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
              color={selfPrescribed.istrue ? "primary" : "default"}
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
              color={!selfPrescribed.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
          {selfPrescribed.istrue && (
            <Grid container xs={12} alignItems={"center"} spacing={2}>
              <Grid item xs={3}>
                <Autocomplete
                  freeSolo
                  value={selfPrescribed.search}
                  onChange={(_, newValue: string | null) => {
                    setSelfPrescribed((prev) => ({
                      ...prev,
                      search: newValue || "",
                    }));
                  }}
                  inputValue={selfPrescribed.search || undefined}
                  onInputChange={(_, newInputValue) => {
                    setSelfPrescribed((prev) => ({
                      ...prev,
                      search: newInputValue || "",
                    }));
                    fetchMedicineList(newInputValue);
                  }}
                  options={selfPrescribed.searchedList}
                  renderInput={(params) => (
                    <TextField {...params} label="Medicine Name" />
                  )}
                />
              </Grid>

              <Grid item xs={1}>
                <TextField
                  label="Dosage"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={selfPrescribed.dosage}
                  onChange={(e) =>
                    setSelfPrescribed((prev) => ({
                      ...prev,
                      dosage: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={1}>
                <FormControl fullWidth>
                  <InputLabel>Dosage Unit</InputLabel>
                  <Select
                    value={prescribedMedicine.dosageUnit}
                    onChange={(e) =>
                      setSelfPrescribed((prev) => ({
                        ...prev,
                        dosageUnit: e.target.value,
                      }))
                    }
                    label="Dosage Unit"
                  >
                    <MenuItem value="mg">mg</MenuItem>
                    <MenuItem value="ml">ml</MenuItem>
                    <MenuItem value="g">g</MenuItem>
                    <MenuItem value="units">Units</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1}>
                <TextField
                  label="Frequency"
                  type="number"
                  inputProps={{ min: 1, max: 6 }}
                  value={selfPrescribed.frequency}
                  onChange={(e) =>
                    setSelfPrescribed((prev) => ({
                      ...prev,
                      frequency: e.target.value,
                    }))
                  }
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={4}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Duration"
                    type="number"
                    value={selfPrescribed.duration.number}
                    onChange={(e) =>
                      setSelfPrescribed((prev) => ({
                        ...prev,
                        duration: {
                          ...prev.duration,
                          number: e.target.value,
                        },
                      }))
                    }
                    InputProps={{ inputProps: { min: 1, max: 11 } }} // Ensure the number is positive
                    sx={{ width: 100 }}
                  />
                  <FormControl sx={{ width: 120 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={selfPrescribed.duration.unit}
                      onChange={(e) =>
                        setSelfPrescribed((prev) => ({
                          ...prev,
                          duration: {
                            ...prev.duration,
                            unit: e.target.value,
                          },
                        }))
                      }
                      label="Unit"
                    >
                      <MenuItem value="month">Month</MenuItem>
                      <MenuItem value="year">Year</MenuItem>
                      <MenuItem value="day">Day</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={selfPrescribed.date || null}
                    onChange={(date) =>
                      setSelfPrescribed((prev) => ({
                        ...prev,
                        searchedList: prev.searchedList,
                        selectedList: prev.selectedList,
                        search: prev.search,
                        istrue: prev.istrue,
                        date: date,
                      }))
                    }
                    disabled={!selfPrescribed.istrue || formDisabled}
                    maxDate={new Date()}
                    slots={{ textField: TextField }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { maxWidth: 250 },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid xs={2} item>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (
                      selfPrescribed.search &&
                      !selfPrescribed.selectedList.some(
                        (med) => med.name === selfPrescribed.search
                      )
                    ) {
                      setSelfPrescribed((prev) => ({
                        ...prev,
                        selectedList: [
                          ...prev.selectedList,
                          {
                            name: `${selfPrescribed.search} (Dosage: ${selfPrescribed.dosage} ${selfPrescribed.dosageUnit} | Frequency: ${selfPrescribed.frequency} | Duration: ${selfPrescribed.duration.number} ${selfPrescribed.duration.unit}) `,
                            date: selfPrescribed.date,
                          },
                        ],
                        search: "",
                        dosage: "",
                        dosageUnit: "mg",
                        frequency: "",
                        duration: {
                          number: "",
                          unit: "month",
                        },
                      }));
                    }
                    setMedicineList([]);
                  }}
                  endIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          )}
        </Stack>
        {selfPrescribed.istrue && (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: "10px" }}
                rowGap={2}
                flexWrap={"wrap"}
              >
                {selfPrescribed.selectedList.map((el, index) => {
                  const label = `${el.name} (${
                    el.date
                      ? new Date(el.date).toLocaleDateString("en-GB")
                      : "No Date"
                  })`;

                  return (
                    <Chip
                      key={index}
                      label={label}
                      onDelete={() => {
                        setSelfPrescribed((curr) => ({
                          ...curr,
                          selectedList: curr.selectedList.filter(
                            (_med, idx) => idx !== index
                          ),
                        }));
                      }}
                      disabled={formDisabled}
                    />
                  );
                })}
              </Stack>
            </Grid>
          </Grid>
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
              onClick={() =>
                setChestCondition((pre) => {
                  return { ...pre, istrue: true };
                })
              }
              color={chestCondition.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() =>
                setChestCondition((pre) => {
                  return { ...pre, istrue: false, selectedList: [] };
                })
              }
              color={!chestCondition.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
          {chestCondition.istrue ? (
            <Grid container xs={20} alignItems={"center"} spacing={2}>
              <Stack spacing={2} direction="row" rowGap={2}>
                <Grid item xs={10}>
                  <Autocomplete
                    freeSolo
                    value={chestCondition.search}
                    onChange={(_, newValue) => {
                      setChestCondition((prev) => ({
                        ...prev,
                        search: newValue || "",
                      }));
                    }}
                    inputValue={chestCondition.search}
                    onInputChange={(_, newInputValue) => {
                      setChestCondition((prev) => ({
                        ...prev,
                        search: newInputValue || "",
                      }));
                    }}
                    //  options={medicineList}
                    options={chestCondition.searchedList}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chest Condition"
                        placeholder="Enter 3 letters for Search"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date"
                      value={chestCondition.date || null}
                      onChange={(date) =>
                        setChestCondition((prev) => ({
                          ...prev,
                          searchedList: prev.searchedList,
                          selectedList: prev.selectedList,
                          search: prev.search,
                          istrue: prev.istrue,
                          date: date,
                        }))
                      }
                      disabled={!chestCondition.istrue || formDisabled}
                      maxDate={new Date()}
                      slots={{ textField: TextField }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: { maxWidth: 250 },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Stack>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (
                      chestCondition.search &&
                      !chestCondition.selectedList.includes(
                        chestCondition.search
                      )
                    ) {
                      setChestCondition((prev) => ({
                        ...prev,
                        selectedList: [
                          ...prev.selectedList,
                          `${chestCondition.search.trim()}:${
                            chestCondition.date
                              ? chestCondition.date.toLocaleDateString("en-GB")
                              : ""
                          }`,
                        ],
                      }));
                    }
                    setChestCondition((prev) => ({ ...prev, search: "" }));
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
            {chestCondition.selectedList.map((el) => {
              return (
                <Chip
                  label={el}
                  onDelete={() => {
                    setChestCondition((curr) => {
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
              onClick={() =>
                setNeurologicalDisorder((pre) => {
                  return { ...pre, istrue: true };
                })
              }
              color={neurologicalDisorder.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() =>
                setNeurologicalDisorder((pre) => {
                  return { ...pre, istrue: false, selectedList: [] };
                })
              }
              color={!neurologicalDisorder.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
          </Stack>
          {neurologicalDisorder.istrue ? (
            <Grid container xs={20} alignItems={"center"} spacing={2}>
              <Stack spacing={2} direction="row" rowGap={2}>
                <Grid item xs={10}>
                  <Autocomplete
                    freeSolo
                    value={neurologicalDisorder.search}
                    onChange={(_, newValue) => {
                      setNeurologicalDisorder((prev) => ({
                        ...prev,
                        search: newValue || "",
                      }));
                    }}
                    inputValue={neurologicalDisorder.search}
                    onInputChange={(_, newInputValue) => {
                      setNeurologicalDisorder((prev) => ({
                        ...prev,
                        search: newInputValue || "",
                      }));
                    }}
                    //  options={medicineList}
                    options={neurologicalDisorder.searchedList}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Neurological Disorder"
                        placeholder="Enter 3 letters for Search"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date"
                      value={neurologicalDisorder.date || null}
                      onChange={(date) =>
                        setNeurologicalDisorder((prev) => ({
                          ...prev,
                          searchedList: prev.searchedList,
                          selectedList: prev.selectedList,
                          search: prev.search,
                          istrue: prev.istrue,
                          date: date,
                        }))
                      }
                      disabled={!neurologicalDisorder.istrue || formDisabled}
                      maxDate={new Date()}
                      slots={{ textField: TextField }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: { maxWidth: 250 },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Stack>

              <Grid item xs={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (
                      neurologicalDisorder.search &&
                      !neurologicalDisorder.selectedList.includes(
                        neurologicalDisorder.search
                      )
                    ) {
                      setNeurologicalDisorder((prev) => ({
                        ...prev,
                        selectedList: [
                          ...prev.selectedList,
                          `${neurologicalDisorder.search.trim()}:${
                            neurologicalDisorder.date
                              ? neurologicalDisorder.date.toLocaleDateString(
                                  "en-GB"
                                )
                              : ""
                          }`,
                        ],
                      }));
                    }
                    setNeurologicalDisorder((prev) => ({
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
        <Grid item xs={12}>
          <Stack
            direction="row"
            spacing={1}
            rowGap={2}
            sx={{ mt: "10px" }}
            flexWrap={"wrap"}
          >
            {neurologicalDisorder.selectedList.map((el) => {
              return (
                <Chip
                  label={el}
                  onDelete={() => {
                    setNeurologicalDisorder((curr) => {
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
                <Stack spacing={2} direction="row" rowGap={2}>
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
                        <TextField {...params} label="Heart Problem" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date"
                        value={heartProblem.date || null}
                        onChange={(date) =>
                          setHeartProblem((prev) => ({
                            ...prev,
                            searchedList: prev.searchedList,
                            selectedList: prev.selectedList,
                            search: prev.search,
                            istrue: prev.istrue,
                            date: date,
                          }))
                        }
                        disabled={!heartProblem.istrue || formDisabled}
                        maxDate={new Date()}
                        slots={{ textField: TextField }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            sx: { maxWidth: 250 },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Stack>
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
                            `${heartProblem.search.trim()}:${
                              heartProblem.date
                                ? heartProblem.date.toLocaleDateString("en-GB")
                                : ""
                            }`,
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
            <Grid container xs={20} alignItems={"center"} spacing={2}>
              <Stack spacing={2} direction="row" rowGap={2}>
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
                      <TextField {...params} label="Mental Problem" />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date"
                      value={mentalProblem.date || null}
                      onChange={(date) =>
                        setMentalProblem((prev) => ({
                          ...prev,
                          searchedList: prev.searchedList,
                          selectedList: prev.selectedList,
                          search: prev.search,
                          istrue: prev.istrue,
                          date: date,
                        }))
                      }
                      disabled={!mentalProblem.istrue || formDisabled}
                      maxDate={new Date()}
                      slots={{ textField: TextField }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: { maxWidth: 250 },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Stack>
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
                          `${mentalProblem.search.trim()}:${
                            mentalProblem.date
                              ? mentalProblem.date.toLocaleDateString("en-GB")
                              : ""
                          }`,
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
      {currentPatient.category !== 1 && (
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
      )}

      {/* ////////////////////////Pregnant  Condition/////////////////////////////////////////////////// */}

      {currentPatient.gender === 2 && (
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Pregnancy Date"
                  value={pregnancyDetails.date || null}
                  onChange={(date) =>
                    setPregnancyDetails((prev) => ({
                      ...prev,
                      numberOfPregnancies: prev.numberOfPregnancies,
                      liveBirths: prev.liveBirths,
                      date: date,
                    }))
                  }
                  disabled={!isPregnant || formDisabled}
                  slots={{ textField: TextField }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { maxWidth: 250 },
                    },
                  }}
                />
              </LocalizationProvider>
            </Stack>
            {isPregnant && (
              <Stack spacing={2} direction="row" alignItems="center">
                <TextField
                  label="Number of Pregnancies"
                  type="number"
                  value={pregnancyDetails.numberOfPregnancies}
                  onChange={(e) =>
                    setPregnancyDetails((prev) => ({
                      ...prev,
                      numberOfPregnancies: e.target.value,
                    }))
                  }
                  inputProps={{ min: 0 }}
                  fullWidth
                />
                <TextField
                  label="Live Births"
                  type="number"
                  value={pregnancyDetails.liveBirths}
                  onChange={(e) =>
                    setPregnancyDetails((prev) => ({
                      ...prev,
                      liveBirths: e.target.value,
                    }))
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Stack>
            )}
          </Stack>
        </Grid>
      )}

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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={heriditary.date || null}
                onChange={(date) =>
                  setHeriditary((prev) => ({
                    ...prev,
                    searchedList: prev.searchedList,
                    selectedList: prev.selectedList,
                    search: prev.search,
                    istrue: prev.istrue,
                    date: date,
                  }))
                }
                disabled={!heriditary.istrue || formDisabled}
                maxDate={new Date()}
                slots={{ textField: TextField }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { maxWidth: 250 },
                  },
                }}
              />
            </LocalizationProvider>
          </Stack>
          <Stack direction={"row"}>
            <Stack direction="column">
              {heriditary.istrue &&
                heriditary.searchedList?.map((element) => (
                  <div
                    style={{ display: "flex", marginBottom: "30px" }}
                    key={element}
                  >
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
                    <Stack>
                      {heriditary.selectedList.includes(element) && (
                        <TextField
                          value={diseaseNames[element] || ""}
                          onChange={(e) =>
                            handleDiseaseNameChange(element, e.target.value)
                          }
                          disabled={!heriditary.selectedList.includes(element)}
                          label="Disease Name"
                          style={{ height: "40px", width: "250px" }} // Adjust height as needed
                        />
                      )}
                    </Stack>
                  </div>
                ))}
            </Stack>
          </Stack>
          {/* ////////////////////////heriditary End/////////////////////// */}
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
              onClick={() => setLumps((prev) => ({ ...prev, istrue: true }))}
              color={lumps.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <Chip
              label={"No"}
              onClick={() =>
                setLumps((prev) => ({
                  ...prev,
                  istrue: false,
                  details: {
                    location: "",
                    size: "",
                    consistency: "",
                    date: "",
                  },
                }))
              }
              color={!lumps.istrue ? "primary" : "default"}
              sx={{ boxSizing: "border-box", padding: "10px 20px" }}
              disabled={formDisabled}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Examination Date"
                value={lumps.details.date || null}
                onChange={(date) =>
                  setLumps((prev) => ({
                    ...prev,
                    details: { ...prev.details, date: date },
                  }))
                }
                disabled={!lumps.istrue || formDisabled} // Dynamically disable based on conditions
                slots={{ textField: TextField }}
                maxDate={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { maxWidth: 250 },
                  },
                }}
              />
            </LocalizationProvider>
          </Stack>
          {lumps.istrue && (
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={lumps.details.location}
                  onChange={(e) =>
                    setLumps((prev) => ({
                      ...prev,
                      details: { ...prev.details, location: e.target.value },
                    }))
                  }
                  label="Location"
                >
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Size</InputLabel>
                <Select
                  value={lumps.details.size}
                  onChange={(e) =>
                    setLumps((prev) => ({
                      ...prev,
                      details: { ...prev.details, size: e.target.value },
                    }))
                  }
                  label="Size"
                >
                  {sizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Consistency</InputLabel>
                <Select
                  value={lumps.details.consistency}
                  onChange={(e) =>
                    setLumps((prev) => ({
                      ...prev,
                      details: { ...prev.details, consistency: e.target.value },
                    }))
                  }
                  label="Consistency"
                >
                  {consistencies.map((consistency) => (
                    <MenuItem key={consistency} value={consistency}>
                      {consistency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          )}
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Examination Date"
                value={cancerDetails.date || null}
                onChange={(date) =>
                  setCancerDetails((prev) => ({
                    ...prev,
                    type: prev.type,
                    stage: prev.stage,
                    date: date,
                  }))
                }
                disabled={!isCancer || formDisabled}
                maxDate={new Date()}
                slots={{ textField: TextField }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { maxWidth: 250 },
                  },
                }}
              />
            </LocalizationProvider>
          </Stack>
          {isCancer && (
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl fullWidth sx={{ flex: 1 }}>
                <InputLabel>Type of Cancer</InputLabel>
                <Select
                  value={cancerDetails.type}
                  onChange={(e) =>
                    setCancerDetails((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  label="Type of Cancer"
                >
                  {cancerTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Stage of Cancer"
                value={cancerDetails.stage}
                onChange={(e) =>
                  setCancerDetails((prev) => ({
                    ...prev,
                    stage: e.target.value,
                  }))
                }
                fullWidth
                sx={{ flex: 1 }}
              />
            </Stack>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}

export default EditMedicalHistoryForm;
