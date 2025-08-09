import React from "react";
import styles from "./patientProfileCard.module.scss";
import { useParams } from "react-router-dom";

import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";

import PersonIcon from "@mui/icons-material/Person";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { selectCurrPatient } from "../../../../store/currentPatient/currentPatient.selector";
import { setLoading } from "../../../../store/error/error.action";
import { authFetch } from "../../../../axios/useAuthFetch";
import { setCurrPatient } from "../../../../store/currentPatient/currentPatient.action";
import { getAge } from "../../../../utility/global";

function LabPatientProfile() {
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const dispatch = useDispatch();

  const { id } = useParams();

  const getCurrentPatient = React.useCallback(async () => {
    dispatch(setLoading(true));
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/single/triage/${id}`,
      user.token
    );
    if (response.message == "success") {
      dispatch(setCurrPatient({ currentPatient: { ...response.patient } }));
    }
    dispatch(setLoading(false));
  }, [dispatch, id, user.hospitalID, user.token]);

  React.useEffect(() => {
    if (user.token) {
      getCurrentPatient();
    }
  }, [getCurrentPatient, id, user]);

  return (
    <>
      <div className={styles.container}>
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
                  {currentPatient?.startTime &&
                    new Date(currentPatient?.startTime).toLocaleDateString(
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
        </div>
      </div>
    </>
  );
}

export default LabPatientProfile;
