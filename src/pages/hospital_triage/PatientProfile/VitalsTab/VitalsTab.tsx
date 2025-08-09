// import React from "react";
import styles from "./vitalsTab.module.scss";
import pulse_icon from "./../../../../../src/assets/PatientProfile/ppulse_icon.png";
import arrow_right_icon from "./../../../../../src/assets/PatientProfile/arrow-right_icon.png";
import droplet_icon from "./../../../../../src/assets/PatientProfile/droplet_icon.png";
import heart_icon from "./../../../../../src/assets/PatientProfile/heart_icon.png";
import thermometer_icon from "./../../../../../src/assets/PatientProfile/thermometer_icon.png";
// import { ArrowRightIcon } from "@mui/x-date-pickers";
import add_icon from "./../../../../../src/assets/addstaff/add_icon.png";
import VitalsFormDialog from "./VitalsForm";
import React from "react";
import { useVitalsStore } from "../../../../store/zustandstore";
import { authFetch } from "../../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import VitalsDialog from "./VitalsDialoge";
import { vitalsFormType, vitalsType } from "../../../../types";
import parse from "html-react-parser";
// import { authPost } from "../../../../axios/useAuthPost";
import { numbersArray } from "../../../../utility/dumpy";
import axios from "axios";
function VitalsTab() {
  const [open, setOpen] = React.useState(false);
  const [openVitalHistory, setOpenVitalHistory] = React.useState(false);
  const { setVitals, vitals } = useVitalsStore();
  const [category, setCategory] = React.useState<keyof vitalsType>("bp");
  const [unit, setUnit] = React.useState<string>("");
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const getAllVitals = async () => {
    const response = await authFetch(
      `vitals/${user.hospitalID}/${timeline.patientID}`,
      user.token
    );
    // console.log("vitals", response);
    if (response.message == "success") {
      setVitals(response.vitals);
    }
  };
  const getVirality = async () => {
    // const response = await (`/detect_pattern/`,
    // { row: numbersArray },
    // user.token);
    const response = await axios.post(
      "https://fever-pattern-detection-api-5wu8.vercel.app/feverPatternDetection/api/detect_pattern/",
      { row: numbersArray },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("res----------------------------------", response);
  };
  React.useEffect(() => {
    getVirality();
  }, []);
  React.useEffect(() => {
    if ((user.token, timeline.id)) {
      getAllVitals();
    }
  }, [user, timeline]);
  // console.log(vitals.slice(-1));
  const initialState: vitalsFormType = {
    userID: 0,
    oxygen: 0,
    pulse: 0,
    temperature: 0,
    bpH: "",
    bpL: "",
    bpTime: "",
    oxygenTime: "",
    temperatureTime: "",
    pulseTime: "",
  };
  const [vital, setVital] = React.useState<vitalsFormType>(initialState);
  React.useEffect(() => {
    // console.log("new", vitals);
    let vitalObj: vitalsFormType = initialState;
    vitals.reverse().forEach((el: vitalsType) => {
      // console.log(vitalObj);
      vitalObj = {
        userID: 0,
        oxygen: vitalObj.oxygen ? vitalObj.oxygen : el.oxygen,
        pulse: vitalObj.pulse ? vitalObj.pulse : el.pulse,
        temperature: vitalObj.temperature
          ? vitalObj.temperature
          : el.temperature,
        bpH: vitalObj.bpH ? vitalObj.bpH : el.bp?.split("/")[0],
        bpL: vitalObj.bpL ? vitalObj.bpL : el.bp?.split("/")[1],
        bpTime: vitalObj.bpTime,
        oxygenTime: vitalObj.oxygenTime || el.oxygenTime,
        temperatureTime: vitalObj.temperatureTime || el.temperatureTime,
        pulseTime: vitalObj.pulseTime || el.pulseTime,
      };
    });
    setVital(vitalObj);
  }, [vitals]);
  return (
    <div className={styles.container}>
      <div className={styles.info_header}>
        {/* <h4>Symptomps At Admission</h4> */}
        <button onClick={() => setOpen(true)}>
          <img src={add_icon} alt="" />
          Add Vitals
        </button>
      </div>
      <div className={styles.vital_container}>
        <div className={styles.card + " " + styles.blue}>
          <div className={styles.card_info}>
            <div className={styles.card_info_header}>
              <h4>
                Pulse Rate{" "}
                <img
                  src={arrow_right_icon}
                  alt=""
                  onClick={() => {
                    setCategory("pulse");
                    setUnit("bpm");
                    setOpenVitalHistory(true);
                  }}
                />
              </h4>
            </div>
            <h1>
              {vital?.pulse || "..."}{" "}
              <span style={{ fontSize: "14px" }}>
                {" "}
                {vital?.pulse ? "bpm" : ""}
              </span>
            </h1>
          </div>
          <div className={styles.card_icon}>
            <img src={pulse_icon} alt="" />
          </div>
        </div>
        <div className={styles.card + " " + styles.orange}>
          <div className={styles.card_info}>
            <div className={styles.card_info_header}>
              <h4>
                Temperature
                <img
                  src={arrow_right_icon}
                  alt=""
                  onClick={() => {
                    setCategory("temperature");
                    setUnit("celsius");
                    setOpenVitalHistory(true);
                  }}
                />
              </h4>
            </div>

            <h1>
              {vital?.temperature || "..."}
              {vital.temperature ? parse("&deg;") : ""}
              <span style={{ fontSize: "14px" }}>
                {vital.temperature ? "celsius" : ""}
              </span>
            </h1>
            {/* <p>Fever Pattern: Malaria</p> */}
          </div>
          <div className={styles.card_icon}>
            <img src={thermometer_icon} alt="" />
          </div>
        </div>
        <div className={styles.card + " " + styles.green}>
          <div className={styles.card_info}>
            <div className={styles.card_info_header}>
              <h4>
                Oxygen Saturation (SpO2){" "}
                <img
                  src={arrow_right_icon}
                  alt=""
                  onClick={() => {
                    setCategory("oxygen");
                    setUnit("%");
                    setOpenVitalHistory(true);
                  }}
                />
              </h4>
            </div>
            <h1>
              {vital?.oxygen || "..."}
              <span style={{ fontSize: "14px" }}>
                {vital?.oxygen ? "%" : ""}
              </span>
            </h1>
          </div>
          <div className={styles.card_icon}>
            <img src={droplet_icon} alt="" />
          </div>
        </div>
        <div className={styles.card + " " + styles.violet}>
          <div className={styles.card_info}>
            <div className={styles.card_info_header}>
              <h4>
                Blood Pressure{" "}
                <img
                  src={arrow_right_icon}
                  alt=""
                  onClick={() => {
                    setCategory("bp");
                    setUnit("mm Hg");
                    setOpenVitalHistory(true);
                  }}
                />
              </h4>
            </div>
            <h1>
              {vital.bpH ? vital.bpH + "/" + vital.bpL : "..."}{" "}
              <span style={{ fontSize: "14px" }}>
                {" "}
                {vitals.slice(-1)[0]?.bp ? "mm Hg" : ""}
              </span>
            </h1>
          </div>
          <div className={styles.card_icon}>
            <img src={heart_icon} alt="" />
          </div>
        </div>
      </div>
      <VitalsFormDialog open={open} setOpen={setOpen} />
      <VitalsDialog
        open={openVitalHistory}
        setOpen={setOpenVitalHistory}
        category={category}
        unit={unit}
      />
    </div>
  );
}

export default VitalsTab;
