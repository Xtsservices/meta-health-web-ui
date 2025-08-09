import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import AddReport from "../../AddPatient/Form/AddReport";
import { useSelector } from 'react-redux';
import { selectTimeline } from '../../../../store/currentPatient/currentPatient.selector';
import { selectCurrentUser } from '../../../../store/user/user.selector';
import { authPost } from '../../../../axios/useAuthPost';
import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';
import { useDispatch } from 'react-redux';
import { setError, setSuccess } from '../../../../store/error/error.action';
import { useReportStore } from '../../../../store/zustandstore';
import { makeStyles } from '@mui/styles';
import { attachmentType } from '../../../../types';
import AddReport from '../../../../component/AddPatient/Form/AddReport';

type formDialogType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category: number;
};
const useStyles = makeStyles({
  dialogPaper: {
    width: '800px',
    minWidth: '800px',
  },
});
export default function FormDialog({
  open,
  setOpen,
  category,
}: formDialogType) {
  const [files, setFiles] = React.useState<File[] | undefined>([]);
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const dispatch = useDispatch();
  const { setNewReport } = useReportStore();
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
    // setFiles([]);
  };
  const handleSubmit = async () => {
    // console.log("categoryyy", category);
    if (files?.length) {
      const form = new FormData();
      files?.forEach((el) => {
        form.append('files', el);
      });
      form.append('category', String(category));
      const reportResponse = await authPost(
        `attachment/${user.hospitalID}/${timeline.id}/${timeline.patientID}/${timeline.userID}`,
        form,
        user.token
      );
      if (reportResponse.message == 'success') {
        console.log(
          'report response',
          reportResponse.attachements.map((el: attachmentType) => ({
            ...el,
            addedOn: String(new Date().toISOString()),
          }))
        );
        dispatch(setSuccess('Report successfully uploaded'));

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
  const debouncedSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);

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
          <Button onClick={debouncedSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
