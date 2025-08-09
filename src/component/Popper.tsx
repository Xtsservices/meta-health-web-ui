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
import { selectCurrentUser } from "../store/user/user.selector";
import Logout from "./sidebar/Logout";
import { Role_list } from "../utility/role";

type PopperMenuProps = {
  anchorRef: React.RefObject<HTMLDivElement>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  url: string;
  color: string;
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
  url,
  color
}: PopperMenuProps) => {
  const user = useSelector(selectCurrentUser);
  const [openLogoutOpen, setLogoutOpen] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

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
                height: "350px",
                padding: "20px",
                position: "relative",
                background: `linear-gradient(to bottom, ${color} 40%, #f3f0f0 40%)`,
                borderRadius: "20px",
                zIndex: 0
              }}
            >
              <Paper
                style={{
                  height: "250px",
                  marginTop: "4rem",
                  backgroundColor: "#ffffff",
                  borderRadius: "20px",
                  zIndex: 0
                }}
              >
                <button
                  style={{
                    position: "absolute",
                    top: "2px",
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

                <div
                  style={{
                    top: "2rem",
                    right: "6px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100px",
                    position: "absolute",
                    marginBottom: "16px"
                  }}
                >
                  {user.photo ? (
                    <img
                      src={user.imageURL}
                      alt="User"
                      style={{
                        borderRadius: "50%",
                        width: "120px",
                        height: "120px",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        borderRadius: "50%",
                        width: "100px",
                        height: "100px",
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

                <div
                  style={{
                    paddingTop: "70px",
                    textAlign: "center",
                    marginBottom: "5px"
                  }}
                >
                  <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                    {user.firstName || user.lastName
                      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                      : "Admin"}
                  </div>
                  <div style={{ marginTop: "6px", fontWeight: "600" }}>
                    {user.role !== null &&
                    Role_list[user.role as keyof typeof Role_list]
                      ? Role_list[user.role as keyof typeof Role_list]
                          .slice(0, 1)
                          .toUpperCase() +
                        Role_list[user.role as keyof typeof Role_list]
                          .slice(1)
                          .toLowerCase()
                      : ""}
                  </div>
                </div>

                <div style={{ textAlign: "center", marginBottom: "5px" }}>
                  <div>Email ID : {user.email}</div>
                </div>

                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <div>Yantram User ID : {user.id}</div>
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
                        backgroundColor: "transparent",
                        border: "1px solid #007bff",
                        borderRadius: "4px",
                        padding: "8px 16px",
                        color: "#007bff",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = color)
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
                        backgroundColor: "transparent",
                        border: "1px solid #007bff",
                        borderRadius: "4px",
                        padding: "8px 16px",
                        color: "#007bff",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = color)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "initial")
                      }
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Paper>
          </Grow>
        )}
      </Popper>

      <Dialog
        open={openLogoutOpen}
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
