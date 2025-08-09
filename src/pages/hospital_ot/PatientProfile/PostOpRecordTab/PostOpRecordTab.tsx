import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import DropdownBar from "../../../../component/DropdownBar/DropdownBar";
import styles from "./PostOpRecordTab.module.scss";
import PostOpRecordData from "./PostOpRecordData";
import usePostOPStore from "../../../../store/formStore/ot/usePostOPForm";
import { authPost } from "../../../../axios/useAuthPost";
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { useDispatch, useSelector } from "react-redux";
import { setError, setSuccess } from "../../../../store/error/error.action";
import { selectCurrPatient } from "../../../../store/currentPatient/currentPatient.selector";

import { authFetch } from "../../../../axios/useAuthFetch";

interface Medication {
  days: number;
  name: string;
  time: string;
  dosage: number;
  notify: boolean;
}

import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';



const PostOpRecordTab = () => {
  const { notes, setNotes, selectedType, medications ,tests, setTests, setPostMedications, setSelectedType} = usePostOPStore();
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const dispatch = useDispatch();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const saveHandler = async () => {
    
    const postopRecordData = {
      notes: notes,
      tests,
      medications: medications,
      selectedType: selectedType,
    };
    
  
    try {
      const response = await authPost(
        `ot/${user.hospitalID}/${currentPatient.patientTimeLineID}/postopRecord`,
        { postopRecordData: postopRecordData },
        user.token
      );
      if (response.status === 201) {
        dispatch(setSuccess("postofrecord form added "));
      } else {
        dispatch(setError("postofrecord form update Failed"));
      }
    } catch (err) {
      // console.log(err);
    }
  };
  const debouncedSaveHandler = debounce(saveHandler, DEBOUNCE_DELAY);


 

  const getData = async () => {
    try {
      const response = await authFetch(
        `ot/${user.hospitalID}/${currentPatient.patientTimeLineID}/postopRecord`,
        user.token
      );
     
      if (response && response.data) {
        // Prefill the data from the response
        const { notes, tests, medications, selectedType } = response?.data[0]?.postopRecord || {};
        
        setNotes(notes || "");
        setTests(tests || []);
      // Provide a valid type along with the medications
 
      Object.entries(medications || {}).forEach(([category, meds]) => {
        if (Array.isArray(meds)) {
          setPostMedications(category, meds as Medication[]); // Explicitly cast to Medication[]
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
      <div className={styles.container_dropdown}>
        {PostOpRecordData.map((item) => {
          return (
            <DropdownBar key={item.id} text={item.text} value={item.value} />
          );
        })}
        <TextField
          label="Notes"
          multiline
          rows={3}
          value={notes}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
      </div>
      <div className={styles.container_button}>
        <button className={styles.NextButton} onClick={debouncedSaveHandler}>
          Save
        </button>
      </div>
    </div>
  );
};

export default PostOpRecordTab;
