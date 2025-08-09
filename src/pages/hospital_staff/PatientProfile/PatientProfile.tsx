import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PatientProfile.module.scss";
import { useLocation, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import BasicTabs from "./Tabs";
import { useSelector } from "react-redux/es/hooks/useSelector";
import DischargeDialog from "../InpatientList/DischargeDialog/DischargeDialog";
import { setCurrPatient } from "../../../store/currentPatient/currentPatient.action";
import { setTimeline } from "../../../store/currentPatient/currentPatient.action";
import {
  selectCurrPatient,
  selectTimeline
} from "../../../store/currentPatient/currentPatient.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useDispatch } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { getAge } from "../../../utility/global";
import { setLoading, setError } from "../../../store/error/error.action";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import { testType, wardType } from "../../../types";
import TransferPatientDialog from "./transferPatientDialog";
import { Handshake } from "@mui/icons-material";
import HandshakeDialog from "../../../component/PatientProfile/Handshake/HandshakeDialoge";
import RequestSurgeryDialog from "./RequestSurgeryDialog";
import PrintDialog from "./PrintDialog";
import MyDocument from "../../../component/DischargeReport/MyDocument";
import { usePrintInPatientStore, Reminder } from "../../../store/zustandstore";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Surgery_Light_Icon from "../../../assets/surgery_light.png"
import Surgery_Dark_Icon from "../../../assets/surgery.png"
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import DownloadIcon from "../../../assets/Vector.png"
import { downloadFile } from '../../../utility/reportsDownload';


// Define the interface for the full data
interface FullSurgeryData {
  id: number;
  patientTimeLineID: number;
  physicalExamination: any; // Define more specific types if needed
  preopRecord: any; // Define more specific types if needed
  consentForm: any; // Define more specific types if needed
  anesthesiaRecord: any; // Define more specific types if needed
  hospitalID: number;
  postopRecord: any; // Define more specific types if needed
  status: string;
  addedOn: string;
  approvedTime: string | null;
  scheduleTime: string | null;
  completedTime: string | null;
  patientType: string;
  surgeryType: string;
  rejectReason: string;
}

interface SurgeryData {
  status: string;
  addedOn: string;
  hospitalID: number;
  patientType: string;
  surgeryType: string;
  rejectReason: string;
}

function PatientProfile() {
  const [openDischargeDialog, setOpenDischargeDialog] = React.useState(false);
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const timeline = useSelector(selectTimeline);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const staffRole = location.state?.staffRole || "";
  const { id } = useParams();
  const [wardList, setWardList] = React.useState<wardType[]>([]);
  const [openTransferForm, setOpenTransferForm] = React.useState(false);
  const [openHanshakeDialog, setOpenHandshakeDialog] = React.useState(false);
  const [printDialogBox, setPrintDialogBox] = React.useState(false);
  const getWardDataApi = useRef(true);
  const getCurrentPatientAndTimelineApi = useRef(true);
  const [openRequestSurgeryForm, setOpenRequestSurgeryForm] =
    React.useState(false);
  const [printSelectOptions, setPrintSelectOptions] = useState<string[]>([]);
  const [options, setOptions] = React.useState<string[]>([]);
  const [selectedTestList, setSelectedTestList] = React.useState<testType[]>(
    []
  );
  const [previousMedHistoryList, setPreviousMedHistoryList] = React.useState(
    []
  );
  const [, setIsPrintingReports] = React.useState(false);

  // ================reject dailog box==================
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [surgeryData, setSurgeryData] = useState<SurgeryData[]>([]);
  const [selectKey, setSelectKey] = useState(0);

  const handleClickOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    setSymptoms,
    setReminder,
    setVitalAlert,
    setMedicineHistory,
    setVitalFunction,
    vitalAlert,
    reminder,
    medicalHistory,
    symptoms,
    reports,
    setReports,
    vitalFunction
  } = usePrintInPatientStore();

  React.useEffect(() => {
    const getSurgeryStatus = async (
      patientTimeLineID: number,
      hospitalID: number
    ): Promise<void> => {
      if (patientTimeLineID) {
        try {
          const response = await authFetch(
            `ot/${hospitalID}/${patientTimeLineID}/getOTData`,
            user.token
          );

          if (response.status === 200) {
            // Parse the JSON data from the response
            const data: FullSurgeryData[] = response.data;

            const formatDate = (dateString: string): string => {
              const date = new Date(dateString);
              return `${date.getFullYear()}/${(
                "0" +
                (date.getMonth() + 1)
              ).slice(-2)}/${("0" + date.getDate()).slice(-2)} ${(
                "0" + (date.getHours() % 12 || 12)
              ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)} ${
                date.getHours() >= 12 ? "PM" : "AM"
              }`;
            };

            const finaldata: SurgeryData[] = data.map((item: any) => ({
              status: item.status,
              addedOn: formatDate(item.addedOn),
              hospitalID: item.hospitalID,
              patientType: item.patientType,
              surgeryType: item.surgeryType,
              rejectReason: item.rejectReason
            }));
            // Update the state with the extracted data
            setSurgeryData(finaldata);
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    };

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
          //this function calling for getting surgery data
          await getSurgeryStatus(
            responseTimeline?.patientTimeLine?.id,
            responseTimeline?.patientTimeLine?.hospitalID
          );
          dispatch(
            setTimeline({ timeline: { ...responseTimeline.patientTimeLine } })
          );
        }
      }
      dispatch(setLoading(false));
    };

    const getWardData = async () => {
      const wardResonse = await authFetch(
        `ward/${user.hospitalID}`,
        user.token
      );
      if (wardResonse.message == "success") {
        setWardList(wardResonse.wards);
      }
    };

    if (user.token) {
      if (getCurrentPatientAndTimelineApi.current) {
        getCurrentPatientAndTimelineApi.current = false;
        getCurrentPatientAndTimeline();
      }
      if (getWardDataApi.current) {
        getWardDataApi.current = false;
        getWardData();
      }
    }
  }, [dispatch, id, user]);

  // const {
  //   setSymptoms,
  //   setReminder,
  //   setVitalAlert,
  //   setMedicineHistory,
  //   setVitalFunction,
  //   vitalAlert,
  //   reminder,
  //   medicalHistory,
  //   symptoms,
  //   vitalFunction,
  //   setReports,
  //   reports,
  // } = usePrintInPatientStore();

  // const loadPrintData = async () => {
  //   dispatch(setLoading(true));

  //   const responseTimeline = await authFetch(
  //     `medicine/${timeline.id}/reminders/all`,
  //     user.token
  //   );
  //   // console.log("all medicine response", response);
  //   if (responseTimeline.message == "success") {
  //     setReminder(responseTimeline.reminders.sort(compareDates));
  //   }
  //   const alertResponse = await authFetch(
  //     `alerts/hospital/${user.hospitalID}/vitalAlerts/${currentPatient.id}`,
  //     user.token
  //   );
  //   if (alertResponse.message == "success") {
  //     setVitalAlert(alertResponse.alerts);
  //   }
  //   const responseSymptoms = await authFetch(
  //     `symptom/${timeline.id}`,
  //     user.token
  //   );
  //   // console.log("responseSymptoms while fetching all the symptom", responseSymptoms);
  //   if (responseSymptoms.message == "success") {
  //     setSymptoms(responseSymptoms.symptoms);
  //   }
  //   const responseMedicalHistory = await authFetch(
  //     `history/${user.hospitalID}/patient/${currentPatient.id}`,
  //     user.token
  //   );

  //   const responseReport = await authFetch(
  //     `attachment/${user.hospitalID}/all/${timeline.id}`,
  //     user.token
  //   );
  //   // console.log("resonse medical", responseMedicalHistory);
  //   if (responseMedicalHistory.message == "success") {
  //     setMedicineHistory(responseMedicalHistory.medicalHistory);
  //   }
  //   const vitalFunctionResponse = await authFetch(
  //     `vitals/${user.hospitalID}/functions/${timeline.id}`,
  //     user.token
  //   );
  //   if (vitalFunctionResponse.message == "success") {
  //     setVitalFunction(vitalFunctionResponse);
  //   }
  //   // console.log(
  //   //   responseTimeline.message,
  //   //   responseMedicalHistory.message,
  //   //   responseSymptoms.message,
  //   //   alertResponse.message
  //   // );
  //   if (responseReport.message == "success") {
  //     setReports(responseReport.attachments);
  //   }
  //   if (
  //     alertResponse.message == "success" &&
  //     responseSymptoms.message == "success" &&
  //     // responseMedicalHistory.message == "success" &&
  //     responseTimeline.message == "success"
  //   ) {
  //     const newWindow = window.open();
  //     if (newWindow) {
  //       newWindow.document.write(
  //         "<html><head><title>Patient Report</title></head><body></body></html>"
  //       );
  //       newWindow.document.body
  //         .appendChild(document.createElement("div"))
  //         .setAttribute("id", "pdf-viewer");
  //       ReactDOM.render(
  //         <PDFViewer style={{ width: "100%", height: "100vh" }}>
  //           <MyDocument
  //           // currentPatient={currentPatient}
  //           // data={{
  //           //   vitalAlert: alertResponse.alerts,
  //           //   reminder: responseTimeline.reminders.sort(compareDates),
  //           //   medicalHistory: responseMedicalHistory.medicalHistory,
  //           //   symptoms: responseSymptoms.symptoms,
  //           //   vitalFunction: vitalFunctionResponse,
  //           //   selectedTestList: testresponse.tests,
  //           // }}
  //           />
  //         </PDFViewer>,
  //         newWindow.document.getElementById("pdf-viewer")
  //       );
  //     }
  //     dispatch(setLoading(false));
  //   }
  // };
  // React.useEffect(()=>{},[button])
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     const button = document.querySelector("#pdf-link") as HTMLAnchorElement;
  //     console.log("new button", button);
  //     if (button) {
  //       button.click();
  //     }
  //   }, 2000);
  // }, [dataLoaded]);
  // console.log("current patient", patient);

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
    if (printSelectOptions.includes("tests")) {
      setIsPrintingReports(true); 
      await loadReportData(); 
  
      setPrintDialogBox(true);
    } else if (printSelectOptions.includes("generalInfo")) {
      setPrintDialogBox(true); 
    }
  };

  const loadPrintData = async () => {
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
      if (responseMedicalHistory.message === "success") {
        setMedicineHistory(responseMedicalHistory.medicalHistory);
        apisSuccesCount += 1;
      } else {
        dispatch(setError(responseMedicalHistory.message));
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

      if (apisSuccesCount == 7) {
        setTimeout(() => {
          const button = document.querySelector(
            "#pdf-link"
          ) as HTMLAnchorElement;

          if (button) {
            button.click();
          }
          setPrintSelectOptions([]); 
        }, 800);
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
    if(printSelectOptions.includes("generalInfo") && shouldPrint == true){
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
            console.log("Downloading:", report.fileName, "Type:", report.mimeType);
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
      setPrintSelectOptions([]);
      setSelectKey((prev) => prev + 1);
    }
  };

  const [primaryDrName, setprimaryDrName] = React.useState("");
  const [secondaryDrName, setsecondaryDrName] = React.useState("");

  const getAllDoctorsApi = useRef(true);
  const getAllDoctors = useCallback(async () => {
    try {
      const response = await authFetch(
        `doctor/${user.hospitalID}/${timeline.id}/all`,
        user.token
      );

      if (response.message === "success") {
        // Type assertion to ensure the data is an array of Doctor
        const doctors = response.data;
        setprimaryDrName(
          doctors.filter((each: any) => each.active == 1)[0]?.firstName
        );
        setsecondaryDrName(
          doctors.filter((each: any) => each.category == "secondary")[0]
            ?.firstName
        );
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  }, [timeline.id, user.hospitalID, user.token]);

  useEffect(() => {
    if (user.token && getAllDoctorsApi.current) {
      getAllDoctorsApi.current = false;
      getAllDoctors();
    }
  }, [user.token]);

  console.log("currentPatient====",currentPatient)
  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_header}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {/* <h3>
              <IconButton aria-label="delete">
                <ArrowForwardIosIcon />
              </IconButton>
            </h3>
            <h3 style={{ cursor: "pointer" }} onClick={() => navigate("../")}>
              In-Patient List
            </h3> */}
            <h3>
              <IconButton aria-label="delete">
                <ArrowForwardIosIcon />
              </IconButton>
            </h3>
            <h3>Patient Profile</h3>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {currentPatient.zone !== 3 && (
              <Tooltip title="Move the patient to another Ward(Internal or External)">
              <button
                className={styles.header_button + " " + styles.margin_left_auto}
                onClick={() => {
                  setOpenTransferForm(true);
                }}
                disabled={staffRole === "nurse"}
              >
                <TransferWithinAStationIcon />
                Transfer Patient
              </button>
              </Tooltip>
            )}

            {currentPatient.status === null && currentPatient.zone !== 3 && (
              <Tooltip title="Send a surgery request to surgeon for this patient">
              <button
                className={styles.header_button + " " + styles.margin_left_auto}
                onClick={() => {
                  setOpenRequestSurgeryForm(true);
                }}
                disabled={staffRole === "nurse"}
              >
                <img src={Surgery_Light_Icon} alt="surgery_light" width="20px"/>
                Request Surgery
              </button>
              </Tooltip>
            )}
            {currentPatient.status !== null && (
              <Tooltip title="Send a surgery request to surgeon for this patient">
              <button
                style={{ backgroundColor: "gray" }}
                onClick={handleClickOpen}
                className={styles.header_button + " " + styles.margin_left_auto}
              >
                <img src={Surgery_Dark_Icon} alt="surgery_dark" width="20px"/>
                Request Surgery
              </button>
              </Tooltip>
            )}

            {currentPatient.zone !== 3 && (
              <Tooltip title="Handover the patient to another doctor or Department">
              <button
                className={styles.header_button}
                onClick={() => {
                  setOpenHandshakeDialog(true);
                }}
              >
                <Handshake />
                Handshake Patient
              </button>
              </Tooltip>
            )}
          </div>
        </div>
        <div className={styles.profile_container}>
          <div className={styles.profile_img} onClick={() => navigate(`edit`)}>
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
                <p>
                  {" "}
                  Gender:{" "}
                  {currentPatient?.gender == 1
                    ? "Male"
                    : currentPatient?.gender == 2
                    ? "Female"
                    : "Others"}
                </p>
                <p>
                  Age: {currentPatient.dob ? getAge(currentPatient?.dob) : ""}
                </p>
                <p>
                  {currentPatient?.city}, {currentPatient?.state}{" "}
                </p>
              </div>
              <div className={styles.profile_info_right}>
                <p style={{ marginTop: "0" }}>
                  Date of Admission:{" "}
                  {currentPatient?.startTime &&
                    new Date(currentPatient?.startTime).toLocaleDateString(
                      "en-GB"
                    )}
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
                        ' ' +
                        currentPatient?.lastName)}
                </p>
                <p>
                  Ward:{" "}
                  {timeline?.wardID
                    ? wardList.find((ward) => ward.id == timeline.wardID)?.name
                    : ""}
                </p>

                {primaryDrName && <p>Primary Doctor: {primaryDrName}</p>}
                {secondaryDrName && <p>Secondary Doctor: {secondaryDrName}</p>}
              </div>
            </div>
          </div>
          <div className={styles.profile_options}>
            <div className={styles.profile_options_inpatient}>Inpatient</div>
            <div className={styles.profile_options_discharge}>
              <button
                className={styles.discharge_button}
                onClick={() => setOpenDischargeDialog((el) => !el)}
              >
                Discharge
              </button>
              <IconButton aria-label="edit" onClick={() => navigate(`edit`)}>
                <EditIcon />
              </IconButton>

             
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
                // onClick={handlePrintClick}
                // disabled={printSelectOptions.length === 0}
                style={{ color: "#1976d2", padding: "7px", margin: 0,marginLeft:"10px" }}
              >
                {/* <PrintIcon sx={{ color: "white" }} /> */}
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
            
              {/* <button onClick={() => setPrintDialogBox(true)}>CHECK</button> */}
            </div>
          </div>
        </div>
        <div className={styles.profile_tabs}>
          <BasicTabs />
        </div>
      </div>
      <DischargeDialog
        setOpen={setOpenDischargeDialog}
        open={openDischargeDialog}
        userId={Number(id)}
      />
      {openTransferForm ? (
        <TransferPatientDialog
          open={openTransferForm}
          setOpen={setOpenTransferForm}
        />
      ) : (
        ""
      )}
      {openHanshakeDialog ? (
        <HandshakeDialog
          open={openHanshakeDialog}
          setOpen={setOpenHandshakeDialog}
        />
      ) : (
        ""
      )}
      {openRequestSurgeryForm ? (
        <RequestSurgeryDialog
          open={openRequestSurgeryForm}
          setOpen={setOpenRequestSurgeryForm}
          id={currentPatient.patientTimeLineID}
        />
      ) : (
        ""
      )}
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

      {/* ====================dailog box for reject============== */}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "50%" // Set the min width to 50% of the parent container
          }
        }}
      >
        <DialogTitle id="responsive-dialog-title">
          {"Surgery Status"}
        </DialogTitle>
        <DialogContent>
          {surgeryData.map((data, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px"
              }}
            >
              <TextField
                fullWidth
                margin="dense"
                label="Request Surgery Date"
                type="text"
                value={data.addedOn}
                InputProps={{
                  readOnly: true
                }}
                variant="outlined"
              />
              {/* Status Field */}
              <TextField
                fullWidth
                margin="dense"
                label="Status"
                type="text"
                value={data.status}
                InputProps={{
                  readOnly: true
                }}
                variant="outlined"
              />

              {/* Hospital ID Field */}

              {/* Patient Type Field */}
              <TextField
                fullWidth
                margin="dense"
                label="Patient Type"
                type="text"
                value={data.patientType}
                InputProps={{
                  readOnly: true
                }}
                variant="outlined"
              />

              {/* Surgery Type Field */}
              <TextField
                fullWidth
                margin="dense"
                label="Surgery Type"
                type="text"
                value={data.surgeryType}
                InputProps={{
                  readOnly: true
                }}
                variant="outlined"
              />

              {/* Reject Reason Field */}
              {data.rejectReason && (
                <TextField
                  fullWidth
                  margin="dense"
                  label="Reject Reason"
                  type="text"
                  value={data.rejectReason}
                  multiline
                  rows={2}
                  InputProps={{
                    readOnly: true
                  }}
                  variant="outlined"
                />
              )}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            close
          </Button>
        </DialogActions>
      </Dialog>

      <div>
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
    </>
  );
}

export default PatientProfile;
// function compareDates(a: Reminder, b: Reminder) {
//   return new Date(a.dosageTime).valueOf() - new Date(b.dosageTime).valueOf();
// }

function compareDates(a: Reminder, b: Reminder) {
  return new Date(a.dosageTime).valueOf() - new Date(b.dosageTime).valueOf();
}
