import { FormControl, Select, InputLabel,MenuItem } from "@mui/material";
import {SelectComponentProps} from "../../../../../interfaces/procedures"

const SelectComponent: React.FC<SelectComponentProps> = ({
    label,
    value,
    onChange,
    options,
    MenuProps,
    fullWidth = true,
    required = true,
    name
    
  }) => { 
    console.log(value, "value selected")
    return (
    <FormControl variant="outlined" fullWidth={fullWidth} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        name = {name}
        value={value}
        onChange={onChange}
        MenuProps={MenuProps}
        renderValue={(selectedValue) => {
          //Displaying  only the text when an option is selected and hiding the icon
          const selectedOption = options.find(
            (option) => option.procedureType === selectedValue
          );
          return selectedOption ? selectedOption.procedureType : selectedValue;
        }}
        sx={{
            borderRadius: "2px",
            "& .MuiSelect-icon": {
              color: "#1977F3",
            }, // Curving all sides of the dropdown
          }}
      >
        {options.map((option) => (
          <MenuItem key={option.procedureType} value={option.procedureType} 
          sx={{
            padding: "15px",
            borderBottom: "1px solid #B5B5B5",
            display:"flex", 
            justifyContent:"space-between",

            color:
              value === option.procedureType
                ? "white"
                : "inherit",

            "&:hover": {
              backgroundColor: "#1977F3",
              color: "white",
            },
            "&.Mui-selected": { // Target the selected state
        backgroundColor: "white", // Set the background to your desired color
        color: "#cccccc", // Set the color of the selected text to white
      },
          }}
          >
            {option.procedureType}

            <img src = {option.imgSrc} style ={{width:"25px", height:"25px"}} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}



  export default SelectComponent