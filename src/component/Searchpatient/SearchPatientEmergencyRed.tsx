import React, { useCallback } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import notification_icon from './../../../src/assets/hospital_staff/notification_icon.png';
import warning_white_icon from './../../../src/assets/hospital_staff/warning_white_icon.png';
import { capitalizeFirstLetter, findCorrectRoute } from '../../utility/global';
import styles_card from './search.module.scss';
import { patientStatus, zoneType } from '../../utility/role';
import { authFetch } from '../../axios/useAuthFetch';
import { PatientType } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/user/user.selector';
import { useNavigate } from 'react-router-dom';
import { setCurrPatient } from '../../store/currentPatient/currentPatient.action';
import { setBackdropLoading, setError } from '../../store/error/error.action';
import PatientRevisitDialog from '../PatientProfile/PatientRevisit/RevisitDialog';

function SearchPatientEmergencyRed({ search }: { search: string }) {
  const [allList, setAllList] = React.useState<PatientType[]>([]);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openRevisitForm, setOpenRevisitForm] = React.useState(false);

  const getAllPatient = useCallback(
    async function () {
      setAllList([]);

      const patientList = await authFetch(
        `patient/${user.hospitalID}/patients/${String(
          patientStatus.emergency
        )}?zone=${zoneType.red}`,
        user.token
      );

      if (patientList.message == 'success') {
        setAllList(() => {
          return [...patientList.patients];
        });
      }
    },
    [user.hospitalID, user.token]
  );
  
  React.useEffect(() => {
    if (user.token) getAllPatient();
  }, [getAllPatient, user]);
  const getCurrentPatientAndTimeline = async (id: number): Promise<boolean> => {
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/single/${id}`,
      user.token
    );
    if (response.message == 'success') {
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
      dispatch(setError('Something went wrong'));
    }
    dispatch(setBackdropLoading(false));
  };
  return (
    <>
      {allList
        .filter((el) => String(el.phoneNumber).includes(search))
        .map((patient) => {
          // console.log(patient.lastModified);
          return (
            <>
              <div
                className={styles_card.card}
                style={{ border: 'none' }}
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
                  style={{ visibility: 'hidden' }}
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
                    Patient Status:{' '}
                    {!patient.patientEndStatus
                      ? capitalizeFirstLetter(
                          Object.keys(patientStatus)[
                            Object.values(patientStatus).indexOf(
                              patient.patientStartStatus || 0
                            )
                          ]
                        )
                      : 'Discharged'}
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
        })}
      {openRevisitForm ? (
        <PatientRevisitDialog
          open={openRevisitForm}
          setOpen={setOpenRevisitForm}
        />
      ) : (
        ''
      )}
    </>
  );
}

export default SearchPatientEmergencyRed;
