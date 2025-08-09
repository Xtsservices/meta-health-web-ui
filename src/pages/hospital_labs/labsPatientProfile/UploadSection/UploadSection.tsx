import React, { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Add from "@mui/icons-material/Add";
import pdfIcon from "../../../../assets/pdf.png";
import image_icon from "../../../../assets/image.png";
import PatientProfileCard from "../../../dashboard_labs/patientProfileCard/PatientProfileCard";
import styles from "../../../hospital_pharmacy/PharmacySale/Sale.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { selectTimeline } from "../../../../store/currentPatient/currentPatient.selector";
import { attachmentType, PatientDetails } from "../../../../types";
import { authFetch } from "../../../../axios/useAuthFetch";
import { setError, setSuccess } from "../../../../store/error/error.action";
import { authPost } from "../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../../utility/debounce";
import { useReportStore } from "../../../../store/zustandstore";
import { setTimeline } from "../../../../store/currentPatient/currentPatient.action";

const UploadSection: React.FC = () => {
  const [fileURLs, setFileURLs] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  // const [type, setType] = useState<string>("");
  const location = useLocation();
  const data = location.state;
  const { timeLineID, testID ,walkinID, loincCode} = data;
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const [patientDetails, setPatientDetails] = useState<PatientDetails[]>([]);
  const [walkinPatientDetails, setWalkinPatientDetails] = useState<PatientDetails[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setNewReport } = useReportStore();

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    setFiles([...files, ...newFiles]);
    setFileURLs([
      ...fileURLs,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles([...files, ...newFiles]);
      setFileURLs([
        ...fileURLs,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleSubmit = async () => {
    if (files?.length) {
      const form = new FormData();
      files.forEach((file) => {
        form.append("files", file);
        form.append("category", String(user.roleName));
       
       
      });

   
      
      let reportResponse;
      
      if (walkinID && loincCode) {
        // Call reportResponse2 if testID and loincCode exist
        reportResponse = await authPost(
          `attachment/${user.hospitalID}/${walkinID}/${user.id}/walkinAttachment?testID=${loincCode}`,
          form,
          user.token
        );

      } else {
        // Otherwise, call reportResponse
        reportResponse = await authPost(
          `attachment/${user.hospitalID}/${timeline.id}/${timeline.patientID}/${user.id}?testID=${testID}`,
          form,
          user.token
        );
      }



      if (reportResponse.message === "success") {
        dispatch(setSuccess("Report successfully uploaded"));

        setNewReport(
          reportResponse.attachements.map((el: attachmentType) => ({
            ...el,
            addedOn: String(new Date().toISOString()),
          }))
        );

        if (walkinID && loincCode) {
          navigate("../tests", { state: { walkinID: walkinID, loincCode: loincCode } });
        } else {
          navigate(`../tests`, { state: { timeLineID: timeLineID, testID: testID } });
        }

      
      } else {
        dispatch(setError(reportResponse.message));
      }
    }
  };

  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);

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

  React.useEffect(() => {
    const fetchTimeline = async () => {
      try {
        if(walkinID){
          const response = await authFetch(`test/${user.roleName}/${user.hospitalID}/${user.id}/${walkinID}/getWalkinPatientDetails`, user.token);
          if (response.message === "success") {
            setWalkinPatientDetails(response.patientList);
          }
        }else{

        
        const response = await authFetch(
          `patientTimeLine/${user.hospitalID}/${timeLineID}`,
          user.token
        );
  
        if (response.message === "success") {
          dispatch(setTimeline({ timeline: { ...response.patientTimeLine } }));
        }

       
      } 
      

     
      } catch (error) {
        console.error("Error fetching timeline:", error);
      }
    };
  
    fetchTimeline();
  }, [user.hospitalID, timeLineID, user.token, dispatch]); 

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "40px",
        marginTop: "10px",
        padding: "25px",
        height: "98%",
      }}
    >
      <div>
        <PatientProfileCard patientDetails={patientDetails[0] ||walkinPatientDetails[0]} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "25px",
        }}
      >
        <h3>Upload Patient Test Prescription</h3>
        {/* {fileURLs.length > 0 && (
          <Button variant="contained" component="span" style={{ backgroundColor: "#1977f3", borderRadius: "20px" }}>
            Upload
          </Button>
        )} */}
      </div>

      {fileURLs.length === 0 && (
        <div
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            border: "2px dashed gray",
            padding: "20px",
            margin: "0px 50px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <input
            accept="image/*,application/pdf"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="upload-input"
            ref={fileInputRef}
          />
          <label htmlFor="upload-input">
            <CloudUpload />
            <p>
              Drag and drop files here, or browse to select files from your
              computer. Accepted formats: PDF, PNG, JPG. Each file must be under
              20 MB.
            </p>
            <button
              style={{
                backgroundColor: "#F59706",
                padding: "3px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Add sx={{ color: "white" }} />
            </button>
          </label>
        </div>
      )}

      {/* Uploaded Documents Section */}
      {fileURLs.length > 0 && (
        <h4 style={{ fontWeight: "500", margin: "10px 20px" }}>
          Uploaded Documents
        </h4>
      )}
      <div style={{ display: "flex" }}>
        {fileURLs.map((_, index) => {
          const fileType = files?.[index]?.type;
          const isImage = fileType?.startsWith("image/");
          const isPdf = fileType === "application/pdf";

          return (
            <div
              key={index}
              style={{ margin: "0px 20px", textAlign: "center" }}
              className={styles.uploaded_box}
            >
              <div className={styles.uploaded_box_file}>
                {isImage ? (
                  <img
                    src={image_icon}
                    style={{
                      height: "4rem",
                      width: "4rem",
                      objectFit: "cover",
                    }}
                    alt="Image Preview"
                  />
                ) : isPdf ? (
                  <img
                    src={pdfIcon}
                    alt="PDF"
                    style={{ height: "4rem", width: "4rem" }}
                  />
                ) : null}
              </div>
              <h5 style={{ fontSize: "12px", width: "5rem" }}>
                {files?.[index]?.name.slice(0, 12)}
              </h5>
              <div>
                <button
                  style={{
                    padding: "4px 10px",
                    color: "#1977f3",
                    backgroundColor: "transparent",
                    borderRadius: "25px",
                    border: "1px solid #1977f3",
                  }}
                  onClick={() => {
                    const file = files[index];
                    if (!file) return;
                    const fileUrl = URL.createObjectURL(file);
                    window.open(fileUrl, "_blank");
                  }}
                >
                  View
                </button>
                {/* <button
                style={{padding:"4px 10px",color:"#1977f3",backgroundColor:"transparent",borderRadius:"25px",border:"1px solid #1977f3"}}
                  onClick={() => {
                    const updatedFileURLs = [...fileURLs];
                    updatedFileURLs.splice(index, 1);
                    setFileURLs(updatedFileURLs);

                    const updatedFiles = [...files];
                    updatedFiles.splice(index, 1);
                    setFiles(updatedFiles);
                  }}
                >
                  Delete
                </button> */}
              </div>
            </div>
          );
        })}
      </div>
      {fileURLs.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <Button
            variant="contained"
            sx={{ borderRadius: "25px", backgroundColor: "#1977f3" }}
            onClick={debouncedHandleSubmit}
          >
            Submit
          </Button>
        </div>
      )}
       {/* <div className={styles.container__button}>
            <Button variant="contained" onClick={debouncedAddHandler}>
              Done
            </Button>
          </div> */}
    </div>
  );
};

export default UploadSection;
