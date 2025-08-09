import {useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { Dialog, Box, LinearProgress } from "@mui/material";
import styles from "./sidebar.module.scss";
import yantramLogo from "./../../../src/assets/cross_logo.png";
import dashboard from "./../../../src/assets/sidebar/New/ACTIVE/dashboard.png";
import dashboardDark from "./../../../src/assets/sidebar/New/INACTIVE/dashboard.png";
import love from "./../../../src/assets/love.png";
import search_icon from "./../../../src/assets/sidebar/search_icon.png";
import Logout from "./Logout";
import { selectCurrentUser } from "../../store/user/user.selector";
import { selectLoadingStatus } from "../../store/error/error.selector";
import discharge from "./../../../src/assets/sidebar/New/INACTIVE/DischargeInactive.png";
import discharge_patient_light from "./../../../src/assets/sidebar/New/ACTIVE/DischargeLight.png";
import Searchpatient from "../Searchpatient/Searchpatient";
import help_icon from "./../../../src/assets/sidebar/New/INACTIVE/help_dark.png";
import help_icon_light from "./../../../src/assets/sidebar/New/ACTIVE/help_light.png";
import inpatient_light from "./../../../src/assets/sidebar/New/ACTIVE/patientActive.png";
import inpatient from "./../../../src/assets/sidebar/New/INACTIVE/patientinactive.png";
import PopperMenu from "../Popper";
import { Button } from "./Button";
import { Transition } from "./Transition";

import managmentDark from "./../../assets/nurse/Group-1.png";
import managmentLight from "./../../assets/nurse/Group.png";

const useStyles = makeStyles({
  dialogPaper: {
    minWidth: "600px"
  }
});

const EmergencyYellowSidebar = () => {
  const user = useSelector(selectCurrentUser);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
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
                  color: "#997b00 ",
                  fontWeight: 900,
                  paddingInline: "1rem",
                  paddingBlock: ".25rem",
                  backgroundColor: "#fff3c4",
                  borderRadius: "100px"
                }}
              >
                yellow
              </span>
            </div>
            <Button
              linkName={"/hospital-dashboard/emergency-yellow"}
              name={"Dashboard"}
              iconDark={dashboardDark}
              iconLight={dashboard}
              exact={true}
              setSearch={setSearch}
              bgColor={styles.yellow_active}
            />
            <Button
              linkName={"/hospital-dashboard/emergency-yellow/list"}
              name={"Active Patients"}
              iconDark={inpatient}
              iconLight={inpatient_light}
              setSearch={setSearch}
              bgColor={styles.yellow_active}
            />
            <Button
              linkName={"/hospital-dashboard/emergency-yellow/dischargepatient"}
              name={"Discharged Patients"}
              iconDark={discharge}
              iconLight={discharge_patient_light}
              setSearch={setSearch}
              bgColor={styles.yellow_active}
            />
            <Button
              linkName={"/hospital-dashboard/emergency-yellow/Managment"}
              name={"Managment"}
              iconDark={managmentDark}
              iconLight={managmentLight}
              setSearch={setSearch}
              bgColor={styles.yellow_active}
            />

            <div className={styles.line}></div>
            <Button
              linkName={"/hospital-dashboard/emergency-yellow/help"}
              name={"Help"}
              iconDark={help_icon}
              iconLight={help_icon_light}
              setSearch={setSearch}
              bgColor={styles.yellow_active}
            />

            <div className={styles.line}></div>

            <div className={styles.love}>
              <img src={love} alt="" className="" />
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
              ref={anchorRef}
              onClick={handleToggle}
              style={{ cursor: "pointer" }}
            >
              {user.imageURL && <img src={user.imageURL} alt="" className="" />}

              {!user.imageURL && (
                <div
                  className={styles.header_profile_name}
                  style={{
                    backgroundColor: "#ffffa7",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                    fontSize: "20px",
                    fontWeight: "bold"
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
};

export default EmergencyYellowSidebar;
