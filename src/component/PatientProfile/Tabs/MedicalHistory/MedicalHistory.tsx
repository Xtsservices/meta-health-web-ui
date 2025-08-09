import React, { useRef } from "react";
import styles from "./medicalHistory.module.scss";
// import profile_pic from "./../../../../../src/assets/profile.png";
import surgery from "./../../../../../src/assets/medicalCondition/SURGERY1.png";
import cancer from "./../../../../../src/assets/medicalCondition/cancer.png";
import drugs from "./../../../../../src/assets/medicalCondition/drugs.png";
import drugs3 from "./../../../../../src/assets/medicalCondition/drugs3.png";
import father from "./../../../../../src/assets/medicalCondition/father.png";
import health1 from "./../../../../../src/assets/medicalCondition/health1.png";
import health2 from "./../../../../../src/assets/medicalCondition/health2.png";
import health3 from "./../../../../../src/assets/medicalCondition/health3.png";
import health4 from "./../../../../../src/assets/medicalCondition/health4.png";
import health5 from "./../../../../../src/assets/medicalCondition/health5.png";
import hepatitisB from "./../../../../../src/assets/medicalCondition/hepatitisB.png";
import hepatitisC from "./../../../../../src/assets/medicalCondition/hepatitisC.png";
import hiv1 from "./../../../../../src/assets/medicalCondition/hiv1.png";
import lumps from "./../../../../../src/assets/medicalCondition/lumps.png";
import mother from "./../../../../../src/assets/medicalCondition/mother.png";
// import prescribed3 from "./../../../../../src/assets/medicalCondition/prescribed3.png";
import sibling from "./../../../../../src/assets/medicalCondition/sibling.png";
import tobbaco from "./../../../../../src/assets/medicalCondition/tobbaco.png";
import whiskey1 from "./../../../../../src/assets/medicalCondition/whiskey1.png";
import sneeze from "./../../../../../src/assets/medicalCondition/sneeze 1.png";
import blood_icon from "./../../../../../src/assets/medicalCondition/blood_icon.png";
import blood_pressure_icon from "./../../../../../src/assets/medicalCondition/blood_pressure_icon.png";
import body_figure from "./../../../../../src/assets/medicalCondition/body_figure.png";
import { selectCurrPatient } from "../../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { authFetch } from "../../../../axios/useAuthFetch";
import { medicalHistoryFormType } from "../../../../types";
import { heriditaryList, infectionList } from "../../../../utility/list";
import pregnant_icon from "./../../../../../src/assets/medicalCondition/pregnancy_icon.png";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { useLocation, useNavigate } from "react-router-dom";
// import LineBetweenPointsVertical from "./LineBetweenTwoPoints";
// import LineBetweenPointsHorizontal from "./HorizontalLine";
function MedicalHistory() {
  const patient = useSelector(selectCurrPatient);
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const location = useLocation();
  const isCustomerCare = location.pathname.includes("customerCare");
  const [medicalHistory, setMedicalHistory] =
    React.useState<medicalHistoryFormType>();
  const getMedicalHistoryApi = useRef(true);
  const getMedicalHistory = async () => {
    const response = await authFetch(
      `history/${user.hospitalID}/patient/${patient.id}`,
      user.token
    );
    if (response.message == "success") {
      setMedicalHistory(response.medicalHistory);
    }
  };
  React.useEffect(() => {
    if (user.token && patient.id && getMedicalHistoryApi.current) {
      getMedicalHistoryApi.current = false;
      getMedicalHistory();
    }
  }, [patient, user]);
  const brainRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (brainRef?.current) {
      createLine(50, 0, 300, 100, "brain_line");
    }
  });
  const createLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    lineId: string
  ) => {
    const distance = Math.sqrt((x1 - x2) * (x1 - x2)) + (y1 - y2) * (y1 - y2);
    const xMid = (x1 + x2) / 2;
    const yMid = (y1 + y2) / 2;
    const slopeInRadian = Math.atan2(y1 - y2, x1 - x2);
    const slopeInDegree = (slopeInRadian * 180) / Math.PI;
    ////Change the css
    const line = document.getElementById(lineId);
    if (line) {
      line.style.width = `${distance}px`;
      line.style.top = `${yMid}px`;
      line.style.left = `${xMid - distance / 2}px`;
      line.style.transform = "rotate(" + slopeInDegree + "deg)";
    }
  };
  console.log("patient", patient);
  return (
    <>
      <div style={{ position: "relative" }} className={styles.main_container}>
        {/* ////Neuro Line */}
        {/* <LineBetweenPointsHorizontal
          x2={140}
          top={250}
          left={600}
          Iscircle={true}
        />
        <LineBetweenPointsVertical y2={140} top={250} left={600 + 140 - 4} />
        <LineBetweenPointsHorizontal
          x2={120}
          top={250 + 140 - 4}
          left={600 + 140 - 4}
          Iscircle={false}
        /> */}
        {/* Mental Line */}
        {/* <LineBetweenPointsHorizontal
          x2={90}
          top={265}
          left={615}
          Iscircle={true}
        />
        <LineBetweenPointsVertical y2={190} top={265} left={615 + 90 - 4} />
        <LineBetweenPointsHorizontal
          x2={160}
          top={265 + 190 - 4}
          left={615 + 90 - 4}
          Iscircle={false}
        /> */}
        {/* ////////////////Chest Line//////////////////////// */}
        {/* <LineBetweenPointsHorizontal
          x2={80}
          top={370}
          left={600}
          Iscircle={true}
        />
        <LineBetweenPointsVertical y2={150} top={370} left={600 + 80 - 4} />
        <LineBetweenPointsHorizontal
          x2={180}
          top={370 + 150 - 4}
          left={600 + 80 - 4}
          Iscircle={false}
        /> */}
        {/* ////////////////////Heart Problem//////////////////// */}
        {/* <LineBetweenPointsHorizontal
          x2={70}
          top={390}
          left={570}
          Iscircle={true}
        />
        <LineBetweenPointsVertical y2={200} top={390} left={570 + 70 - 4} />
        <LineBetweenPointsHorizontal
          x2={220}
          top={390 + 200 - 4}
          left={570 + 70 - 4}
          Iscircle={false}
        /> */}
        {/* //////////////////Knee Problem////////////////////////// */}
        {/* <LineBetweenPointsHorizontal
          x2={70}
          top={780}
          left={640}
          Iscircle={true}
        />
        <LineBetweenPointsVertical
          y2={120}
          top={780 - 120 + 4}
          left={640 + 70 - 4}
        />
        <LineBetweenPointsHorizontal
          x2={150}
          top={780 - 120 + 4}
          left={640 + 70 - 4}
          Iscircle={false}
        /> */}
        <div
          className={styles.container}
          style={{
            //  position: "absolute",
            top: 1,
          }}
        >
          <div className={styles.container_header}>
            <h4>Medical History</h4>
            {patient.ptype !== 21 && !isCustomerCare && (
              <div className={styles.edit}>
                {" "}
                <IconButton
                  aria-label="edit"
                  onClick={() => navigate(`edit/medicalHistory`)}
                >
                  <EditIcon />
                </IconButton>
              </div>
            )}
          </div>
          <div className={styles.container_top}>
            <div className={styles.container_top_item}>
              <h4>Given By:</h4>
              <p style={{ marginTop: "18px" }}>
                {medicalHistory?.givenName
                  ? medicalHistory?.givenName[0]?.toUpperCase() +
                    medicalHistory?.givenName?.slice(1)
                  : "NIL"}
              </p>
            </div>
            <div className={styles.container_top_item}>
              {" "}
              <h4>Relation:</h4>
              <p style={{ marginTop: "18px" }}>
                {medicalHistory?.givenRelation || "NIL"}
              </p>
            </div>
            <div className={styles.container_top_item}>
              {" "}
              <h4>Phone Number:</h4>
              <p style={{ marginTop: "18px" }}>
                {medicalHistory?.givenPhone || "NIL"}
              </p>
            </div>
          </div>
          <div className={styles.history_container}>
            <div className={styles.container_left}>
              <div className={styles.surgeries}>
                <div className={styles.surgeries_header}>
                  <img src={surgery} alt="" />

                  <h4> Any Surgeries/Known Conditions in the Past?</h4>
                </div>
                <div className={styles.surgeries_info}>
                  {medicalHistory?.disease.split(",").map((el) => (
                    <li>{el}</li>
                  ))}
                </div>
              </div>
              <div className={styles.allergies}>
                <div className={styles.allergies_header}>
                  <img src={sneeze} alt="" />
                  <h4> Any Known Allergies</h4>
                </div>
                <div className={styles.allergies_info}>
                  <p>Food</p>
                  {medicalHistory?.foodAllergy.split(",").map((el) => (
                    <li>{el}</li>
                  ))}
                  <p>Medicine</p>
                  {medicalHistory?.medicineAllergy.split(",").map((el) => (
                    <li>{el}</li>
                  ))}
                  {/* 
              <p>Anesthesia</p>
              <li>Diabetes</li>
              <li>Laparoscopic Surgery</li> */}
                </div>
              </div>
              <div className={styles.prescribed}>
                <div className={styles.prescribed_header}>
                  <img src={drugs3} alt="" />
                  <h4> Taking Any Prescribed Medicines</h4>
                </div>
                <div className={styles.prescribed_info}>
                  {medicalHistory?.meds.split(",").map((el) => (
                    <li>{el}</li>
                  ))}
                </div>
              </div>
              <div className={styles.infection}>
                <h3>Any Known Infections?</h3>
                <div className={styles.infection_container}>
                  <div className={styles.infection_box}>
                    <img src={hepatitisB} alt="" />
                    <h4>Hepatitis B</h4>
                    <h5>
                      {medicalHistory?.infections
                        .split(",")
                        .includes(infectionList[1])
                        ? "Yes"
                        : "No"}
                    </h5>
                  </div>
                  <div className={styles.infection_box}>
                    <img src={hepatitisC} alt="" />
                    <h4>Hepatitis C</h4>
                    <h5>
                      {medicalHistory?.infections
                        .split(",")
                        .includes(infectionList[2])
                        ? "Yes"
                        : "No"}
                    </h5>
                  </div>
                  <div className={styles.infection_box}>
                    <img src={hiv1} alt="" />
                    <h4>HIV</h4>
                    <h5>
                      {medicalHistory?.infections
                        .split(",")
                        .includes(infectionList[0])
                        ? "Yes"
                        : "No"}
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            {/* ////////////////////////Middle///////////////////////////////////// */}
            <div className={styles.container_center}>
              <div className={styles.blood}>
                <div className={styles.blood_group}>
                  <div className={styles.blood_icon}>
                    <img src={blood_icon} alt="" />
                  </div>
                  <h4 className={styles.blood_label}>
                    {medicalHistory?.bloodGroup}
                  </h4>
                  <h3>Blood group</h3>
                  {/* <h4>{medicalHistory?.bloodGroup}</h4> */}
                </div>
                <div className={styles.blood_pressure}>
                  <div className={styles.pressure_icon}>
                    <img src={blood_pressure_icon} alt="" />
                  </div>
                  <h4 className={styles.pressure_label}>
                    {medicalHistory?.bloodPressure}
                  </h4>
                  <h3>Blood Pressure</h3>
                  {/* <h4>{medicalHistory?.bloodPressure}</h4> */}
                </div>
              </div>
              <div className={styles.body_container}>
                <img src={body_figure} alt="" />
              </div>
              {patient.category !== 1 && (
                <div className={styles.addictions}>
                  <h3>Any Addictions?</h3>
                  <div className={styles.addictions_container}>
                    <div className={styles.addictions_box}>
                      <img src={tobbaco} alt="" />
                      <h4>Tobacco</h4>
                      <h5>
                        {medicalHistory?.drugs.split(",").includes("Tobbaco")
                          ? "Yes"
                          : "No"}
                      </h5>
                    </div>
                    <div className={styles.addictions_box}>
                      <img src={drugs} alt="" />
                      <h4>Drug</h4>
                      <h5>
                        {" "}
                        {medicalHistory?.drugs.split(",").includes("Drugs")
                          ? "Yes"
                          : "No"}
                      </h5>
                    </div>
                    <div className={styles.addictions_box}>
                      <img src={whiskey1} alt="" />
                      <h4>Alcohol</h4>
                      <h5>
                        {" "}
                        {medicalHistory?.drugs.split(",").includes("Alcohol")
                          ? "Yes"
                          : "No"}
                      </h5>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* ////////////////////////Right////////////////////////////////////// */}
            <div className={styles.container_right}>
              <div className={styles.drugs}>
                <div className={styles.drugs_header}>
                  <img src={surgery} alt="" />
                  <h4> Any Self Prescribed Drugs/Medicines? </h4>
                </div>
                <div className={styles.drugs_info}>
                  {medicalHistory?.selfMeds.split(",").map((el) => (
                    <li>{el}</li>
                  ))}
                </div>
              </div>
              <div className={styles.health}>
                <div className={styles.health_header}>
                  <h4>Other Health Conditions</h4>
                </div>
                <div className={styles.health_info}>
                  <li>
                    <img src={health1} alt="" />
                    <div className={styles.health_info_subheader}>
                      <p>Epilepsy or Neurological disorder?</p>
                      <p>{medicalHistory?.neurologicalDisorder}</p>
                    </div>
                  </li>
                  <li>
                    <img src={health2} alt="" />
                    <div className={styles.health_info_subheader}>
                      <p>Any Mental Health Problems?</p>
                      <p>{medicalHistory?.mentalHealth}</p>
                    </div>
                  </li>
                  <li>
                    <img src={health3} alt="" />
                    <div className={styles.health_info_subheader}>
                      <p>Chest</p>
                      <p>{medicalHistory?.chestCondition}</p>
                    </div>
                  </li>
                  <li>
                    <img src={health4} alt="" />
                    <div className={styles.health_info_subheader}>
                      <p>Heart</p>
                      <p>{medicalHistory?.heartProblems}</p>
                    </div>
                  </li>
                  <li>
                    <img src={health5} alt="" />
                    <div className={styles.health_info_subheader}>
                      <p>Any bone/Joint Disease?</p>
                      <p>No</p>
                    </div>
                  </li>
                </div>
              </div>

              <div className={styles.cancer_lumps}>
                <div className={styles.cancer}>
                  <h4>Been Through Cancer?</h4>
                  <img src={cancer} alt="" />
                  {medicalHistory?.cancer.split(", Date:")[0]}
                  {medicalHistory?.cancer.includes("Date:") && (
                  <span>
                    Date:{" "}
                    <span>
                      {(() => {
                        const dateString = medicalHistory?.cancer
                          .split(",")
                          .find((item) => item.includes("Date:"))
                          ?.replace("Date:", "")
                          .trim();

                        return dateString ? new Date(dateString).toDateString() : "Invalid Date";
                      })()}
                    </span>
                  </span>
                )}
                </div>
                <div className={styles.lumps}>
                  <h4>Lumps Found ?</h4>
                  <img src={lumps} alt="" />

                  {medicalHistory?.lumps.split(", Date:")[0]}
                  {medicalHistory?.lumps.includes("Date:") && (
                  <span>
                    Date:{" "}
                    <span>
                      {(() => {
                        const dateString = medicalHistory?.lumps
                          .split(",")
                          .find((item) => item.includes("Date:"))
                          ?.replace("Date:", "")
                          .trim();

                        return dateString ? new Date(dateString).toDateString() : "Invalid Date";
                      })()}
                    </span>
                  </span>
                )}
                </div>
                {patient.gender === 2 && (
                  <div className={styles.lumps}>
                    <h4>Pregnant?</h4>
                    <img src={pregnant_icon} alt="" />

                    {medicalHistory?.pregnant.split(", Date:")[0]}
                    {medicalHistory?.pregnant.includes("Date:") && (
                  <span>
                    Date:{" "}
                    <span>
                      {(() => {
                        const dateString = medicalHistory?.pregnant
                          .split(",")
                          .find((item) => item.includes("Date:"))
                          ?.replace("Date:", "")
                          .trim();

                        return dateString ? new Date(dateString).toDateString() : "Invalid Date";
                      })()}
                    </span>
                  </span>
                )}
                  </div>
                )}
              </div>
              <div className={styles.familymaincontainer}>
                <h3>Any Known Diseases In Family?</h3>
                <div className={styles.myfamilycontainer}>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <div>
                      <img src={father} alt="" />
                      <ul
                        style={{
                          padding: 0,
                          listStyleType: "none",
                          fontWeight: "600",
                        }}
                      >
                        <li>Father</li>
                        <li>
                          {medicalHistory?.hereditaryDisease
                            .split(",")
                            .includes(heriditaryList[0])
                            ? "Yes"
                            : "No"}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <img src={mother} alt="" />
                      <ul
                        style={{
                          padding: 0,
                          listStyleType: "none",
                          fontWeight: "600",
                        }}
                      >
                        <li>Mother</li>
                        <li>
                          {medicalHistory?.hereditaryDisease
                            .split(",")
                            .includes(heriditaryList[1])
                            ? "Yes"
                            : "No"}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <img src={sibling} alt="" />
                      <ul
                        style={{
                          padding: 0,
                          listStyleType: "none",
                          fontWeight: "600",
                        }}
                      >
                        <li>Siblings</li>
                        <li>
                          {medicalHistory?.hereditaryDisease
                            .split(",")
                            .includes(heriditaryList[2])
                            ? "Yes"
                            : "No"}
                        </li>
                      </ul>
                    </div>
                  </div>
                  {medicalHistory?.familyDisease && (
                    <span>
                      Disease Name:{" "}
                      <span>
                        {medicalHistory?.familyDisease}
                      </span>
                    </span>
                  )}

                {medicalHistory?.hereditaryDisease.includes("Date:") && (
                  <span>
                    Date:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {(() => {
                        const dateString = medicalHistory?.hereditaryDisease
                          .split(",")
                          .find((item) => item.includes("Date:"))
                          ?.replace("Date:", "")
                          .trim();

                        return dateString ? new Date(dateString).toDateString() : "Invalid Date";
                      })()}
                    </span>
                  </span>
                )}


                </div>
              </div>
            </div>
          </div>

          {/* <div className={styles.point_start + " " + styles.neuro_start}></div>
      <div className={styles.point_middle + " " + styles.neuro_middle}></div>
      <div className={styles.point_end + " " + styles.neuro_end}></div>
      <div className={styles.line} id="brain_line" ref={brainRef}></div> */}
        </div>
      </div>
    </>
  );
}

export default MedicalHistory;
