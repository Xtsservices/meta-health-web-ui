import React, { useRef } from "react";
import styles from "./PatientProfile.module.scss";
import { useParams } from "react-router-dom";
import add_icon from "./../../../../src/assets/addstaff/add_icon.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import BasicTabs from "./Tabs";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { setCurrPatient } from "../../../store/currentPatient/currentPatient.action";
import { setTimeline } from "../../../store/currentPatient/currentPatient.action";
import {
  selectCurrPatient,
  selectTimeline
} from "../../../store/currentPatient/currentPatient.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useDispatch } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import PatientRevisitDialog from "./RevisitDialog";
import { getAge } from "../../../utility/global";
import { Reminder, usePrintInPatientStore } from "../../../store/zustandstore";
import MyDocument from "../../../component/DischargeReport/MyDocument";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { setError, setLoading } from "../../../store/error/error.action";
import { followUpStatus } from "../../../utility/role";
import { testType } from "../../../types";
import PrintDialog from "../PatientProfile/PrintDialog";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import DownloadIcon from "../../../assets/Vector.png"
import DischargeTemplate from "../../../component/DischargeReport/DischargeTemplate";
//const BASE_URL = import.meta.env.VITE_BASE_URL;
import { downloadFile } from '../../../utility/reportsDownload';

