import React, { ChangeEvent, useCallback, useEffect } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material";
import DropdownBar from "../../../../component/DropdownBar/DropdownBar";
import styles from "./PreOpRecordTab.module.scss";
import PreOpRecordData from "./PreOpRecordData";
import usePreOpStore from "../../../../store/formStore/ot/usePreOPForm";
import useOTConfig, {
  OTPatientStages,
  OTUserTypes,
} from "../../../../store/formStore/ot/useOTConfig";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { authPost } from "../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';
import { setError } from "../../../../store/error/error.action";
import { selectCurrPatient } from "../../../../store/currentPatient/currentPatient.selector";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { authFetch } from "../../../../axios/useAuthFetch";

type PreOpRecordTabProps = {
  incrementTab: () => void;
};

interface Medication {
  days: number;
  name: string;
  time: string;
  dosage: number;
  notify: boolean;
}


const PreOpRecordTab: React.FC<PreOpRecordTabProps> = ({ incrementTab }) => {
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const [rejectReason, setRejectReason] = React.useState<string>("");
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const {
    notes,
    tests,
    medications,
    arrangeBlood,
    riskConsent,
    setNotes,
    setArrangeBlood,
    setRiskConsent,
    setMedications,
    setTests,
    setSelectedType
  } = usePreOpStore();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = event.target;
    if (name === "arrangeBlood") {
      setArrangeBlood(checked);
    } else if (name === "riskConsent") {
      setRiskConsent(checked);
    }
  };

  const [isInitialTabsAPICallAllowed] = useOTConfig((state) => [
    state.isInitialTabsAPICallAllowed(),
  ]);

  const { patientStage, userType, preOpReadOnly } = useOTConfig();

  // ================reject dailog box==================
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitHandler = useCallback(
    (status: string) => {
      const preopRecordData = {
        notes,
        tests,
        medications,
        arrangeBlood,
        riskConsent,
      };
     

      if (status == "rejected" && rejectReason.length == 0) {
        return dispatch(setError("Please Enter reason"));
      }

      const postPreOpRecord = async () => {
        try {
          const response = await authPost(
            `ot/${user.hospitalID}/${currentPatient.patientTimeLineID}/${user.id}/preopRecord`,
            {
              preopRecordData: preopRecordData,
              status: status,
              rejectReason: rejectReason,
            },
            user.token
          );
          if (response.status === 201) {
            navigate("/hospital-dashboard/ot");
          } else {
            setError("PreOpRecord Failed");
          }
        } catch (err) {
          // console.log(err);
        }
      };
      if (isInitialTabsAPICallAllowed) {
        postPreOpRecord();
      }
    },
    [
      notes,
      tests,
      medications,
      arrangeBlood,
      riskConsent,
      isInitialTabsAPICallAllowed,
      rejectReason,
      user.hospitalID,
      user.id,
      user.token,
      currentPatient.patientTimeLineID,
      navigate,
    ]
  );
  const debouncedSaveHandler = debounce(submitHandler, DEBOUNCE_DELAY);

  const handleNext = () => {
    incrementTab();
  };

  const handleReasonData = (e: ChangeEvent<HTMLInputElement>) => {
    setRejectReason(e.target.value);
  };

 


 const getData = async () => {
  try {
    const response = await authFetch(
      `ot/${user.hospitalID}/${currentPatient.patientTimeLineID}/postopRecord`,
      user.token
    );
   
    if (response && response.data) {
      // Prefill the data from the response
      const { notes, tests, medications, selectedType } = response?.data[0]?.preopRecord || {};
      
      setNotes(notes || "");
      setTests(tests || []);
    // Provide a valid type along with the medications

    Object.entries(medications || {}).forEach(([category, meds]) => {
      if (Array.isArray(meds)) {
        setMedications(category, meds as Medication[]); // Explicitly cast to Medication[]
      } else {
        console.warn(`Invalid medications format for category: ${category}`, meds);
      }
    });

      //  setPostMedications(selectedType, medications || []);

      setSelectedType(selectedType || "");
    }
  } catch (err) {
    dispatch(setError("An error occurred while fetching post-op record data."));
  }
};

useEffect(() => {
  getData()
},[])
  return (
    <div className={styles.container}>
      <FormControl component="fieldset" disabled={preOpReadOnly}>
        <div>
          <p>Last Seen:</p>
          <Box className={styles.checkboxGroup}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={arrangeBlood}
                  onChange={handleCheckboxChange}
                  name="arrangeBlood"
                />
              }
              label="Arrange Blood"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={riskConsent}
                  onChange={handleCheckboxChange}
                  name="riskConsent"
                />
              }
              label="Written Informed Consent/High Risk Consent"
            />
          </Box>
        </div>
        <div className={styles.container_dropdown}>
          {PreOpRecordData.map((item) => (
            <DropdownBar key={item.id} text={item.text} value={item.value} category="preop"/>
          ))}
          <TextField
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={handleChange}
            variant="outlined"
            disabled={preOpReadOnly}
            fullWidth
          />
        </div>
      </FormControl>
      <div className={styles.container_button}>
        {patientStage === OTPatientStages.PENDING &&
          userType === OTUserTypes.ANESTHETIST && (
            <>
              <button className={styles.RejectButton} onClick={handleClickOpen}>
                Reject
              </button>
              <button
                className={styles.ApprovedButton}
                onClick={() => debouncedSaveHandler("approved")}
              >
                Approve
              </button>
            </>
          )}
        {patientStage === OTPatientStages.APPROVED &&
          userType === OTUserTypes.SURGEON && (
            <button className={styles.ApprovedButton} onClick={handleNext}>
              Next
            </button>
          )}
      </div>
      {/* ====================dailog box for reject============== */}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "50%", // Set the min width to 50% of the parent container
          },
        }}
      >
        <DialogTitle id="responsive-dialog-title">{"Reason?"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="textArea"
            label="Enter Reason"
            type="text"
            fullWidth
            multiline
            rows={4} // Adjust the number of rows as needed
            variant="outlined"
            value={rejectReason}
            onChange={handleReasonData}
          />
        </DialogContent>
        
        <DialogActions>
          <Button variant="contained" onClick={() => submitHandler("rejected")}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PreOpRecordTab;
