import React, { useState, useRef } from "react";
import styles from "./PatientEdit.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import form_1_icon from "./../../../../src/assets/addPatient/form_1_icon.gif";
import dummy_icon from "./../../../../src/assets/addPatient/dummy_pic_icon.png";
import Form_start from "./Form/Form_start";
import { Stack, Button, Grid } from "@mui/material";
import { basicPatientSkeleton, patientbasicDetailType } from "../../../types";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { setError, setSuccess } from "../../../store/error/error.action";
import { setCurrPatient } from "../../../store/currentPatient/currentPatient.action";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { authFetch } from "../../../axios/useAuthFetch";
import { authPatch } from "../../../axios/usePatch";
import {
  selectCurrPatient,
  selectTimeline,
} from "../../../store/currentPatient/currentPatient.selector";
import UploadIcon from "@mui/icons-material/Upload";
import { patientCategory } from "../../../utility/role";

function PatientEdit() {
  const [step, setStep] = useState(0);
  const [disable, setDisable] = useState(false);
  const [profileFile, setProfileFile] = React.useState<File | undefined>();
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const timeline = useSelector(selectTimeline);
  const image_ref = useRef<HTMLImageElement>(null);
  const label_ref = useRef<HTMLLabelElement>(null);
  const { patientId } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();
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

  const getCurrentPatientAndTimeline = React.useCallback(async () => {
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/single/${patientId}`,
      user.token

    );
    console.log(response,"response_data")
    if (response.message == "success") {
      dispatch(setCurrPatient({ currentPatient: { ...response.patient } }));
    }
  }, [dispatch, patientId, user.hospitalID, user.token]);

  React.useEffect(() => {
    if (user.token) getCurrentPatientAndTimeline();
  }, [getCurrentPatientAndTimeline, patientId, user]);

  const [basicFormData, setBasicFormData] = useState<patientbasicDetailType>({
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

  React.useEffect(() => {
    const basicFormKey: Array<keyof patientbasicDetailType> = Object.keys(
      basicFormData
    ) as Array<keyof patientbasicDetailType>;
    basicFormKey.forEach((el: keyof patientbasicDetailType) => {
      setBasicObj((state) => {
        return { ...state, [el]: basicFormData[el].value };
      });
    });
    setBasicObj((state) => {
      state.ptype = Number(currentPatient.ptype);
      state.category = Number(currentPatient.category);
      state.hospitalID = Number(user.hospitalID);
      state.userID = user.id;
      state.patientStartStatus = Number(currentPatient.ptype);
      return { ...state };
    });
  }, [basicFormData, user.hospitalID, user.id]);

  const handleBasicFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step == 0) {
      setStep((el) => el);
    } else if (step < 3) {
      setStep((el) => el);
    }

    if (step == 0) {
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
      if (response.message == "success") {
        dispatch(setSuccess("Patient successfully updated"));
        navigate("../");
      } else {
        dispatch(setError(response.message));
        setDisable(false);
      }
    }
  };
  const debouncedHandleSubmit = debounce(handleBasicFormSubmit, DEBOUNCE_DELAY);

  React.useEffect(() => {
    label_ref.current?.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    label_ref.current?.addEventListener("drop", (event) => {
      event.preventDefault();

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

  const handleGoBack = () => {
    navigate(-1);
  };
  const getCategory = () => {
    return Object.keys(patientCategory).find(
      (key) =>
        patientCategory[key as keyof typeof patientCategory] ===
        Number(currentPatient?.category)
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.container_left}>
        <div className={styles.container_stepper}>
          <h4 style={{ visibility: "hidden" }}>Patient Information</h4>

          <h2>Edit Patient Profile</h2>
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
                    const result = e.target?.result as string | null;
                    if (result) {
                      image_ref.current?.setAttribute("src", result);
                    }
                  };

                  const file = e.target.files?.[0];
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
                category={getCategory() || ""}
                formData={basicFormData}
                setFormData={setBasicFormData}
              />
            ) : (
              ""
            )}

            <Grid item xs={12} sx={{ mt: "30px" }}>
              <Stack spacing={2} direction="row" justifyContent="flex-start">
                <Button
                  variant="contained"
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
                  Close
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
