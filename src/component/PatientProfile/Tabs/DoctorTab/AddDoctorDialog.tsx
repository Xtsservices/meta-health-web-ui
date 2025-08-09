import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./../../../../pages/hospital_admin/addDepartment/addDepartment.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authPost } from "../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';
import { PatientDoctor, staffType } from "../../../../types";
import TextField from "@mui/material/TextField";
import { Role_NAME } from "../../../../utility/role";
import { authFetch } from "../../../../axios/useAuthFetch";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import treatingDoctorsBanner from "../../../../assets/addDoctorBanner/treatingDoctorsBanner.png"
import { setError } from "../../../../store/error/error.action";
type addStaffProps = {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedList: React.Dispatch<React.SetStateAction<PatientDoctor[]>>;
  selectedList?: PatientDoctor[];
};

export default function AddDoctorDialog({
  setOpen,
  setSelectedList,
}: addStaffProps) {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const [doctorList, setDoctorList] = React.useState<staffType[]>([]);
  const [doctorID, setDoctorID] = React.useState<number | null>(null);
  const [category, setCategory] = React.useState<
    "primary" | "secondary" | null
  >(null);
  const [purpose, setPurpose] = React.useState<string>("");
  const dispatch = useDispatch();

  const getAllListApi = React.useRef(true)
  const getAllList = async () => {
    const doctorResponse = await authFetch(
      `user/${user.hospitalID}/list/${Role_NAME.doctor}`,
      user.token
    );
    if (doctorResponse.message == "success") {
      setDoctorList(doctorResponse.users);
    }
  };
  React.useEffect(() => {
    if(getAllListApi.current){
      getAllListApi.current = false
      getAllList();
    }
  }, [user, timeline]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    const body = {
      patientTimeLineId: timeline.id,
      doctorId: doctorID,
      category: category,
      purpose,
      scope: "doctor",
    };
    const response = await authPost(
      `doctor/${user.hospitalID}`,
      body,
      user.token
    );
    if (response.message == "success") {
      setSelectedList((prevList) => {
        return [...prevList, ...response.doctor];
      });
    }else{
      dispatch(setError(response.message));

    }
    handleClose();
    // if (response.message == "success") {
    // }
    // const response=
  };
  const handleSaveDebounced = debounce(handleSave, DEBOUNCE_DELAY);
  return (
    <form onSubmit={handleSaveDebounced}>
      <DialogTitle style = {{fontWeight:"bold"}}>Add Doctor </DialogTitle>
      <DialogContent>
        <img src = {treatingDoctorsBanner} alt = "treating Doctors Banner" style ={{width:"180px",height:"140px", position:"absolute", left :"71%", top :"0%"}} />
        <div className={styles.department_dialog}>
          <FormControl
            variant="outlined"
            fullWidth
            required
            sx={{ mt: "30px" }}
          >
            {/* <InputLabel></InputLabel> */}
            <InputLabel>Doctor</InputLabel>
            <Select
              label="Doctor"
              style ={{background:"#ffffff"}}
              required
              onChange={(event: SelectChangeEvent) => {
                setDoctorID(Number(event.target.value));
              }}
              name="doctor"
              value={doctorID ? String(doctorID) : ""}
            >
              {doctorList.map((doc) => {
                return (
                  <MenuItem value={doc.id}>
                    {doc.firstName
                      ? doc.firstName
                      : "" + doc.lastName
                      ? " " + doc.lastName
                      : ""}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            fullWidth
            required
            sx={{ mt: "20px" }}
          >
            {/* <InputLabel></InputLabel> */}
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              required
              onChange={(event: SelectChangeEvent) => {
                setCategory(event.target.value as "primary" | "secondary");
              }}
              name="category"
              value={category || ""}
            >
              <MenuItem value={"primary"}>Primary </MenuItem>
              <MenuItem value={"secondary"}>Secondary</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="outlined-required"
            label="Reason"
            variant="outlined"
            multiline
            rows={3}
            value={purpose}
            required
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              //   medicineData[index].medicineName = event.target.value;
              setPurpose(event.target.value);
            }}
            fullWidth
            sx={{ mt: "20px" }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSaveDebounced} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </form>
  );
}
