import React from 'react';
import { MenuItem, FormControl, Select, InputLabel, Grid } from '@mui/material';
import styles from './AnesthesiaRecordForm.module.scss';
import useAnesthesiaForm from '../../../../../../store/formStore/ot/useAnesthesiaForm';

interface AnesthesiaRecordFormProps {
  airwayManagementOptions: string[];
  airwaySizeOptions: string[];
  laryngoscopyOptions: string[];
  vascularAccessOptions: string[];
}

const AnesthesiaRecordForm: React.FC<AnesthesiaRecordFormProps> = ({
  airwayManagementOptions,
  airwaySizeOptions,
  laryngoscopyOptions,
  vascularAccessOptions,
}) => {
  const { anesthesiaRecordForm, setAnesthesiaRecordForm } = useAnesthesiaForm();

  const handleSelectChange = (event: {
    target: { name: string; value: string | boolean };
  }) => {
    const { name, value } = event.target;
    setAnesthesiaRecordForm({ [name!]: value as string });
  };

  return (
    <div className={styles.container}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="airway-management-label">
              Airway Management
            </InputLabel>
            <Select
              labelId="airway-management-label"
              name="airwayManagement"
              value={anesthesiaRecordForm.airwayManagement}
              label="Airway Management"
              onChange={handleSelectChange}
            >
              {airwayManagementOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="vascular-access-label">Vascular Access</InputLabel>
            <Select
              labelId="vascular-access-label"
              name="vascularAccess"
              value={anesthesiaRecordForm.vascularAccess}
              label="Vascular Access"
              onChange={handleSelectChange}
            >
              {vascularAccessOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="airway-size-label">Airway Size</InputLabel>
            <Select
              labelId="airway-size-label"
              name="airwaySize"
              value={anesthesiaRecordForm.airwaySize}
              label="Airway Size"
              onChange={handleSelectChange}
            >
              {airwaySizeOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="laryngoscopy-label">Laryngoscopy</InputLabel>
            <Select
              labelId="laryngoscopy-label"
              name="laryngoscopy"
              value={anesthesiaRecordForm.laryngoscopy}
              label="Laryngoscopy"
              onChange={handleSelectChange}
            >
              {laryngoscopyOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default AnesthesiaRecordForm;
