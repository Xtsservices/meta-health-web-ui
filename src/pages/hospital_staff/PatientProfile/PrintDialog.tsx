import React, { useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { makeStyles } from "@mui/styles";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import { Box, Typography } from "@mui/material";
import AmicoImg from "../../../assets/amico.png"
import { Attachment } from "../../../types";
import { downloadFile } from '../../../utility/reportsDownload';

type PropType = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  id: string;
  type:string;
  reportsData?: Attachment[];
  updateTheSelectedPrintOptions: (arrayData: string[], shouldPrint: boolean) => void;
};


const useStyles = makeStyles({
  dialogPaper: {
    width: "800px",
    minWidth: "800px",
    backgroundColor: "white",
    cursor: "pointer",
  },
  selectedButton: {
    backgroundColor: "black",
    color: "white",
  },
});

const PrintDialog: React.FC<PropType> = ({
  setOpen,
  open,
  updateTheSelectedPrintOptions,
  type,
  reportsData = [],
}) => {
  const classes = useStyles();
  const defaultOptions = type === "tests" 
    ? ["Radiology", "Pathology"] 
    : ["Symptoms", "Tests (Prescribed by Doctor)", "Vitals", "Treatments", "Medical History"];

    const options = type === "report" && reportsData.length > 0 
    ? reportsData.map(report => (report?.testName || report.test)).filter(Boolean) as string[] // Remove undefined values
    : defaultOptions;
  
  const [selected, setSelected] = useState<string[]>([]);
  const isAllSelected =
    options.length > 0 && selected.length === options.length;

    const handleClose = () => {
      setSelected([]); 
      updateTheSelectedPrintOptions([], false); 
      setTimeout(() => setOpen(false), 0);
    };

  const handleSelectAllClick = () => {
    setSelected(isAllSelected ? [] : options);
  };

  const handleIndividualSelect = (option: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    );
  };

async function handleSave() {
  updateTheSelectedPrintOptions(selected, true);
  
  if (type === "report") {
    for (const option of selected) {
      const matchingReports = reportsData.filter(report => 
        (report?.testName || report.test) === option
      );
      
      for (const report of matchingReports) {
        if (report?.fileURL && report?.fileName && report?.mimeType) {
          await downloadFile(report.fileURL, report.fileName, report.mimeType);
        }
      }
    }
    setSelected([]);
    updateTheSelectedPrintOptions([], false);
    setOpen(false);
  } else {
    setSelected([]);
    setOpen(false);
  }
}

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>Select Reports</DialogTitle>
        <DialogContent>
        {type === "report" && reportsData.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
              <Typography variant="h6" color="textSecondary">
                No Reports Available
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {/* Left: Checkbox List */}
              <Box>
                {type !== "tests" && type !== "report" && (
                  <MenuItem onClick={handleSelectAllClick} className={isAllSelected ? classes.selectedButton : ""}>
                    <ListItemIcon>
                      <Checkbox checked={isAllSelected} indeterminate={selected.length > 0 && selected.length < options.length} />
                    </ListItemIcon>
                    <ListItemText primary="Select All" />
                  </MenuItem>
                )}

                {options.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    onClick={() => handleIndividualSelect(option)}
                    className={selected.includes(option) ? classes.selectedButton : ""}
                  >
                    <ListItemIcon>
                      <Checkbox checked={selected.includes(option)} />
                    </ListItemIcon>
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Box>

              {/* Right: Single Image */}
              <Box component="img" src={AmicoImg} alt="icon" sx={{ width: 150, height: 150, mr: 8 }} />
            </Box>
          )}
          </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" sx={{borderRadius:"40px"}} onClick={handleSave}>Download</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PrintDialog;
