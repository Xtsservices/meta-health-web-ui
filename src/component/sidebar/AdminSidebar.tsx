import React, { useEffect } from "react";
import styles from "./sidebar.module.scss";
import admin_styles from "./admin_styles.module.scss";
import { Outlet } from "react-router-dom";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import yantramLogo from "./../../../src/assets/circlemeta.jpg";
import dashboard from "./../../../src/assets/sidebar/dashboard_icon.png";
import dashboardDark from "./../../../src/assets/sidebar/dashboard_dark_icon.png";
import addpatient_light from "./../../../src/assets/sidebar/addpatient_light.png";
import add_patient from "./../../../src/assets/sidebar/add_patient.png";
// import alertsIcon from "./../../../src/assets/sidebar/New/INACTIVE/alert.png";
// import alertsLightIcon from "./../../../src/assets/sidebar/New/ACTIVE/alert.png";
import inpatient_light from "./../../../src/assets/sidebar/inpatient_light.png";
import inpatient from "./../../../src/assets/sidebar/Inpatient.png";
import love from "./../../../src/assets/love.png";
import device_icon from "./../../../src/assets/sidebar/device_icon.png";
import device_icon_light from "./../../../src/assets/sidebar/device_icon_light.png";
import profile_icon from "./../../../src/assets/sidebar/profile.png";
import profile_icon_light from "./../../../src/assets/sidebar/profile_light.png";
import hub_icon from "./../../../src/assets/sidebar/hub_icon.png";
import hub_icon_light from "./../../../src/assets/sidebar/hub_icon_light.png";
import help_icon from "./../../../src/assets/hospital_staff/help.png";
import help_icon_light from "./../../../src/assets/hospital_staff/help_light.png";
import report from "./../../../src/assets/sadmin/report.png";
import report_dark from "./../../../src/assets/sadmin/report_dark.png";
import Dialog from "@mui/material/Dialog";
import Logout from "./Logout";
import { makeStyles } from "@mui/styles";
import { useSeachStore } from "../../store/zustandstore";
import { useSelector } from "react-redux";
import { selectLoadingStatus } from "../../store/error/error.selector";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { Transition } from "./Transition";
const useStyles = makeStyles({
  dialogPaper: {
    minWidth: "600px"
  }
});

type buttonPro = {
  linkName: string;
  name: string;
  iconLight?: string;
  iconDark: string;
  rightIcon?: string;
  exact?: boolean;
  onClick?: () => void;
};
function Buttons({
  linkName,
  name,
  iconLight,
  iconDark,
  rightIcon,
  exact = false
}: buttonPro): JSX.Element {
  const [isActive, setisActive] = React.useState(false);
  const location = useLocation();
  const { setSearchText } = useSeachStore();

  useEffect(() => {
    if (exact) {
      if (location.pathname == linkName) {
        setisActive(true);
      } else setisActive(false);
    } else {
      if (location.pathname.includes(linkName)) {
        setisActive(true);
      } else {
        setisActive(false);
      }
    }
  }, [exact, linkName, location]);
  return (
    <NavLink
      to={linkName}
      className={
        isActive
          ? styles.sidebar_button + " " + styles.active
          : styles.sidebar_button
      }
      onClick={() => setSearchText("")}
    >
      <div className={styles.sidebar_button_icon}>
        {!isActive ? (
          <img src={iconDark} alt="" className="dark" />
        ) : (
          <img src={iconLight} alt="" className="light" />
        )}
      </div>
      {name}
      {rightIcon && (
        <div className={styles.sidebar_button_right_icon} style={{ marginLeft: "auto" }}>
          <img src={rightIcon} alt="" />
        </div>
      )}
    </NavLink>
  );
}

const AdminSidebar = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

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
            <div
              className={styles.logo}
              onClick={() => navigate("/inpatient/admin")}
            >
              <img src={yantramLogo} alt="" className="" />
            </div>
            <Buttons
              linkName={"/inpatient/admin"}
              name={"Dashboard"}
              iconDark={dashboardDark}
              iconLight={dashboard}
              exact={true}
            />
            <Buttons
              linkName={"/inpatient/admin/addDepartment"}
              name={"Add Department"}
              iconDark={add_patient}
              iconLight={addpatient_light}
            />
            <Buttons
              linkName={"/inpatient/admin/addWard"}
              name={"Add Ward"}
              iconDark={add_patient}
              iconLight={addpatient_light}
            />
            {/* <Buttons
              linkName={"/inpatient/admin/alerts"}
              name={"Alerts"}
              iconDark={alertsIcon}
              iconLight={alertsLightIcon}
            /> */}
            <Buttons
              linkName={"/inpatient/admin/addstaff"}
              name={"Add Staff"}
              iconDark={inpatient}
              iconLight={inpatient_light}
            />
            {/* <Buttons
              linkName={"/inpatient/admin/allHub"}
              name={"All Hub"}
              iconDark={hub_icon}
              iconLight={hub_icon_light}
            /> */}
            {/* <Buttons
              linkName={"/inpatient/admin/allDevices"}
              name={"All Devices"}
              iconDark={device_icon}
              iconLight={device_icon_light}
            /> */}
            <div className={styles.line}></div>
            <div style={{ marginTop: "1rem" }}></div>
            <Buttons
              linkName={"/inpatient/admin/profile"}
              name={"Profile"}
              iconDark={profile_icon}
              iconLight={profile_icon_light}
            />
            <div className={styles.dropdownContainer}>
  <div className={styles.dropdownButton} onClick={toggleDropdown}>
    <Buttons
    linkName="#"
    name="Settings"
    iconDark={hub_icon}
    iconLight={hub_icon_light}
    onClick={toggleDropdown}
  />
  </div>

  {dropdownOpen && (
    <div className={styles.dropdownMenu}>
      <Buttons
        linkName="/inpatient/admin/template-management"
        name="Template Management"
        iconDark={report_dark}
        iconLight={report}
      />
      {/* <Buttons
        linkName="/inpatient/admin/tax-invoice-management"
        name="Tax Invoice Management"
        iconDark={note_icon_dark}
        iconLight={note_icon}
      />
      <Buttons
        linkName="/inpatient/admin/report-management"
        name="Report Management"
        iconDark={report_dark}
        iconLight={report}
      /> */}
    </div>
  )}
</div>
            <Buttons
              linkName={"/inpatient/admin/help"}
              name={"Help"}
              iconDark={help_icon}
              iconLight={help_icon_light}
            />

            <div className={styles.love}>
              {/* <img src={love} alt="" className="" /> */}
            </div>
          </div>
        </div>

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
};

export default AdminSidebar;
