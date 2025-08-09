import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PreOpRecordTab from "./PreOpRecordTab/PreOpRecordTab";
import AnesthesiaRecordTab from "./AnesthesiaRecordTab/AnesthesiaRecordTab";
// import Reports from './ConsentForm/Reports';
import ReportsTab from "./ConsentForm/Reports";
import PhysicalExaminationTab from "./PhysicalExaminationTab/PhysicalExaminationTab";
import PatientFileTab from "./PatientFileTab/PatientFileTab";
import PostOpRecordTab from "./PostOpRecordTab/PostOpRecordTab";
import useOTConfig, {
  OTPatientStages,
  OTUserTypes,
} from "../../../store/formStore/ot/useOTConfig";
import usePatientFileStore from "../../../store/formStore/ot/usePatientFileForm";
import usePhysicalExaminationForm from "../../../store/formStore/ot/usePhysicalExaminationForm";
import usePreOpStore from "../../../store/formStore/ot/usePreOPForm";
import usePostOPStore from "../../../store/formStore/ot/usePostOPForm";
import useAnesthesiaForm from "../../../store/formStore/ot/useAnesthesiaForm";
import ScheduleTab from "./TreatmentTab/ScheduleTab/ScheduleTab";
import { authFetch } from "../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useParams } from "react-router-dom";
import { selectCurrPatient } from "../../../store/currentPatient/currentPatient.selector";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Typography>{children}</Typography>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const user = useSelector(selectCurrentUser);
  const { id } = useParams();
  const [value, setValue] = React.useState(0);
  const [isChangeAllowed, setIsChangeAllowed] = React.useState(false); // Indicates on tab click, tab change
  const {
    userType,
    patientStage,
    unsetInitialTabsReadOnly,
    setInitialTabsReadOnly,
  } = useOTConfig();
  const currentPatient = useSelector(selectCurrPatient);
  const { resetAll: resetPatientFileStore } = usePatientFileStore();
  const {
    resetAll: resetPhysicalExaminationForm,
    setMainFormFields,
    setExaminationFindingNotes,
    setGeneralPhysicalExamination,
    setMallampatiGrade,
    setRespiratory,
    setHepato,
    setCardioVascular,
    setNeuroMuscular,
    setRenal,
    setOthers,
  } = usePhysicalExaminationForm();
  const {
    resetAll: resetPreOpStore,
    // setMedications,
    setNotes,
    setRiskConsent,
    setArrangeBlood,
    addTest,
  } = usePreOpStore();
  const { resetAll: resetPostOpStore } = usePostOPStore();
  const { resetAll: resetAnesthesiaForm } = useAnesthesiaForm();

  const handleChange = React.useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      if (isChangeAllowed) setValue(newValue);
    },
    [isChangeAllowed]
  );

  const isSurgeonSchedulePending =
    userType === OTUserTypes.SURGEON &&
    patientStage === OTPatientStages.APPROVED;

  const incrementTab = () => setValue((value) => value + 1);

  // Clean all the stores
  React.useEffect(() => {
    resetPatientFileStore();
    resetPhysicalExaminationForm();
    resetPreOpStore();
    resetPostOpStore();
    resetAnesthesiaForm();
  }, [
    resetPatientFileStore,
    resetPhysicalExaminationForm,
    resetPostOpStore,
    resetPreOpStore,
    resetAnesthesiaForm,
  ]);

  React.useEffect(() => {
    const getOTData = async () => {
      try {
        const response = await authFetch(
          `ot/${user.hospitalID}/${currentPatient.patientTimeLineID}/getOTData`,
          user.token
        );
        if (response.status == 200) {
          const physicalExaminationData = response.data[0].physicalExamination;
          if (physicalExaminationData) {
            setRenal(physicalExaminationData.renal);
            setHepato(physicalExaminationData.hepato);
            setOthers(physicalExaminationData.others);
            setRespiratory(physicalExaminationData.respiratory);
            setNeuroMuscular(physicalExaminationData.neuroMuscular);
            setCardioVascular(physicalExaminationData.cardioVascular);
            setMainFormFields(physicalExaminationData.mainFormFields);
            setMallampatiGrade(physicalExaminationData.mallampatiGrade);
            setExaminationFindingNotes(
              physicalExaminationData.examinationFindingNotes
            );
            setGeneralPhysicalExamination(
              physicalExaminationData.generalphysicalExamination
            );
          }
          const preOPData = response.data[0].preopRecord;
          if (preOPData) {
            setNotes(preOPData.notes);
            addTest(preOPData.tests);
            // setMedications(preOPData.medications);
            setRiskConsent(preOPData.riskConsent);
            setArrangeBlood(preOPData.arrangeBlood);
          }
        }
      } catch (error) {
        // console.log("error");
      }
    };
    if (user.token && currentPatient.patientTimeLineID) {
      getOTData();
    }
  }, [
    user.token,
    currentPatient.patientTimeLineID,
    id,
    setRenal,
    setHepato,
    setOthers,
    setRespiratory,
    setNeuroMuscular,
    setCardioVascular,
    setMainFormFields,
    setMallampatiGrade,
    setExaminationFindingNotes,
    setGeneralPhysicalExamination,
    setNotes,
    addTest,
    setRiskConsent,
    setArrangeBlood,
  ]);

  // useEffect sets whether tabs are disabled or not (work only w/ next handler)
  // sets read only mode for certain panels/tabs
  React.useEffect(() => {
    if (
      (userType === OTUserTypes.ANESTHETIST &&
        patientStage > OTPatientStages.PENDING) ||
      userType === OTUserTypes.SURGEON
    )
      setIsChangeAllowed(true);

    if (
      userType === OTUserTypes.ANESTHETIST &&
      patientStage === OTPatientStages.PENDING
    )
      unsetInitialTabsReadOnly();
    else setInitialTabsReadOnly();
  }, [
    userType,
    patientStage,
    unsetInitialTabsReadOnly,
    setInitialTabsReadOnly,
  ]);

  const isAnesthesiaFormVisible = React.useMemo(() => {
    if (
      patientStage > OTPatientStages.APPROVED &&
      userType === OTUserTypes.ANESTHETIST
    )
      return true;
    if (
      patientStage >= OTPatientStages.SCHEDULED &&
      userType === OTUserTypes.SURGEON
    )
      return true;
    return false;
  }, [patientStage, userType]);
  const isConsentFormVisible = React.useMemo(() => {
    if (
      patientStage > OTPatientStages.APPROVED &&
      userType === OTUserTypes.ANESTHETIST
    )
      return true;
    if (
      patientStage >= OTPatientStages.SCHEDULED &&
      userType === OTUserTypes.SURGEON
    )
      return true;
    return false;
  }, [patientStage, userType]);
  const isPostOPFormVisible = React.useMemo(() => {
    if (
      patientStage > OTPatientStages.APPROVED &&
      userType === OTUserTypes.ANESTHETIST
    )
      return true;
    if (
      patientStage >= OTPatientStages.SCHEDULED &&
      userType === OTUserTypes.SURGEON
    )
      return true;
    return false;
  }, [patientStage, userType]);

  return (
    <Box>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          overflowX: "auto",
          width: "100%",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            component={(props: object) => (
              <Button
                variant="contained"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            tabIndex={0}
            label="PATIENT FILE"
            disabled={!isChangeAllowed}
            {...a11yProps(0)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />
          <Tab
            component={(props: object) => (
              <Button
                variant="contained"
                // color="primary"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            tabIndex={1}
            disabled={!isChangeAllowed}
            label="PHYSICAL EXAMINATION"
            {...a11yProps(1)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />
          <Tab
            component={(props: object) => (
              <Button
                variant="contained"
                // color="primary"
                {...props}
                sx={{
                  marginRight: "12px",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
            label="PRE-OP RECORD"
            tabIndex={2}
            disabled={!isChangeAllowed}
            {...a11yProps(2)}
            sx={{
              marginRight: "12px",
              "&.Mui-selected": {
                borderRadius: "4px",
                background: "#1977F3",
                color: "white",
              },
            }}
          />

          {isConsentFormVisible && (
            <Tab
              component={(props: object) => (
                <Button
                  variant="contained"
                  // color="primary"
                  {...props}
                  sx={{
                    marginRight: "12px",
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                />
              )}
              label="CONSENT FORM"
              tabIndex={3}
              {...a11yProps(3)}
              sx={{
                marginRight: "12px",
                "&.Mui-selected": {
                  borderRadius: "4px",
                  background: "#1977F3",
                  color: "white",
                },
              }}
            />
          )}

          {isAnesthesiaFormVisible && (
            <Tab
              component={(props: object) => (
                <Button
                  variant="contained"
                  // color="primary"
                  {...props}
                  sx={{
                    marginRight: "12px",
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                />
              )}
              label="ANESTHESIA RECORD"
              tabIndex={4}
              {...a11yProps(4)}
              sx={{
                marginRight: "12px",
                "&.Mui-selected": {
                  borderRadius: "4px",
                  background: "#1977F3",
                  color: "white",
                },
              }}
            />
          )}

          {isSurgeonSchedulePending && (
            <Tab
              component={(props: object) => (
                <Button
                  variant="contained"
                  // color="primary"
                  {...props}
                  sx={{
                    marginRight: "12px",
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                />
              )}
              label={"SCHEDULE"}
              tabIndex={4}
              {...a11yProps(4)}
              sx={{
                marginRight: "12px",
                "&.Mui-selected": {
                  borderRadius: "4px",
                  background: "#1977F3",
                  color: "white",
                },
              }}
            />
          )}

          {isPostOPFormVisible && (
            <Tab
              component={(props: object) => (
                <Button
                  variant="contained"
                  // color="primary"
                  {...props}
                  sx={{
                    marginRight: "12px",
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                />
              )}
              label="POST OP-RECORD"
              tabIndex={5}
              {...a11yProps(5)}
              sx={{
                marginRight: "12px",
                "&.Mui-selected": {
                  borderRadius: "4px",
                  background: "#1977F3",
                  color: "white",
                },
              }}
            />
          )}
        </Tabs>
      </Box>
      <div style={{ minHeight: "40rem" }}>
        <TabPanel value={value} index={0}>
          <PatientFileTab incrementTab={incrementTab} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PhysicalExaminationTab incrementTab={incrementTab} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <PreOpRecordTab incrementTab={incrementTab} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          {isSurgeonSchedulePending ? <ScheduleTab /> : <ReportsTab />}
        </TabPanel>
        <TabPanel value={value} index={4}>
          <AnesthesiaRecordTab incrementTab={incrementTab} />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <PostOpRecordTab />
        </TabPanel>
      </div>
    </Box>
  );
}
