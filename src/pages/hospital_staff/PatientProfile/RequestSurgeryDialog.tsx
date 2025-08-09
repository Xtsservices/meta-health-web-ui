import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { setError, setSuccess } from "../../../store/error/error.action";
import { makeStyles } from "@mui/styles";
import { authFetch } from "../../../axios/useAuthFetch";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import requestSurgery from "../../../assets/addDoctorBanner/requestSurgery.png"

type propType = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  id: string | number | undefined;
};

const surgeryTypesData = [
  "Orthopedic Surgery",
  "Spine Surgery",
  "Cataract Surgery",
  "Neuro Surgery",
  "General Surgery",
  "Transplantation",
  "Endocrine Surgery",
  "Arthoscopy",
  "Others",
];

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

const RequestSurgeryDialog = ({ setOpen, open, id }: propType) => {
  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const [patientType, setPatientType] = React.useState<string>("");
  const [surgeryType, setSurgeryType] = React.useState<string>("");
  const [manualsurgeryType, setManualSurgeryType] = React.useState<string>("");
  // const [surgeryTypesData, setSurgeryTypesData] = React.useState([]);
  const getSurgerytypesApi = React.useRef(true);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedsurgeryType =
      surgeryType === "Others" ? manualsurgeryType : surgeryType;

    try {
      const data = {
        patientType: patientType,
        surgeryType: selectedsurgeryType,
      };
      const res = await authPost(
        `ot/${user.hospitalID}/${id}`,
        data,
        user.token
      );
      if (res.status === 201) {
        dispatch(setSuccess("Request Raised Successfully"));
        navigate("../");
      }
      if (res.status === "error") {
        dispatch(setError(res.message));
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
    setOpen(false);
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);
  async function getSurgerytypes() {
    const surgeryTypesResponse = await authFetch(
      `data/surgerytypes`,
      user.token
    );
    console.log("surgeryTypesResponse", surgeryTypesResponse);
    // if (surgeryTypesResponse.message == 'success') {
    //   setSurgeryTypesData(surgeryTypesResponse.surgeryTypes);
    // }
  }

  React.useEffect(() => {
    if (user.token && getSurgerytypesApi.current) {
      getSurgerytypesApi.current = false;
      getSurgerytypes();
    }
  }, [user.token]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle style ={{fontWeight:"bold"}}>Request For Surgery</DialogTitle>
        <img src = {requestSurgery} alt = "request for surgery image" style ={{width:"160px",position:"absolute",left:"80%"}}/>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              debouncedHandleSubmit(e);
            }}
          >
            <FormControl
              variant="outlined"
              fullWidth
              required
              sx={{ mt: "40px" }}
            >
              <InputLabel>Surgery urgency</InputLabel>
              <Select
                label="Surgery urgency"
                required
                style={{background:"#ffffff"}}
                onChange={(event: SelectChangeEvent) => {
                  setPatientType(event.target.value);
                }}
                value={patientType}
                name="patientType"
              >
                <MenuItem value={"elective"}>elective</MenuItem>
                <MenuItem value={"emergency"}>emergency</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              variant="outlined"
              fullWidth
              required
              sx={{ mt: "20px" }}
            >
              <InputLabel>Type of Surgery</InputLabel>
              <Select
                label="surgeryType"
                required
                onChange={(event: SelectChangeEvent) => {
                  setSurgeryType(event.target.value);
                }}
                value={surgeryType}
                name="surgeryType"
              >
                {surgeryTypesData.map((el, index) => {
                  return (
                    <MenuItem key={index} value={el}>
                      {el}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {surgeryType === "Others" && (
              <FormControl
                variant="outlined"
                fullWidth
                required
                sx={{ mt: "20px" }}
              >
                <TextField
                  label="surgeryType"
                  placeholder="Enter surgeryType"
                  required
                  onChange={(event) => {
                    setManualSurgeryType(event.target.value);
                  }}
                  value={manualsurgeryType}
                  name="manualsurgeryType"
                />
              </FormControl>
            )}
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

export default RequestSurgeryDialog;
