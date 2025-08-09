import styles from "./PharmacySidebar.module.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WarningIcon from "@mui/icons-material/Warning";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HelpIcon from "@mui/icons-material/Help";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import Logout from "./../../common/Logout";
import React, { useState } from "react";
import { useNavigate } from "react-router";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PharmacySidebar({ setSearch }: any) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [activeState, setActiveState] = useState("dashboard"); //change will be made here
  const [, setAnchorEl] = useState(null);
  const [dropdown, setDropdown] = useState(false);

  // const handleClick = (event: any) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // const handleClose = () => {
  //   setOpen(false);
  // };
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
              handleNavigate("dashboard", "/hospital-dashboard/pharmacy")
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
              handleNavigate("sale", "/hospital-dashboard/pharmacy/sale")
            }
            className={activeState === "sale" ? styles.active : ""}
          >
            <MedicalServicesIcon />

            <span>Sale</span>
          </a>
        </li>

        <li>
          <a
            onClick={() =>
              handleNavigate("alerts", "/hospital-dashboard/pharmacy/alerts")
            }
            className={activeState === "alerts" ? styles.active : ""}
          >
            <WarningIcon />
            <span>Alerts</span>
          </a>
        </li>

        <li className={styles.dropdownLi}>
          <a onClick={() => setDropdown(!dropdown)}>
            <MedicalServicesIcon />
            <span>Order Management</span>
            <KeyboardArrowDownIcon
              className={dropdown === true ? styles.dropdownArrow : ""}
            />
          </a>
          {dropdown && (
            <ul className={styles.submenu}>
              <li>
                <a
                  onClick={() =>
                    handleNavigate(
                      "ipd",
                      "/hospital-dashboard/pharmacy/orderManagement/ipd"
                    )
                  }
                  className={activeState === "ipd" ? styles.active : ""}
                >
                  <LocalPharmacyIcon />
                  <span>IPD</span>
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavigate(
                      "opd",
                      "/hospital-dashboard/pharmacy/orderManagement/opd"
                    )
                  }
                  className={activeState === "opd" ? styles.active : ""}
                >
                  <LocalPharmacyIcon />
                  <span>OPD</span>
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavigate(
                      "emergency",
                      "/hospital-dashboard/pharmacy/orderManagement/emergency"
                    )
                  }
                  className={activeState === "emergency" ? styles.active : ""}
                >
                  <LocalPharmacyIcon />
                  <span>Emergency</span>
                </a>
              </li>
              <li>
                <a
                  onClick={() =>
                    handleNavigate(
                      "rejected",
                      "/hospital-dashboard/pharmacy/orderManagement/rejected"
                    )
                  }
                  className={activeState === "rejected" ? styles.active : ""}
                >
                  <LocalPharmacyIcon />
                  <span>Rejected</span>
                </a>
              </li>
            </ul>
          )}
        </li>

        <li>
          <a
            onClick={() =>
              handleNavigate("inStock", "/hospital-dashboard/pharmacy/inStock")
            }
            className={activeState === "inStock" ? styles.active : ""}
          >
            <InventoryIcon />
            <span>In Stock</span>
          </a>
        </li>

        <li>
          <a
            onClick={() =>
              handleNavigate(
                "addInventory",
                "/hospital-dashboard/pharmacy/addInventory"
              )
            }
            className={activeState === "addInventory" ? styles.active : ""}
          >
            <AddModeratorIcon />

            <span>Add Inventory</span>
          </a>
        </li>

        <li>
          <a
            onClick={() =>
              handleNavigate(
                "expenses",
                "/hospital-dashboard/pharmacy/expenses"
              )
            }
            className={activeState === "expenses" ? styles.active : ""}
          >
            <PaymentsIcon />
            <span>Expenses</span>
          </a>
        </li>
        {/* className={dropdown ? styles.activeDropdown : ''} */}
      </div>
      <div className={styles.sidebar__line}></div>
      <div className={styles.sidebar__footer}>
        <li>
          <a
            onClick={() =>
              handleNavigate("profile", "/hospital-dashboard/pharmacy/profile")
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
              handleNavigate("help", "/hospital-dashboard/pharmacy/help")
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

export default PharmacySidebar;
