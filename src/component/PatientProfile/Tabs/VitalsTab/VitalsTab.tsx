import React, { useRef, useState } from "react";
import styles from "./vitalsTab.module.scss";
import pulse_icon from "./../../../../../src/assets/PatientProfile/ppulse_icon.png";
import arrow_right_icon from "./../../../../../src/assets/PatientProfile/arrow-right_icon.png";
import droplet_icon from "./../../../../../src/assets/PatientProfile/droplet_icon.png";
import heart_icon from "./../../../../../src/assets/PatientProfile/heart_icon.png";
import rr_icon from "./../../../../../src/assets/PatientProfile/rr.png";
import thermometer_icon from "./../../../../../src/assets/PatientProfile/thermometer_icon.png";
import hrv_icon from "./../../../../../src/assets/PatientProfile/icons8-heart-rate-64.png";
// import { ArrowRightIcon } from "@mui/x-date-pickers"; 
import add_icon from "./../../../../../src/assets/addstaff/add_icon.png";
import all_vital_graphs from "./../../../../../src/assets/addstaff/all-vitals-graph.png";
import VitalsFormDialog from "./VitalsForm";
import { useVitalsStore } from "../../../../store/zustandstore";
import { authFetch } from "../../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import {
  selectCurrPatient,
  selectTimeline,
} from "../../../../store/currentPatient/currentPatient.selector";
import VitalsDialog from "./VitalsDialoge";
import { vitalsFormType1, vitalsType } from "../../../../types";
import parse from "html-react-parser";
import { useLocation } from "react-router-dom";
import AllVitalsGraph from "./AllVitalsGraph";
// import { authPost } from "../../../../axios/useAuthPost";
// import { numbersArray } from "../../../../utility/dumpy";
// import axios from "axios";

