import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material';
import { Search, Notifications, NotificationsOff } from '@mui/icons-material';
import styles from './MedicationSelector.module.scss';
import usePreOpStore from '../../../../../../store/formStore/ot/usePreOPForm';

interface Medication {
  name: string;
  days: number;
  dosage: number;
  time: string;
  notify: boolean;
}

// * IF MAKING OPTIMIZATIONS - FOR REUSE
// type StoreType = {
//   selectedType: string;
//   medications: { [key: string]: Medication[] };
//   setSelectedType: (type: string) => void;
//   setMedications: (type: string, meds: Medication[]) => void;
// };

// type MedicationSelectorProps = {
//   store: UseBoundStore<StoreApi<StoreType>>;
// };

// const MedicationSelector = ({ store }: MedicationSelectorProps) => {

const MedicationSelector = () => {
  const { selectedType, setSelectedType, medications, setMedications } =
    usePreOpStore();

  const handleMenuClick = (type: string) => {
    setSelectedType(type);
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
    setMedications(selectedType, updatedMeds);
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
              {['capsules', 'syrups', 'tablets', 'injections', 'ivLine','Tubing','Topical','Drop','Spray'].map(
                (type) => (
                  <div
                    key={type}
                    className={`${styles.menuItem} ${
                      selectedType === type ? styles.active : ''
                    }`}
                    onClick={() => handleMenuClick(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
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
                  {medications[selectedType].map((med, index) => (
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
                        <TextField
                          select
                          variant="outlined"
                          size="small"
                          value={med.time}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              'time',
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value="Before BreakFast">
                            Before BreakFast
                          </MenuItem>
                          <MenuItem value="After BreakFast">
                            After BreakFast
                          </MenuItem>
                          <MenuItem value="Before Lunch">Before Lunch</MenuItem>
                          <MenuItem value="After Lunch">After Lunch</MenuItem>
                          <MenuItem value="Before Dinner">
                            Before Dinner
                          </MenuItem>
                          <MenuItem value="After Dinner">After Dinner</MenuItem>
                        </TextField>
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
              <Button
                variant="contained"
                color="primary"
                className={styles.saveButton}
              >
                Save
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MedicationSelector;
