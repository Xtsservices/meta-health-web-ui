import React, { useCallback } from 'react';
import styles from './Reports.module.scss';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { selectTimeline } from '../../../../../../store/currentPatient/currentPatient.selector';
import { selectCurrentUser } from '../../../../../../store/user/user.selector';
import { authFetch } from '../../../../../../axios/useAuthFetch';
import { attachmentType } from '../../../../../../types';
import FormDialog from './AddReportDialoge';
import image_icon from './../../../../../../../src/assets/image.png';
import pdf from './../../../../../../../src/assets/pdf.png';
import { useReportStore } from '../../../../../../store/zustandstore';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertDialog from './deleteAlertDialog';
import { reportCategory } from '../../../../../../utility/role';
import { capitalizeFirstLetter } from '../../../../../../utility/global';

function Reports() {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const [open, setOpen] = React.useState(false);
  const { reports, setReports } = useReportStore();
  const [alertOpen, setAlertOpen] = React.useState<boolean>(false);
  const [reportId, setReportId] = React.useState(0);
  const [category] = React.useState(0);

  const getAllReports = useCallback(async () => {
    const response = await authFetch(
      `attachment/${user.hospitalID}/all/${timeline.patientID}`,
      user.token
    );
    if (response.message == 'success') {
      setReports(response.attachments);
    }
  }, []);

  React.useEffect(() => {
    if (timeline.id && user.token) {
      getAllReports();
    }
  }, [getAllReports, timeline, user]);

  return (
    <div className={styles.container}>
      {Object.keys(reportCategory).map((category, index) => {
        return (
          <>
            {' '}
            <div className={styles.container_report}>
              <div className={styles.container_header}>
                <h2>{capitalizeFirstLetter(category)}</h2>
                {/* <Button
                  variant="contained"
                  onClick={() => {
                    setCategory(Object.values(reportCategory)[index] as number);
                    setOpen(true);
                  }}
                  sx={{ ml: 'auto' }}
                >
                  Add Report
                </Button> */}
              </div>
              <div className={styles.report}>
                {reports
                  .filter(
                    (report) =>
                      report.category == Object.values(reportCategory)[index]
                  )
                  .sort(compareDates)
                  .map((report) => {
                    return (
                      <div className={styles.uploaded_box}>
                        <div className={styles.uploaded_box_file}>
                          <div className={styles.icons}>
                            <img
                              src={
                                report.mimeType == 'application/pdf'
                                  ? pdf
                                  : image_icon
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
                                setAlertOpen(true);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </div>
                          <h3>
                            {report.fileName
                              .slice(
                                0,
                                -report.mimeType.split('/')[1].length - 1
                              )
                              .slice(
                                0,
                                report.fileName.length > 12
                                  ? 12
                                  : report.fileName.length
                              )}
                          </h3>
                          <br />
                          {/* Added On: {new Date(report.addedOn)} */}
                          <h4>
                            {' '}
                            Added on:{' '}
                            {new Date(report.addedOn).toLocaleDateString(
                              'en-GB',
                              {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                              }
                            )}
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
          </>
        );
      })}

      <FormDialog open={open} setOpen={setOpen} category={category} />
      <AlertDialog id={reportId} setOpen={setAlertOpen} open={alertOpen} />
    </div>
  );
}

export default Reports;

function compareDates(a: attachmentType, b: attachmentType) {
  return new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf();
}
