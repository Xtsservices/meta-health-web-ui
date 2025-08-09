import styles from "./Sidebar.module.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListIcon from "@mui/icons-material/List";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HelpIcon from "@mui/icons-material/Help";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Logout from "../../common/Logout";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Sidebar({ setSearch }: any) {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [open, setOpen] = React.useState(false);
  const [activeState, setActiveState] = useState("dashboard");
  const handleClose = () => {
    setOpen(false);
  };
  const handleNavigate = (item: string, path: string) => {
    setActiveState(item);
    setSearch("");
    navigate(path);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__list}>
        <li>
          <a
            onClick={() =>
              handleNavigate(
                "dashboard",
                `/hospital-dashboard/${user.roleName}`
              )
            }
            className={activeState === "dashboard" ? styles.active : ""}
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </a>
        </li>

        <li>
          <a
            onClick={() =>
              handleNavigate(
                "patient-list",
                `/hospital-dashboard/${user.roleName}/list`
              )
            }
            className={activeState === "patient-list" ? styles.active : ""}
          >
            <ListIcon />
            <span>Patient list</span>
          </a>
        </li>
      </div>
      <div className={styles.sidebar__line}></div>
      <div className={styles.sidebar__footer}>
        <li>
          <a
            onClick={() =>
              handleNavigate(
                "profile",
                `/hospital-dashboard/${user.roleName}/profile`
              )
            }
            className={activeState === "profile" ? styles.active : ""}
          >
            <AccountCircleIcon />
            <span>Profile</span>
          </a>
        </li>
        <li>
          <a
            onClick={() =>
              handleNavigate(
                "help",
                `/hospital-dashboard/${user.roleName}/help`
              )
            }
            className={activeState === "help" ? styles.active : ""}
          >
            <HelpIcon />
            <span>Help</span>
          </a>
        </li>
        <li>
          <a onClick={() => setOpen(true)}>
            <ExitToAppIcon />
            <span>Logout</span>
          </a>
        </li>
      </div>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        style={{ minWidth: "1600px" }}
      >
        <Logout setOpen={setOpen} open={open} />
      </Dialog>
    </div>
  );
}

export default Sidebar;
