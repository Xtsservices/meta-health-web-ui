import styles from "./AddTriageIssue.module.scss";
import { useNavigate } from "react-router-dom";
import TriageFormContext from "./contexts/TriageFormContext";
import React, { useContext, useEffect, useState } from "react";
import { zoneType } from "../../../utility/role";
import TriageDialogBox from "./TriageDialogBox";
import HyperTension from "../../../assets/triage/hypertension.png";
import BrainStroke from "../../../assets/triage/brain-stroke.svg";
import UnConcious from "../../../assets/triage/unconcious.png";

function AddTriageIssue() {
  const navigate = useNavigate();
  const { formData, setFormData } = useContext(TriageFormContext);
  const [triageDialog, setTriageDialog] = useState(false);
  const [condition, setCondition] = useState<null | string | undefined>("");

  const toggleTriageDialog = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const condition = target.closest("div")?.getAttribute("data-condition");
    setCondition(condition);
    setTriageDialog((prev) => !prev);
  };

  const handleCriticalCondition = (wardSelected: string) => {
    if (!condition) return;
    setFormData((prev) => ({
      ...prev,
      criticalCondition: condition,
      ward: wardSelected,
      zone: zoneType.red
    }));
    navigate("./zone");
  };

  const proceedToVitals = () => navigate("vitals");
  const back = () => navigate(-1);

  useEffect(() => {
    setFormData((p) => ({ ...p, lastKnownSequence: "criticalCondition" }));
  }, [setFormData]);

  return (
    <div className={styles.container}>
      <h3>Select a Critical Condition</h3>
      <div className={styles.container_options}>
        <div
          className={styles.card + " " + styles.card_chest}
          onClick={toggleTriageDialog}
          data-condition="chest pain"
        >
          <img width="100" height="100" src={HyperTension} alt="hypertension" />
          <h2>Chest Pain</h2>
        </div>
        <div
          className={styles.card + " " + styles.card_stroke}
          onClick={toggleTriageDialog}
          data-condition="stroke"
        >
          <img width="100" height="100" src={BrainStroke} alt="brain-stroke" />
          <h2>Stroke</h2>
        </div>
        <div
          className={styles.card + " " + styles.card_unconcious}
          onClick={toggleTriageDialog}
          data-condition="unconcious"
        >
          <img
            width="100"
            height="100"
            src={UnConcious}
            alt="faint-full-body"
          />
          <h2>Unconcious</h2>
        </div>
      </div>
      <div className={styles.container_bottom}>
        <button onClick={back}>Back</button>
        {!formData.criticalCondition && (
          <button onClick={proceedToVitals}>Skip</button>
        )}
      </div>
      {triageDialog && (
        <TriageDialogBox
          setOpen={setTriageDialog}
          open={triageDialog}
          condition={condition}
          handleCriticalCondition={handleCriticalCondition}
        />
      )}
    </div>
  );
}

export default AddTriageIssue;
