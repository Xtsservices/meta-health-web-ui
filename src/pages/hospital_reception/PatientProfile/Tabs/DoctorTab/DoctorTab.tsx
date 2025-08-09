import styles from "./symptomps.module.scss";
import Dialog from "@mui/material/Dialog";
// import AddSymptomsDialog from "./AddTestDialog";
import React from "react";
import DoctorTable from "./Doctor";
import AddDoctorDialog from "./AddDoctorDialog";
import { PatientDoctor } from "../../../../../types";
import add_icon from "../../../../../assets/reception/add_icon.png";

function DoctorTab() {
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
            <button onClick={handleClickOpen}>
              <img src={add_icon} alt="" />
              Add Doctor
            </button>
          </div>
          <div className={styles.info_list}>
            <DoctorTable selectedList={selectedList} />
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            minWidth: "600px",
          },
        }}
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
