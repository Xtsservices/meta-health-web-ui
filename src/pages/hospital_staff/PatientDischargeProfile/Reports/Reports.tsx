import React, { useRef } from "react";
import styles from "./Reports.module.scss";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authFetch } from "../../../../axios/useAuthFetch";
import { attachmentType } from "../../../../types";
import image_icon from "./../../../../../src/assets/image.png";
import pdf from "./../../../../../src/assets/pdf.png";
import { useReportStore } from "../../../../store/zustandstore";
import { capitalizeFirstLetter } from "../../../../utility/global";
import { reportCategory } from "../../../../utility/role";
function Reports() {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const { reports, setReports } = useReportStore();
  //   console.log("Repor page is working");
  const getAllReportsApi = useRef(true);
  const getAllReports = async () => {
    const response = await authFetch(
      `attachment/${user.hospitalID}/all/${timeline.patientID}`,
      user.token
    );
    console.log(response);
    // console.log("response ", response);
    // console.log("get all reports", response);
    if (response.message == "success") {
      setReports(response.attachments);
    }
    // if (response.message == "success") {
    // }
  };
  React.useEffect(() => {
    if (timeline.id && user.token && getAllReportsApi.current) {
      getAllReportsApi.current = false;
      getAllReports();
    }
  }, [timeline, user]);
  // console.log("reports", reports);
  return (
    <div className={styles.container}>
      {Object.keys(reportCategory).map((category, index) => {
        return (
          <>
            {" "}
            <div className={styles.container_report}>
              <div className={styles.container_header}>
                <h2>{capitalizeFirstLetter(category)}</h2>
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
                                report.mimeType == "application/pdf"
                                  ? pdf
                                  : image_icon
                              }
                              style={{
                                height: "4rem",
                                width: "4rem",
                                objectFit: "cover"
                              }}
                              alt=""
                            />
                          </div>
                          <h3>
                            {report.fileName
                              .slice(
                                0,
                                -report.mimeType.split("/")[1].length - 1
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
                            {" "}
                            Added on:{" "}
                            {new Date(report.addedOn).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit"
                              }
                            )}
                          </h4>{" "}
                        </div>
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
    </div>
  );
}

export default Reports;

function compareDates(a: attachmentType, b: attachmentType) {
  return new Date(b.addedOn).valueOf() - new Date(a.addedOn).valueOf();
}
