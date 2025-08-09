import React, { useEffect } from "react";
import styles from "./sidebar.module.scss";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import yantramLogo from "./../../../src/assets/circlemeta.jpg";
import dashboard from "./../../../src/assets/sidebar/New/ACTIVE/dashboard.png";
import dashboardDark from "./../../../src/assets/sidebar/New/INACTIVE/dashboard.png";
import love from "./../../../src/assets/love.png";
import search_icon from "./../../../src/assets/sidebar/search_icon.png";
import Dialog from "@mui/material/Dialog";
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
import person_dark from "../../../src/assets/sidebar/New/INACTIVE/medical-icon_surgery.png";
import surgery1 from "../../../src/assets/sidebar/New/ACTIVE/medical-icon_surgery-1.png";
import surgery2 from "../../../src/assets/sidebar/New/ACTIVE/healthicons_general-surgery-1.png";
import surgery2_dark from "../../../src/assets/sidebar/New/INACTIVE/healthicons_general-surgery.png";
// import {
//   DropDownList,
//   DropDownListItem,
//   DropDownMenu,
// } from './components/dropdown-menu';
import { Buttons } from "./Buttons";
import { Transition } from "./Transition";
import useOTConfig, { OTUserTypes } from "../../store/formStore/ot/useOTConfig";
import { SCOPE_LIST } from "../../utility/role";

import managmentDark from "./../../assets/nurse/Group-1.png";
import managmentLight from "./../../assets/nurse/Group.png";

const useStyles = makeStyles({
  dialogPaper: {
    minWidth: "600px"
  }
});

function OT_sidebar(): JSX.Element {
  const { setUserType, userType } = useOTConfig();
  const user = useSelector(selectCurrentUser);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // const scopes = user.scope;
  // const userScopes = scopes && scopes.split('#').map((n: string) => Number(n));
  // TODO: Confirm the user type for OT here
  useEffect(() => {
    const userScopes = user?.scope?.split("#");
    if (userScopes) {
      const scopes = userScopes.map((n: string) => Number(n));
      if (scopes.includes(SCOPE_LIST.anesthetist)) {
        setUserType(OTUserTypes.ANESTHETIST);
      } else if (scopes.includes(SCOPE_LIST.surgeon)) {
        setUserType(OTUserTypes.SURGEON);
      }
    }
  }, [setUserType, user?.scope]);

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
                  backgroundColor: "#c0b8e9",
                  borderRadius: "100px"
                }}
              >
                {userType}
              </span>
            </div>
            <Buttons
              linkName={"/hospital-dashboard/ot"}
              name={"Dashboard"}
              iconDark={dashboardDark}
              iconLight={dashboard}
              exact={true}
              setSearch={setSearch}
              bgColor={styles.ot_active}
            />
            <Buttons
              linkName={"/hospital-dashboard/ot/emergency"}
              name={"Emergency"}
              iconDark={surgery2_dark}
              iconLight={surgery2}
              setSearch={setSearch}
              bgColor={styles.ot_active}
            />
            <Buttons
              linkName={"/hospital-dashboard/ot/elective"}
              name={"Elective"}
              iconDark={person_dark}
              iconLight={surgery1}
              setSearch={setSearch}
              bgColor={styles.ot_active}
            />
            <Buttons
              linkName={"/hospital-dashboard/ot/Managment"}
              name={"Managment"}
              iconDark={managmentDark}
              iconLight={managmentLight}
              setSearch={setSearch}
              bgColor={styles.ot_active}
            />
            <div className={styles.line}></div>

            <Buttons
              linkName={"/hospital-dashboard/ot/help"}
              name={"Help"}
              iconDark={help_icon}
              iconLight={help_icon_light}
              setSearch={setSearch}
              bgColor={styles.ot_active}
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
                    backgroundColor: "#c0b8e9",
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
              url={"/hospital-dashboard/ot/profile"}
              anchorRef={anchorRef}
              color="#c0b8e9"
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

export default OT_sidebar;
