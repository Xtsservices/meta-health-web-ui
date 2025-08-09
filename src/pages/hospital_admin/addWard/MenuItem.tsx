import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "@mui/styles";
import { authFetch } from "../../../axios/useAuthFetch";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { capitalizeFirstLetter } from "../../../utility/global";
import { wardType } from "../../../types";
import { authPatch } from "../../../axios/usePatch";
import { setError, setSuccess } from "../../../store/error/error.action";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
type props = {
  id: number;
  setData: React.Dispatch<React.SetStateAction<wardType[]>>;
};
function MenuItems({ id, setData }: props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const handleClose = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        //   id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        PaperProps={{
          style: {
            minWidth: "120px",
            boxShadow: "1px 1px 1px #888888",
          },
        }}
      >
        <MenuItem onClick={handleClose}>Edit</MenuItem>
      </Menu>
      {openDialog ? (
        <DialogEdit
          setOpen={setOpenDialog}
          open={openDialog}
          id={id}
          setData={setData}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default MenuItems;

type dialogProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  id: number;
  setData: React.Dispatch<React.SetStateAction<wardType[]>>;
};
const useStyles = makeStyles({
  dialogPaper: {
    // width: "600px",
    minWidth: "600px",
  },
});
function DialogEdit({ setOpen, open, id, setData }: dialogProps): JSX.Element {
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  //   const [ward, setWard] = React.useState<wardType>();
  const [addBeds, setAddBeds] = React.useState(0);
  const [name, setName] = React.useState("");
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };
  const getWardData = async () => {
    const response = await authFetch(
      `ward/${user.hospitalID}/${id}`,
      user.token
    );
    console.log("responseolk", response);
    if (response.message == "success") {
      //   setWard(response.ward);
      setName(response.ward.name);
      // setAddBeds(response.ward.totalBeds)
      //   setTotalBeds(response.ward.totalBeds);
    }
  };
  const updateWard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await authPatch(
      `ward/${user.hospitalID}/${id}`,
      { name, addBedCount: addBeds },
      user.token
    );
    if (response.message == "success") {
      dispatch(setSuccess("Ward successfully updated"));
      setData((prev) => {
        prev.map((ward) => {
          if (ward.id != id) return ward;
          ward.name = name;
          ward.totalBeds = response?.ward?.totalBeds;
          ward.availableBeds = response?.ward?.availableBeds;
          return ward;
        });
        return [...prev];
      });
      handleClose();
    } else {
      dispatch(setError(response.message));
    }
  };
  const debouncedHandleSubmit = debounce(updateWard, DEBOUNCE_DELAY);

  React.useEffect(() => {
    if (user.token) {
      getWardData();
    }
  }, [user]);
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>{capitalizeFirstLetter(name)}</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            debouncedHandleSubmit(e);
          }}
        >
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Ward Name"
              // type=""
              value={capitalizeFirstLetter(name) || ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setName(event.target.value)
              }
              fullWidth
              variant="standard"
              sx={{ mb: "10px" }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Add Bed"
              type="number"
              value={addBeds || ""}
              inputProps={{
                min: 1,
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setAddBeds(Number(event.target.value))
              }
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
