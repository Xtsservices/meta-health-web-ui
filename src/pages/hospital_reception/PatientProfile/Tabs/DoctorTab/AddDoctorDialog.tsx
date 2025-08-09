import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import styles from "./adddoctordialog.module.scss";
import { PatientDoctor, staffType } from "../../../../../types";

type addStaffProps = {
  open?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedList: React.Dispatch<React.SetStateAction<PatientDoctor[]>>;
  selectedList?: PatientDoctor[];
};

export default function AddDoctorDialog({ setOpen }: addStaffProps) {
  const [doctorList] = React.useState<staffType[]>([]);
  const [doctorID, setDoctorID] = React.useState<number | null>(null);
  const [category, setCategory] = React.useState<
    "primary" | "secondary" | null
  >(null);
  const [purpose, setPurpose] = React.useState<string>("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    console.log();
  };
  return (
    <form onSubmit={handleSave}>
      <DialogTitle>Add Doctor</DialogTitle>
      <DialogContent>
        <div className={styles.department_dialog}>
          <FormControl
            variant="outlined"
            fullWidth
            required
            sx={{ mt: "20px" }}
          >
            {/* <InputLabel></InputLabel> */}
            <InputLabel>Doctor</InputLabel>
            <Select
              label="Doctor"
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
            label="Purpose"
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
        <Button onClick={handleSave} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </form>
  );
}
