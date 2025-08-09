import React, { useEffect, useRef } from "react";
import styles from "./Symptomps.module.scss";
import symptomps_gif from "./../../../../../src/assets/PatientProfile/symptomps_tab_icon.gif";
import add_icon from "./../../../../../src/assets/addstaff/add_icon.png";
import Dialog from "@mui/material/Dialog";
import { makeStyles } from "@mui/styles";
import { testType } from "../../../../types";
import { authFetch } from "../../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import TestsTable from "./TestTable";
import AddTestsDialog from "./AddTestDialog";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles({
  dialogPaper: {
    minWidth: "600px",
  },
});
function TestTab({ navigateToReports }: { navigateToReports: () => void }) {
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const getAllSymptompsApi = useRef(true);
  const location = useLocation();
  const isCustomerCare = location.pathname.includes("customerCare");


  useEffect(() => {
    const getAllSymptomps = async () => {
      const response = await authFetch(`test/${timeline.patientID}`, user.token);
      if (response.message == "success") {
        setSelectedList(response.tests);
      }
    };
    if (user.token && timeline.id && getAllSymptompsApi.current) {
      getAllSymptompsApi.current = false;
      getAllSymptomps();
    }
  }, [user, timeline, getAllSymptompsApi]);

  const [selectedList, setSelectedList] = React.useState<testType[]>([]);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const isNurseRoute = window.location.pathname.includes("nurse");

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_info}>
          <div className={styles.info_header}>
            <h4>Tests Prescribed</h4>
            {!isNurseRoute && !isCustomerCare && <button onClick={handleClickOpen}>
              <img src={add_icon} alt="" />
              Add Tests
            </button>}
          </div>
          <div className={styles.info_list}>
            <TestsTable
              selectedList={selectedList}
              setSelectedList={setSelectedList}
              navigateToReports={navigateToReports}
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
        <AddTestsDialog
          open={open}
          setOpen={setOpen}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        />
      </Dialog>
    </>
  );
};

export default TestTab;
