import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./AddPatient.module.scss";
import form_1_icon from "../../../../src/assets/addPatient/form_1_icon.gif";
import dummy_icon from "../../../../src/assets/addPatient/dummy_pic_icon.png";
import Form from "./Form";
import { Stack, Button, Grid } from "@mui/material";
import {  patientOPDbasicDetailType } from "../../../types";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { debounce, DEBOUNCE_DELAY } from '../../../utility/debounce';
import {
  setError,
  setLoading,
  setSuccess
} from "../../../store/error/error.action";
import { authPost } from "../../../axios/useAuthPost";

const AddPatientForm = ({ category }: { category: string }) => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const ptype = useParams();
  const image_ref = useRef<HTMLImageElement>(null);
  const label_ref = useRef<HTMLLabelElement>(null);
  const [profileFile, setProfileFile] = useState<File | null | undefined>(
    undefined
  );

  const initialFormState: patientOPDbasicDetailType = {
    hospitalID: {
      valid: true,
      value: user.hospitalID,
      showError: false,
      message: ""
    },
    pID: { valid: false, value: "", showError: false, message: "" },
    pUHID: { valid: true, value: null, showError: false, message: "" },
    ptype: {
      valid: true,
      value: Number(ptype?.ptype) || null,
      showError: false,
      message: ""
    },
    dob: { valid: true, value: "", showError: false, message: "" },
    gender: { valid: false, value: -1, showError: false, message: "" },
    age: {
      value: "",
      valid: false,
      showError: false,
      message: "",
    },
    weight: { valid: false, value: null, showError: false, message: "" },
    height: { valid: false, value: null, showError: false, message: "" },
    pName: { valid: false, value: "", showError: false, message: "" },
    phoneNumber: { valid: false, value: null, showError: false, message: "" },
    email: { valid: true, value: "", showError: false, message: "" },
    address: { valid: false, value: "", showError: false, message: "" },
    city: { valid: false, value: "", showError: false, message: "" },
    state: { valid: false, value: "", showError: false, message: "" },
    pinCode: { valid: false, value: "", showError: false, message: "" },
    referredBy: { valid: true, value: "", showError: false, message: "" },
    departmentID: {
      valid: false,
      value: undefined,
      showError: false,
      message: ""
    },
    department: {
      valid: false,
      value: "",
      showError: false,
      message: ""
    },
    userID: { valid: false, value: null, showError: false, message: "" },
    wardID: { valid: true, value: null, showError: false, message: "" },
    insurance: { valid: true, value: 0, showError: false, message: "" },
    insuranceNumber: { valid: true, value: "", showError: false, message: "" },
    insuranceCompany: { valid: true, value: "", showError: false, message: "" },
    discount: { valid: true, value: "", showError: false, message: "" },
    reason: { valid: true, value: "", showError: false, message: "" },
    id: { valid: true, value: "", showError: false, message: "" }
  };

  const [basicFormData, setBasicFormData] =
    useState<patientOPDbasicDetailType>(initialFormState);
console.log("basicFormData",basicFormData)
  const checkValid = useCallback((): boolean => {
    let isValid = true;
    setBasicFormData((prev) => {
      const updatedData = { ...prev };
      Object.keys(basicFormData).forEach((key) => {
        const fieldKey = key as keyof patientOPDbasicDetailType;
        if (!basicFormData[fieldKey].valid) {
          isValid = false;
          updatedData[fieldKey].showError = true;
        }
      });
      return updatedData;
    });
    return isValid;
  }, [basicFormData]);

  const handleFileUpload = useCallback((file: File | null) => {
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
  }, []);

  const handleProfileFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file: File | null = e.target.files?.[0] || null;
      setProfileFile(file);
      handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleBasicFormSubmit = async () => {
    if (!checkValid()) return;
    const patientBasicDetailform = new FormData();
    patientBasicDetailform.append("category", category);
    patientBasicDetailform.append("patientStartStatus", ptype?.ptype || "");
    patientBasicDetailform.append("addedBy", user.id.toString());
    patientBasicDetailform.append("photo", profileFile || "");

    Object.keys(basicFormData).forEach((key) => {
      const fieldKey = key as keyof patientOPDbasicDetailType;
      const fieldValue: any = basicFormData[fieldKey].value;
      if (
        basicFormData[fieldKey].valid &&
        fieldValue !== null &&
        fieldValue !== ""
      ) {
        patientBasicDetailform.append(fieldKey, fieldValue);
      }
    });
    try {
      dispatch(setLoading(true));
      const response = await authPost(
        `patient/${user.hospitalID}/patients`,
        patientBasicDetailform,
        user.token
      );
      dispatch(setLoading(false));

      if (response.message === "success") {
        dispatch(setSuccess("Patient data saved successfully."));
        navigate(
          `/hospital-dashboard/${location.pathname.split("/")[2]}/addpatient`
        );
      } else {
        dispatch(setError("Failed to save patient data."));
      }
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError("An error occurred while submitting the form."));
      console.error(error);
    }
  };
  const debouncedHandleSubmit = debounce(handleBasicFormSubmit, DEBOUNCE_DELAY);

  useEffect(() => {
    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const file: File | undefined | null =
        event.dataTransfer?.files[0] || null;
      setProfileFile(file);
      handleFileUpload(file);
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    label_ref.current?.addEventListener("dragover", handleDragOver);
    label_ref.current?.addEventListener("drop", handleDrop);

    return () => {
      label_ref.current?.removeEventListener("dragover", handleDragOver);
      label_ref.current?.removeEventListener("drop", handleDrop);
    };
  }, [handleFileUpload]);

  return (
    <div className={styles.container}>
      <div className={styles.container_left}>
        <div className={styles.container_stepper}>
          <h4>Patient Information</h4>
        </div>
        <div className={styles.container_form}>
          <div className={styles.image_container}>
            Upload Patient Image
            <input
              type="file"
              id="profile_pic"
              accept="image/*"
              className={styles.profile_pic}
              onChange={handleProfileFileChange}
            />
            <label
              htmlFor="profile_pic"
              className={styles.profile_pic_label}
              ref={label_ref}
            >
              {profileFile ? (
                <img
                  src=""
                  alt="Profile"
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  ref={image_ref}
                />
              ) : (
                <>
                  <img src={dummy_icon} alt="Dummy" />
                  <p>Drag & Drop</p>
                  <p>or Browse</p>
                </>
              )}
            </label>
          </div>

          <div className={styles.form_box}>
            <Form
              category={category}
              formData={basicFormData}
              setFormData={setBasicFormData}
            />
            <Grid item xs={12} sx={{ mt: "30px" }}>
              <Stack spacing={2} direction="row" justifyContent="flex-start">
                <Button
                  variant="contained"
                  onClick={debouncedHandleSubmit}
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
        <img src={form_1_icon} alt="Form Icon" />
      </div>
    </div>
  );
};

export default AddPatientForm;
