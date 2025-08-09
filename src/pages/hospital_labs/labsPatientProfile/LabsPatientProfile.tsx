import TestCard from "./testcard/Testcard";
import styles from "./LabsPatientProfile.module.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { PatientDetails, TestDetails } from "../../../types";
import { authFetch } from "../../../axios/useAuthFetch";
import PatientProfileCard from "../../dashboard_labs/patientProfileCard/PatientProfileCard";
import { capitalizeFirstLetter } from "../../../utility/global";


import pdf from "../../../assets/pdf.png";
import audio from "../../../assets/audio.png";
import video from "../../../assets/video.png";
import image_icon from "../../../assets/image.png";

const LabsPatientProfile = () => {
  const user = useSelector(selectCurrentUser);
  const [patientDetails, setPatientDetails] = useState<PatientDetails[]>([]);
  const [completedPatientData, setCompletedPatientData] = useState<
    PatientDetails[]
  >([]);

  const location = useLocation();
  const data = location.state;
  const timeLineID = data?.timeLineID;
  const prescriptionURL = data.prescriptionURL || null;
  const tab = data?.tab;

  useEffect(() => {
    const getPatientList = async () => {
      let apiEndpoint = prescriptionURL
        ? `test/${user.roleName}/${user.hospitalID}/${user.id}/${timeLineID}/getWalkinPatientDetails`
        : `test/${user.roleName}/${user.hospitalID}/${user.id}/${timeLineID}/getPatientDetails`;
        console.log(apiEndpoint,"apis")

      const response = await authFetch(apiEndpoint, user.token);
      console.log(response, "response")

      if (response.message === "success") {
        setPatientDetails(response.patientList);
      }
    };

    getPatientList();
  }, [timeLineID, user.hospitalID, user.id, user.roleName, user.token]);

  useEffect(() => {
    const getReportsCompletedPatientList = async () => {
      let apiEndpoint = prescriptionURL
        ? `test/${user.roleName}/${user.hospitalID}/${user.id}/${timeLineID}/getWalkinReportsCompletedPatientDetails`
        : `test/${user.roleName}/${user.hospitalID}/${user.id}/${timeLineID}/getReportsCompletedPatientDetails`;

      const response = await authFetch(apiEndpoint, user.token);
      
      if (response.message === "success") {
        setCompletedPatientData(response.patientList);
      } else {
        setCompletedPatientData([]);
      }
    };

    getReportsCompletedPatientList();
  }, [timeLineID, user.hospitalID, user.id, user.roleName, user.token]);

  console.log("complered==", completedPatientData);
  console.log("patientDetails==", patientDetails);
  console.log("timeLineID==", timeLineID);

  return (
    <div className={styles.patientProfile__container}>
      <PatientProfileCard
        patientDetails={patientDetails[0] || completedPatientData[0]}
        completedDetails={completedPatientData}
        tab={tab}
      />
      {tab === "normal" && (
      <div className={styles.patientProfile__tests}>
        <h3 style={{fontSize:"1.5rem"}}>Tests</h3>
        {patientDetails.map((el) =>
          (el.testsList ?? [el]).map((test) => (
            <TestCard
              testID={el.id}
              testName={el.test}
              timeLineID={el.timeLineID}
              status={el.status || test.status}
              date={el.addedOn}
              prescriptionURL={prescriptionURL}
              test={(test as TestDetails).name}
              loincCode={test.loinc_num_}
              walkinID={el.id}
            />
          ))
        )}
        {completedPatientData?.length > 0 && completedPatientData?.map((el) =>
          (el.testsList ?? [el]).map((test) => (
            <TestCard
              testID={el.id}
              testName={el.test}
              timeLineID={el.timeLineID}
              status={el.status || test.status}
              date={el.addedOn}
              prescriptionURL={prescriptionURL}
              test={(test as TestDetails).name}
              loincCode={test.loinc_num_}
              walkinID={el.id}
            />
          ))
        )}
      </div>
      )}
      {completedPatientData?.length > 0 && tab === "completed" && (
        <>
          <h1
            style={{
              textAlign: "left",
              marginBottom: "0.5rem",
              paddingLeft: "10px",
            }}
          >
            {capitalizeFirstLetter(user.roleName)}
            
          </h1>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #ccc", // Ensures a visible thin gray line
              width: "100%", // Makes it span full width
              marginBottom: "0.5rem", // Adds spacing below
            }}
          />

          {/* Description */}
          <p
            style={{
              marginLeft: "0",
              marginBottom: "2rem",
              paddingLeft: "10px",
            }}
          >
            Test reports
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "flex-start", // Ensures reports start from the left
              alignItems: "flex-start",
            }}
          >
            {Array.isArray(completedPatientData) &&
  completedPatientData?.map((report) =>
    (report?.attachments || []).map((attachment) => (
      <div key={attachment.id} className={styles.uploaded_box}>
        <p style={{ fontSize: "13px" }}>
          {attachment.test || report.testsList?.[0]?.name || "Unknown Test"}
        </p>
        <div className={styles.icons}>
          <img
            src={
              attachment.mimeType === "application/pdf"
                ? pdf
                : attachment.mimeType === "audio/mpeg"
                ? audio
                : attachment.mimeType === "video/mp4"
                ? video
                : image_icon
            }
            style={{
              height: "3rem",
              width: "3rem",
              objectFit: "cover",
            }}
            alt="file icon"
          />
        </div>
        <h3>
          {attachment.fileName.length > 12
            ? attachment.fileName.slice(0, 12) + "..."
            : attachment.fileName}
        </h3>
        <br />
        <h4>
          Added on:{" "}
          {new Date(attachment.addedOn).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
        </h4>
        <a
          href={attachment.fileURL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <div className={styles.uploaded_box_buttons}>
            <button className="">View</button>
          </div>
        </a>
      </div>
    ))
  )}
          </div>
        </>
      )}
    </div>
  );
};

export default LabsPatientProfile;
