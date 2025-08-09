import React from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  TextField,
  Box,
} from '@mui/material';
import styles from './BreathingForm.module.scss';
import useAnesthesiaForm from '../../../../../../store/formStore/ot/useAnesthesiaForm';

interface BreathingFormProps {
  breathingSystemOptions: string[];
  filterOptions: string[];
  ventilationOptions: string[];
}

const BreathingForm: React.FC<BreathingFormProps> = ({
  breathingSystemOptions,
  filterOptions,
  ventilationOptions,
}) => {
  const { breathingForm, setBreathingForm } = useAnesthesiaForm();

  const handleSelectChange = (event: {
    target: { name: string; value: string | boolean };
  }) => {
    const { name, value } = event.target;
    setBreathingForm({ [name!]: value as string });
  };

  const handleTextFieldChange = (event: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = event.target;
    setBreathingForm({ [name]: value });
  };

  return (
    <Box className={styles.container}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" flexDirection="column" gap={2}>
          <FormControl fullWidth>
            <InputLabel id="breathing-system-label">
              Breathing System
            </InputLabel>
            <Select
              labelId="breathing-system-label"
              name="breathingSystem"
              value={breathingForm.breathingSystem}
              label="Breathing System"
              onChange={handleSelectChange}
            >
              {breathingSystemOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              name="filter"
              value={breathingForm.filter}
              label="Filter"
              onChange={handleSelectChange}
            >
              {filterOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="ventilation-label">Ventilation</InputLabel>
            <Select
              labelId="ventilation-label"
              name="ventilation"
              value={breathingForm.ventilation}
              label="Ventilation"
              onChange={handleSelectChange}
            >
              {ventilationOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" flexDirection="row" gap={2}>
          <TextField
            label="VT"
            fullWidth
            name="vt"
            value={breathingForm.vt}
            onChange={handleTextFieldChange}
          />
          <TextField
            label="RR"
            fullWidth
            name="rr"
            value={breathingForm.rr}
            onChange={handleTextFieldChange}
          />
        </Box>

        <Box display="flex" flexDirection="row" gap={2}>
          <TextField
            label="VM"
            fullWidth
            name="vm"
            value={breathingForm.vm}
            onChange={handleTextFieldChange}
          />
          <TextField
            label="Pressure"
            fullWidth
            name="pressure"
            value={breathingForm.pressure}
            onChange={handleTextFieldChange}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BreathingForm;
