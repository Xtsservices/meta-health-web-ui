import React, { useState } from "react";
import styles from "./Testcard.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authPost } from "../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';
import { Adjust } from "@mui/icons-material";

interface TestCardProps {
  testName: string;
  timeLineID: number;
  status: string;
  testID: number;
  date:string;
  prescriptionURL?:string;
  test?:string;
  loincCode?:string
  walkinID?:number;
}

const TestCard: React.FC<TestCardProps> = ({
  testName,
  timeLineID,
  status,
  testID,
  date,
 
  test,
  loincCode,
  walkinID
}) => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [progress, setProgress] = useState<string>(status);

  const handleFirstButtonClick = async() => {
    const updateStatus = async () => {
      await authPost(
        `test/pathology/${user.hospitalID}/${testID}/testStatus`,
        { status: "processing" },
        user.token
      );
    };

    const updateStatus2 = async () => {
      await authPost(
        `test/${user.hospitalID}/${loincCode}/${walkinID}/walkinTestStatus`,
        { status: "processing" },
        user.token
      );
    };
    if (progress === "pending") {
      setProgress("processing");
      if (test && loincCode) {
        await updateStatus2();
      } else {
        await updateStatus();
      }
     
    }
  };
  const debouncedHandleFirstButtonClick = debounce(handleFirstButtonClick, DEBOUNCE_DELAY);

  const handleSecondButtonClick = () => {
    if (progress !== "processing") {
      return;
    }
    // navigate(`./tests`, { state: { timeLineID: timeLineID, testID: testID } });
    if (test && loincCode) {
      navigate("./upload", { state: { walkinID: walkinID, loincCode: loincCode } });
    } else {
      navigate("./upload", { state: { timeLineID: timeLineID, testID: testID } });
    }
    
    // navigate("./upload",{ state: { timeLineID: timeLineID, testID: testID } })
    if (progress === "processing") {
      setProgress("completed");
    }
  };
  console.log("progress===12")
  console.log("progress===12",progress)
  
  const convertToIST = (utcDate:string) => {
    let date = new Date(utcDate);
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Ensures AM/PM format
    });
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.testName}
        onClick={() => navigate("./upload",{ state: { timeLineID: timeLineID, testID: testID } })}
        style={{ cursor: "pointer",marginBottom:"10px",color:"#1977f3",fontWeight:"600" }}
      >
        {testName}
      </div>

      {/* Circles and Progress Bars Container */}
      <div className={styles.progressContainer} style={{display:"flex",alignItems:"center",padding:"0px 20px",margin:"0px 20px"}}>
        {/* First Circle - Test Received */}
        <div className={styles.circleContainer}>
          <CheckIcon
            sx={{ fontSize: "2rem", zIndex: "2" }}
            className={`${styles.iconButton} ${styles.active}`}
            // onClick={debouncedHandleFirstButtonClick}
          />
        </div>

        {/* Progress Bar from Test Received to Processing */}
        <div
          className={`${styles.progressBar} ${
            progress === "processing" || progress === "completed" ? styles.active : ""
          }`}
        ></div>

        {/* Second Circle - Processing */}
        <div className={styles.circleContainer}>
          {progress === "processing" || progress === "completed" ? (
            <CheckIcon
              sx={{ fontSize: "2rem", zIndex: "2" }}
              className={`${styles.iconButton} ${styles.active}`}
              onClick={debouncedHandleFirstButtonClick}
            />
          ) : (
            <Adjust sx={{ fontSize: "2rem", zIndex: "2" }} className={styles.iconButton} onClick={debouncedHandleFirstButtonClick}/>
          )}
        </div>

        {/* Progress Bar from Processing to Submitted */}
        <div
          className={`${styles.progressBar} ${
            progress === "completed" ? styles.active : ""
          }`}
        ></div>

        {/* Third Circle - Pending or Submitted */}
        <div className={styles.circleContainer}>
          {progress === "completed" ? (
            <CheckIcon
              sx={{ fontSize: "2rem", zIndex: "2" }}
              className={`${styles.iconButton} ${styles.active}`}
              onClick={handleSecondButtonClick}
            />
          ) : (
            <Adjust sx={{ fontSize: "2rem" }} className={styles.iconButton} onClick={handleSecondButtonClick}/>
          )}
        </div>
      </div>

      {/* Labels (Text) Container */}
      <div className={styles.textContainer} style={{display:"flex",justifyContent:"space-between",padding:"10px",margin:"0px 10px",color:"gray"}}>
        <div className={styles.label}>Test Received</div>
        <div className={styles.label}>Processing</div>
        <div className={styles.label}>
          {progress === "pending" && "Pending"}
          {progress === "processing" && "Pending"}
          {progress === "completed" && "Submitted"}
        </div>
      </div>
      <div style={{padding:"0px 15px",color:"gray",fontSize:"0.9rem"}}>{convertToIST(date)}</div>
    </div>
  );
};

export default TestCard;
