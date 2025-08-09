import styles from "./patientProfile.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import { Box, Typography } from "@mui/material";
import BasicTabs from "./BasicTable";

const PatientProfile = () => {
  return (
    <>
      <div className={styles.mainContainer}>
        <h2 className={styles.heading}>PATIENT PROFILE</h2>

        <div className={styles.profile_container}>
          <div className={styles.primaryCotainer}>
            <div className={styles.profile_img}>
              <PersonIcon className={styles.profile} />
            </div>
            <h3 className={styles.userName}>John Doe</h3>

            <p className={styles.patientId}>Patient ID: 120</p>
          </div>

          <div className={styles.profile_info}>
            <div className={styles.profile_info_main}>
              <div className={styles.profile_info_left}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Gender</span>
                  <span className={styles.value}>:Male</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Age</span>
                  <span className={styles.value}>:20</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Place</span>
                  <span className={styles.value}>:Hyderabad</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Date of Admission</span>
                  <span className={styles.value}>:19/08/2024</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Treating Doctor</span>
                  <span className={styles.value}>:John</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Follow Up</span>
                  <span className={styles.value}>:Yes</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.profile_options}>
            <div className={styles.profile_options}>
              <IconButton aria-label="edit">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <EditIcon />
                  <Typography variant="caption">Edit</Typography>
                </Box>
              </IconButton>

              <IconButton aria-label="print">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <PrintIcon />
                  <Typography variant="caption">Print</Typography>
                </Box>
              </IconButton>
            </div>
          </div>
        </div>

        <BasicTabs />
      </div>
    </>
  );
};
export default PatientProfile;
