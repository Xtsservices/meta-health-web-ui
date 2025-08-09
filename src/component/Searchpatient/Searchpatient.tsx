import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import notification_icon from "./../../../src/assets/hospital_staff/notification_icon.png";
import warning_white_icon from "./../../../src/assets/hospital_staff/warning_white_icon.png";
import { capitalizeFirstLetter, findCorrectRoute } from "../../utility/global";
import styles_card from "./search.module.scss";
import { Role_NAME, SCOPE_LIST, patientStatus } from "../../utility/role";
import { authFetch } from "../../axios/useAuthFetch";
import { PatientType } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { useNavigate } from "react-router-dom";
import { setCurrPatient } from "../../store/currentPatient/currentPatient.action";
import { setBackdropLoading, setError } from "../../store/error/error.action";
import PatientRevisitDialog from "../PatientProfile/PatientRevisit/RevisitDialog";

function Searchpatient({ search }: { search: string }) {
  console.log("search", search);
  const [allList, setAllList] = React.useState<PatientType[]>([]);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openRevisitForm, setOpenRevisitForm] = React.useState(false);

  
  // async function getAllPatient() {
  //   setAllList([]);
  //   const opdListResponse = await authFetch(
  //     `patient/${user.hospitalID}/patients/${
  //       String(patientStatus.outpatient) +
  //       "$" +
  //       String(patientStatus.discharged) +
  //       "$" +
  //       String(patientStatus.inpatient) +
  //       "$" +
  //       String(patientStatus.emergency)
  //     }?role=${Role_NAME.nurse}&userID=${user.id}`,
  //     user.token
  //   );
  //   if (opdListResponse.message == "success") {
  //     setAllList(() => {
  //       return [...opdListResponse.patients];
  //     });
  //   }
  // }

  const getStatusFromScopes = (scopes: string): string => {
    const statusList: number[] = [];
    // Map the user's scopes to patient status
    scopes.split("#").forEach((scope) => {
      switch (scope) {
        case String(SCOPE_LIST.inpatient):
          statusList.push(patientStatus.inpatient);
          break;
        case String(SCOPE_LIST.outpatient):
          statusList.push(patientStatus.outpatient);
          break;
        case String(SCOPE_LIST.emergency_green_zone):
        case String(SCOPE_LIST.emergency_yellow_zone):
        case String(SCOPE_LIST.emergency_red_zone):
          statusList.push(patientStatus.emergency);
          break;

          case String(SCOPE_LIST.surgeon): // If the user is a surgeon
          case String(SCOPE_LIST.anesthetist): // If the user is an anesthetist
            statusList.push(patientStatus.operationTheatre);
            break;
        default:
          break;
      }
    });
  
    return statusList.join("$");
  };
  
  async function getAllPatient() {
    setAllList([]);
    
    // Get the patient statuses based on user scope
    const statusQuery = getStatusFromScopes(user.scope);
  
    const opdListResponse = await authFetch(
      `patient/${user.hospitalID}/patients/${statusQuery}?role=${Role_NAME.nurse}&userID=${user.id}`,
      user.token
    );
    
    if (opdListResponse.message === "success") {
      setAllList(() => {
        return [...opdListResponse.patients];
      });
    }
  }
  
  React.useEffect(() => {
    if (user.token) getAllPatient();
  }, [user]);
  const getCurrentPatientAndTimeline = async (id: number): Promise<boolean> => {
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/single/${id}`,
      user.token
    );
    if (response.message == "success") {
      dispatch(setCurrPatient({ currentPatient: { ...response.patient } }));
      return true;
    }
    return false;
  };
  const handleRevist = async (id: number) => {
    dispatch(setBackdropLoading(true));
    const isData = await getCurrentPatientAndTimeline(id);
    if (isData) {
      setOpenRevisitForm(true);
    } else {
      dispatch(setError("Something went wrong"));
    }
    dispatch(setBackdropLoading(false));
  };

 
  return (
    <>
    {allList.filter((el) => String(el.phoneNumber).includes(search)).length === 0 ? (
    <div style={{ textAlign: 'center', margin: '0 auto', width: '100%' }}>
    No Patients Found
  </div>
    ) : (
      allList
      .filter((el) => String(el.phoneNumber).includes(search))
      .map((patient) => {
        // console.log(patient.lastModified);
        return (
          <>
            <div
              className={styles_card.card}
              style={{ border: "none" }}
              onClick={() => {
                navigate(
                  `/hospital-dashboard/${findCorrectRoute(
                    patient.patientEndStatus ||
                      patient.patientStartStatus ||
                      0
                  )}/${patient.id}`
                );
                // setSearch("");
              }}
            >
              {/* <div className={styles_card.card_main}> */}
              <div
                className={styles_card.card_warning}
                style={{ visibility: "hidden" }}
              >
                <img src={warning_white_icon} alt="" />
                Temperature Raised
                <img
                  src={notification_icon}
                  alt=""
                  className={styles_card.notification}
                />
              </div>
              <div className={styles_card.card_img}>
                {patient.imageURL && (
                  <img
                    src={patient.imageURL}
                    alt=""
                    className={styles_card.profile}
                  />
                )}
                {/* <img src={profile_pic} alt="" className={styles.profile} /> */}
                {!patient.imageURL && (
                  <PersonIcon className={styles_card.profile} />
                )}
              </div>
              <h2>{patient.pName}</h2>
              <h4>{patient.pID}</h4>
              <p className={styles_card.highlight}>
                <strong>
                  Patient Status:{" "}
                  {!patient.patientEndStatus
                    ? capitalizeFirstLetter(
                        Object.keys(patientStatus)[
                          Object.values(patientStatus).indexOf(
                            patient.patientStartStatus || 0
                          )
                        ]
                      )
                    : "Discharged"}
                </strong>
              </p>
              {!patient.patientEndStatus ? (
                <button>View Details</button>
              ) : (
                <div className={styles_card.btns}>
                  <button
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.stopPropagation();
                      navigate(`/hospital-dashboard/opd/list/${patient.id}`);
                    }}
                  >
                    Follow Up
                  </button>
                  <button
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.stopPropagation();
                      handleRevist(patient.id || 0);
                    }}
                  >
                    Revisit
                  </button>
                </div>
              )}
            </div>
          </>
        );
      })
    )}
      
      {openRevisitForm ? (
        <PatientRevisitDialog
          open={openRevisitForm}
          setOpen={setOpenRevisitForm}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Searchpatient;
