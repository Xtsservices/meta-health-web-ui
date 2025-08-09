import React, { useState } from "react";
import styles from "./PatientEdit.module.scss";
import form_1_icon from "./../../../../src/assets/addPatient/form_1_icon.gif";
// import HorizontalStepperWithError from "./Form/Stepper";
import dummy_icon from "./../../../../src/assets/addPatient/dummy_pic_icon.png";
import Form_start from "./Form/Form_start";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
// import Symptomps from "./Form/Symptomps";
// import MedicalHistory from "./Form/MedicalHistory";
// import AddReport from "./Form/AddReport";
import {
  basicPatientSkeleton,
  //   medicalHistoryFormType,
  patientbasicDetailType,
} from "../../../types";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
// import { authPost } from "../../../axios/useAuthPost";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../../../store/error/error.action";
// import { selectTimeline } from "../../../store/currentPatient/currentPatient.selector";
import { setCurrPatient } from "../../../store/currentPatient/currentPatient.action";
import { authFetch } from "../../../axios/useAuthFetch";
import { authPatch } from "../../../axios/usePatch";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import {
  selectCurrPatient,
  selectTimeline,
} from "../../../store/currentPatient/currentPatient.selector";
import UploadIcon from "@mui/icons-material/Upload";
// import { authFetch } from "../../../axios/useAuthFetch";
// import { authFetch } from "../../../axios/useAuthFetch";
// import { postAxios } from "../../../axios/usePost";
// import { authPost } from "../../../axios/useAuthPost";
function PatientEdit() {
  const [step, setStep] = React.useState(0);
  const user = useSelector(selectCurrentUser);
  const { patientId } = useParams();
  const [basicObj, setBasicObj] = useState<basicPatientSkeleton>({
    hospitalID: 0,
    pID: "",
    pUHID: 0,
    ptype: 0,
    dob: "",
    gender: "",
    age:"",
    weight: 0,
    height: 0,
    pName: "",
    phoneNumber: 0,
    email: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    referredBy: "",
    category: 0,
    userID: 0,
    patientStartStatus: 0,
    departmentID: undefined,
    wardID: 0,
    insurance: 0,
    insuranceNumber: "",
    insuranceCompany: "",
  });
  // const navigate = useNavigate();
  const [disable, setDisable] = useState(false);
  //   const [files, setFiles] = React.useState<File[] | undefined>([]);
  const dispatch = useDispatch();
  const currentPatient = useSelector(selectCurrPatient);
  const timeline = useSelector(selectTimeline);
  const navigate = useNavigate();
  //   const timeline = useSelector(selectTimeline);
  const getCurrentPatientAndTimeline = React.useCallback(async () => {
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/single/${patientId}`,
      user.token
    );
    // console.log("response of current patient by id", response);
    if (response.message == "success") {
      dispatch(setCurrPatient({ currentPatient: { ...response.patient } }));
    }
  }, [dispatch, patientId, user.hospitalID, user.token]);

  React.useEffect(() => {
    if (user.token) getCurrentPatientAndTimeline();
  }, [getCurrentPatientAndTimeline, patientId, user]);
  // console.log("files to test", files);
  const [basicFormData, setBasicFormData] =
    React.useState<patientbasicDetailType>({
      hospitalID: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },
      pID: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      pUHID: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },
      ptype: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },
      dob: {
        valid: true,
        value: "",
        showError: false,
        message: "",
      },
      gender: {
        valid: false,
        value: -1,
        showError: false,
        message: "",
      },
      age: {
        value: "",
        valid: true,
        showError: false,
        message: "",
      },
      weight: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },
      height: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },
      pName: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      phoneNumber: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },
      email: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      address: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      city: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      state: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      pinCode: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      referredBy: {
        valid: false,
        value: "",
        showError: false,
        message: "",
      },
      departmentID: {
        valid: false,
        value: undefined,
        showError: false,
        message: "",
      },
      userID: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },
      wardID: {
        valid: false,
        value: null,
        showError: false,
        message: "",
      },
      insurance: {
        valid: true,
        value: 0,
        showError: false,
        message: "",
      },
      insuranceNumber: {
        valid: true,
        value: "",
        showError: false,
        message: "",
      },
      insuranceCompany: {
        valid: true,
        value: "",
        showError: false,
        message: "",
      },
    });
  React.useEffect(() => {
    setBasicFormData({
      hospitalID: {
        valid: false,
        value: currentPatient.hospitalID,
        showError: false,
        message: "",
      },
      pID: {
        valid: false,
        value: currentPatient.pID,
        showError: false,
        message: "",
      },
      pUHID: {
        valid: true,
        value: currentPatient.pUHID,
        showError: false,
        message: "",
      },
      ptype: {
        valid: false,
        value: currentPatient.ptype,
        showError: false,
        message: "",
      },
      dob: {
        valid: true,
        value: currentPatient.dob?.split("T")[0] || null,
        showError: false,
        message: "",
      },
      gender: {
        valid: false,
        value: currentPatient.gender,
        showError: false,
        message: "",
      },
      age: {
        value: "",
        valid: true,
        showError: false,
        message: "",
      },
      weight: {
        valid: false,
        value: currentPatient.weight,
        showError: false,
        message: "",
      },
      height: {
        valid: false,
        value: currentPatient.height,
        showError: false,
        message: "",
      },
      pName: {
        valid: false,
        value: currentPatient.pName,
        showError: false,
        message: "",
      },
      phoneNumber: {
        valid: false,
        value: currentPatient.phoneNumber,
        showError: false,
        message: "",
      },
      email: {
        valid: true,
        value: currentPatient.email,
        showError: false,
        message: "",
      },
      address: {
        valid: false,
        value: currentPatient.address,
        showError: false,
        message: "",
      },
      city: {
        valid: false,
        value: currentPatient.city,
        showError: false,
        message: "",
      },
      state: {
        valid: false,
        value: currentPatient.state,
        showError: false,
        message: "",
      },
      pinCode: {
        valid: false,
        value: currentPatient.pinCode,
        showError: false,
        message: "",
      },
      referredBy: {
        valid: true,
        value: currentPatient.referredBy,
        showError: false,
        message: "",
      },
      departmentID: {
        valid: false,
        value: undefined,
        showError: false,
        message: "",
      },
      userID: {
        valid: false,
        value: timeline.userID,
        showError: false,
        message: "",
      },
      wardID: {
        valid: false,
        value: timeline.wardID,
        showError: false,
        message: "",
      },
      insurance: {
        valid: false,
        value: currentPatient.insurance || 0,
        showError: false,
        message: "",
      },
      insuranceNumber: {
        valid: currentPatient.insurance ? false : true,
        value: currentPatient.insuranceNumber,
        showError: false,
        message: "",
      },
      insuranceCompany: {
        valid: currentPatient.insurance ? false : true,
        value: currentPatient.insuranceCompany,
        showError: false,
        message: "",
      },
    });
  }, [currentPatient, timeline]);
  //   const [medicalHistoryData, setMedicalHistoryData] =
  //     React.useState<medicalHistoryFormType>({
  //       patientID: 0,
  //       userID: 0,
  //       givenName: "",
  //       givenPhone: "",
  //       givenRelation: "",
  //       bloodGroup: "",
  //       bloodPressure: "",
  //       disease: "",
  //       foodAllergy: "",
  //       medicineAllergy: "",
  //       anaesthesia: "",
  //       meds: "",
  //       selfMeds: "",
  //       chestCondition: "",
  //       neurologicalDisorder: "",
  //       heartProblems: "",
  //       infections: "",
  //       mentalHealth: "",
  //       drugs: "",
  //       pregnant: "",
  //       hereditaryDisease: "",
  //       lumps: "",
  //       cancer: "",
  //     });
  // let obj: any = {};
  React.useEffect(() => {
    // console.log("Current pID:", currentPatient.pID);
    const basicFormKey: Array<keyof patientbasicDetailType> = Object.keys(
      basicFormData
    ) as Array<keyof patientbasicDetailType>;
    basicFormKey.forEach((el: keyof patientbasicDetailType) => {
      // obj[el] = basicFormData[String(el)].value;
      setBasicObj((state) => {
        return { ...state, [el]: basicFormData[el].value };
      });
    });
    setBasicObj((state) => {
      state.ptype = 2;
      state.category = 1;
      state.hospitalID = Number(user.hospitalID);
      state.userID = user.id;
      state.patientStartStatus = 2;
      return { ...state };
    });
  }, [basicFormData, user.hospitalID, user.id]);
  // console.log("form data",FormData.ins)
  const handleBasicFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // let obj: patientbasicDetailType = {};
    e.preventDefault();
    // console.log("form submit");
    if (step == 0) {
      // const forms = new FormData();
      // Object.keys(obj).forEach((el) => {
      //   forms.append(el, obj[el]);
      // });
      // console.log(obj);
      setStep((el) => el);
      // console.log(basicObj, forms);
    } else if (step < 3) {
      setStep((el) => el);
    }
    // if (step == 2) {
    //   console.log(medicalHistoryData);
    // }
    if (step == 0) {
      // console.log("basic obj", basicObj);
      setDisable(true);

      const patientBasicDetailform = new FormData();
      const basicFormSkeletonKeys: Array<keyof basicPatientSkeleton> =
        Object.keys(basicObj) as Array<keyof basicPatientSkeleton>;
      basicFormSkeletonKeys.forEach((el: keyof basicPatientSkeleton) => {
        if (
          el !== "hospitalID" &&
          el != "pID" &&
          el != "userID" &&
          el != "patientStartStatus" &&
          el != "ptype" &&
          el !== "departmentID" &&
          el !== "wardID"
        )
          if (basicObj[el])
            patientBasicDetailform.append(el, basicObj[el] as string | Blob);
      });
      if (profileFile) {
        patientBasicDetailform.append("photo", profileFile);
      }
      const response = await authPatch(
        `patient/${user.hospitalID}/patients/single/${patientId}`,
        patientBasicDetailform,
        user.token
      );
      // console.log("patient registration response", response);
      if (response.message == "success") {
        dispatch(setSuccess("Patient successfully updated"));
        navigate(-1);
        // console.log("before response", medicalHistoryData);
        // setMedicalHistoryData((prev) => {
        //   return { ...prev, patientID: response.patient.pID };
        // });
      }
      //     const medicalResonse = await authPost(
      //       `history/${user.hospitalID}/patient/${response.patient.id}`,
      //       medicalHistoryData,
      //       user.token
      //     );
      //     // console.log("medical response", medicalResonse);
      //     if (medicalResonse.message == "success") {
      //       dispatch(setSuccess("Medical history successfully added"));
      //     } else {
      //       dispatch(setError(medicalResonse.message));
      //     }
      //     if (files?.length) {
      //       const responseTimeline = await authFetch(
      //         `patientTimeLine/${response.patient.id}`,
      //         user.token
      //       );
      //       const form = new FormData();
      //       files?.forEach((el) => {
      //         form.append("files", el);
      //       });
      //       if (responseTimeline.message == "success") {
      //         // console.log("file before upload", files);
      //         const reportResponse = await authPost(
      //           `attachment/${user.hospitalID}/${responseTimeline.patientTimeLine.id}/${responseTimeline.patientTimeLine.userID}`,
      //           form,
      //           user.token
      //         );
      //         // console.log("report response", reportResponse);
      //         if (reportResponse.message == "success") {
      //           dispatch(setSuccess("Report successfully added"));
      //           setTimeout(() => {
      //             navigate("/inpatient/list");
      //           }, 2000);
      //         } else {
      //           dispatch(setError("Unable to upload report"));
      //         }
      //       } else {
      //         dispatch(setError("Unable to upload report"));
      //       }
      //     }
      //   }
      else {
        dispatch(setError(response.message));
        setDisable(false);
      }
    }
    // handleClose();
  };
  const debouncedHandleSubmit = debounce(handleBasicFormSubmit, DEBOUNCE_DELAY);
  /////////////////////////Drapg and Drop///////////////////////
  /////////////////////////////////////////////////////////////
  const image_ref = React.useRef<HTMLImageElement>(null);
  const label_ref = React.useRef<HTMLLabelElement>(null);
  const [profileFile, setProfileFile] = React.useState<File | undefined>();
  React.useEffect(() => {
    label_ref.current?.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    // label_ref.current?.addEventListener("dragleave", (event) => {
    // });
    label_ref.current?.addEventListener("drop", (event) => {
      event.preventDefault();
      // event.stopPropagation();
      setProfileFile(event.dataTransfer?.files[0]);

      const file = event.dataTransfer?.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageData = reader.result as string | null;
          if (imageData) {
            image_ref.current?.setAttribute("src", imageData);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, [label_ref]);
  // console.log("forms", basicFormData.insurance);
  //   console.log("currentpatient", currentPatient.imageURL);

  const handleGoBack = () => {
    navigate(-1); // This will navigate to the previous path
  };

  return (
    <div className={styles.container}>
      <div className={styles.container_left}>
        <div className={styles.container_stepper}>
          <h4 style={{ visibility: "hidden" }}>Patient Information</h4>

          <h2>Edit Patient Profile</h2>
          {/* <HorizontalStepperWithError setStep={setStep} step={step} /> */}
        </div>
        <div className={styles.container_form}>
          {step == 0 && (
            <div className={styles.image_container}>
              Upload Patient Image
              <input
                type="file"
                id="profile_pic"
                accept="image/*"
                className={styles.profile_pic}
                onChange={(e) => {
                  const reader = new FileReader();
                  reader.onloadend = function (e) {
                    // console.log("reader", e.target);
                    const result = e.target?.result as string | null; // Add type assertion
                    if (result) {
                      image_ref.current?.setAttribute("src", result);
                    }
                  };
                  //   reader.readAsDataURL(e.target.files[0]);
                  const file = e.target.files?.[0]; // Use optional chaining to access the first file
                  setProfileFile(file);
                  if (file) {
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="profile_pic"
                className={styles.profile_pic_label}
                ref={label_ref}
              >
                {(profileFile || currentPatient.imageURL) && (
                  <img
                    src={currentPatient.imageURL}
                    alt=""
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                    ref={image_ref}
                  />
                )}
                {!profileFile && !currentPatient.imageURL && (
                  <>
                    <img src={dummy_icon} alt="" />
                    <p>Drag & Drop</p>
                    <p>or Browse</p>
                  </>
                )}
              </label>
              <label htmlFor="profile_pic">
                <UploadIcon sx={{ mr: "5px" }} color="primary" />
                Upload Image
              </label>
            </div>
          )}

          <form
            className={styles.form_box}
            onSubmit={(e) => {
              e.preventDefault();
              debouncedHandleSubmit(e);
            }}
          >
            {step == 0 ? (
              <Form_start
                category="neonate"
                formData={basicFormData}
                setFormData={setBasicFormData}
              />
            ) : (
              ""
            )}
            {/* {step == 1 && (
              <MedicalHistory
                medicalHistoryData={medicalHistoryData}
                setMedicalHistoryData={setMedicalHistoryData}
              />
            )} */}
            <Grid item xs={12} sx={{ mt: "30px" }}>
              <Stack spacing={2} direction="row" justifyContent="flex-start">
                {/* <Button
                  variant="text"
                  onClick={() => {
                    if (step > 0) setStep((prev) => prev - 1);
                  }}
                >
                  Back
                </Button> */}
                {/* {step < 3 && step !== 0}
                {
                  <Button
                    // variant="contained"
                    onClick={() => handleBasicFormSubmit()}
                    variant="outlined"
                    sx={{ borderRadius: "30px" }}
                    disabled={step == 0}
                  >
                    Skip
                  </Button>
                } */}
                <Button
                  variant="contained"
                  // onClick={() => handleBasicFormSubmit()}
                  disabled={disable}
                  sx={{ ml: "auto" }}
                  type="submit"
                >
                  {step == 0 ? "Save" : "save"}
                </Button>
                <Button
                  variant="contained"
                  sx={{ ml: "auto" }}
                  type="button"
                  onClick={handleGoBack}
                >
                  close
                </Button>
              </Stack>
            </Grid>
          </form>
        </div>
      </div>
      <div className={styles.container_right}>
        <img src={form_1_icon} alt="" />
      </div>
    </div>
  );
}

export default PatientEdit;