function VitalsTab() {
  const getAllVitalsApi = useRef(true);
  const [open, setOpen] = React.useState(false);
  const [openAllGraphs, setOpenAllGraphs] = React.useState(false);
  const [render, setRender] = React.useState(false);
  const [openVitalHistory, setOpenVitalHistory] = React.useState(false);
  const { setVitals, vitals } = useVitalsStore();
  const [category, setCategory] = React.useState<keyof vitalsType>("bp");
  const location = useLocation();
  const isCustomerCare = location.pathname.includes("customerCare");
  const [showID, setShowID] = useState<number | null>(0);

  const [unit, setUnit] = React.useState<string>("");
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const currentPatient = useSelector(selectCurrPatient);

  // const getVirality = async () => {
  //   // const response = await (`/detect_pattern/`,
  //   // { row: numbersArray },
  //   // user.token);
  //   await axios.post(
  //     "https://fever-pattern-detection-api-5wu8.vercel.app/feverPatternDetection/api/detect_pattern/",
  //     { row: numbersArray },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  // };
  React.useEffect(() => {
    // getVirality();
  }, []);

  
  React.useEffect(() => {
    const getAllVitals = async () => {
      const apiUrl =
        currentPatient.role === "homecarepatient"
          ? `alerts/getIndividualHomeCarePatientsVitails/${currentPatient.id}`
          : `vitals/${user.hospitalID}/${timeline.patientID}`;

      const response = await authFetch(apiUrl, user.token);
      console.log("Response", response);
      if (response.message === "success") {
        if (currentPatient.role === "homecarepatient") {
          // Map homecarepatient data to vitalsType
          const mappedVitals = response.data.map((item: any) => ({
            userID: item.patientID,
            oxygen: parseFloat(item.spo2) || 0,
            pulse: parseFloat(item.heartRate) || 0,
            hrv: parseFloat(item.heartRateVariability) || 0,
            temperature: parseFloat(item.temperature) || 0,
            respiratoryRate: parseFloat(item.respiratoryRate) || 0,
            bp: null, // Blood pressure not available in homecarepatient data
            oxygenTime: item.givenTime,
            pulseTime: item.givenTime,
            hrvTime: item.givenTime,
            temperatureTime: item.givenTime,
            respiratoryRateTime: item.givenTime,
            addedOn: item.addedOn,
          }));
          setVitals(mappedVitals);
        } else {
          setVitals(response.vitals);
        }
      }
    };

    // Only fetch if user.token and either timeline.id or currentPatient.id are available
    if (user.token && (timeline.id || currentPatient.id)) {
      getAllVitals();
    }
  }, [user.token, timeline.id, currentPatient.id, render, setVitals]);

  const initialState: vitalsFormType1 = {
    userID: 0,
    oxygen: 0,
    pulse: 0,
    hrv:0,
    temperature: 0,
    respiratoryRate: 0,
    bpH: "",
    bpL: "",
    bpTime: "",
    oxygenTime: "",
    temperatureTime: "",
    pulseTime: "",
    respiratoryRateTime: "",
    hrvTime:"",
  };
  const [vital, setVital] = React.useState<vitalsFormType1>(initialState);
  React.useEffect(() => {
    let vitalObj: vitalsFormType1 = initialState;

    vitals.reverse().forEach((el: vitalsType) => {
      vitalObj = {
              userID: vitalObj.userID ? vitalObj.userID : el.userID,
              oxygen: vitalObj.oxygen ? vitalObj.oxygen : el.oxygen,
              hrv: vitalObj.hrv ? vitalObj.hrv : el.hrv,
              respiratoryRate: vitalObj.respiratoryRate
                ? vitalObj.respiratoryRate
                : el.respiratoryRate,
              pulse: vitalObj.pulse ? vitalObj.pulse : el.pulse,
              temperature: vitalObj.temperature
                ? vitalObj.temperature
                : el.temperature,
              bpH: vitalObj.bpH ? vitalObj.bpH : el.bp?.split("/")[0],
              bpL: vitalObj.bpL ? vitalObj.bpL : el.bp?.split("/")[1],
              bpTime: vitalObj.bpTime,
              oxygenTime: vitalObj.oxygenTime || el.oxygenTime,
              hrvTime: vitalObj.hrvTime || el.hrvTime,
              respiratoryRateTime:
                vitalObj.respiratoryRateTime || el.respiratoryRateTime,
              temperatureTime: vitalObj.temperatureTime || el.temperatureTime,
              pulseTime: vitalObj.pulseTime || el.pulseTime,
      };
          });
     
    setVital(vitalObj);
  }, [vitals]);

  function doRemderAfterUpdate() {
    getAllVitalsApi.current = true;
    setRender(!render);
  }
  return (
    <div className={styles.container}>
      <div className={styles.info_header}>
        {/* <h4>Symptomps At Admission</h4> */}
        <button style={{marginRight:"10px",display:"flex",justifyContent:"center",alignItems:"center"}} onClick={() => setOpenAllGraphs(true)}>
            <img style={{width:"20px", height:"20px"}} src={all_vital_graphs} alt="" />
            <span>All Graphs</span>
          </button>
          
        {currentPatient.ptype !== 21 && !isCustomerCare && (
          <>
          
          <button onClick={() => setOpen(true)}>
            <img src={add_icon} alt="" />
            Add Vitals
          </button>
          </>
        )}
      </div>
      <div className={styles.vital_container}>
        {/* ================Pulse Rate================== */}
        <div
          className={styles.card + " " + styles.blue}
          onClick={() => {
            setCategory("pulse");
            setUnit("beats/min");
            setOpenVitalHistory(true);
            setShowID(vital.userID);
          }}
        >
          <div className={styles.card_info}>
            <div className={styles.card_info_header}>
              <h4>
                Pulse Rate <img src={arrow_right_icon} alt="" />
              </h4>
            </div>
            <h1>
              {vital?.pulse || "..."}{" "}
              <span style={{ fontSize: "14px" }}>
                {" "}
                {vital?.pulse ? " beats/min" : ""}
              </span>
            </h1>
          </div>
          <div className={styles.card_icon}>
            <img src={pulse_icon} alt="" />
          </div>
        </div>
        {/* ========================Temperature=================== */}
        <div
          className={styles.card + " " + styles.orange}
          onClick={() => {
            setCategory("temperature");
            setUnit("celsius");
            setOpenVitalHistory(true);
          }}
        >
          <div className={styles.card_info}>
            <div className={styles.card_info_header}>
              <h4>
                Temperature
                <img src={arrow_right_icon} alt="" />
              </h4>
            </div>

            <h1>
              {vital?.temperature || "..."}
              {vital.temperature ? parse("°") : ""}
              <span style={{ fontSize: "14px" }}>
                {vital.temperature ? " celsius" : ""}
              </span>
            </h1>
            {/* <p>Fever Pattern: Malaria</p> */}
          </div>
          <div className={styles.card_icon}>
            <img src={thermometer_icon} alt="" />
          </div>
        </div>
        {/* =========================Oxygen Saturation================ */}
        <div
          className={styles.card + " " + styles.green}
          onClick={() => {
            setCategory("oxygen");
            setUnit("%");
            setOpenVitalHistory(true);
          }}
        >
          <div className={styles.card_info}>
            <div className={styles.card_info_header}>
              <h4>
                Oxygen Saturation (SpO2) <img src={arrow_right_icon} alt="" />
              </h4>
            </div>
            <h1>
              {vital?.oxygen || "..."}
              <span style={{ fontSize: "14px" }}>
                {vital?.oxygen ? " %" : ""}
              </span>
            </h1>
          </div>
          <div className={styles.card_icon}>
            <img src={droplet_icon} alt="" />
          </div>
        </div>
        {/* =======================Blood Pressure=================== */}
        <div
          className={styles.card + " " + styles.violet}
          onClick={() => {
            setCategory("bp");
            setUnit("mm Hg");
            setOpenVitalHistory(true);
          }}
        >
          <div className={styles.card_info}>
            <div className={styles.card_info_header}>
              <h4>
                Blood Pressure <img src={arrow_right_icon} alt="" />
              </h4>
            </div>
            <h1>
              {vital.bpH ? vital.bpH + "/" + vital.bpL : "..."}{" "}
              <span style={{ fontSize: "14px" }}>
                {" "}
                {vital.bpH ? " mm Hg" : ""}
              </span>
            </h1>
          </div>
          <div className={styles.card_icon}>
            <img src={heart_icon} alt="" />
          </div>
        </div>
        {/* =======================respiratory rate=================== */}
        <div
          className={styles.card + " " + styles.pink}
          onClick={() => {
            setCategory("respiratoryRate");
            setUnit("breaths/min");
            setOpenVitalHistory(true);
          }}
        >
          <div className={styles.card_info}>
            <div className={styles.card_info_header}>
              <h4>
                Respiratory Rate <img src={arrow_right_icon} alt="" />
              </h4>
            </div>
            <h1>
              {vital?.respiratoryRate || "..."}
              <span style={{ fontSize: "14px" }}>
                {vital?.respiratoryRate ? " breaths/min" : ""}
              </span>
            </h1>
          </div>
          <div className={styles.card_icon}>
            <img src={rr_icon} alt="" />
          </div>
        </div>
          {/* =======================HRV=================== */}
          <div
          className={styles.card + " " + styles.lightBrown}
          onClick={() => {
            setCategory("hrv");
            setUnit("ms");
            setOpenVitalHistory(true);
          }}
        >
          <div className={styles.card_info}>
            <div className={styles.card_info_header}>
              <h4>
                Heart Rate Variability <img src={arrow_right_icon} alt="" />
              </h4>
            </div>
            <h1>
              {vital?.hrv || "..."}
              <span style={{ fontSize: "14px" }}>
                {vital?.hrv ? " ms" : ""}
              </span>
            </h1>
          </div>
          <div className={styles.card_icon}>
            <img src={hrv_icon} alt="" />
          </div>
        </div>
      </div>
      {/* =========all graphs= openAllGraphs========== */}

      <AllVitalsGraph
        openAllGraphs={openAllGraphs}
        setOpenAllGraphs={setOpenAllGraphs}
        
      />


      <VitalsFormDialog
        open={open}
        setOpen={setOpen}
        doRemderAfterUpdate={doRemderAfterUpdate}
      />
      <VitalsDialog
        open={openVitalHistory}
        setOpen={setOpenVitalHistory}
        category={category}
        unit={unit}
        showID={showID}
        vitals={currentPatient.role === "homecarepatient" ? vitals : undefined}
      />
    </div>
  );
}

export default VitalsTab;