import * as React from "react";
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
};
function createData(
  symptom: string,
  code: number | null,
  addedOn: string | null,
  duration: string,
  durationParameter: string
) {
  return { symptom, code, addedOn, duration, durationParameter };
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
  const [rows, setRows] = React.useState<rowType[]>([]);
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState(0);
  React.useEffect(() => {
    setRows(
      selectedList.map((symptom) => {
        return createData(
          symptom.symptom,
          symptom.id,
          symptom.addedOn,
          symptom.duration || "------",
          symptom.durationParameter
        );
      })
    );
  }, [selectedList]);
  const deleteSymptom = async (code: number) => {
    const response = await authDelete(
      `symptom/${timeline.id}/${code}`,
      user.token
    );

    // console.log("Deleting symptom response", response);
    if (response.message == "success") {
      setSelectedList((currentList) => {
        const newList = currentList.filter((el) => el.id != code);
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
              <th>Symptoms</th>
              <th>Duration</th>
              <th>Time and Date of Symptom</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.sort(compareDates).map((row, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    {row.symptom.slice(0, 1).toUpperCase() +
                      row.symptom.slice(1).toLowerCase()}
                  </td>
                  <td>
                    {row.duration +
                      " " +
                      capitalizeFirstLetter(row.durationParameter)}
                  </td>
                  <td>
                    {new Date(row.addedOn || "").toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                      month: "short",
                      year: "2-digit",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <IconButton
                      // aria-label="delete"
                      onClick={() => {
                        setCode(row.code || 1);
                        setOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        "No Symptom Added"
      )}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete Symptoms"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure, you want to delete this symptoms?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              deleteSymptom(code || 1);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function compareDates(a: rowType, b: rowType) {
  return (
    new Date(b.addedOn || "").valueOf() - new Date(a.addedOn || "").valueOf()
  );
}
