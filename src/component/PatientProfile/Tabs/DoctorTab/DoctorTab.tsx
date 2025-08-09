import React, { useCallback, useRef } from "react";
import styles from "./Symptomps.module.scss";
import symptomps_gif from "./../../../../../src/assets/PatientProfile/symptomps_tab_icon.gif";
import add_icon from "./../../../../../src/assets/addstaff/add_icon.png";
import Dialog from "@mui/material/Dialog";
// import AddSymptomsDialog from "./AddTestDialog";
import { makeStyles } from "@mui/styles";
import { PatientDoctor } from "../../../../types";
import { authFetch } from "../../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import {
  selectCurrPatient,
  selectTimeline,
} from "../../../../store/currentPatient/currentPatient.selector";
import DoctorTable from "./Doctor";
import AddDoctorDialog from "./AddDoctorDialog";
const useStyles = makeStyles({
  dialogPaper: {
    // width: "600px",
    minWidth: "600px",
  },
});
function DoctorTab() {
  const getAllDoctorsApi = useRef(true);
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const currentPatient = useSelector(selectCurrPatient);
  const getAllDoctors = useCallback(async () => {
    const patientDoctorResponse = await authFetch(
      `doctor/${user.hospitalID}/${timeline.id}/all`,
      user.token
    );
    if (patientDoctorResponse.message == "success") {
      setSelectedList(patientDoctorResponse.data);
    }
  }, [timeline.id, user.hospitalID, user.token]);

  const isNurseRoute = window.location.pathname.includes("nurse");
  React.useEffect(() => {
    if (user.token && timeline.id && getAllDoctorsApi.current) {
      getAllDoctorsApi.current = false;
      getAllDoctors();
    }
  }, [user, timeline, getAllDoctors]);
  const [selectedList, setSelectedList] = React.useState<PatientDoctor[]>([]);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_info}>
          <div className={styles.info_header}>
            <h4>Doctor List</h4>
            {currentPatient.ptype !== 21 && !isNurseRoute && (
              <button onClick={handleClickOpen}>
                <img src={add_icon} alt="" />
                Add Doctor
              </button>
            )}
          </div>
          <div className={styles.info_list}>
            <DoctorTable selectedList={selectedList} />
          </div>
        </div>
        <div className={styles.container_gif}>
          <img src={symptomps_gif} alt="" />
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <AddDoctorDialog
          open={open}
          setOpen={setOpen}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        />
      </Dialog>
    </>
  );
}

export default DoctorTab;
