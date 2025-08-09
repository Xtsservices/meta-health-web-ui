import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { wardType } from "../../../types";
import { authFetch } from "../../../axios/useAuthFetch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";

type propType = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  condition: string | null | undefined;
  handleCriticalCondition: (wardSelected: string) => void;
};

const useStyles = makeStyles({
  dialogPaper: {
    width: "800px",
    minWidth: "800px",
    backgroundColor: "white",
    cursor: "pointer",
  },
  draggableHandle: {
    cursor: "move",
    padding: "16px",
    backgroundColor: "#1977f3",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  draggableDialog: {
    cursor: "move",
  },
});

const TriageDialogBox = ({
  setOpen,
  open,
  condition,
  handleCriticalCondition,
}: propType) => {
  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const [wardSelected, setWardSelected] = React.useState<string>("");
  const [wards, setWards] = React.useState<wardType[]>([]);
  const getWardDataApi = React.useRef(true)

  React.useEffect(() => {
    const getWardData = async () => {
      const wardResonse = await authFetch(
        `ward/${user.hospitalID}`,
        user.token
      );
      if (wardResonse.message == "success") {
        setWards(wardResonse.wards);
      }
    };
    if(getWardDataApi.current){
      getWardDataApi.current = false
      getWardData();
    }
  }, [user.hospitalID, user.token]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCriticalCondition(wardSelected);
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>Transferring Patient to RED Zone</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              value={condition?.toUpperCase()}
              fullWidth
              sx={{ mt: "20px" }}
            />
            <FormControl
              variant="outlined"
              fullWidth
              required
              sx={{ mt: "20px" }}
            >
              <InputLabel>Select Ward</InputLabel>
              <Select
                label="ward"
                required
                onChange={(event: SelectChangeEvent) => {
                  setWardSelected(event.target.value);
                }}
                value={wardSelected}
                name="wards"
              >
                {wards.map((el, index) => {
                  return (
                    <MenuItem key={index} value={el.id.toString()}>
                      {el.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TriageDialogBox;
