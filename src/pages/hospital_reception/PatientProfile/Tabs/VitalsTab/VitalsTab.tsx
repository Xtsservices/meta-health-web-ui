import React, { useState } from "react";
import styles from "./vitalsTab.module.scss";
import VitalsDialog from "./VitalsDialog";
import VitalsFormDialog from "./VitalsForm";
import parse from "html-react-parser";

import arrowRightIcon from "../../../../../assets/reception/arrow-right_icon.png";
import pulseIcon from "../../../../../assets/reception/ppulse_icon.png";
import thermometerIcon from "../../../../../assets/reception/thermometer_icon.png";
import heartIcon from "../../../../../assets/reception/heart_icon.png";
import rrIcon from "../../../../../assets/reception/rr.png";
import addIcon from "../../../../../assets/reception/add_icon.png";
import dropletIcon from "../../../../../assets/reception/droplet_icon.png";
import { vitalsFormType1, vitalsType } from "../../../../../types";

function VitalsTab() {
  const [open, setOpen] = React.useState(false);
  const [openVitalHistory, setOpenVitalHistory] = React.useState(false);

  const [category, setCategory] = React.useState<keyof vitalsType>("bp");

  const [showID, setShowID] = useState<number | null>(0);

  const [unit, setUnit] = React.useState<string>("");

  const initialState: vitalsFormType1 = {
    userID: 0,
    oxygen: 0,
    pulse: 0,
    temperature: 0,
    hrv: 0,
    respiratoryRate: 0,
    bpH: "",
    bpL: "",
    bpTime: "",
    oxygenTime: "",
    temperatureTime: "",
    pulseTime: "",
    respiratoryRateTime: "",
    hrvTime: "",
  };
  const [vital] = React.useState<vitalsFormType1>(initialState);

  function doRemderAfterUpdate() {
    console.log();
  }

  return (
    <div className={styles.container}>
      <div className={styles.info_header}>
        {/* <h4>Symptomps At Admission</h4> */}
        <button onClick={() => setOpen(true)}>
          <img src={addIcon} alt="" />
          Add Vitals
        </button>
      </div>
      <div className={styles.vital_container}>
        {/* ================Pulse Rate================== */}
        <div
          className={styles.card + " " + styles.blue}
          onClick={() => {
            setCategory("pulse");
            setUnit("bpm");
            setOpenVitalHistory(true);
            setShowID(vital.userID);
          }}
        >
          <div className={styles.card_info}>
            <div className={styles.card_info_header}>
              <h4>
                Pulse Rate <img src={arrowRightIcon} alt="arrow_right_icon" />
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
            <img src={pulseIcon} alt="pulse_icon" />
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
                <img src={arrowRightIcon} alt="arrow_right_icon" />
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
            <img src={thermometerIcon} alt="thermometer_icon" />
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
                Oxygen Saturation (SpO2){" "}
                <img src={arrowRightIcon} alt="arrow_right_icon" />
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
            <img src={dropletIcon} alt="droplet_icon" />
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
                Blood Pressure{" "}
                <img src={arrowRightIcon} alt="arrow_right_icon" />
              </h4>
            </div>
            <h1>{vital.bpH ? vital.bpH + "/" + vital.bpL : "..."} </h1>
          </div>
          <div className={styles.card_icon}>
            <img src={heartIcon} alt="heart_icon" />
          </div>
        </div>
        {/* =======================respiratory rate=================== */}
        <div
          className={styles.card + " " + styles.pink}
          onClick={() => {
            setCategory("respiratoryRate");
            setUnit("bpm");
            setOpenVitalHistory(true);
          }}
        >
          <div className={styles.card_info}>
            <div className={styles.card_info_header}>
              <h4>
                Respiratory Rate{" "}
                <img src={arrowRightIcon} alt="arrow_right_icon" />
              </h4>
            </div>
            <h1>
              {vital?.respiratoryRate || "..."}
              <span style={{ fontSize: "14px" }}>
                {vital?.respiratoryRate ? "bpm" : ""}
              </span>
            </h1>
          </div>
          <div className={styles.card_icon}>
            <img src={rrIcon} alt="rr_icon" />
          </div>
        </div>
      </div>
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
      />
    </div>
  );
}

export default VitalsTab;
