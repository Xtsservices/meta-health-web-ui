import React, { useRef, useState } from "react";
import styles from "./PatientProfile.module.scss";
import { useLocation, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import BasicTabs from "./Tabs";
import { useSelector } from "react-redux/es/hooks/useSelector";
import DischargeDialog from "./DischargeDialog/DischargeDialog";
import { setCurrPatient } from "../../../store/currentPatient/currentPatient.action";
import { setTimeline } from "../../../store/currentPatient/currentPatient.action";
import {
  selectCurrPatient,
  selectTimeline,
} from '../../../store/currentPatient/currentPatient.selector';
import { authFetch } from '../../../axios/useAuthFetch';
import { selectCurrentUser } from '../../../store/user/user.selector';
import { useDispatch } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import { getAge } from '../../../utility/global';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Reminder, usePrintInPatientStore } from '../../../store/zustandstore';
import { setError, setLoading } from '../../../store/error/error.action';
import { testType, wardType } from '../../../types';
// import TransferPatientDialog from './transferPatientDialog';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { Handshake } from '@mui/icons-material';
import HandshakeDialog from '../../../component/PatientProfile/Handshake/HandshakeDialoge';
import RequestSurgeryDialog from '../../hospital_staff/PatientProfile/RequestSurgeryDialog';
import Surgery_Light_Icon from "../../../assets/surgery_light.png"
import Surgery_Dark_Icon from "../../../assets/surgery.png"
import PrintDialog from '../../hospital_staff/PatientProfile/PrintDialog';
import MyDocument from '../../../component/DischargeReport/MyDocument';
import { MenuItem, Tooltip, FormControl, InputLabel,Select, Button } from '@mui/material';
import DownloadIcon from "../../../assets/Vector.png"
import { downloadFile } from '../../../utility/reportsDownload';
import TransferPatientDialog from "../../common/emergency/transferPatientDialog";
import DischargeTemplate from "../../../component/DischargeReport/DischargeTemplate";
import NurseCommonHeader from "../../nurseDashboard/NurseCommonHeader";


