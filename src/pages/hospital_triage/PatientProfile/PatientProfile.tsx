import React, { useRef } from "react";
import styles from "./PatientProfile.module.scss";
import { useParams } from "react-router-dom";

import { useSelector } from "react-redux/es/hooks/useSelector";
import { setCurrPatient } from "../../../store/currentPatient/currentPatient.action";
import { selectCurrPatient } from "../../../store/currentPatient/currentPatient.selector";
import { authFetch } from "../../../axios/useAuthFetch";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useDispatch } from "react-redux";

import PersonIcon from "@mui/icons-material/Person";
import { getAge } from "../../../utility/global";
import { setLoading } from "../../../store/error/error.action";
import TransferPatientDialog from "./transferPatientDialog";

function TriagePatientProfile() {
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const dispatch = useDispatch();

  const { id } = useParams();
  const [openTransferForm, setOpenTransferForm] = React.useState(false);
  const getCurrentPatientApi = useRef(true)

  const getCurrentPatient = React.useCallback(async () => {
    dispatch(setLoading(true));
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/single/triage/${id}`,
      user.token
    );
    if (response.message == "success") {
      // setCurrPatient(response.patient);
      dispatch(setCurrPatient({ currentPatient: { ...response.patient } }));
    }
    dispatch(setLoading(false));
  }, [dispatch, id, user.hospitalID, user.token]);

  React.useEffect(() => {
    if (user.token && getCurrentPatientApi.current) {
      // getCurrentPatientAndTimeline();
      getCurrentPatientApi.current = false
      getCurrentPatient();
      // getWardData();
    }
  }, [getCurrentPatient, id, user]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_header}>
          <h3>Patient Details</h3>
          {/* <button
            className={styles.header_button + ' ' + styles.margin_left_auto}
            onClick={() => {
              setOpenTransferForm(true);
            }}
          >
            <TransferWithinAStationIcon />
            Transfer Patient
          </button> */}
        </div>
        <div className={styles.profile_container}>
          <div className={styles.profile_img}>
            {currentPatient.imageURL && (
              <img
                src={currentPatient.imageURL}
                alt=""
                className={styles.profile}
              />
            )}
            {}
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
                    UHID No: {currentPatient?.pUHID}
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
                <p>
                  {currentPatient?.city}, {currentPatient?.state}{" "}
                </p>
              </div>
              <div className={styles.profile_info_right}>
                <p style={{ marginTop: "0" }}>
                  Date of Admission:{" "}
                  {currentPatient?.addedOn &&
                    new Date(currentPatient?.addedOn).toLocaleDateString(
                      "en-GB"
                    )}
                </p>
                <p>
                  Treating Doctor:&nbsp;
                  {currentPatient?.doctorName &&
                    (currentPatient.doctorName === "undefined undefined"
                      ? "Unassigned"
                      : currentPatient?.doctorName.slice(0, 1).toUpperCase() +
                        currentPatient?.doctorName.slice(1).toLowerCase())}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.profile_options}>
            <div className={styles.profile_options_inpatient}>Emergency</div>
          </div>
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
    </>
  );
}

export default TriagePatientProfile;

// function compareDates(a: Reminder, b: Reminder) {
//   return new Date(a.dosageTime).valueOf() - new Date(b.dosageTime).valueOf();
// }
