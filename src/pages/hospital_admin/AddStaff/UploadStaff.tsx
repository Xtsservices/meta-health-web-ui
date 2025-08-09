import * as React from "react";
import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
import styles from "./AddStaff.module.scss";
// import uploadStyles from "./upload.module.scss";
// import * as React from "react";
// import Box from "@mui/material/Box";
import file_icon from "./../../../../src/assets/addstaff/file_icon.png";
import download_icon from "./../../../../src/assets/addstaff/download_icon.png";
// import tick_icon from "./../../../../src/assets/addstaff/tick_icon.png";
import upload_icon from "./../../../../src/assets/addstaff/uploaded_icon.png";

type addStaffProps = {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function UploadDialog({ setOpen }: addStaffProps) {
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <DialogContent>
        <div className={styles.uploadDialog}>
          <p>
            Please upload the staffing sheet in excel format using the
            prescribed fields
          </p>
          <p className="">
            <img src={download_icon} /> Download the format here
          </p>
          <label className={styles.upload_container} htmlFor="uploadFile">
            <img src={file_icon} />
            Drag and Drop or Browse
          </label>
          <input
            type="file"
            className=""
            id="uploadFile"
            style={{ visibility: "hidden" }}
            accept=".xlsx, .csv"
          />
          Supported formats: xlsx, csv
          <h4 className="">Uploaded Documents</h4>
          <div className={styles.uploaded_box}>
            <div className={styles.uploaded_box_file}>
              <img src={upload_icon} alt="" />
              <h3>Example.xlsx</h3>
              <br />
              File Size: 1mb
            </div>
            <div className={styles.uploaded_box_buttons}>
              <button className="">View</button>
              <button className={styles.delete}>Delete</button>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Save</Button>
      </DialogActions>
    </div>
  );
}
