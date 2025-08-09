import React from "react";
import Dialog from "@mui/material/Dialog";
import styles from "./symptoms.module.scss";
import SymptompsTable from "./SymptomsTable";
import AddSymptomsDialog from "./SymptompsDialogue";
import { symptompstype } from "../../../../../types";
import addIcon from "../../../../../assets/reception/add_icon.png";

function SymptompsTab() {
  const [selectedList, setSelectedList] = React.useState<symptompstype[]>([]);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dialogPaperStyles = {
    minWidth: "600px",
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_info}>
          <div className={styles.info_header}>
            <h4>Symptoms At Admission</h4>
            <button onClick={handleClickOpen}>
              <img src={addIcon} alt="" />
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
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: dialogPaperStyles,
        }}
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
