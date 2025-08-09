import React, { useEffect } from "react";
import styles from "./sidebar.module.scss";
import { Outlet } from "react-router-dom";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import yantramLogo from "./../../../src/assets/cross_logo.png";
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
import { useAlertStore } from "../../store/zustandstore";
import PopperMenu from "../Popper";
import Searchpatient from "../Searchpatient/Searchpatient";
import help_icon from "./../../../src/assets/sidebar/New/INACTIVE/help_dark.png";
import help_icon_light from "./../../../src/assets/sidebar/New/ACTIVE/help_light.png";
import saleIcon from "./../../../src/assets/sidebar/New/INACTIVE/sale.png";
import saleLightIcon from "./../../../src/assets/sidebar/New/ACTIVE/sale-1.png";
import inStockIcon from "./../../../src/assets/sidebar/New/INACTIVE/IN stock.png";
import inStockLightIcon from "./../../../src/assets/sidebar/New/ACTIVE/IN stock-1.png";
import alertsIcon from "./../../../src/assets/sidebar/New/INACTIVE/alert.png";
import alertsLightIcon from "./../../../src/assets/sidebar/New/ACTIVE/alert.png";
import dashboardIcon from "./../../../src/assets/sidebar/New/INACTIVE/dashboard.png";
import dashboardLightIcon from "./../../../src/assets/sidebar/New/ACTIVE/dashboard.png";
import expensesIcon from "./../../../src/assets/sidebar/New/INACTIVE/Order placed.png";
import expensesLightIcon from "./../../../src/assets/sidebar/New/ACTIVE/Order placed-1.png";
import addInventoryIcon from "./../../../src/assets/sidebar/New/INACTIVE/Order.png";
import addInventoryLightIcon from "./../../../src/assets/sidebar/New/ACTIVE/Order-1.png";
import taxIcon from "./../../../src/assets/sidebar/New/INACTIVE/tax.png";
import taxLightIcon from "./../../../src/assets/sidebar/New/ACTIVE/tax.png";
import patientOrder from "./../../../src/assets/sidebar/New/INACTIVE/Patient order.png";
import patientOrderLight from "./../../../src/assets/sidebar/New/ACTIVE/Patient order-1.png"

const useStyles = makeStyles({
  dialogPaper: {
    minWidth: "600px"
  }
});
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
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
  isAlert = false
}: buttonPro): JSX.Element {
  const [isActive, setisActive] = React.useState(false);
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const { alertNumber } = useAlertStore();

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
      {isAlert && alertNumber ? (
        <span className={styles.notification}>{alertNumber}</span>
      ) : (
        ""
      )}
    </NavLink>
  );
}

function PharmacySidebar(): JSX.Element {
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
                  color: "#217355",
                  fontWeight: 900,
                  paddingInline: "1rem",
                  paddingBlock: ".25rem",
                  backgroundColor: "#c6e9dc",
                  borderRadius: "100px"
                }}
              >
                Pharmacy
              </span>
            </div>
            <Buttons
              linkName={"/hospital-dashboard/pharmacy"}
              name={"Dashboard"}
              iconDark={dashboardIcon}
              iconLight={dashboardLightIcon}
              exact={true}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/pharmacy/sale"}
              name={"Sale"}
              iconDark={saleIcon}
              iconLight={saleLightIcon}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/pharmacy/alerts"}
              name={"Alerts"}
              iconDark={alertsIcon}
              iconLight={alertsLightIcon}
              setSearch={setSearch}
              isAlert={true}
            />
            <Buttons
              linkName={"/hospital-dashboard/pharmacy/orderManagement"}
              name={"Patient Orders"}
              iconDark={patientOrder}
              iconLight={patientOrderLight}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/pharmacy/taxInvoice"}
              name={"Tax Invoice"}
              iconDark={taxIcon}
              iconLight={taxLightIcon}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/pharmacy/inStock"}
              name={"In Stock"}
              iconDark={inStockIcon}
              iconLight={inStockLightIcon}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/pharmacy/addInventory"}
              name={"Add Inventory"}
              iconDark={addInventoryIcon}
              iconLight={addInventoryLightIcon}
              setSearch={setSearch}
            />
            <Buttons
              linkName={"/hospital-dashboard/pharmacy/expenses"}
              name={"Order Placement"}
              iconDark={expensesIcon}
              iconLight={expensesLightIcon}
              setSearch={setSearch}
            />
            <div className={styles.line}></div>

            <Buttons
              linkName={"/hospital-dashboard/pharmacy/help"}
              name={"Help"}
              iconDark={help_icon}
              iconLight={help_icon_light}
              setSearch={setSearch}
            />

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
              // onClick={() => navigate("/hospital-dashboard/inpatient/profile")}
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
                    backgroundColor: "#c6e9dc", // change to the desired background color
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
              url={"/hospital-dashboard/pharmacy/profile"}
              anchorRef={anchorRef}
              color="#c6e9dc"
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

export default PharmacySidebar;
