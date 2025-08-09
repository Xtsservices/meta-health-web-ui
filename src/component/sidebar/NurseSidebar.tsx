import React from "react";
import styles from "./sidebar.module.scss";
import admin_styles from "./admin_styles.module.scss";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import yantramLogo from "./../../../src/assets/cross_logo.png";
import dashboardDark from "./../../assets/nurse/material-symbols_dashboard-rounded-1.png";
import dashboardLight from "./../../assets/nurse/material-symbols_dashboard-rounded.png";
import patientsListDark from "./../../assets/nurse/material-symbols_patient-list-rounded-1.png";
import patientsListLight from "./../../assets/nurse/material-symbols_patient-list-rounded.png";
import alertDark from "./../../assets/nurse/mingcute_alert-fill-1.png";
import alertLight from "./../../assets/nurse/mingcute_alert-fill.png";
import managmentDark from "./../../assets/nurse/Group-1.png";
import managmentLight from "./../../assets/nurse/Group.png";
import love from "./../../../src/assets/love.png";
import help_icon from "./../../../src/assets/hospital_staff/help.png";
import help_icon_light from "./../../../src/assets/hospital_staff/help_light.png";
import Dialog from "@mui/material/Dialog";
import Logout from "./Logout";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { selectLoadingStatus } from "../../store/error/error.selector";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
const useStyles = makeStyles({
  dialogPaper: {
    // width: "600px",
    minWidth: "600px",
  },
});

// import { ChangeEventHandler, MouseEventHandler } from "react";
import { selectCurrentUser } from "../../store/user/user.selector";
import { Transition } from "./Transition";
import { Buttons } from "./Buttons";



function NurseSidebar(): JSX.Element {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const user = useSelector(selectCurrentUser);
  const [, setSearch] = React.useState("");

  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  const isLoading = useSelector(selectLoadingStatus);
  return (
    <>
      {isLoading ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <LinearProgress variant="determinate" value={0} />
      )}
      <div className={styles.sidebar}>
        <div className={styles.sidebar_container}>
          <div className={styles.sidebar_container_box}>
            <div className={styles.logo} onClick={() => navigate("/nurse")}>
              <img src={yantramLogo} alt="" className="" />
            </div>
            <div className={styles.zone_box}>
              <span
                style={{
                  textTransform: "uppercase",
                  color: "#7F2863 ",
                  fontWeight: 900,
                  paddingInline: "1rem",
                  paddingBlock: ".25rem",
                  backgroundColor: "#EAB8DA",
                  borderRadius: "100px",
                }}
              >
                {user?.role && user.role === 2002 ? "Head Nurse" : "Nurse"}
              </span>
            </div>

            <Buttons
              linkName={"/nurse"}
              name={"Dashboard"}
              iconDark={dashboardDark}
              iconLight={dashboardLight}
              setSearch={setSearch}
              exact={true}
              bgColor={styles.ot_active}
              
            />
            <Buttons
              linkName={"/nurse/patientsList"}
              name={"Patients List"}
              iconDark={patientsListDark}
              iconLight={patientsListLight}
              setSearch={setSearch}
              bgColor={styles.ot_active}

            />
            <Buttons
              linkName={"/nurse/alerts"}
              name={"Alerts"}
              iconDark={alertDark}
              iconLight={alertLight}
              setSearch={setSearch}
              bgColor={styles.ot_active}

            />
            <Buttons
              linkName={"/nurse/managment"}
              name={"Management"}
              iconDark={managmentDark}
              iconLight={managmentLight}
              setSearch={setSearch}
              bgColor={styles.ot_active}
            />

            <div className={styles.line}></div>
            <Buttons
              linkName={"/nurse/help"}
              name={"Help"}
              iconDark={help_icon}
              iconLight={help_icon_light}
              setSearch={setSearch}
              bgColor={styles.ot_active}
            />
            {/* <Buttons /> */}
            <div className={styles.love}>
              <img src={love} alt="" className="" />
            </div>
          </div>
        </div>

        {/* The Right side of the containet */}

        <div className={admin_styles.main}>
          <Outlet />
        </div>
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        classes={{ paper: classes.dialogPaper }}
      >
        <Logout setOpen={setOpen} open={open} />
      </Dialog>
    </>
  );
}

export default NurseSidebar;
