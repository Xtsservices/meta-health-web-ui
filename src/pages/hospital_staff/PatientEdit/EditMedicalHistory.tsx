import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { medicalHistoryFormType } from "../../../types";
import { authFetch } from "../../../axios/useAuthFetch";
import EditMedicalHistoryForm from "./Form/MedicalHistoryForm";
import styles from "./PatientEdit.module.scss";
import Button from "@mui/material/Button";
import { authPatch } from "../../../axios/usePatch";
import { setError, setSuccess } from "../../../store/error/error.action";
import { useNavigate, useParams } from "react-router-dom";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { ArrowBackIosNew } from "@mui/icons-material";

function EditMedicalHistory() {
  const { patientId } = useParams();
  const user = useSelector(selectCurrentUser);
  const [disable, setDisable] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
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
      familyDisease: "",
    });
  const getMedicalHistory = React.useCallback(async () => {
    const response = await authFetch(
      `history/${user.hospitalID}/patient/${patientId}`,
      user.token
    );
    if (response.message == "success") {
      if (response.medicalHistory != undefined)
        setMedicalHistory(response.medicalHistory);
    }
    setLoading(false);
  }, [patientId, user.hospitalID, user.token]);

  React.useEffect(() => {
    if (user.token && patientId) getMedicalHistory();
  }, [getMedicalHistory, patientId, user]);

  React.useEffect(() => {
    if (
      medicalHistory?.givenName &&
      medicalHistory?.givenPhone &&
      medicalHistory?.givenRelation
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [medicalHistory]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisable(true);

    const medicalResonse = await authPatch(
      `history/${user.hospitalID}/patient/${patientId}/${user.id}`,
      medicalHistory,
      user.token
    );
    if (medicalResonse.message == "success") {
      dispatch(setSuccess("Medical successfully updated"));
      // this will navigate previous path
      navigate(-1);
    } else {
      dispatch(setError(medicalResonse.message));
    }
    setDisable(false);
  };

  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);

  return (
    <div className={styles.container}>
      <form
        className={styles.container_left}
        onSubmit={(e) => {
          e.preventDefault();
          debouncedHandleSubmit(e);
        }}
      >
        <div className={styles.container_stepper}>
        <div className={styles.arrowBack} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
          <ArrowBackIosNew onClick={() => {
                                  navigate(-1);
                                }} />
                                </div>
          <h2>Edit Medical History of the Patient</h2>
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
        <div style={{ display: "flex" }}>
          {/* <Button
            variant="contained"
            disabled={disable}
            sx={{ ml: 6, mr: "auto", mb: 2 }}
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </Button> */}
          <Button
            variant="contained"
            disabled={disable}
            sx={{ ml: 6, mr: "auto", mb: 2 }}
            type="submit"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditMedicalHistory;
