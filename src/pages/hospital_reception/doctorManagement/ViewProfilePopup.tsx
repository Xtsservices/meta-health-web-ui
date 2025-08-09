import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import styles from "./ViewProfilePopup.module.scss";

type ViewProfilePopupProps = {
  open: boolean;
  onClose: () => void;
  doctorName: string;
  doctorImage: string;
  qualification: string;
  department: string;
  experience: string;
  designation: string;
};

const ViewProfilePopup: React.FC<ViewProfilePopupProps> = ({
  open,
  onClose,
  doctorName,
  qualification,
  department,
  experience,
  designation,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>Profile</DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <Typography variant="h6" className={styles.name}>
          {doctorName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {qualification}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {department}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {experience}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {designation}
        </Typography>
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          className={styles.button}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProfilePopup;
