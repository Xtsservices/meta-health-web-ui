import React from "react";
import styles from "./Reports.module.scss";
import Button from "@mui/material/Button";
import FormDialog from "./AddReportDialogue";
import AlertDialog from "./DeleteAlertDialog";
import { reportCategory } from "../../../../../utility/role";
import { capitalizeFirstLetter } from "../../../../../utility/global";

function Reports() {
  const [open, setOpen] = React.useState(false);

  const [alertOpen, setAlertOpen] = React.useState<boolean>(false);
  const [reportId] = React.useState(0);
  const [category, setCategory] = React.useState(0);

  return (
    <div className={styles.container}>
      {Object.keys(reportCategory).map((category, index) => {
        return (
          <>
            {" "}
            <div className={styles.container_report}>
              <div className={styles.container_header}>
                <h2>{capitalizeFirstLetter(category)}</h2>
                <Button
                  variant="contained"
                  onClick={() => {
                    setCategory(Object.values(reportCategory)[index] as number);
                    setOpen(true);
                  }}
                  sx={{ ml: "auto" }}
                >
                  Add Report
                </Button>
              </div>
              <div className={styles.report}></div>
            </div>
          </>
        );
      })}

      <FormDialog open={open} setOpen={setOpen} category={category} />
      <AlertDialog id={reportId} setOpen={setAlertOpen} open={alertOpen} />
      {/* Added By Dialog */}
      {/* {(showID !== 0 && (render)) && <AddedBy userID={showID} />} */}
    </div>
  );
}

export default Reports;
