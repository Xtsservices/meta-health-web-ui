import React, { useState } from "react";
import {
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Dialog
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../../store/user/user.selector";
import Logout from "../Logout";

type PopperMenuProps = {
  anchorRef: React.RefObject<HTMLDivElement>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  url: string;
};
const useStyles = makeStyles({
  dialogPaper: {
    minWidth: "600px"
  }
});

const PopperMenu: React.FC<PopperMenuProps> = ({
  anchorRef,
  setOpen,
  open,
  url
}: PopperMenuProps) => {
  const user = useSelector(selectCurrentUser);
  const [openLogoutOpen, setLogoutOpen] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

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

  return (
    <>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        style={{ zIndex: 9999 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom"
            }}
          >
            <Paper
              style={{
                width: "400px",
                padding: "20px",
                position: "relative",
                backgroundColor: "#e0f7fa",
                borderRadius: "20px",
                zIndex: 0
              }}
            >
              {/* Close button */}
              <button
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "5px"
                }}
                onClick={handleClose}
              >
                X
              </button>

              {/* User Image */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100px",
                  marginBottom: "16px"
                }}
              >
                {user.photo ? (
                  <img
                    src={user.imageURL}
                    alt="User"
                    style={{
                      borderRadius: "50%",
                      width: "80px",
                      height: "80px",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      borderRadius: "50%",
                      width: "80px",
                      height: "80px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#4682B4",
                      color: "#fff",
                      fontSize: "40px",
                      fontWeight: "bold",
                      textAlign: "center"
                    }}
                  >
                    {user.firstName
                      ? user.firstName.charAt(0).toUpperCase()
                      : ""}
                  </div>
                )}
              </div>

              {/* Greeting Message */}
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <div>Hi, {user.firstName}!</div>
              </div>

              {/* Email */}
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <div>{user.email}</div>
              </div>

              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center"
                  }}
                >
                  <MenuItem
                    onClick={(event: React.MouseEvent<HTMLLIElement>) => {
                      navigate(url);
                      handleClose(event);
                    }}
                    style={{
                      textAlign: "center",
                      fontWeight: "800",
                      transition: "background-color 0.3s",
                      padding: "10px",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "gray")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "initial")
                    }
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={(event: React.MouseEvent<HTMLLIElement>) => {
                      localStorage.removeItem("user");
                      navigate("/login");
                      handleClose(event);
                      setLogoutOpen(true);
                      handleClose(event);
                    }}
                    style={{
                      textAlign: "center",
                      fontWeight: "800",
                      transition: "background-color 0.3s",
                      padding: "10px",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "gray")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "initial")
                    }
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>

              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "100",
                    margin: "10px 0"
                  }}
                >
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "underline",
                      color: "#007bff",
                      marginRight: "10px"
                    }}
                  >
                    Privacy Policy
                  </a>
                  |
                  <a
                    href="/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "underline",
                      color: "#007bff",
                      marginLeft: "10px"
                    }}
                  >
                    Terms of Service
                  </a>
                </p>
              </div>
            </Paper>
          </Grow>
        )}
      </Popper>

      <Dialog
        open={openLogoutOpen}
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        classes={{ paper: classes.dialogPaper }}
      >
        <Logout setOpen={setLogoutOpen} open={openLogoutOpen} />
      </Dialog>
    </>
  );
};

export default PopperMenu;
