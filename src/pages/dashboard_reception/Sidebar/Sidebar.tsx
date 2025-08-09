import styles from "./Sidebar.module.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WarningIcon from "@mui/icons-material/Warning";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ListIcon from "@mui/icons-material/List";
import ReceiptIcon from "@mui/icons-material/Receipt";
import EventIcon from "@mui/icons-material/Event";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HelpIcon from "@mui/icons-material/Help";

import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Logout from "./Logout";
import React from "react";
import { NavLink } from "react-router-dom"; // Import NavLink instead of Link

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Sidebar() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__list}>
        <li>
          <NavLink
            to="/hospital-dashboard/reception"
            end
            className={({ isActive }) => (isActive ? styles.active : "")} // Updated line
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hospital-dashboard/reception/alerts"
            className={({ isActive }) => (isActive ? styles.active : "")} // Updated line
          >
            <WarningIcon />
            <span>Alerts</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hospital-dashboard/reception/registration"
            className={({ isActive }) => (isActive ? styles.active : "")} // Updated line
          >
            <ReceiptIcon />
            <span>Enrollment Desk</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hospital-dashboard/reception/addPatient"
            className={({ isActive }) => (isActive ? styles.active : "")} // Updated line
          >
            <PersonAddIcon />
            <span>Add Patient</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hospital-dashboard/reception/tax-invoice"
            className={({ isActive }) => (isActive ? styles.active : "")} // Updated line
          >
            <ReceiptIcon />
            <span>Tax Invoice</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/reception/list"
            className={({ isActive }) => (isActive ? styles.active : "")} // Updated line
          >
            <ListIcon />
            <span>Patient list</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hospital-dashboard/reception/appointment"
            className={({ isActive }) => (isActive ? styles.active : "")} // Updated line
          >
            <EventIcon />
            <span>Appointment</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hospital-dashboard/reception/wardManagement"
            className={({ isActive }) => (isActive ? styles.active : "")} // Updated line
          >
            <AccountBalanceIcon />
            <span>Ward Management</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hospital-dashboard/reception/doctorManagement"
            className={({ isActive }) => (isActive ? styles.active : "")} // Updated line
          >
            <LocalHospitalIcon />
            <span>Doctor Management</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hospital-dashboard/reception/insurance"
            className={({ isActive }) => (isActive ? styles.active : "")} // Updated line
          >
            <HealthAndSafetyIcon />
            <span>Insurance</span>
          </NavLink>
        </li>
      </div>
      <div className={styles.sidebar__line}></div>
      <div className={styles.sidebar__footer}>
        <li>
          <NavLink
            to="/hospital-dashboard/reception/profile"
            className={({ isActive }) => (isActive ? styles.active : "")} // Updated line
          >
            <AccountCircleIcon />
            <span>Profile</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hospital-dashboard/reception/help"
            className={({ isActive }) => (isActive ? styles.active : "")} // Updated line
          >
            <HelpIcon />
            <span>Help</span>
          </NavLink>
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
