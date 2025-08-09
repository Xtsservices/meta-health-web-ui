import React, { useRef, useState } from "react";
import styles from "./PatientProfile.module.scss";
import { useLocation, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

// import profile_pic from "./../../../../src/assets/profile.png";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import PrintIcon from '@mui/icons-material/Print';
import BasicTabs from "./Tabs";
import { useSelector } from "react-redux/es/hooks/useSelector";
// import DischargeDialog from "../InpatientList/DischargeDialog/DischargeDialog";
import DischargeDialog from "./DischargeDialog/DischargeDialog";
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
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Reminder, usePrintInPatientStore } from "../../../store/zustandstore";
import { setError, setLoading } from "../../../store/error/error.action";
import { testType, wardType } from "../../../types";
import TransferPatientDialog from "./../../common/emergency/transferPatientDialog";
import MyDocument from "../../../component/DischargeReport/MyDocument";
// import ReactDOM from 'react-dom';
import { Handshake } from '@mui/icons-material';
import PrintDialog from '../../hospital_staff/PatientProfile/PrintDialog';
import HandshakeDialog from '../../../component/PatientProfile/Handshake/HandshakeDialoge';
import RequestSurgeryDialog from '../../hospital_staff/PatientProfile/RequestSurgeryDialog';
import Surgery_Light_Icon from "../../../assets/surgery_light.png"
import Surgery_Dark_Icon from "../../../assets/surgery.png"
import { Tooltip } from '@mui/material';
import DownloadIcon from "../../../assets/Vector.png"
import { downloadFile } from '../../../utility/reportsDownload';



