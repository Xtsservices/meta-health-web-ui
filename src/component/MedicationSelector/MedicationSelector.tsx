import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
 
  IconButton,
} from '@mui/material';
import { Search, Notifications, NotificationsOff } from '@mui/icons-material';
import styles from './MedicationSelector.module.scss';
import { StoreApi, UseBoundStore } from 'zustand';
import React from 'react';
import Capsule_icon_svg from '../../assets/reception/svgIcons/capsule_icon_svg';
import Syrups_svg from '../../assets/PatientProfile/syrups_svg';
import Tablet_svg from '../../assets/PatientProfile/tablet_svg';
import Injection_svg from '../../assets/PatientProfile/injection_svg';
import Tube_svg from '../../assets/PatientProfile/tube_svg';
import Topical_svg from '../../assets/PatientProfile/topical_svg';
import Drop_svg from '../../assets/PatientProfile/drops_sv';
import Spray_svg from '../../assets/PatientProfile/spray_svg';
import Frame_svg from '../../assets/PatientProfile/frame_svg';
import Ventilator_svg from "../../../src/assets/ventilator";

interface Medication {
  name: string;
  days: number;
  dosage: number;
  time: string;
  notify: boolean;
}

type StoreType = {
  selectedType: string;
  medications: { [key: string]: Medication[] };
  setSelectedType: (type: string) => void;
  setMedications: (type: string, meds: Medication[]) => void;
};

interface Test {
  test: string;
  ICD_Code: string;
}

interface PostOPFormState {
  tests: Test[];
  selectedType: string;
  medications: { [key: string]: Medication[] };
  notes: string;
  setTests: (tests: Test[]) => void;
  addTest: (newTest: Test) => void;
  setSelectedType: (type: string) => void;
  setPostMedications: (type: string, meds: Medication[]) => void;
  setNotes: (notes: string) => void;
  resetAll: () => void;
  
}

type MedicationSelectorProps = {
  // store: UseBoundStore<StoreApi<StoreType>>;
  store: UseBoundStore<StoreApi<StoreType>> | UseBoundStore<StoreApi<PostOPFormState>>;
  setMedications?: (type: string, meds: Medication[]) => void;
  setPostMedications?: (type: string, meds: Medication[]) => void;
};


const MedicationSelector = ({ store, setMedications, setPostMedications }: MedicationSelectorProps) => {
  const { selectedType, setSelectedType, medications } =
    store();

   

  const handleMenuClick = (type: string, index:number) => {
    setSelectedType(type);
    setTabIndex(index)
  };

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    const updatedMeds = medications[selectedType].map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    if (setMedications) {
      setMedications(selectedType, updatedMeds);
    } else if (setPostMedications) {
      setPostMedications(selectedType, updatedMeds);
    }
  };

  
type TabButtonProps = {
  index: number;
  // placeholder: string;
};
const [tabIndex, setTabIndex] = React.useState<number>(0);

  const TabButton: React.FC<TabButtonProps> = ({ index }) => {
    return (
      <button
        style={{
          background: `${index === tabIndex ? "#F90" : "#F0F0F0"}`,
          transition: "all 0.5s",
          border:"none",
        }}
        // onClick={() => setTabIndex(index)}
      >
        <div className={styles.button_icon}>
          {index === 0 && (
            <Capsule_icon_svg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 1 && (
            <Syrups_svg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 2 && (
            <Tablet_svg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 3 && (
            <Injection_svg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index === 5 && (
            <Tube_svg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
           {index === 6 && (
            <Topical_svg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
           {index === 7 && (
            <Drop_svg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
            {index === 8 && (
            <Spray_svg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 4 && (
            <Frame_svg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
          {index == 9 && (
            <Ventilator_svg
              fill={index === tabIndex ? "#FF9900" : "#8A8A8A"}
              rect={index === tabIndex ? "#FEE4BE" : "#DDD"}
            />
          )}
        </div>
      </button>
    );
  };


  return (
    <Container className={styles.medicationContainer}>
      <Typography variant="h5" gutterBottom>
        Select Medication
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Card className={styles.menuCard}>
            <CardContent>
              {['capsules', 'syrups', 'tablets', 'injections', 'ivLine','Tubing','Topical','Drop','Spray','Ventilator'].map(
                (type, index) => (
                  
                  <div
                    key={type}
                    className={`${styles.menuItem} ${
                      selectedType === type ? styles.active : ''
                    }`}
                    onClick={() => handleMenuClick(type,index)}
                  >
                     <TabButton key={index} index={index}  />
                     <span style={{padding:"10px"}}>
                     {type.charAt(0).toUpperCase() + type.slice(1)}
  </span>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Card>
            <CardContent>
              <div className={styles.header}>
                <Typography variant="h6">
                  {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                </Typography>
                <div className={styles.searchContainer}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search"
                    InputProps={{
                      endAdornment: (
                        <IconButton>
                          <Search />
                        </IconButton>
                      ),
                    }}
                  />
                </div>
              </div>
              <table className={styles.medicationTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>No. of days</th>
                    <th>Dosage</th>
                    <th>Time of Medication</th>
                    <th>Notify</th>
                  </tr>
                </thead>
                <tbody>
                  {medications[selectedType]?.map((med, index) => (
                    <tr key={index}>
                      <td>{med.name}</td>
                      <td>
                        <TextField
                          variant="outlined"
                          size="small"
                          type="number"
                          value={med.days}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              'days',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <TextField
                          variant="outlined"
                          size="small"
                          type="number"
                          value={med.dosage}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              'dosage',
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                       {med.time}
                      </td>
                      <td>
                        <IconButton
                          onClick={() =>
                            handleMedicationChange(index, 'notify', !med.notify)
                          }
                        >
                          {med.notify ? (
                            <Notifications />
                          ) : (
                            <NotificationsOff />
                          )}
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MedicationSelector;
