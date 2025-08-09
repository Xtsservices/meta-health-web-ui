import React, { useEffect, useRef, useState } from "react";
import styles from "./Reports.module.scss";
import Button from "@mui/material/Button";
import FormDialog from "./AddReportDialoge";
import image_icon from "./../../../../../src/assets/image.png";
import pdf from "./../../../../../src/assets/pdf.png";
import audio from "./../../../../../src/assets/audio.png";
import video from "./../../../../../src/assets/video.png";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog from "./deleteAlertDialog";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { attachmentType, PatientDetails } from "../../../../types";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { useReportStore } from "../../../../store/zustandstore";
import { authPost } from "../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';
import { authFetch } from "../../../../axios/useAuthFetch";
import PatientProfileCard from "../../../dashboard_labs/patientProfileCard/PatientProfileCard";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";

function Reports() {
  const location = useLocation();
  const data = location.state;
  const { timeLineID, testID , walkinID, loincCode} = data;
  const [patientDetails, setPatientDetails] = useState<PatientDetails[]>([]);
  const navigate = useNavigate();
  const getAllReportsApi = useRef(true);
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const [open, setOpen] = React.useState(false);
  const { reports, setReports } = useReportStore();
  const [alertOpen, setAlertOpen] = React.useState<boolean>(false);
  const [reportId, setReportId] = React.useState(0);
  const [render, setRender] = React.useState<boolean>(false);

  const [, setShowID] = useState<number | null>(0);
  const [hoveredUserID, setHoveredUserID] = useState<number | null>(null);

  const doneHandler = async () => {
    let response;
    if(walkinID && loincCode){
       response = await authPost(
          `test/${user.hospitalID}/${loincCode}/${walkinID}/walkinTestStatus`,
          { status: "completed" },
          user.token
        );
      
    }else{
      response = await authPost(
        `test/pathology/${user.hospitalID}/${testID}/testStatus`,
        { status: "completed" },
        user.token
      );
    }
   
    if (response.message === "success") {
      navigate("../../", { state: { timeLineID: timeLineID } });
    }
  };
  const debouncedAddHandler = debounce(doneHandler,DEBOUNCE_DELAY);

  useEffect(() => {
    const getPatientList = async () => {
      const response = await authFetch(
        `test/${user.roleName}/${user.hospitalID}/${user.id}/${timeLineID}/getPatientDetails`,
        user.token
      );

      if (response.message === "success") {
        setPatientDetails(response.patientList);
      }
    };

    if (
      user.hospitalID &&
      user.id &&
      user.roleName &&
      user.token &&
      timeLineID
    ) {
      getPatientList();
    }
  }, [timeLineID, user.hospitalID, user.id, user.roleName, user.token]);

  useEffect(() => {
    const getAllReports = async () => {
      const response = await authFetch(
        `attachment/${user.hospitalID}/all/${timeline.patientID}`,
        user.token
      );

      if (response.message === "success") {
        setReports(response.attachments);
      }
    };
    if (timeLineID && user.token && getAllReportsApi.current) {
      getAllReportsApi.current = false;
      getAllReports();
    }
  }, [getAllReportsApi, setReports, timeLineID, timeline.patientID,user]);

  return (
    <div className={styles.container}>
      <div className={styles.patientDetails}>
        <PatientProfileCard patientDetails={patientDetails[0]} />
      </div>

      
      <div>
        {" "}
        <div className={styles.container_report}>
          <div className={styles.container_header}>
            <h2>{user.roleName}</h2>
            {/* <Button
              variant="contained"
              onClick={() => {
                setOpen(true);
              }}
              sx={{ ml: "auto" }}
            >
              Add Report
            </Button> */}
          </div>
          <div className={styles.report}>
            {reports.sort(compareDates).map((report: any) => {
              return (
                <div className={styles.uploaded_box}>
                  <div className={styles.icons}>
                    <img
                      src={
                        report.mimeType === "application/pdf"
                          ? pdf
                          : report.mimeType === "audio/mpeg"
                          ? audio
                          : report.mimeType === "video/mp4"
                          ? video
                          : image_icon
                      }
                      style={{
                        height: "4rem",
                        width: "4rem",
                        objectFit: "cover",
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
                      .slice(0, -report.mimeType.split("/")[1].length - 1)
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
                    {" "}
                    Added on:{" "}
                    {new Date(report.addedOn).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </h4>{" "}
                  <h4
                    style={{
                      cursor: "pointer",
                      color: hoveredUserID === report.id ? "blue" : "initial",
                      fontWeight: hoveredUserID === report.id ? "bold" : "600",
                    }}
                    onClick={() => {
                      setHoveredUserID(report.id || null);
                      setShowID(report.userID || 0);
                      setRender(!render);
                      setTimeout(() => {
                        setRender(true);
                      }, 100);
                    }}
                  >
                    Added By: {report.userID}
                  </h4>
                  <a
                    href={report.fileURL}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                    rel="noreferrer"
                  >
                    <div className={styles.uploaded_box_buttons}>
                      <button className="">View </button>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
          <div className={styles.container__button}>
            <Button variant="contained" onClick={debouncedAddHandler}>
              Done
            </Button>
          </div>
        </div>
      </div>
      <FormDialog
        open={open}
        setOpen={setOpen}
        category={user.roleName}
        timeLineID={timeLineID}
        testID={testID}
      />
      <AlertDialog id={reportId} setOpen={setAlertOpen} open={alertOpen} />
    </div>
  );
}

export default Reports;

function compareDates(a: attachmentType, b: attachmentType) {
  return new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf();
}
