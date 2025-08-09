import React, { useRef } from "react";
import styles from "./Symptomps.module.scss";
import symptomps_gif from "./../../../../../src/assets/PatientProfile/symptomps_tab_icon.gif";
import add_icon from "./../../../../../src/assets/addstaff/add_icon.png";
import SymptompsTable from "./SymptompsTable";
import Dialog from "@mui/material/Dialog";
import AddSymptomsDialog from "./SymptompsDialog";
import { makeStyles } from "@mui/styles";
import { symptompstype } from "../../../../types";
import { authFetch } from "../../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { selectCurrPatient, selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { useLocation } from "react-router-dom";
const useStyles = makeStyles({
  dialogPaper: {
    // width: "600px",
    minWidth: "600px",
  },
});
function SymptompsTab() {
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const location = useLocation();
  const isCustomerCare = location.pathname.includes("customerCare");
  const timeline = useSelector(selectTimeline);
  const getAllSymptompsApi = useRef(true)
  
  const getAllSymptomps = async () => {
    const response = await authFetch(`symptom/${timeline.patientID}`, user.token);
    if (response.message == "success") {
      setSelectedList(response.symptoms);
    }
  };
  React.useEffect(() => {
    if (user.token && timeline.id ) {
      getAllSymptompsApi.current = false
      getAllSymptomps();
    }
  }, [user, timeline]);
  const [selectedList, setSelectedList] = React.useState<symptompstype[]>([]);
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
            <h4>Symptoms At Admission</h4>
            {currentPatient.ptype !== 21 && !isCustomerCare &&(
              <button onClick={handleClickOpen}>
              <img src={add_icon} alt="" />
              Add Symptoms
            </button>
            )}
            
          </div>
          <div className={styles.info_list}>
            <SymptompsTable
              selectedList={selectedList}
              setSelectedList={setSelectedList}
            />
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
        <AddSymptomsDialog
          open={open}
          setOpen={setOpen}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        />
      </Dialog>
    </>
  );
}

export default SymptompsTab;
