import { useEffect, useRef, useState } from "react";
import styles from "./Reports.module.scss";
import { useSelector } from "react-redux/es/hooks/useSelector";
import {
  selectCurrPatient,
  selectTimeline,
} from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FormDialog from "./AddReportDialoge";
import image_icon from "./../../../../../src/assets/image.png";
import pdf from "./../../../../../src/assets/pdf.png";
import audio from "./../../../../../src/assets/audio.png";
import video from "./../../../../../src/assets/video.png";
import { useReportStore } from "../../../../store/zustandstore";
import AlertDialog from "./deleteAlertDialog";
import { reportCategory } from "../../../../utility/role";
import { capitalizeFirstLetter } from "../../../../utility/global";
import AddedBy from "../../../DailogBoxs/AddedBy";
import { attachmentType } from "../../../../types";
import { useLocation } from "react-router-dom";

const Reports = () => {
  const getAllReportsApi = useRef(true);
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const currentPatient = useSelector(selectCurrPatient);
  const [open, setOpen] = useState(false);
  const { reports, setReports } = useReportStore();
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [reportId, setReportId] = useState(0);
  const [category, setCategory] = useState(0);
  const [render, setRender] = useState<boolean>(false);
  const [showID, setShowID] = useState<number | null>(0);
  const [hoveredUserID, setHoveredUserID] = useState<number | null>(null);
  const location = useLocation();
  const isCustomerCare = location.pathname.includes("customerCare");

  const getAllReports = async () => {
    const response = await authFetch(
      `attachment/${user.hospitalID}/all/${timeline.patientID}`,
      user.token
    );
    if (response.message == "success") {
      setReports(response.attachments);
    }
  };

  useEffect(() => {
    if (timeline.id && user.token && getAllReportsApi.current) {
      getAllReportsApi.current = false;
      getAllReports();
    }
  }, [timeline, user]);

  return (
    <div className={styles.container}>
      {Object.keys(reportCategory).map((category, index) => {
        const categoryValue =
          reportCategory[category as keyof typeof reportCategory];

        return (
          <>
            {" "}
            <div className={styles.container_report}>
              <div className={styles.container_header}>
                <h2>{capitalizeFirstLetter(category)}</h2>
                {currentPatient.ptype !== 21 && !isCustomerCare && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setCategory(
                        Object.values(reportCategory)[index] as number
                      );
                      setOpen(true);
                    }}
                    sx={{ ml: "auto", borderRadius: "20px" }}
                  >
                    Add Report
                  </Button>
                )}
              </div>
              <div className={styles.report}>
                {reports
                  .filter((report) => {
                    let reportCategoryValue: number;
                    if (!isNaN(Number(report.category))) {
                      reportCategoryValue = Number(report.category);
                    } else if (typeof report.category === "string") {
                      reportCategoryValue =
                        reportCategory[
                          report.category.toLowerCase() as keyof typeof reportCategory
                        ] ?? -1; // Default to -1 if not found
                    } else {
                      // If it's not a string or number, handle it accordingly
                      reportCategoryValue = -1; // Default value for unsupported types
                    }
                    return reportCategoryValue === categoryValue; // Compare the normalized category value
                  })
                  .sort(compareDates)
                  .map((report) => {
                    console.log("23", report);
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
                        <h4>
                          {" "}
                          Added on:{" "}
                          {new Date(report.addedOn).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )}
                        </h4>{" "}
                        <h4
                          style={{
                            cursor: "pointer",
                            color:
                              hoveredUserID === report.id ? "blue" : "initial",
                            fontWeight:
                              hoveredUserID === report.id ? "bold" : "600",
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
      {showID !== 0 && render && <AddedBy userID={showID} />}
    </div>
  );
};

export default Reports;

function compareDates(a: attachmentType, b: attachmentType) {
  return new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf();
}