function DischargePatientProfile() {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const timeline = useSelector(selectTimeline);
  const dispatch = useDispatch();
  const [printDialogBox, setPrintDialogBox] = React.useState(false);
  const [PrintReport, setPrintReport] = React.useState(false);

  const { id } = useParams();
  // const [age, setAge] = React.useState("");
  const [openRevisitDialog, setOpenRevisitDialog] = React.useState(false);
  const getCurrentPatientAndTimelineApi = useRef(true);
  const [previousMedHistoryList, setPreviousMedHistoryList] = React.useState(
    []
  );
  const [printSelectOptions, setPrintSelectOptions] = React.useState<string[]>(
    []
  );
  const [options, setOptions] = React.useState<string[]>([]);
  const [selectedTestList, setSelectedTestList] = React.useState<testType[]>(
    []
  );
  const [selectKey, setSelectKey] = React.useState(0);
  // React.useEffect(() => {
  //   if (currentPatient.dob) {
  //     const birthDate = new Date(currentPatient.dob);
  //     const currentDate = new Date();

  //     const ageYears = currentDate.getFullYear() - birthDate.getFullYear();
  //     const ageMonths =
  //       currentDate.getMonth() -
  //       birthDate.getMonth() +
  //       (currentDate.getDate() < birthDate.getDate() ? -1 : 0);

  //     const ageString = `${ageYears} yr, ${ageMonths} month`;
  //     // console.log(ageString);
  //     setAge(ageString);
  //   }
  // }, [currentPatient]);

  const {
    setSymptoms,
    setReminder,
    setVitalAlert,
    setMedicineHistory,
    setVitalFunction,
    setReports,
    vitalAlert,
    reminder,
    medicalHistory,
    symptoms,
    reports,
    vitalFunction
  } = usePrintInPatientStore();

  React.useEffect(() => {
    const getCurrentPatientAndTimeline = async () => {
      dispatch(setLoading(true));
      const response = await authFetch(
        `patient/${user.hospitalID}/patients/single/${id}`,
        user.token
      );
      if (response.message == "success") {
        dispatch(setCurrPatient({ currentPatient: { ...response.patient } }));
        const responseTimeline = await authFetch(
          `patientTimeLine/${response.patient.id}`,
          user.token
        );
        if (responseTimeline.message == "success") {
          // console.log(responseTimeline);
          // console.log("response from timeline", responseTimeline.count[0]);
          dispatch(
            setTimeline({ timeline: { ...responseTimeline.patientTimeLine } })
          );
        }
      }
      dispatch(setLoading(false));
    };
    if (user.token && getCurrentPatientAndTimelineApi.current) {
      getCurrentPatientAndTimelineApi.current = false;
      getCurrentPatientAndTimeline();
    }
  }, [dispatch, id, user]);

  const [, setIsPrintingReports] = React.useState(false);

  const loadReportData = async () => {
    dispatch(setLoading(true));
    try {
      const responseReport = await authFetch(
        `attachment/${user.hospitalID}/all/${timeline.patientID}`,
        user.token
      );
      console.log("responseReport", responseReport);

      if (responseReport.message === "success" && responseReport.attachments) {
        setReports(responseReport.attachments);
      } else {
        dispatch(setError(responseReport.message));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePrintClick = async () => {
    console.log("Print Button clicked!!");
    console.log("Print Selected Options", printSelectOptions);

    if (printSelectOptions.includes("tests")) {
      setIsPrintingReports(true); 
      await loadReportData(); 
  
      setPrintDialogBox(true);
    } else if (printSelectOptions.includes("generalInfo")) {
      setPrintDialogBox(true); 
    }
  };
  



  const loadPrintData = async () => {
    console.log("object,1",1)
    dispatch(setLoading(true));
    let apisSuccesCount = 0; //total 7 apis
    try {
      const responseTimeline = await authFetch(
        `medicine/${timeline.id}/reminders/all`,
        user.token
      );
      if (responseTimeline.message === "success") {
        setReminder(responseTimeline.reminders.sort(compareDates));
        apisSuccesCount += 1;
      }

      //get previous all med list
      const responsePreviousMedHistory = await authFetch(
        `medicine/${timeline.id}/previous/allmedlist`,
        user.token
      );
      if (responsePreviousMedHistory.message === "success") {
        setPreviousMedHistoryList(responsePreviousMedHistory.previousMedList);
        apisSuccesCount += 1;
      }

      const response = await authFetch(`test/${currentPatient.id}`, user.token);
      if (response.message == "success") {
        setSelectedTestList(response.tests);
        apisSuccesCount += 1;
      }
      console.log("setSelectedTestListresponse",response)

      const alertResponse = await authFetch(
        `alerts/hospital/${user.hospitalID}/vitalAlerts/${timeline.id}`,
        user.token
      );
      if (alertResponse.message === "success") {
        setVitalAlert(alertResponse.alerts);
        apisSuccesCount += 1;
      }

      const responseSymptoms = await authFetch(
        `symptom/${currentPatient.id}`,
        user.token
      );

      if (responseSymptoms.message === "success") {
        setSymptoms(responseSymptoms.symptoms);
        apisSuccesCount += 1;
      }

      const responseMedicalHistory = await authFetch(
        `history/${user.hospitalID}/patient/${currentPatient.id}`,
        user.token
      );
      console.log("responseMedicalHistory", responseMedicalHistory);
      if (responseMedicalHistory.message === "success") {
        setMedicineHistory(responseMedicalHistory.medicalHistory);
        apisSuccesCount += 1;
      } else {
        dispatch(setError(responseMedicalHistory.message));
      }

      const responseReport = await authFetch(
        `attachment/${user.hospitalID}/all/${timeline.patientID}`,
        user.token
      );
      console.log("responseReport", responseReport);
      if (responseReport.message === "success" && responseReport.attachments) {
        setReports(responseReport.attachments);
        apisSuccesCount += 1;
      } else {
        dispatch(setError(responseReport.message));
      }

      const vitalFunctionResponse = await authFetch(
        `vitals/${user.hospitalID}/functions/${currentPatient.id}`,
        user.token
      );
      if (vitalFunctionResponse.message === "success") {
        const { message, ...rest } = vitalFunctionResponse;
        setVitalFunction(rest);
        apisSuccesCount += 1;
      }


      if (apisSuccesCount == 8) {
        setPrintReport(true)
        setTimeout(() => {
          setPrintReport(false)
        }, 100);
        

       
      } else {
        dispatch(setError("Failed to Download Report"));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };



  const handlePrintOptionChange = (event: any) => {
    const selectedOptions = event.target.value as string[];
    setPrintSelectOptions(selectedOptions);
  };

  React.useEffect(() => {
    if (printSelectOptions.length > 0) {
      handlePrintClick();
    }
  }, [printSelectOptions]);

  const updateTheSelectedPrintOptions = async (options: string[], shouldPrint: Boolean) => {
    setPrintSelectOptions(options);
    setOptions(options);
    if (printSelectOptions.includes("generalInfo") && shouldPrint == true  ) {
      setPrintSelectOptions(options);
      loadPrintData();
    }
    const filteredReports = reports.filter((report) => {
      if (options.includes("Radiology") && (report.category === "radiology" || report.category === "1")) {
        return true;
      }
      if (options.includes("Pathology") && (report.category === "pathology" || report.category === "2")) {
        return true;
      }
      return false;
    });
    if (filteredReports.length === 0) {
      console.warn("No reports found for selected options.");
      setPrintSelectOptions([]);
      setSelectKey((prev) => prev + 1); 
      setIsPrintingReports(false);
      return;
    }
  
    try {
      await Promise.all(
        filteredReports.map((report) => {
          if (report.fileURL) {
            return downloadFile(report.fileURL, report.fileName, report.mimeType);
          } else {
            console.error("No file URL available for report:", report);
            return Promise.resolve(); 
          }
        })
      );
    } catch (error) {
      console.error("Error downloading one or more files:", error);
    } finally {
      setIsPrintingReports(false);
      setSelectKey((prev) => prev + 1);
      setPrintSelectOptions([]);
    }
  };


  console.log("PrintReport",PrintReport)

  return (
    <div className={styles.container}>
      <div className={styles.container_header}>
        <h3>
          <IconButton aria-label="delete" onClick={() => navigate("../")}>
            <ArrowBackIosIcon />
          </IconButton>
        </h3>
        <h3>Patient Profile</h3>

       
            
        <button
          className={styles.header_button}
          onClick={() => setOpenRevisitDialog(true)}
        >
          <img src={add_icon} alt="" className="" />
          Patient Revisit
        </button>
      </div>
      <div className={styles.profile_container}>
        <div className={styles.profile_img}>
          {/* <img src={profile_pic} alt="" /> */}
          {currentPatient.imageURL && (
            <img
              src={currentPatient.imageURL}
              alt=""
              className={styles.profile}
            />
          )}
          {/* <img src={profile_pic} alt="" className={styles.profile} /> */}
          {!currentPatient.imageURL && (
            <PersonIcon className={styles.profile} />
          )}
        </div>
        <div className={styles.profile_info}>
          <h3>
            {currentPatient?.pName?.slice(0, 1).toUpperCase() +
              currentPatient?.pName?.slice(1).toUpperCase()}{" "}
            <span>|</span>
            <span style={{ fontSize: "14px" }}>
              {" "}
              UHID No: {currentPatient?.pUHID}
            </span>
          </h3>
          <div className={styles.profile_info_main}>
            <div className={styles.profile_info_left}>
              <p> Gender: {currentPatient?.gender == 1 ? "Male" : "Female"}</p>
              <p>
                Age: {currentPatient.dob ? getAge(currentPatient?.dob) : ""}
              </p>
              <p>
                {currentPatient?.city}, {currentPatient?.state}{" "}
              </p>
            </div>
            <div className={styles.profile_info_right}>
              <p>
                {" "}
                Date of Discharge:{" "}
                {timeline?.endTime &&
                  new Date(timeline?.endTime).toLocaleDateString()}
              </p>
              {/* <p>Guardian Name: given Name</p> */}
              <p>
                Treating Doctor:{" "}
                {(currentPatient?.doctorName &&
                  currentPatient?.doctorName.slice(0, 1).toUpperCase() +
                    currentPatient?.doctorName.slice(1).toLowerCase()) ||
                  (currentPatient?.firstName &&
                    currentPatient?.firstName?.slice(0, 1).toUpperCase() +
                      currentPatient?.firstName?.slice(1).toLowerCase() +
                      " " +
                      currentPatient?.lastName)}
              </p>
              <p>
                Follow Up:{" "}
                {Number(currentPatient?.followUpStatus || 0) ==
                followUpStatus.active
                  ? new Date(currentPatient?.followUpDate || "")
                      .toLocaleString("en-Gb")
                      .split(",")[0]
                  : "No Follow up"}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.profile_options}>
          <div
            className={styles.profile_options_inpatient}
            style={{ background: "#F79797", color: "white" }}
          >
            Discharged
          </div>
         

          <div>
            <div
              style={{
                backgroundColor: "#1977f3",
                borderRadius: "35px",
                color: "white",
                display: "flex",
                alignItems: "center"
              }}
            >
              <IconButton
                // disabled={printSelectOptions.length === 0}
                style={{ color: "#1976d2", padding: "7px", margin: 0,marginLeft:"10px" }}
              >
                <img src={DownloadIcon} alt="" />
              </IconButton>
              <FormControl variant="outlined" size="small">
              {(printSelectOptions.length === 0) && <InputLabel
                sx={{
                  color: "white",
                  transform: "translateY(10px)",  
                  "&.Mui-focused": { color: "white", transform: "translateY(10px)",display:"none" }, 
                  border: "none",
                }}
              >
                Reports
              </InputLabel>}
                <Select
                  label="Select"
                  key={selectKey}
                  value={printSelectOptions}
                  onChange={handlePrintOptionChange}
                  style={{
                    minWidth:"100px",
                    borderRadius: "35px",
                    outline: "none",
                    backgroundColor: "transparent",
                    color:"white"
                  }}
                  sx={{
                    "& fieldset": { border: "none" }, 
                    "&:hover fieldset": { border: "none" }, 
                    "&.Mui-focused fieldset": { border: "none" }, 
                    "& .MuiSelect-icon": { color: "white" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: "15px", 
                        marginLeft: "-15px", 
                      },
                    },
                  }}
                >
                  <MenuItem value="generalInfo">Discharge Summary</MenuItem>
                  <MenuItem value="tests">Test Reports</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* <IconButton aria-label="delete">
              <PrintIcon onClick={() => setPrintDialogBox(true) } />
            </IconButton> */}

            {PrintReport&&
             <DischargeTemplate 
             currentPatient={currentPatient}
             data={{
               vitalAlert,
               reminder,
               medicalHistory,
               previousMedHistoryList,
               symptoms,
               reports,
               vitalFunction,
               selectedTestList
             }}
             printSelectOptions={options}
            />
            }
            
            <PDFDownloadLink
              document={
                <MyDocument
                  currentPatient={currentPatient}
                  data={{
                    vitalAlert,
                    reminder,
                    medicalHistory,
                    previousMedHistoryList,
                    symptoms,
                    reports,
                    vitalFunction,
                    selectedTestList
                  }}
                  printSelectOptions={options}
                />
              }
              fileName="document.pdf"
              style={{ display: "none" }}
            >
              {() => <button id="pdf-link">Generating PDF...</button>}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
      <div className={styles.profile_tabs}>
        <BasicTabs />
      </div>
      <PatientRevisitDialog
        setOpen={setOpenRevisitDialog}
        open={openRevisitDialog}
      />
      {printDialogBox ? (
        <PrintDialog
          open={printDialogBox}
          setOpen={setPrintDialogBox}
          updateTheSelectedPrintOptions={updateTheSelectedPrintOptions}
          id={id ?? ""}
          type={`${printSelectOptions}`}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default DischargePatientProfile;

function compareDates(a: Reminder, b: Reminder) {
  return new Date(a.dosageTime).valueOf() - new Date(b.dosageTime).valueOf();
}
