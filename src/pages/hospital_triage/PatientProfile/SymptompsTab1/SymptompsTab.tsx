import React from "react";
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
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
const useStyles = makeStyles({
  dialogPaper: {
    // width: "600px",
    minWidth: "600px",
  },
});
function SymptompsTab() {
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  // console.log("timeline from symptom tab", timeline);
  const getAllSymptomps = async () => {
    const response = await authFetch(`symptom/${timeline.patientID}`, user.token);
    // console.log("response while fetching all the symptom", response);
    if (response.message == "success") {
      setSelectedList(response.symptoms);
    }
  };
  React.useEffect(() => {
    if (user.token && timeline.id) {
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
            <button onClick={handleClickOpen}>
              <img src={add_icon} alt="" />
              Add Symptoms
            </button>
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