function EmergencyRedPatientProfile() {
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const timeline = useSelector(selectTimeline);
  const dispatch = useDispatch();
  const location = useLocation();
  const staffRole = location.state?.staffRole || "";  
  const { id } = useParams();
  const name = location.state?.name || "";
  const [wardList, setWardList] = React.useState<wardType[]>([]);
  const [openTransferForm, setOpenTransferForm] = React.useState(false);
  const [openRequestSurgeryForm, setOpenRequestSurgeryForm] =
    React.useState(false);
  const [openHanshakeDialog, setOpenHandshakeDialog] = React.useState(false);
  const [printDialogBox, setPrintDialogBox] = React.useState(false);
  const [selectedTestList, setSelectedTestList] = React.useState<testType[]>(
    []
  );
  const [printSelectOptions, setPrintSelectOptions] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [previousMedHistoryList, setPreviousMedHistoryList] = React.useState(
    []
  );
  const [, setIsPrintingReports] = React.useState(false);
  const [selectKey, setSelectKey] = useState(0);
  const [PrintReport, setPrintReport] = React.useState(false);
  const getCurrentPatientAndTimelineApi = useRef(true);
  const getCurrentPatientAndTimeline = React.useCallback(async () => {
    dispatch(setLoading(true));
    try {
      let response;
      if (name === "Individual") {
        response = await authFetch(
          `alerts/individualPatientDetails/${id}`,
          user.token
        );
      }
      else if(name === "Hospital"){
        response = await authFetch(
          `patient/patients/customerCare/${id}`,
          user.token
        );
      } else {
        response = await authFetch(
          `patient/${user.hospitalID}/patients/single/${id}`,
          user.token
        );
      }     
      if (response.message === "success") {
        // Handle different response structures
        const patientData = name === "Individual" ? response.data : response.patient;

        dispatch(setCurrPatient({ currentPatient: { ...patientData } }));
        const timelineId = patientData.id || patientData.timeline_id;
        if (timelineId) {
          const responseTimeline = await authFetch(
            `patientTimeLine/${timelineId}`,
            user.token
          );
          
          if (responseTimeline.message === "success") {
            dispatch(
              setTimeline({ timeline: { ...responseTimeline.patientTimeLine } })
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      dispatch(setError("Failed to fetch patient data"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, id, user.hospitalID, user.token, name]); // Added name to dependencies

  const handlePrintOptionChange = (event: any) => {
    const selectedOptions = event.target.value as string[];
    setPrintSelectOptions(selectedOptions);
  };

  const getWardData = React.useCallback(async () => {
    const wardResonse = await authFetch(`ward/${user.hospitalID}`, user.token);
    if (wardResonse.message == "success") {
      setWardList(wardResonse.wards);
    }
  }, [user.hospitalID, user.token]);

  React.useEffect(() => {
    if (user.token && getCurrentPatientAndTimelineApi.current) {
      getCurrentPatientAndTimelineApi.current = false;
      getCurrentPatientAndTimeline();
      getWardData();
    }
  }, [getCurrentPatientAndTimeline, getWardData, id, user]);

  const {
    setSymptoms,
    setReminder,
    setVitalAlert,
    setMedicineHistory,
    setVitalFunction,
    vitalAlert,
    reminder,
    symptoms,
    vitalFunction,
    reports,
    setReports,
    medicalHistory
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
        currentPatient.role === "homecarepatient"
          ? `vitals/getHomecarePatientVitalFunctions/${currentPatient.id}`
          : `vitals/${user.hospitalID}/functions/${currentPatient.id}`,
        user.token
      );
      if (vitalFunctionResponse.message === "success") {
        const { message, ...rest } = vitalFunctionResponse;
        setVitalFunction(rest);
        apisSuccesCount += 1;
      }

      if (apisSuccesCount == 7) {
        setPrintReport(true);
        setTimeout(() => {
          setPrintReport(false);
        }, 100);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
  const [openDischargeDialog, setOpenDischargeDialog] = React.useState(false);


  const updateTheSelectedPrintOptions = async (options: string[], shouldPrint: boolean) => {
    setPrintSelectOptions(options);
    setOptions(options);

    if (printSelectOptions.includes("generalInfo") && shouldPrint == true) {
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
      // Log reports being processed
      console.log("Filtered Reports:", filteredReports);
  
      // Download all files concurrently
      await Promise.all(
        filteredReports.map((report) => {
          if (report.fileURL) {
            console.log("Downloading:", report.fileName, "Type:", report.mimeType);
            return downloadFile(report.fileURL, report.fileName, report.mimeType);
          } else {
            console.error("No file URL available for report:", report);
            return Promise.resolve(); // Ensures `Promise.all` doesn't reject on missing file
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

  const isNurseRoute = window.location.pathname.includes("nurse");
  const isCustomerRoute = window.location.pathname.includes("customerCare");


  const handlePrintClick = async (option?: string) => {
    console.log("Print Button clicked!!");
    console.log("Print Selected Options", printSelectOptions);

    if (isCustomerRoute && option === "generalInfo") {
      setOptions(["Vitals"]);
      await loadPrintData();
    }
    else if (printSelectOptions.includes("tests")) {
      setIsPrintingReports(true);
      await loadReportData();

      setPrintDialogBox(true);
    } else if (printSelectOptions.includes("generalInfo")) {
      setPrintDialogBox(true);
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <NurseCommonHeader />
      <div className={styles.container}>
    
        <div className={styles.container_header}>
          {name !== "Individual" && <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {name !== "Hospital" &&
            (<>
              <h3>
                <IconButton aria-label="delete">
                  <ArrowForwardIosIcon />
                </IconButton>
              </h3>
              <h3 style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
                Patient List
              </h3>
            </>)
            }
            <h3>
              <IconButton aria-label="delete">
                <ArrowForwardIosIcon />
              </IconButton>
            </h3>
            <h3>Patient Profile</h3>
          </div>}
          {
            name === "Individual" && (
              <>
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
                  <h3>Patient Vitals</h3>
                </div>
              </>
            )
          }

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {!isNurseRoute && !isCustomerRoute && <Tooltip title="Move the patient to another Ward(Internal or External)">
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
            </Tooltip>}

            {currentPatient.status === null && !isNurseRoute && !isCustomerRoute && (
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
                  {/* <TransferWithinAStationIcon /> */}
                  <img
                    src={Surgery_Light_Icon}
                    alt="surgery_light"
                    width="20px"
                  />
                  Request Surgery
                </button>
              </Tooltip>
            )}
            {currentPatient.status !== null && !isCustomerRoute &&  (
              <Tooltip title="Send a surgery request to surgeon for this patient">
                <button
                  style={{ backgroundColor: "gray", gap: "30px" }}
                  disabled
                  className={
                    styles.header_button + " " + styles.margin_left_auto
                  }
                >
                  {/* <TransferWithinAStationIcon /> */}
                  <img
                    src={Surgery_Dark_Icon}
                    alt="surgery_dark"
                    width="20px"
                  />
                  Request Surgery
                </button>
              </Tooltip>
            )}
            {!isCustomerRoute && <Tooltip title="Handover the patient to another doctor or Department">
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
            </Tooltip>}
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
            {!currentPatient.imageURL && (
              <PersonIcon className={styles.profile} />
            )}
          </div>
          <div className={styles.profile_info}>
            <h3>
              {currentPatient?.pName?.slice(0, 1).toUpperCase() +
                currentPatient?.pName?.slice(1).toUpperCase()}{" "}
              {currentPatient?.pUHID && (
                <>
                  <span>|</span>
                  <span style={{ fontSize: "14px" }}>
                    UHID No: {currentPatient.pUHID}
                  </span>
                </>
              )}
            </h3>
            <div className={styles.profile_info_main}>
              <div className={styles.profile_info_left}>
                <p>Gender: {currentPatient?.gender == 1 ? "Male" : "Female"}</p>
                <p>
                  Age: {currentPatient.dob ? getAge(currentPatient?.dob) : ""}
                </p>
                {name !== "Individual" && (
                  <p>
                    {currentPatient?.city}, {currentPatient?.state}{" "}
                  </p>
                )}
                {name === "Individual" && (
                  <>
                    <p>State : {currentPatient?.state}</p>
                    <p>District : {currentPatient?.city}</p>
                  </>
                )}
              </div>
              <div className={styles.profile_info_right}>
                {currentPatient?.startTime && <p style={{ marginTop: "0" }}>
                  {name === "Individual" ? "Date" : "Date of Admission:"}{" "}
                  {currentPatient?.startTime &&
                    new Date(currentPatient?.startTime).toLocaleDateString(
                      "en-GB"
                    )}
                </p>}
                {name !== "Individual" && (
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
                )}
                {name === "Individual" && (
                  <>
                    <p>Contact No. : {currentPatient?.phoneNumber}</p>
                    <p>Email : {currentPatient?.email}</p>
                    {currentPatient?.address && <p>City : {currentPatient?.address}</p>}
                  </>
                )}
                {name !== "Individual" && (
                  <p>
                    Ward:&nbsp;
                    {timeline?.wardID
                      ? wardList.find((ward) => ward.id == timeline.wardID)
                          ?.name
                      : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className={styles.profile_options}>
            {!isNurseRoute && !isCustomerRoute && (
              <div className={styles.profile_options_inpatient}>Emergency</div>
            )}
            <div
              className={styles.profile_options_discharge}
              style={{
                marginTop: isNurseRoute ? "40px" : "0px",
              }}
            >
              {currentPatient.ptype === 21 ? (
                // Show "Discharged" button when patient is already discharged
                <button
                  className={styles.discharge_button}
                  style={{
                    backgroundColor: "#f79797", // Same yellow as discharge button
                  }}
                >
                  Discharged
                </button>
              ) : (
                // Show normal buttons when patient is not discharged
                <>
                  {!isCustomerRoute && <button
                    className={styles.discharge_button}
                    onClick={() => setOpenDischargeDialog((el) => !el)}
                  >
                    Discharge
                  </button>}
                  {!isCustomerRoute && <IconButton aria-label="edit" onClick={() => navigate(`edit`)}>
                    <EditIcon />
                  </IconButton>}
                </>
              )}
              {/* <IconButton aria-label="delete" onClick={loadPrintData}>
                <PrintIcon onClick={() => setPrintDialogBox(true)} />
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
                {isCustomerRoute ? (
                  <Button
                    onClick={() => handlePrintClick("generalInfo")}
                    startIcon={<img src={DownloadIcon} alt="" style={{ color: "#1976d2", width: "16px" }} />}
                    sx={{
                      borderRadius: "35px",
                      backgroundColor: "transparent",
                      color: "#fff",
                      padding: "7px 16px",
                      textTransform: "none",
                      fontSize: "14px",
                      minWidth: "140px",
                      justifyContent: "flex-start",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <div style={{color:"white"}}>Vitals Report</div>
                  </Button>
                ) : (
                  <>
                    <IconButton
                      onClick={() => handlePrintClick()}
                      style={{ color: "#1976d2", padding: "7px", margin: 0, marginLeft: "10px" }}
                    >
                      <img src={DownloadIcon} alt="" />
                    </IconButton>
                    <FormControl variant="outlined" size="small">
                      {printSelectOptions.length === 0 && (
                        <InputLabel
                          sx={{
                            color: "white",
                            transform: "translateY(10px)",
                            "&.Mui-focused": { color: "white", transform: "translateY(10px)", display: "none" },
                            border: "none",
                          }}
                        >
                          Reports
                        </InputLabel>
                      )}
                      <Select
                        label="Select"
                        key={selectKey}
                        value={printSelectOptions}
                        onChange={handlePrintOptionChange}
                        style={{
                          minWidth: "100px",
                          borderRadius: "35px",
                          outline: "none",
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                        sx={{
                          "& fieldset": { border: "none" },
                          "&:hover fieldset": { border: "none" },
                          "&.Mui-focused fieldset": { border: "none" },
                          "& .MuiSelect-icon": { color: "white" },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: { borderRadius: "15px", marginLeft: "-15px" },
                          },
                        }}
                      >
                        <MenuItem value="generalInfo">Discharge Summary</MenuItem>
                        <MenuItem value="tests">Test Reports</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                )}
              </div>

              {PrintReport && (
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
              )}
            </div>
          </div>
        </div>
        <div className={styles.profile_tabs}>
          <BasicTabs name={name}/>
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
          id={id ?? ""}
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

export default EmergencyRedPatientProfile;
function compareDates(a: Reminder, b: Reminder) {
  return new Date(a.dosageTime).valueOf() - new Date(b.dosageTime).valueOf();
}
