import React from 'react';
import { Box, FormControlLabel, Checkbox } from '@mui/material';
import styles from './Monitors.module.scss';
import useAnesthesiaForm from '../../../../../../store/formStore/ot/useAnesthesiaForm';

const Monitors: React.FC = () => {
  const { monitors, setMonitors } = useAnesthesiaForm();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setMonitors({ [name]: checked });
  };

  return (
    <Box className={styles.Container}>
      <Box className={styles.Section}>
        <Box className={styles.checkboxGroup}>
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.spo2}
                onChange={handleCheckboxChange}
                name="spo2"
              />
            }
            label="SPO2"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.nbp}
                onChange={handleCheckboxChange}
                name="nbp"
              />
            }
            label="NBP"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.temp}
                onChange={handleCheckboxChange}
                name="temp"
              />
            }
            label="Temp"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.etco2}
                onChange={handleCheckboxChange}
                name="etco2"
              />
            }
            label="ETCO2"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.ventAlarm}
                onChange={handleCheckboxChange}
                name="ventAlarm"
              />
            }
            label="Vent Alarm"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.ibp}
                onChange={handleCheckboxChange}
                name="ibp"
              />
            }
            label="IBP"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.fio2}
                onChange={handleCheckboxChange}
                name="fio2"
              />
            }
            label="FIO2"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.anesAgent}
                onChange={handleCheckboxChange}
                name="anesAgent"
              />
            }
            label="Anes Agent"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.nerveStim}
                onChange={handleCheckboxChange}
                name="nerveStim"
              />
            }
            label="Nerve Stim"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.paw}
                onChange={handleCheckboxChange}
                name="paw"
              />
            }
            label="PAW"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.paCathCVP}
                onChange={handleCheckboxChange}
                name="paCathCVP"
              />
            }
            label="PA Cath/CVP"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.oesophPrecordSteth}
                onChange={handleCheckboxChange}
                name="oesophPrecordSteth"
              />
            }
            label="Oesoph/Precord Steth"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.ecg}
                onChange={handleCheckboxChange}
                name="ecg"
              />
            }
            label="ECG"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={monitors.hourlyUrine}
                onChange={handleCheckboxChange}
                name="hourlyUrine"
              />
            }
            label="Hourly Urine"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Monitors;
