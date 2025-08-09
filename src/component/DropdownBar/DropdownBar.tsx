import React, { useEffect } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './DropdownBar.module.scss';
import { useState } from 'react';
import Button from "@mui/material/Button";
import AddTestsDialog from '../PatientProfile/Tabs/TestsTab/AddTestDialog';
import Dialog from "@mui/material/Dialog";
import { testType } from "../../types";
import usePreOpStore from "../../store/formStore/ot/usePreOPForm";
import AddMedicine from "../PatientProfile/Tabs/TreatmentTab/AddMedicine/AddMedicine";
import { medicineCategory } from "../../utility/medicine";
import usePostOPStore from "../../store/formStore/ot/usePostOPForm";
import { useSelector } from "react-redux";
import { selectCurrPatient } from "../../store/currentPatient/currentPatient.selector";

interface DropdownBarProps {
  key: number;
  text: string;
  value: React.ReactNode;
  category?:string
 
}
  interface Medicine {
    medicineName: string;
    daysCount: number;
    doseCount: number;
    medicationTime: string;
    medicineType: number;
    id: string; // assuming `id` or another unique key exists
  }


const DropdownBar: React.FC<DropdownBarProps> = ({ text, value, category }) => {
  const [expanded, setExpanded] = useState(false);
  const onClick = () => {
    setExpanded(!expanded);
  };
 
  const setTestsInStore = usePreOpStore((state) => state.setTests);
  const setPostTestsInStore = usePostOPStore((state) => state.setTests);
  const [selectedList, setSelectedList] = React.useState<testType[]>([]);
  const [open, setOpen] = React.useState(false);
  const [addMedicine, setAddMedicine] = React.useState<boolean>(false);
  const [, setIsTimeline] = React.useState<boolean>(false);
  const [latestMedicine, setLatestMedicine] = useState<any>(null); // State to hold the latest medicine
  const { setMedications } = usePreOpStore();
  const { setPostMedications } = usePostOPStore();
  const currentPatient = useSelector(selectCurrPatient);

const handleLatestMedUpdate = (medicine: any) => {

  setLatestMedicine(medicine); // Updates the latestMedicine state


};

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (latestMedicine && latestMedicine.length > 0  && text === 'Pre-Medication') {
      latestMedicine.forEach((med:Medicine) => {
        const category = Object.keys(medicineCategory).find(
          (key) => medicineCategory[key as keyof typeof medicineCategory] === med.medicineType
        );
        
        if (category) {
          const medicationData = {
            name: med.medicineName,
            days: med.daysCount,
            dosage: med.doseCount,
            time: med.medicationTime,
            notify: false, // Set to false by default, you can change this as needed
          };
          
          const existingMedications = usePreOpStore.getState().medications[category] || [];
          setMedications(category, [...existingMedications, medicationData]);
          
        }
      });
    }
  }, [latestMedicine, setMedications]);


  useEffect(() => {
    if (latestMedicine && latestMedicine.length > 0 && text === 'Post-Medication') {
      latestMedicine.forEach((med:Medicine) => {
        const category = Object.keys(medicineCategory).find(
          (key) => medicineCategory[key as keyof typeof medicineCategory] === med.medicineType
        );
        
        if (category) {
          const medicationData = {
            name: med.medicineName,
            days: med.daysCount,
            dosage: med.doseCount,
            time: med.medicationTime,
            notify: false, // Set to false by default, you can change this as needed
          };
          
          // Update the store with the categorized medication
          const existingMedications = usePostOPStore.getState().medications[category] || [];
          setPostMedications(category, [...existingMedications, medicationData]);
          
          
          // setPostMedications(category, [...usePostOPStore.getState().medications[category], medicationData]);
        }


      });
    }
  }, [latestMedicine, setPostMedications]);

   // Update the  pre-op store when `selectedList` changes
   React.useEffect(() => {
    setTestsInStore(
      selectedList.map((item) => ({
        test: item.test,
        ICD_Code: item.loinc_num_,
      }))
    );
  }, [selectedList, setTestsInStore]);

   // Update the  post-op store when `selectedList` changes
  React.useEffect(() => {
    setPostTestsInStore(
      selectedList.map((item) => ({
        test: item.test,
        ICD_Code: item.loinc_num_,
      }))
    );
  }, [selectedList, setPostTestsInStore]);
 
  
 
  return (
    <div>
      <div className={styles.DropdownBar} onClick={onClick}>
        <p className="text-sm font-semibold ml-3">{text}</p>
        <KeyboardArrowDownIcon
          sx={{ color: 'black' }}
          className={expanded ? styles.DropdownArrow : ''}
        />
      </div>
      
      {expanded && (
        <div className={styles.DropdownContent}>
          {text === 'Tests' && 
  ((!category || (category === "preop" && currentPatient.status === "pending"))) &&(
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                marginLeft: 'auto',
                display: 'block',
                borderRadius:'16px',
                marginTop:'10px'
              }}
            
              onClick={handleClickOpen}
              className={styles.ActionButton}
            >
              Add Test
            </Button>
          )}
          {text === 'Pre-Medication' &&  currentPatient.status === 'pending' && (
            <Button
            variant="contained"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              marginLeft: 'auto',
              display: 'block',
               borderRadius:'16px',
                marginTop:'10px'
            }}
            onClick={() => setAddMedicine(true)}
              className={styles.ActionButton}
            >
              Add Medication
            </Button>
          )}

{text === 'Post-Medication' &&  (
            <Button
            variant="contained"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              marginLeft: 'auto',
              display: 'block',
               borderRadius:'16px',
                marginTop:'10px',
            }}
            onClick={() => setAddMedicine(true)}
              className={styles.ActionButton}
            >
              Add Medication
            </Button>
          )}  
        </div>
      )}
      <div>{expanded && value}</div>


      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiPaper-root": { minWidth: "600px" } }}
      >
        <AddTestsDialog
          open={open}
          setOpen={setOpen}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        />
      </Dialog>


      <AddMedicine
        setOpen={setAddMedicine}
        open={addMedicine}
        setIsTimeline={setIsTimeline}
        handleLatestMedUpdate={handleLatestMedUpdate}
      />
      
    </div>
  );
};
export default DropdownBar;
