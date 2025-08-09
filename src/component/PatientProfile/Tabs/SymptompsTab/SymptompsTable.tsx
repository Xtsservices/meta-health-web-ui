import React, { useState } from "react";
import styles from "./SymptompsTable.module.scss";
import { symptompstype } from "../../../../types";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { useSelector } from "react-redux";
import { authDelete } from "../../../../axios/authDelete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import Button from "@mui/material/Button";
import { capitalizeFirstLetter } from "../../../../utility/global";
import "./symptomsAddedby.css";
import AddedBy from "../../../DailogBoxs/AddedBy";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type rowType = {
  symptom: string;
  code: number | null;
  addedOn: string | null;
  duration: string;
  durationParameter: string;
  userID: number | null;
  id: number | null;
  conceptID: number | null;

};

function createData(
  symptom: string,
  code: number | null,
  addedOn: string | null,
  duration: string,
  durationParameter: string,
  userID: number | null,
  id: number | null,
  conceptID: number | null
): rowType {
  return { id, symptom, code, addedOn, duration, durationParameter, userID ,conceptID};
}

type SymptompsTableType = {
  selectedList: symptompstype[];
  setSelectedList: React.Dispatch<React.SetStateAction<symptompstype[]>>;
};

export default function SymptompsTable({
  selectedList,
  setSelectedList,
}: SymptompsTableType) {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const [rows, setRows] = useState<rowType[]>([]);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(0);
  const [showID, setShowID] = useState(0);
  const [hoveredUserID, setHoveredUserID] = useState<number | null>(null);
  const [render, setRender] = React.useState<boolean>(false);

  React.useEffect(() => {
    setRows(
      selectedList.map((symptom) => {
        return createData(
          symptom.symptom,
          symptom.id,
          symptom.addedOn,
          symptom.duration || "------",
          symptom.durationParameter,
          symptom.userID,
          symptom.id,
          symptom.conceptID,
        );
      })
    );
  }, [selectedList]);

  const deleteSymptom = async (code: number) => {
    const response = await authDelete(
      `symptom/${timeline.id}/${code}`,
      user.token
    );

    if (response.message === "success") {
      setSelectedList((currentList) => {
        const newList = currentList.filter((el) => el.id !== code);
        return newList;
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.table}>
      {rows.length ? (
        <table>
          <thead>
            <tr>
              <th>S. No</th>
              <th>Snomed Code</th>
              <th>Symptoms</th>
              <th>Duration</th>
              <th>Time and Date of Symptom</th>
              <th>Added By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.sort(compareDates).map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.conceptID ?row.conceptID:"N/A"}</td>
                <td>
                  {row.symptom.slice(0, 1).toUpperCase() +
                    row.symptom.slice(1).toLowerCase()}
                </td>
                <td>
                  {row.duration} {capitalizeFirstLetter(row.durationParameter)}
                </td>
                <td>
                  {row.addedOn &&
                    new Date(row.addedOn).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                      month: "short",
                      year: "2-digit",
                      day: "numeric",
                    })}
                </td>
                <td
                  style={{
                    cursor: "pointer",
                    color: hoveredUserID === row.id ? "blue" : "initial",
                    fontWeight: hoveredUserID === row.id ? "bold" : "normal",
                  }}
                  
                  onClick={()=>{
                    setHoveredUserID(row.id || null);
                    setShowID(row.userID || 0);
                    setRender(!render)
                    setTimeout(() => {
                      setRender(true)
                    }, 100)
                  }}
                >
                  {row.userID}
                </td>
                <td>
                  <IconButton
                    onClick={() => {
                      setCode(row.code || 0);
                      setOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Symptom Added</p>
      )}

      {/* Delete Dialog */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Delete Symptoms</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this symptom?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => deleteSymptom(code)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Added By Dialog */}
      {(showID !== 0 && (render)) && <AddedBy userID={showID}/>}
    </div>
  );
}

function compareDates(a: rowType, b: rowType) {
  const dateA = new Date(a.addedOn || "");
  const dateB = new Date(b.addedOn || "");

  return dateB.getTime() - dateA.getTime();
}
