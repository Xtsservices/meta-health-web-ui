import React, { useEffect } from "react";
import styles from "./sidebar.module.scss";
import { Outlet } from "react-router-dom";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import yantramLogo from "./../../../src/assets/cross_logo.png";
import dashboard from "./../../../src/assets/sidebar/New/ACTIVE/dashboard.png";
import dashboardDark from "./../../../src/assets/sidebar/New/INACTIVE/dashboard.png";
import love from "./../../../src/assets/love.png";
import search_icon from "./../../../src/assets/sidebar/search_icon.png";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Logout from "./Logout";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { selectLoadingStatus } from "../../store/error/error.selector";
import PopperMenu from "../Popper";
import Searchpatient from "../Searchpatient/Searchpatient";
import help_icon from "./../../../src/assets/sidebar/New/INACTIVE/help_dark.png";
import help_icon_light from "./../../../src/assets/sidebar/New/ACTIVE/help_light.png";

import alertsLight from "./../../../src/assets/sidebar/New/ACTIVE/alert.png";
import addPatientLight from "./../../../src/assets/sidebar/New/ACTIVE/add.png";
import taxInvoiceLight from "./../../../src/assets/sidebar/New/ACTIVE/tax.png";
import patientListLight from "./../../../src/assets/sidebar/New/ACTIVE/Patient.png";
import appointmentLight from "./../../../src/assets/sidebar/New/ACTIVE/appointment.png";
import wardManagementLight from "./../../../src/assets/sidebar/New/ACTIVE/bed.png";
import doctorManagementLight from "./../../../src/assets/sidebar/New/ACTIVE/doctor management.png";
import insurnaceLight from "./../../../src/assets/sidebar/New/ACTIVE/insurance.png";
import alerts from "./../../../src/assets/sidebar/New/INACTIVE/alert.png";
import addPatient from "./../../../src/assets/sidebar/New/INACTIVE/add.png";
import taxInvoice from "./../../../src/assets/sidebar/New/INACTIVE/tax.png";
import patientList from "./../../../src/assets/sidebar/New/INACTIVE/Patient.png";
import appointment from "./../../../src/assets/sidebar/New/INACTIVE/appointment.png";
import wardManagement from "./../../../src/assets/sidebar/New/INACTIVE/bed.png";
import doctorManagement from "./../../../src/assets/sidebar/New/INACTIVE/doctor management.png";
import insurnace from "./../../../src/assets/sidebar/New/INACTIVE/insurance.png";

const useStyles = makeStyles({
  dialogPaper: {
    minWidth: "600px",
  },
});
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
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
}: buttonPro): JSX.Element {
  const [isActive, setisActive] = React.useState(false);
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

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
  }, [exact, linkName, location, setSearch, user]);

  return (
    <NavLink
      to={linkName}
      className={
        isActive
          ? styles.sidebar_button + " " + styles.active
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
    </NavLink>
  );
}

function HospitalReceptionSidebar(): JSX.Element {
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

  // const navigate = useNavigate();
  //   setLink(window.location.pathname);
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
                  color: "#755553",
                  fontWeight: 900,
                  paddingInline: "1rem",
                  paddingBlock: ".25rem",
                  backgroundColor: "#D4C3C2",
                  borderRadius: "100px",
                }}
              >
                Reception
              </span>
            </div>
            <Buttons
              linkName={"/hospital-dashboard/reception/addPatient"}
              name={"Add patient"}
              iconDark={addPatient}
              iconLight={addPatientLight}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/reception"}
              name={"Dashboard"}
              iconDark={dashboardDark}
              iconLight={dashboard}
              exact={true}
              setSearch={setSearch}
            />
           
            {/* <Buttons
              linkName={"/hospital-dashboard/reception/registration"}
              name={"Enrollment Desk"}
              iconDark={registeration}
              iconLight={registerationLight}
              setSearch={setSearch}
            /> */}

            <Buttons
              linkName={"/hospital-dashboard/reception/alerts"}
              name={"Alerts"}
              iconDark={alerts}
              iconLight={alertsLight}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/reception/tax-invoice"}
              name={"Tax Invoice"}
              iconDark={taxInvoice}
              iconLight={taxInvoiceLight}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/reception/list"}
              name={"Patient list"}
              iconDark={patientList}
              iconLight={patientListLight}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/reception/appointment"}
              name={"Appointment"}
              iconDark={appointment}
              iconLight={appointmentLight}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/reception/wardManagement"}
              name={"Ward Management"}
              iconDark={wardManagement}
              iconLight={wardManagementLight}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/reception/doctorManagement"}
              name={"Doctor Management"}
              iconDark={doctorManagement}
              iconLight={doctorManagementLight}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/reception/insurance"}
              name={"Insurance"}
              iconDark={insurnace}
              iconLight={insurnaceLight}
              setSearch={setSearch}
            />
            <div className={styles.line}></div>

            <Buttons
              linkName={"/hospital-dashboard/reception/help"}
              name={"Help"}
              iconDark={help_icon}
              iconLight={help_icon_light}
              setSearch={setSearch}
            />

            {/* <div
              className={styles.sidebar_button}
              onClick={() => setOpen(true)}
            >
              <div className={styles.sidebar_button_icon}>
                <img src={logout} alt="" className="dark" />
              </div>
              Logout
            </div> */}
            <div className={styles.line}></div>
            {/* <Buttons /> */}
            <div className={styles.love}>
              <img src={love} alt="" className="" />
            </div>
          </div>
        </div>

        {/* The Right side of the containet */}

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
              ref={anchorRef}
              onClick={handleToggle}
              style={{ cursor: "pointer" }}
            >
              {/* <div className={styles.header_profile_name}>
                Hi,
                <br />
                {user.firstName}
              </div> */}
              {user.imageURL && <img src={user.imageURL} alt="" className="" />}
              {/* {!user.imageURL && <AccountCircleIcon />} */}
              {!user.imageURL && (
                <div
                  className={styles.header_profile_name}
                  style={{
                    backgroundColor: "#ffffa7", // change to the desired background color
                    borderRadius: "50%", // makes the element circular
                    width: "40px", // specify a width
                    height: "40px", // specify a height
                    display: "flex", // center the text
                    alignItems: "center", // vertically center the text
                    justifyContent: "center", // horizontally center the text
                    color: "black", // change to the desired text color
                    fontSize: "20px", // change to the desired font size
                    fontWeight: "bold", // change to the desired font weight
                  }}
                >
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : ""}
                </div>
              )}
            </div>
            <PopperMenu
              setOpen={setOpenMenu}
              open={openMenu}
              url={"/hospital-dashboard/emergency-yellow/profile"}
              anchorRef={anchorRef}
              color="#ffffa7"
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

export default HospitalReceptionSidebar;
