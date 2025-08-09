import React, { useRef, useState } from "react";
import styles from "./PatientProfile.module.scss";
import { useLocation, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "../../../assets/Vector.png";
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
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { getAge } from "../../../utility/global";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Reminder, usePrintInPatientStore } from "../../../store/zustandstore";
import { setError, setLoading } from "../../../store/error/error.action";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import TransferPatientDialog from "./transferPatientDialog";
import { followUpStatus } from "../../../utility/role";
import PatientRevisitDialog from "../../../component/PatientProfile/PatientRevisit/RevisitDialog";
import MyDocument from "../../../component/DischargeReport/MyDocument";
import { Handshake } from "@mui/icons-material";
import HandshakeDialog from "../../../component/PatientProfile/Handshake/HandshakeDialoge";
import { testType } from "../../../types";
import PrintDialog from "../../hospital_staff/PatientProfile/PrintDialog";
import { MenuItem, FormControl, InputLabel,Select } from '@mui/material';
import { downloadFile } from '../../../utility/reportsDownload';

function PatientProfileOPD() {
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const timeline = useSelector(selectTimeline);
  const dispatch = useDispatch();
  const location = useLocation();
  const staffRole = location.state?.staffRole || "";
  const { id } = useParams();
  const [openTransferForm, setOpenTransferForm] = React.useState(false);
  const [openRevisitForm, setOpenRevisitForm] = React.useState(false);
  const [openHanshakeDialog, setOpenHandshakeDialog] = React.useState(false);
  const [previousMedHistoryList, setPreviousMedHistoryList] = React.useState(
    []
  );
  const [printDialogBox, setPrintDialogBox] = React.useState(false);
  const [printSelectOptions, setPrintSelectOptions] = React.useState<string[]>(
    []
  );
  const [options, setOptions] = useState<string[]>([]);
  const [selectedTestList, setSelectedTestList] = React.useState<testType[]>(
    []
  );
  const [, setIsPrintingReports] = React.useState(false);
  const getCurrentPatientAndTimelineApi = useRef(true);
  const [selectKey, setSelectKey] = useState(0);

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
        dispatch(
          setTimeline({ timeline: { ...responseTimeline.patientTimeLine } })
        );
      }
    }
    dispatch(setLoading(false));
  };

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

  const handlePrintOptionChange = (event: any) => {
    const selectedOptions = event.target.value as string[];
    setPrintSelectOptions(selectedOptions);
  };

  React.useEffect(() => {
    if (user.token && getCurrentPatientAndTimelineApi.current) {
      getCurrentPatientAndTimelineApi.current = false;
      getCurrentPatientAndTimeline();
    }
  }, [id, user]);

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

  ///////////////////////////Loading Data////////////////////////////////
  const loadPrintData = async () => {
    dispatch(setLoading(true));

    const responseTimeline = await authFetch(
      `medicine/${timeline.id}/reminders/all`,
      user.token
    );
    if (responseTimeline.message == "success") {
      setReminder(responseTimeline.reminders.sort(compareDates));
    }
    const alertResponse = await authFetch(
      `alerts/hospital/${user.hospitalID}/vitalAlerts/${currentPatient.id}`,
      user.token
    );
    if (alertResponse.message == "success") {
      setVitalAlert(alertResponse.alerts);
    }
    const responseSymptoms = await authFetch(
      `symptom/${currentPatient.id}`,
      user.token
    );
    if (responseSymptoms.message == "success") {
      setSymptoms(responseSymptoms.symptoms);
    }
    //get previous all med list
    const responsePreviousMedHistory = await authFetch(
      `medicine/${timeline.id}/previous/allmedlist`,
      user.token
    );
    if (responsePreviousMedHistory.message === "success") {
      setPreviousMedHistoryList(responsePreviousMedHistory.previousMedList);
    }
    const response = await authFetch(`test/${currentPatient.id}`, user.token);
    if (response.message == "success") {
      setSelectedTestList(response.tests);
    }
    const responseMedicalHistory = await authFetch(
      `history/${user.hospitalID}/patient/${currentPatient.id}`,
      user.token
    );
    if (responseMedicalHistory.message == "success") {
      setMedicineHistory(responseMedicalHistory.medicalHistory);
    }
    const vitalFunctionResponse = await authFetch(
      `vitals/${user.hospitalID}/functions/${currentPatient.id}`,
      user.token
    );
    if (vitalFunctionResponse.message == "success") {
      setVitalFunction(vitalFunctionResponse);
    }
    if (
      alertResponse.message == "success" &&
      responseSymptoms.message == "success" &&
      responseTimeline.message == "success"
    ) {
      setTimeout(() => {
        const button = document.querySelector("#pdf-link") as HTMLAnchorElement;
        if (button) {
          button.click();
        }
        setPrintSelectOptions([]); 
      }, 800);
    }
    dispatch(setLoading(false));
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

  const updateTheSelectedPrintOptions = async (options: string[], shouldPrint: Boolean  ) => {
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
          <h3>
            <IconButton aria-label="delete">
              <ArrowForwardIosIcon />
            </IconButton>
          </h3>
          <h3>Patient Profile OPD</h3>
          {currentPatient.ptype !== 21 ? (
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
          ) : (
            <button
              className={styles.header_button + " " + styles.margin_left_auto}
              onClick={() => {
                setOpenRevisitForm(true);
              }}
            >
              <TransferWithinAStationIcon />
              Patient Revisit
            </button>
          )}
          {currentPatient.ptype !== 21 && (
            <button
              className={styles.header_button}
              onClick={() => {
                setOpenHandshakeDialog(true);
              }}
            >
              <Handshake />
              Handshake Patient
            </button>
          )}
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
                  Date of review:{" "}
                  {currentPatient?.startTime &&
                    new Date(currentPatient?.startTime).toLocaleDateString(
                      "en-GB"
                    )}
                </p>

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
            {currentPatient.ptype === 21 && (
              <div className={styles.profile_options_inpatient}>
                Previous Patients
              </div>
            )}

            <div className={styles.profile_options_discharge} style={{display:"flex",marginTop:"30px"}}>
              {timeline.patientEndStatus ? (
                ""
              ) : (
                <IconButton aria-label="edit" onClick={() => navigate(`edit`)}>
                  <EditIcon />
                </IconButton>
              )}

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

              {/* <IconButton
                aria-label="delete"
                onClick={loadPrintData}
                style={{ backgroundColor: "gray" }}
              >
                <img src={DownloadIcon} alt="" style={{ color: "gray" }} />
              </IconButton> */}
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
                  onClick={handlePrintClick}
                  style={{
                    color: "#1976d2",
                    padding: "7px",
                    margin: 0,
                    marginLeft: "10px"
                  }}
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
                      color: "white"
                    }}
                    sx={{
                      "& fieldset": { border: "none" },
                      "&:hover fieldset": { border: "none" },
                      "&.Mui-focused fieldset": { border: "none" },
                      "& .MuiSelect-icon": { color: "white" }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: "15px",
                          marginLeft: "-15px"
                        }
                      }
                    }}
                  >
                    <MenuItem value="generalInfo">Discharge Summary</MenuItem>
                    <MenuItem value="tests">Test Reports</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.profile_tabs}>
          <BasicTabs />
        </div>
      </div>
      {openTransferForm ? (
        <TransferPatientDialog
          open={openTransferForm}
          setOpen={setOpenTransferForm}
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
      {openRevisitForm ? (
        <PatientRevisitDialog
          open={openRevisitForm}
          setOpen={setOpenRevisitForm}
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
    </>
  );
}

export default PatientProfileOPD;
function compareDates(a: Reminder, b: Reminder) {
  return new Date(a.dosageTime).valueOf() - new Date(b.dosageTime).valueOf();
}
