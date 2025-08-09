import styles from "./home.module.scss";
import yantramLogo from "./../../../src/assets/cross_logo.png";
import love from "./../../../src/assets/love.png";
import { selectCurrentUser } from "../../store/user/user.selector";
import { useSelector } from "react-redux";
import * as React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useNavigate } from "react-router-dom";
import LabWidgets from "./lab-widgets";

function LabHome() {
  const user = useSelector(selectCurrentUser);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const navigate = useNavigate();
  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    )
      return;

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    prevOpen.current = open;
  }, [open]);



  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate("/login");
    // window.location.reload();
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <img src={yantramLogo} alt="" className={styles.yantramlogo} />
          <div
            className={styles.header_profile}
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? "composition-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <div className={styles.header_profile_name}>
              Hi,
              <br />
              {user.firstName}
            </div>
            {user.photo && (
              <img
                src={user.imageURL}
                alt=""
                className=""
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom-start" ? "left top" : "left bottom",
                }}
              >
                <Paper
                  style={{ minWidth: "200px" /* Set the desired width here */ }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      onKeyDown={handleListKeyDown}
                    >
                      <MenuItem
                        onClick={() => {
                          handleLogout();
                        }}
                      >
                        Logout
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
        <div className={styles.container_heading}>
          Streamlined Medical Data Access for Improved Patient Care
        </div>
        <LabWidgets />
        <img src={love} alt="" className={styles.tagline} />
      </div>
    </>
  );
}

export default LabHome;
