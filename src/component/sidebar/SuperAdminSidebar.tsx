import React from "react";
import styles from "./sidebar.module.scss";
import super_admin_styles from "./super_admin_styles.module.scss";
import { Outlet, useNavigate } from "react-router-dom";
import yantramLogo from "./../../../src/assets/circlemeta.jpg";
import addpatient_light from "./../../../src/assets/sidebar/addpatient_light.png";
import add_patient from "./../../../src/assets/sidebar/add_patient.png";
import dashboard_icon from "./../../../src/assets/sidebar/dashboard_icon.png";
import dashboard_dark_icon from "./../../../src/assets/sidebar/dashboard_dark_icon.png";
import love from "./../../../src/assets/love.png";
import Dialog from "@mui/material/Dialog";
import Logout from "./Logout";
import { makeStyles } from "@mui/styles";
import { Transition } from "./Transition";
import { Button } from "./Button";

const useStyles = makeStyles({
  dialogPaper: {
    minWidth: "600px"
  }
});

const SuperAdminSidebar = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.sidebar_container}>
          <div className={styles.sidebar_container_box}>
            <div className={styles.logo} onClick={() => navigate("/sadmin")}>
              <img src={yantramLogo} alt="" className="" />
            </div>
            <Button
              linkName={"/sadmin"}
              name={"Dashboard"}
              iconDark={dashboard_dark_icon}
              iconLight={dashboard_icon}
              exact={true}
              bgColor={styles.active}
              setSearch={() => ""}
            />
            <Button
              linkName={"add-hospital"}
              name={"Add Hospital"}
              iconDark={add_patient}
              iconLight={addpatient_light}
              bgColor={styles.active}
              setSearch={() => ""}
            />
            <Button
              linkName={"view-hospital"}
              name={"View Hospitals"}
              iconDark={add_patient}
              iconLight={addpatient_light}
              bgColor={styles.active}
              setSearch={() => ""}
            />
            {/* <Button
              linkName={"add-customerCare"}
              name={"Add Customer Care Executive"}
              iconDark={add_patient}
              iconLight={addpatient_light}
              bgColor={styles.active}
              setSearch={() => ""}
            /> */}
           
            <Button
              linkName={"tickets"}
              name={"Tickets"}
              iconDark={add_patient}
              iconLight={addpatient_light}
              bgColor={styles.active}
              setSearch={() => ""}
            />
            <div className={styles.line}></div>
            <div style={{ marginTop: "1rem" }}></div>

            <div className={styles.love}>
              {/* <img src={love} alt="" className="" /> */}
            </div>
          </div>
        </div>

        <div className={super_admin_styles.main}>
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

export default SuperAdminSidebar;
