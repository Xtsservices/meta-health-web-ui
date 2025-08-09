import React, { useEffect, useRef } from "react";
import styles from "./sidebar.module.scss";
import { Outlet } from "react-router-dom";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import yantramLogo from "./../../../src/assets/circlemeta.jpg";
import dashboard from "./../../../src/assets/sidebar/New/ACTIVE/dashboard.png";
import dashboardDark from "./../../../src/assets/sidebar/New/INACTIVE/dashboard.png";
import addpatient_light from "./../../../src/assets/sidebar/New/ACTIVE/add.png";
import add_patient from "./../../../src/assets/sidebar/New/INACTIVE/add.png";
import discharge from "./../../../src/assets/sidebar/New/INACTIVE/DischargeInactive.png";
import discharge_patient_light from "./../../../src/assets/sidebar/New/ACTIVE/DischargeLight.png";
import inpatient_light from "./../../../src/assets/sidebar/New/ACTIVE/Patient.png";
import inpatient from "./../../../src/assets/sidebar/New/INACTIVE/Patient.png";
import love from "./../../../src/assets/love.png";
import search_icon from "./../../../src/assets/sidebar/search_icon.png";
import Dialog from "@mui/material/Dialog";
import Logout from "./Logout";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authFetch } from "../../axios/useAuthFetch";
import alertDark from "./../../../src/assets/sidebar/New/INACTIVE/alert.png";
import alertLight from "./../../../src/assets/sidebar/New/ACTIVE/alert.png";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { selectLoadingStatus } from "../../store/error/error.selector";
import { useAlertStore } from "../../store/zustandstore";
import PopperMenu from "../Popper";
import Searchpatient from "../Searchpatient/Searchpatient";
import help_icon from "./../../../src/assets/sidebar/New/INACTIVE/help_dark.png";
import help_icon_light from "./../../../src/assets/sidebar/New/ACTIVE/help_light.png";
import { Transition } from "./Transition";

import managmentDark from "./../../assets/nurse/Group-1.png";
import managmentLight from "./../../assets/nurse/Group.png";
const alarmSound = new Audio("../../../src/assets/notification.wav");

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
  exact?: boolean;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isAlert?: boolean;
};
function Buttons({
  linkName,
  name,
  iconLight,
  iconDark,
  exact = false,
  setSearch,
  isAlert = false
}: buttonPro): JSX.Element {
  const [isActive, setisActive] = React.useState(false);
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const { setAlertNumber, alertNumber } = useAlertStore();
  const getAlertCountApi = useRef(true);

  const getAlertCount = async () => {
    const response = await authFetch(
      `alerts/hospital/${user.hospitalID}/unseenCount`,
      user.token
    );

    if (response.message === "success") {
      setAlertNumber(response.count);
      // Get previous count from localStorage
      const previousCountString = localStorage.getItem("alertcount");
      // Parse previous count only if it's not null
      const previousCount =
        previousCountString !== null ? parseInt(previousCountString) : 0;
      // Check if the new count is greater than the previous count
      if (response.count > previousCount) {
        // Update localStorage with the new count
        localStorage.setItem("alertcount", response.count.toString());
        alarmSound.play();
      }
    }
  };

  useEffect(() => {
    if (user.token && user.hospitalID && getAlertCountApi.current) {
      getAlertCountApi.current = false;
      getAlertCount();
    }
  }, [user.token, user.hospitalID]);

  useEffect(() => {
    setSearch("");
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
  }, [location, user]);

  return (
    <NavLink
      to={linkName}
      className={
        isActive
          ? styles.sidebar_button + " " + styles.ipd_active
          : styles.sidebar_button
      }
    >
      <div className={styles.sidebar_button_icon}>
        {!isActive ? (
          <img src={iconDark} alt="" className="dark" />
        ) : (
          <img src={iconLight} alt="" className="light" />
        )}
      </div>
      {name}
      {isAlert && alertNumber ? (
        <span className={styles.notification}>{alertNumber}</span>
      ) : (
        ""
      )}
    </NavLink>
  );
}