function EmergencyYellowPatientProfile() {
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const timeline = useSelector(selectTimeline);
  const dispatch = useDispatch();
  const location = useLocation();
  const staffRole = location.state?.staffRole || "";  
  const { id } = useParams();
  const [wardList, setWardList] = React.useState<wardType[]>([]);
  const [openTransferForm, setOpenTransferForm] = React.useState(false);
  const [openRequestSurgeryForm, setOpenRequestSurgeryForm] =
    React.useState(false);
  const [printDialogBox, setPrintDialogBox] = React.useState(false);
  const [openHanshakeDialog, setOpenHandshakeDialog] = React.useState(false);
  const [printSelectOptions, setPrintSelectOptions] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [previousMedHistoryList, setPreviousMedHistoryList] = React.useState(
    []
  );

  const [selectedTestList, setSelectedTestList] = React.useState<testType[]>(
    []
  );
  const [, setIsPrintingReports] = React.useState(false);
  const [selectKey, setSelectKey] = useState(0);

  const getCurrentPatientAndTimelineApi = useRef(true);
  const getWardDataApi = useRef(true);
  const getCurrentPatientAndTimeline = React.useCallback(async () => {
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
        dispatch(
          setTimeline({ timeline: { ...responseTimeline.patientTimeLine } })
        );
      }
    }
    dispatch(setLoading(false));
  }, [dispatch, id, user.hospitalID, user.token]);
  const { vitalAlert, reminder, medicalHistory, symptoms, vitalFunction } =
    usePrintInPatientStore();

  const getWardData = React.useCallback(async () => {
    const wardResonse = await authFetch(`ward/${user.hospitalID}`, user.token);
    if (wardResonse.message == "success") {
      setWardList(wardResonse.wards);
    }
  }, [user.hospitalID, user.token]);

  // console.log("current patient", time);
  React.useEffect(() => {
    if (user.token && getCurrentPatientAndTimelineApi.current) {
      getCurrentPatientAndTimelineApi.current = false;
      getCurrentPatientAndTimeline();
    }
    if (user.token && getWardDataApi.current) {
      getWardDataApi.current = false;
      getWardData();
    }
  }, [getCurrentPatientAndTimeline, getWardData, id, user]);

  const {
    setSymptoms,
    setReminder,
    setVitalAlert,
    setMedicineHistory,
    setVitalFunction,
    reports,
    setReports
  } = usePrintInPatientStore();

  ///////////////////////////Loading Data////////////////////////////////

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
      console.log("responseMedicalHistory", responseMedicalHistory);
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
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
  // React.useEffect(()=>{},[button])
  const [openDischargeDialog, setOpenDischargeDialog] = React.useState(false);
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

  const handlePrintOptionChange = (event: any) => {
    const selectedOptions = event.target.value as string[];
    setPrintSelectOptions(selectedOptions);
  };

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
      setSelectKey((prev) => prev + 1);
      setPrintSelectOptions([]); 
    }
  };

  React.useEffect(() => {
    if (printSelectOptions.length > 0) {
      handlePrintClick();
    }
  }, [printSelectOptions]);
  const navigate = useNavigate();

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
            <h3>
              <IconButton aria-label="delete">
                <ArrowForwardIosIcon />
              </IconButton>
            </h3>
            <h3 style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
              Patient List
            </h3>
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

            {currentPatient.status === null && (
              <Tooltip title="Send a surgery request to surgeon for this patient">
                <button
                  className={
                    styles.header_button + " " + styles.margin_left_auto
                  }
                  onClick={() => {
                    setOpenRequestSurgeryForm(true);
                  }}
                  disabled={staffRole === "nurse"}
                >
                  <img
                    src={Surgery_Light_Icon}
                    alt="surgery_light"
                    width="20px"
                  />
                  Request Surgery
                </button>
              </Tooltip>
            )}
            {currentPatient.status !== null && (
              <Tooltip title="Send a surgery request to surgeon for this patient">
                <button
                  style={{ backgroundColor: "gray" }}
                  disabled
                  className={
                    styles.header_button + " " + styles.margin_left_auto
                  }
                >
                  <img
                    src={Surgery_Dark_Icon}
                    alt="surgery_dark"
                    width="20px"
                  />
                  Request Surgery
                </button>
              </Tooltip>
            )}
            <Tooltip title="Handover the patient to another doctor or Department">
              <button
                className={styles.header_button}
                onClick={() => {
                  setOpenHandshakeDialog(true);
                }}
              >
                {/* <img src={add_icon} alt="" className="" /> */}
                {/* <TransferWithinAStationIcon /> */}
                <Handshake />
                Handshake Patient
              </button>
            </Tooltip>
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
                  Gender: {currentPatient?.gender == 1 ? "Male" : "Female"}
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
                        " " +
                        currentPatient?.lastName)}
                </p>
                <p>
                  Ward:{" "}
                  {timeline?.wardID
                    ? wardList.find((ward) => ward.id == timeline.wardID)?.name
                    : ""}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.profile_options}>
            <div className={styles.profile_options_inpatient}>Emergency</div>
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

              {/* <PDFDownloadLink
                document={
                  <MyDocument
                    currentPatient={currentPatient}
                    data={{
                      vitalAlert,
                      reminder,
                      medicalHistory,
                      symptoms,
                      vitalFunction,
                    }}
                  />
                }
                fileName="document.pdf"
                style={{ display: 'none' }}
              >
                {() => <button id="pdf-link">Generating PDF...</button>}
              </PDFDownloadLink> */}

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
                style={{ color: "#1976d2", paddingLeft: "10px", margin: 0 }}
              >
                {/* <Print sx={{ color: "white" }} /> */}
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
                  label="Print Options"
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

              {/* <IconButton aria-label="delete" onClick={loadPrintData}>
                <PrintIcon />
              </IconButton> */}
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
          id={currentPatient.patientTimeLineID ?? ""}
        />
      ) : (
        ""
      )}
      {printDialogBox ? (
        <PrintDialog
          open={printDialogBox}
          setOpen={setPrintDialogBox}
          updateTheSelectedPrintOptions={updateTheSelectedPrintOptions}
          id={id ?? ''}
          type={`${printSelectOptions}`}
        />
      ) : (
        ""
      )}

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

export default EmergencyYellowPatientProfile;
function compareDates(a: Reminder, b: Reminder) {
  return new Date(a.dosageTime).valueOf() - new Date(b.dosageTime).valueOf();
}
