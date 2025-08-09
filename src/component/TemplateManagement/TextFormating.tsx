import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {Add } from "@mui/icons-material";
import styles from "../../pages/hospital_pharmacy/PharmacySale/Sale.module.scss";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ButtonGroup from "@mui/material/ButtonGroup";
import Slider from "@mui/material/Slider";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TextFormatingProps {
  addText: () => void;
  addTable: () => void;
  addWatermark: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleTextChange: (
    property: keyof fabric.IText,
    value: string | number
  ) => void;
  rows: number;
  columns: number;
  watermarkOpacity: number;
  setRows: React.Dispatch<React.SetStateAction<number>>;
  setColumns: React.Dispatch<React.SetStateAction<number>>;
  setWatermarkOpacity: React.Dispatch<React.SetStateAction<number>>;
}

// Font family options
const fontFamilies = [
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Verdana", label: "Verdana" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Georgia", label: "Georgia" },
  { value: "Tahoma", label: "Tahoma" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Lucida Sans", label: "Lucida Sans" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "Impact", label: "Impact" },
  { value: "Palatino Linotype", label: "Palatino Linotype" },
  { value: "Garamond", label: "Garamond" },
  { value: "Segoe UI", label: "Segoe UI" },
  { value: "Roboto", label: "Roboto" },
];

// Font weight options
const fontWeights = [
  { value: "normal", label: "Normal" },
  { value: "bold", label: "Bold" },
  { value: "500", label: "Medium" },
];

export default function TextFormating({
  addText,
  addTable,
  handleUndo,
  handleRedo,
  addWatermark,
  handleTextChange,
  watermarkOpacity,
  setWatermarkOpacity,
  rows,
  columns,
  setRows,
  setColumns,
}: TextFormatingProps) {
  const [value, setValue] = React.useState(0);
  const [fontsize, setFontsize] = React.useState<number>(20);
  const [fontFamily, setFontFamily] = React.useState<string>("Arial"); // Default font family
  const [fontWeight, setFontWeight] = React.useState<string>("normal"); // Default font weight

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    console.log("even",event)
  };

  const handleFontSizeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    const numericValue = Number(value);

    if (!isNaN(numericValue)) {
      setFontsize(numericValue);
      handleTextChange("fontSize", numericValue);
    } else {
      setFontsize(20);
      handleTextChange("fontSize", 20);
    }
  };

  const handleFontFamilyChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const selectedFontFamily = event.target.value;
    setFontFamily(selectedFontFamily);
    handleTextChange("fontFamily", selectedFontFamily);
  };

  const handleFontWeightChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const selectedFontWeight = event.target.value;
    setFontWeight(selectedFontWeight);
    handleTextChange("fontWeight", selectedFontWeight);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Add Text" {...a11yProps(0)} />
          <Tab label="Font Styles" {...a11yProps(1)} />
          <Tab label="Add Table" {...a11yProps(2)} />
          <Tab label="Water Mark" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Button
          onClick={() => addText()}
          variant="outlined"
          startIcon={<AddCircleIcon sx={{ color: "#1977F3" }} />}
        >
          Add Text
        </Button>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            id="outlined-basic"
            label="Font Size"
            variant="outlined"
            value={fontsize}
            onChange={handleFontSizeChange}
            type="number"
            inputProps={{
              min: 1,
              max: 100,
            }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            id="outlined-select-font-family"
            select
            label="Font Family"
            value={fontFamily}
            onChange={handleFontFamilyChange}
            variant="outlined"
            sx={{ minWidth: 150 }}
          >
            {fontFamilies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="outlined-select-font-weight"
            select
            label="Font Weight"
            value={fontWeight}
            onChange={handleFontWeightChange}
            variant="outlined"
            sx={{ minWidth: 150 }}
          >
            {fontWeights.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            type="number"
            label="Rows"
            variant="outlined"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            inputProps={{ min: 1 }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            type="number"
            label="Columns"
            variant="outlined"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            inputProps={{ min: 1 }}
            sx={{ minWidth: 150 }}
          />
          <Button
            onClick={() => addTable()}
            variant="outlined"
            startIcon={<AddCircleIcon sx={{ color: "#1977F3" }} />}
          >
            Add Table
          </Button>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <div
          className={styles.upload}
          onClick={() => addWatermark()}
          style={{
            border: "2px dashed #9CA7B9",
            padding: "20px",
            margin: "10px",
            textAlign: "center",
            cursor: "pointer",
            height: "150px",
            borderRadius: "4px",
          }}
        >
          <label htmlFor="upload-input">
              <p style={{ fontSize: "15px" }}>Upload Watermark Image</p>
            <button
              style={{
                backgroundColor: "#F59706",
                padding: "3px",
                border: "none",
                cursor: "pointer",
                borderRadius: "4px",
            }}
            >
              <Add sx={{ color: "white" }} />
            </button>
          </label>
        </div>

        {/* Centered Label & Slider */}
        <Box sx={{ width: 300, margin: "auto", textAlign: "center" }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Watermark Opacity
          </p>
          <Slider
            size="small"
            min={0.1}
            max={3}
            step={0.1} // Allows finer control watermarkOpacity
            value={watermarkOpacity}
            onChange={(e, newValue) => {setWatermarkOpacity(newValue as number);console.log(e)}}
            aria-label="Watermark Opacity"
            valueLabelDisplay="auto"
          />
        </Box>
      </CustomTabPanel>

      <ButtonGroup
        disableElevation
        variant="contained"
        aria-label="Disabled button group"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button
          onClick={() => handleUndo()}
          startIcon={<UndoIcon sx={{ color: "#ffffff" }} />}
        >
          Undo
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleRedo()}
          endIcon={<RedoIcon sx={{ color: "#000000" }} />}
        >
          Redo
        </Button>
      </ButtonGroup>
    </Box>
  );
}