function Staff_sidebar(): JSX.Element {
  const user = useSelector(selectCurrentUser);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const isLoading = useSelector(selectLoadingStatus);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };

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
              onClick={() => navigate("/hospital-dashboard")}
            >
              <img src={yantramLogo} alt="" className="" />
            </div>
            <div className={styles.zone_box}>
              <span
                style={{
                  textTransform: "uppercase",
                  color: "black ",
                  fontWeight: 900,
                  paddingInline: "1rem",
                  paddingBlock: ".25rem",
                  backgroundColor: "#c0e4ff",
                  borderRadius: "100px"
                }}
              >
                Inpatient
              </span>
            </div>
            <Buttons
              linkName={"/hospital-dashboard/inpatient"}
              name={"Dashboard"}
              iconDark={dashboardDark}
              iconLight={dashboard}
              exact={true}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/inpatient/list"}
              name={"Patients List"}
              iconDark={inpatient}
              iconLight={inpatient_light}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/inpatient/alerts"}
              name={"Alert"}
              iconDark={alertDark}
              iconLight={alertLight}
              setSearch={setSearch}
              isAlert={true}
            />
            <Buttons
              linkName={"/hospital-dashboard/inpatient/addpatient"}
              name={"Add Patient"}
              iconDark={add_patient}
              iconLight={addpatient_light}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/inpatient/dischargepatient"}
              name={"Discharged Patients"}
              iconDark={discharge}
              iconLight={discharge_patient_light}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/inpatient/Managment"}
              name={"Managment"}
              iconDark={managmentDark}
              iconLight={managmentLight}
              setSearch={setSearch}
            />

            <div className={styles.line}></div>

            <Buttons
              linkName={"/hospital-dashboard/inpatient/help"}
              name={"Help"}
              iconDark={help_icon}
              iconLight={help_icon_light}
              setSearch={setSearch}
            />

            <div className={styles.line}></div>

            <div className={styles.love}>
              {/* <img src={love} alt="" className="" /> */}
            </div>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.topbar}>
            <div className={styles.topbar_search}>
              <img src={search_icon} alt="" className="" />
              <form autoComplete="off">
              <input
                type="text"
                className="input_search"
                placeholder="Search Patient by Mobile Number"
                value={search}
                maxLength={15}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSearch(event.target.value);
                }}
                />
                </form>
            </div>
            <div
              className={styles.header_profile}
              // onClick={() => navigate("/hospital-dashboard/inpatient/profile")}
              ref={anchorRef}
              onClick={handleToggle}
              style={{ cursor: "pointer" }}
            >
              {user.imageURL && <img src={user.imageURL} alt="" className="" />}

              {!user.imageURL && (
                <div
                  className={styles.header_profile_name}
                  style={{
                    backgroundColor: "#c0e4ff", // change to the desired background color
                    borderRadius: "50%", // makes the element circular
                    width: "40px", // specify a width
                    height: "40px", // specify a height
                    display: "flex", // center the text
                    alignItems: "center", // vertically center the text
                    justifyContent: "center", // horizontally center the text
                    color: "black", // change to the desired text color
                    fontSize: "20px", // change to the desired font size
                    fontWeight: "bold" // change to the desired font weight
                  }}
                >
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : ""}
                </div>
              )}
            </div>
            <PopperMenu
              setOpen={setOpenMenu}
              open={openMenu}
              url={"/hospital-dashboard/inpatient/profile"}
              anchorRef={anchorRef}
              color="#c0e4ff"
            />
          </div>
          {
            <div className={styles.main_info_right}>
              {!search ? (
                <Outlet />
              ) : (
                <div className={styles.search_container}>
                  <div className={styles.search_container_card}>
                    <Searchpatient search={search} />
                  </div>
                </div>
              )}
            </div>
          }
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

export default Staff_sidebar;
