import React, { useEffect, useState } from "react";
import styles from "./addNeonate.module.scss";
import form_1_icon from "../../../src/assets/addPatient/form_1_icon.gif";
import dummy_icon from "../../../src/assets/addPatient/dummy_pic_icon.png";
import Form_start from "./Form/Form_start";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { basicPatientSkeleton, patientbasicDetailType } from "../../types";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authPost } from "../../axios/useAuthPost";
import { selectCurrentUser } from "../../store/user/user.selector";
import { authFetch } from "../../axios/useAuthFetch";
import {
  setError,
  setLoading,
  setSuccess
} from "../../store/error/error.action";
import { patientCategory } from "../../utility/role";

function AddAdultEmergency() {
  const user = useSelector(selectCurrentUser);
  const { ptype } = useParams();
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
    insuranceCompany: ""
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [basicFormData, setBasicFormData] =
    React.useState<patientbasicDetailType>({
      hospitalID: {
        valid: true,
        value: null,
        showError: false,
        message: ""
      },
      pID: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      pUHID: {
        valid: true,
        value: null,
        showError: false,
        message: ""
      },
      ptype: {
        valid: true,
        value: null,
        showError: false,
        message: ""
      },
      dob: {
        valid: true,
        value: "",
        showError: false,
        message: ""
      },
      gender: {
        valid: false,
        value: -1,
        showError: false,
        message: ""
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
        message: ""
      },
      height: {
        valid: false,
        value: null,
        showError: false,
        message: ""
      },
      pName: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      phoneNumber: {
        valid: false,
        value: null,
        showError: false,
        message: ""
      },
      email: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      address: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      city: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      state: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      pinCode: {
        valid: false,
        value: "",
        showError: false,
        message: ""
      },
      referredBy: {
        valid: true,
        value: "",
        showError: false,
        message: ""
      },

      departmentID: {
        valid: false,
        value: undefined,
        showError: false,
        message: ""
      },
      userID: {
        valid: false,
        value: null,
        showError: false,
        message: ""
      },
      wardID: {
        valid: true,
        value: null,
        showError: false,
        message: ""
      },
      insurance: {
        valid: true,
        value: 0,
        showError: false,
        message: ""
      },
      insuranceNumber: {
        valid: true,
        value: "",
        showError: false,
        message: ""
      },
      insuranceCompany: {
        valid: true,
        value: "",
        showError: false,
        message: ""
      }
    });
console.log("basicFormData1",basicFormData)
  const checkValid = (): boolean => {
    let valid = true;
    const basicFormKeys: Array<keyof patientbasicDetailType> = Object.keys(
      basicFormData
    ) as Array<keyof patientbasicDetailType>;
    basicFormKeys.forEach((el: keyof patientbasicDetailType) => {
      if (!basicFormData[el].valid) {
        valid = false;
        setBasicFormData((prev) => {
          prev[el].showError = true;
          return { ...prev };
        });
      }
    });
    return valid;
  };

  const getAlreadyExistedData = async () => {
    const response = await authFetch(
      `patient/${user.hospitalID}/patients/checkRecord/${basicFormData.pID.value}`,
      user.token
    );
    if (response.message == "success") {
      if (response.status == 0) {
        dispatch(setError("Record already exist"));
        return setBasicFormData((prev) => {
          return {
            ...prev,
            pID: {
              ...prev.pID,
              showError: true,
              valid: true,
              message: "Patient with this id already exists"
            }
          };
        });
      }
    } else {
      return dispatch(setError("Something went wrong, please try again"));
    }
  };
  const createPostData = async () => {
    const basicFormKey: Array<keyof patientbasicDetailType> = Object.keys(
      basicFormData
    ) as Array<keyof patientbasicDetailType>;
    basicFormKey.forEach((el: keyof patientbasicDetailType) => {
      setBasicObj((state) => {
        return { ...state, [el]: basicFormData[el].value };
      });
    });
    setBasicObj((state) => {
      state.ptype = Number(ptype);
      state.category = patientCategory.adult;
      state.hospitalID = Number(user.hospitalID);
      state.patientStartStatus = Number(ptype);
      return { ...state };
    });
  };

  useEffect(() => {
    createPostData();
  }, [basicFormData]);

  const handleBasicFormSubmit = async () => {
    await getAlreadyExistedData();

    dispatch(setLoading(true));

    const patientBasicDetailform = new FormData();
    const basicFormSkeletonKeys: Array<keyof basicPatientSkeleton> =
      Object.keys(basicObj) as Array<keyof basicPatientSkeleton>;
    basicFormSkeletonKeys.forEach((el: keyof basicPatientSkeleton) => {
      if (basicObj[el])
        patientBasicDetailform.append(el, basicObj[el] as string | Blob);
    });
    if (profileFile) {
      patientBasicDetailform.append("photo", profileFile);
    }
    // Append the addedBy field
    patientBasicDetailform.append("addedBy", user.id.toString());
    try {
      const response = await authPost(
        `patient/${user.hospitalID}/patients`,
        patientBasicDetailform,
        user.token
      );
      if (response.message == "success") {
        dispatch(setSuccess("Patient successfully added"));
        navigate(
          `/hospital-dashboard/${location.pathname.split("/")[2]}/addpatient`
        );
      } else {
        dispatch(setError(response.message));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): T {
    let timeout: NodeJS.Timeout;
    return function (...args: Parameters<T>) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    } as T;
  }

  const debouncedHandleSubmit = debounce(handleBasicFormSubmit, 300);

  /////////////////////////Drapg and Drop///////////////////////
  /////////////////////////////////////////////////////////////
  const image_ref = React.useRef<HTMLImageElement>(null);
  const label_ref = React.useRef<HTMLLabelElement>(null);
  const [profileFile, setProfileFile] = React.useState<File | undefined>();
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

  return (
    <div className={styles.container}>
      <div className={styles.container_left}>
        <div className={styles.container_stepper}>
          <h4>Patient Information</h4>
        </div>
        <div className={styles.container_form}>
          {
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
                    const result = e.target?.result as string | null; // Add type assertion
                    if (result) {
                      image_ref.current?.setAttribute("src", result);
                    }
                  };
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
                {profileFile && (
                  <img
                    src=""
                    alt=""
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover"
                    }}
                    ref={image_ref}
                  />
                )}
                {!profileFile && (
                  <>
                    <img src={dummy_icon} alt="" />
                    <p>Drag & Drop</p>
                    <p>or Browse</p>
                  </>
                )}
              </label>
            </div>
          }

          <div className={styles.form_box}>
            {
              <Form_start
                category="adult"
                formData={basicFormData}
                setFormData={setBasicFormData}
              />
            }

            <Grid item xs={12} sx={{ mt: "30px" }}>
              <Stack spacing={2} direction="row" justifyContent="flex-start">
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!checkValid()) return;
                    debouncedHandleSubmit();
                  }}
                  sx={{ ml: "auto" }}
                >
                  Save
                </Button>
              </Stack>
            </Grid>
          </div>
        </div>
      </div>
      <div className={styles.container_right}>
        <img src={form_1_icon} alt="" />
      </div>
    </div>
  );
}

export default AddAdultEmergency;
