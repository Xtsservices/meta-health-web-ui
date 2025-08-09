import React from "react";
import MenuItem from "@mui/material/MenuItem";
// import PopperMenu from "./PopperMenu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import DialogChangePassword from "./DialogChangePassword";
// import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DialogEditProfile from "./DialogEditProfile";

type PopperType = {
  id: number;
};
function PopperMenu({ id }: PopperType) {
  const options = ["Edit Profile", "Change Password"];
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [passwordDialog, setPasswordDialog] = React.useState(false);
  const [editProfileDialog, setEditProfileDialog] = React.useState(false);
  return (
    <>
      {/* {({ TransitionProps, placement }) => ( */}
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // PaperProps={{
        //   style: {
        //     maxHeight: ITEM_HEIGHT * 4.5,
        //     width: "20ch",
        //   },
        // }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === "Pyxis"}
            onClick={() => {
              handleClose();
              if (option == options[1]) setPasswordDialog(true);
              if (option == options[0]) setEditProfileDialog(true);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
      <DialogChangePassword
        setPasswordDialog={setPasswordDialog}
        passwordDialog={passwordDialog}
        id={id}
      />
      {editProfileDialog ? (
        <DialogEditProfile
          editProfileDialog={editProfileDialog}
          setEditProfileDialog={setEditProfileDialog}
          id={id}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default PopperMenu;
