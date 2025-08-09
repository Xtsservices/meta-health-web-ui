import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
// import { selectCurrPatient } from "../../../store/currentPatient/currentPatient.selector";
import { medicalHistoryFormType } from "../../../types";
import { authFetch } from "../../../axios/useAuthFetch";
import EditMedicalHistoryForm from "./Form/MedicalHistoryForm";
import styles from "./PatientEdit.module.scss";
import Button from "@mui/material/Button";
import { authPatch } from "../../../axios/usePatch";
import { setError, setSuccess } from "../../../store/error/error.action";
import { useNavigate, useParams } from "react-router-dom";
import { debounce, DEBOUNCE_DELAY } from '../../../utility/debounce';
function EditMedicalHistory() {
  //   const currentPatient = useSelector(selectCurrPatient);
  const { patientId } = useParams();
  const user = useSelector(selectCurrentUser);
  const [disable, setDisable] = React.useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const [medicalHistory, setMedicalHistory] =
    React.useState<medicalHistoryFormType>({
      patientID: 0,
      userID: 0,
      givenName: "",
      givenPhone: "",
      givenRelation: "",
      bloodGroup: "",
      bloodPressure: "",
      disease: "",
      foodAllergy: "",
      medicineAllergy: "",
      anaesthesia: "",
      meds: "",
      selfMeds: "",
      chestCondition: "",
      neurologicalDisorder: "",
      heartProblems: "",
      infections: "",
      mentalHealth: "",
      drugs: "",
      pregnant: "",
      hereditaryDisease: "",
      lumps: "",
      cancer: "",
      familyDisease:""
    });
  const getMedicalHistory = async () => {
    const response = await authFetch(
      `history/${user.hospitalID}/patient/${patientId}`,
      user.token
    );
    if (response.message == "success") {
      setMedicalHistory(response.medicalHistory);
    }
    setLoading(false);
  };
  React.useEffect(() => {
    if (user.token && patientId) {
      getMedicalHistory();
    }
  }, [patientId, user]);
  React.useEffect(() => {
    if (
      medicalHistory.givenName &&
      medicalHistory.givenPhone &&
      medicalHistory.givenRelation
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [medicalHistory]);
  const handleSubmit = async () => {
    setDisable(true);
    const medicalResonse = await authPatch(
      `history/${user.hospitalID}/patient/${patientId}/${user.id}`,
      medicalHistory,
      user.token
    );
    if (medicalResonse.message == "success") {
      dispatch(setSuccess("Medical successfully updated"));
      navigate(`../${patientId}`);
    } else {
      dispatch(setError(medicalResonse.message));
    }
    setDisable(false);
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);
  return (
    <div className={styles.container}>
      <div className={styles.container_left}>
        <div className={styles.container_stepper}>
          <h4 style={{ visibility: "hidden" }}>Patient Information</h4>
          <p style={{ visibility: "hidden" }}>
            {" "}
        
          </p>
          <h2>Edit Medical History of the Patientop</h2>
          {/* <HorizontalStepperWithError setStep={setStep} step={step} /> */}
        </div>
        <div className={styles.container_form} style={{ width: "80%" }}>
          {!loading ? (
            <EditMedicalHistoryForm
              medicalHistoryData={medicalHistory}
              setMedicalHistoryData={setMedicalHistory}
            />
          ) : (
            ""
          )}
        </div>
        <Button
          variant="contained"
          // onClick={() => handleBasicFormSubmit()}
          disabled={disable}
          sx={{ ml: 6, mr: "auto", mb: 2 }}
          type="submit"
          onClick={() => debouncedHandleSubmit()}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default EditMedicalHistory;
