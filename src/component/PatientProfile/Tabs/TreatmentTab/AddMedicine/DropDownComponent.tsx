import React from "react";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (event: SelectChangeEvent) => void;
}

const DropDownComponent: React.FC<DropdownProps> = ({ label, value, options, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        variant="outlined"
        label={label}
        value={value}
        onChange={onChange}
        fullWidth
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{fontSize:"14px"}}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropDownComponent;