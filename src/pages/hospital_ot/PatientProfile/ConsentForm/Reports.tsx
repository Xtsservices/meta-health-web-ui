import React from 'react';
import styles from './Reports.module.scss';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { selectTimeline } from '../../../../store/currentPatient/currentPatient.selector';
import { selectCurrentUser } from '../../../../store/user/user.selector';
import { authFetch } from '../../../../axios/useAuthFetch';
import { attachmentType } from '../../../../types';
import image_icon from './../../../../../src/assets/image.png';
import pdf from './../../../../../src/assets/pdf.png';
import { useReportStore } from '../../../../store/zustandstore';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddReport from '../../../../component/AddPatient/Form/AddReport';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { authDelete } from '../../../../axios/authDelete';
function ReportsTab() {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const { reports, setReports } = useReportStore();
  const [reportId, setReportId] = React.useState(0);
  const [files, setFiles] = React.useState<File[] | undefined>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const getAllReports = async () => {
    const response = await authFetch(
      `attachment/${user.hospitalID}/all/${timeline.patientID}/consentform`,
      user.token
    );
  
    if (response.message == 'success') {
      setReports(response.attachments);
    }
  };
  React.useEffect(() => {
    if (timeline.id && user.token) {
      getAllReports();
    }
  }, [timeline, user]);

 

  const handleDeleteReport = async () => {
    if (reportId !== null) {
      await authDelete(
        `attachment/${user.hospitalID}/${reportId}/consentform`,
        user.token
      );
      
      setReports(reports.filter((report) => report.id !== reportId));
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.container_report}>
        <AddReport files={files} setFiles={setFiles} consentText="Consentform"/>
        <div className={styles.report}>
          {reports.sort(compareDates).map((report) => {
            return (
              <div className={styles.uploaded_box}>
                <div className={styles.uploaded_box_file}>
                  <div className={styles.icons}>
                    <img
                      src={
                        report.mimeType == 'application/pdf' ? pdf : image_icon
                      }
                      style={{
                        height: '4rem',
                        width: '4rem',
                        objectFit: 'cover',
                      }}
                      alt=""
                    />
                    <IconButton
                      aria-label="delete"
                      size="large"
                      onClick={() => {
                        setReportId(report.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                  <h3>
                    {report.fileName
                      .slice(0, -report.mimeType.split('/')[1].length - 1)
                      .slice(
                        0,
                        report.fileName.length > 12
                          ? 12
                          : report.fileName.length
                      )}
                  </h3>
                  <br />
                  <h4>
                    {' '}
                    Added on:{' '}
                    {new Date(report.addedOn).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </h4>{' '}
                </div>
                <a
                  href={report.fileURL}
                  target="_blank"
                  style={{ textDecoration: 'none' }}
                >
                  <div className={styles.uploaded_box_buttons}>
                    <button className="">View </button>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
 {/* Delete Confirmation Dialog */}
 <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>No</Button>
          <Button
            onClick={handleDeleteReport}
            variant="contained"
            color="error"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>


    </div>
  );
}

export default ReportsTab;

function compareDates(a: attachmentType, b: attachmentType) {
  return new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf();
}
