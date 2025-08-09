import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import AddReport from "./AddReport";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { useReportStore } from "../../../../store/zustandstore";
import { authPost } from "../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';
import { setError, setSuccess } from "../../../../store/error/error.action";
import { attachmentType } from "../../../../types";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
import { setTimeline } from "../../../../store/currentPatient/currentPatient.action";
type formDialogType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category: string;
  timeLineID: number;
  testID?:number;
};
const useStyles = makeStyles({
  dialogPaper: {
    width: "800px",
    minWidth: "800px",
  },
});
// below we have timeLineID
export default function FormDialog({
  open,
  setOpen,
  category,
  timeLineID,
  testID,
}: formDialogType) {
  const [files, setFiles] = React.useState<File[] | undefined>([]);
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const dispatch = useDispatch();
  const { setNewReport } = useReportStore();
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSubmit = async () => {
    if (files?.length) {
      const form = new FormData();
      files?.forEach((el) => {
        form.append("files", el);
      });
      form.append("category", String(category));
      const reportResponse = await authPost(
        `attachment/${user.hospitalID}/${timeline.id}/${timeline.patientID}/${user.id}?testID=${testID}`,
        form,
        user.token
      );
      if (reportResponse.message === "success") {
        dispatch(setSuccess("Report successfully uploaded"));

        setNewReport(
          reportResponse.attachements.map((el: attachmentType) => ({
            ...el,
            addedOn: String(new Date().toISOString()),
          }))
        );
      } else {
        dispatch(setError(reportResponse.message));
      }
    }
    handleClose();
  };
  const debouncedHandleSubmit = debounce(handleSubmit,DEBOUNCE_DELAY)

  React.useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await authFetch(
          `patientTimeLine/${user.hospitalID}/${timeLineID}`,
          user.token
        );
  
        if (response.message === "success") {
          dispatch(setTimeline({ timeline: { ...response.patientTimeLine } }));
        }
      } catch (error) {
        console.error("Error fetching timeline:", error);
      }
    };
  
    fetchTimeline();
  }, [user.hospitalID, timeLineID, user.token, dispatch]); 
  console.log("timeline===",timeline)

  
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogContent>
          <AddReport files={files} setFiles={setFiles} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={debouncedHandleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
