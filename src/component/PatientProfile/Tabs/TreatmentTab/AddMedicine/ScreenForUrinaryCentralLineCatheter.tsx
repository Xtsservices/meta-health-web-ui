import React from "react";
import { ChecklistItemUrinaryCentralCatheter } from "../../../../../interfaces/procedures";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  DialogContent,
  TextField,
  // InputLabel,
  // Select,
  // MenuItem,
  // FormControl,
  // Box,
} from "@mui/material";
import checklist from "../../../../../assets/treatmentPlan/procedures/checklist/checklist.png";
import {
  proceduresOptions,
  dropdownOptions,
  dropdownOptionsCatheterInsertion,
} from "./constant";
import SelectComponent from "./SelectComponent";
import DropDownComponent from "./DropDownComponent";

type ChecklistComponentProps = {
  title: string;
  dailyChecklistItems: ChecklistItemUrinaryCentralCatheter[];
  procedureSpecificCheckList: ChecklistItemUrinaryCentralCatheter[];
  procedureSelected: string;
  onChangeProcedure: (event: any) => void;
  onCheckboxChange: (id: number) => void;
  MenuProps: Object;
  patientPreparation?: string;
  insertionSite?: string;
  lumenType?: string;
  localAnesthesiaGuidewireInsertion?: string;
  catheterSizes?: string;
  typesOfUrinaryCatheter?: string;
  patientPositioningAsepticSetup?: string;
  days?:Number,
  onDaysChange?: (value:number)=>void,
  onFieldChange?: (field: string, value: string) => void;
};

const ScreenForUrinaryCentralLineCatheter: React.FC<
  ChecklistComponentProps
> = ({
  title,
  dailyChecklistItems,
  procedureSpecificCheckList,
  procedureSelected,
  onChangeProcedure,
  onCheckboxChange,
  MenuProps,
  patientPreparation = "",
  insertionSite = "",
  lumenType = "",
  localAnesthesiaGuidewireInsertion = "",
  catheterSizes = "",
  typesOfUrinaryCatheter = "",
  patientPositioningAsepticSetup = "",
  days,
  onDaysChange = () => {},
  onFieldChange = () => {},
}) => {
  // const [patientPreparation, setPatientPreparation] = useState("");
  // const [insertionSite, setInsertionSite] = useState("");
  // const [lumenType, setLumenType] = useState("");
  // const [
  //   localAnesthesiaGuidewireInsertion,
  //   setLocalAnesthesiaGuidewireInsertion,
  // ] = useState("");
  // const [catheterSizes, setCatheterSizes] = useState("");
  // const [typesOfUrinaryCatheter, setTypesOfUrinaryCatheter] = useState("");
  // const [patientPositioningAsepticSetup, setPatientPositioningAsepticSetup] =
  //   useState("");


  return (
    <DialogContent
      sx={{ minHeight: "620px", minWidth: "800px", position: "relative" }}
    >
      <h3 style={{ textAlign: "center", fontWeight: "bold", fontSize: "25px" }}>
        {title}
      </h3>
      <Grid container display="flex" justifyContent="space-between">
        <Grid container spacing={1} xs={7}>
          <Grid item xs={8} marginTop="20px" marginLeft="0px">
            <SelectComponent
              label="Procedures Type"
              name="procedure"
              value={procedureSelected}
              onChange={onChangeProcedure}
              options={proceduresOptions}
              MenuProps={MenuProps}
            />
          </Grid>
          <Grid item xs={4} marginTop="20px">
            <TextField type="number" label="Days" 
            value={days}
            onChange={(e) => onDaysChange(Number(e.target.value))} // Update days state
            inputProps={{ min: 1 }} 
            
            fullWidth required />
          </Grid>
          <Grid item xs={12}>
            {/* rendering based on condition */}
            {title == "Central Line Insertion" ? (
              <DropDownComponent
                label="Patient Preparation Type"
                value={patientPreparation}
                options={dropdownOptions.patientPreparation}
                onChange={(e) => onFieldChange("patientPreparation", e.target.value)}
              />
            ) : (
              <DropDownComponent
                label="Catheter sizes"
                value={catheterSizes}
                options={dropdownOptionsCatheterInsertion.catheterSizes}
                onChange={(e) => onFieldChange("catheterSizes", e.target.value)}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            {title == "Central Line Insertion" ? (
              <DropDownComponent
                label="Insertion Site Type"
                value={insertionSite}
                options={dropdownOptions.insertionSite}
                onChange={(e) => onFieldChange("insertionSite",e.target.value)}
              />
            ) : (
              <DropDownComponent
                label="Types Of Urinary Catheters"
                value={typesOfUrinaryCatheter}
                options={
                  dropdownOptionsCatheterInsertion.typesOfUrinaryCatheter
                }
                onChange={(e) => onFieldChange("typesOfUrinaryCatheter",e.target.value)}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            {title == "Central Line Insertion" ? (
              <DropDownComponent
                label="Lumen Type"
                value={lumenType}
                options={dropdownOptions.lumenType}
                onChange={(e) => onFieldChange("lumenType",e.target.value)}
              />
            ) : (
              <DropDownComponent
                label="Patient Positioning & Aseptic Setup"
                value={patientPositioningAsepticSetup}
                options={
                  dropdownOptionsCatheterInsertion.patientPositioningAsepticSetup
                }
                onChange={(e) =>
                  onFieldChange("patientPositioningAsepticSetup", e.target.value)
                }
              />
            )}
          </Grid>
          <Grid item xs={12}>
            {title=="Central Line Insertion" && 
            <DropDownComponent
              label="Local Anesthesia & Guidewire Insertion Type"
              value={localAnesthesiaGuidewireInsertion}
              options={dropdownOptions.localAnesthesiaGuidewireInsertion}
              onChange={(e) =>
                onFieldChange("localAnesthesiaGuidewireInsertion", e.target.value)
              }
            />
}
          </Grid>
        </Grid>
        <Grid xs={5}>
          <img
            src={checklist}
            alt="checklist background"
            style={{
              width: "128px",
              position: "absolute",
              right: 80,
              top: 0,
              display: "flex",
              height: "120px",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          <div>
            <div
              style={{
                display: "flex",
                marginTop: "22px",
                background: title =="Central Line Insertion"? "#F38314": "#2BACCC",
                alignItems: "center",
                padding: "10px",
                marginLeft: "10px",
                paddingLeft: "22px",
              }}
            >
              <p
                style={{
                  color: "#ffffff",
                  fontSize: "12px",
                  flex: 1,
                  margin: 0,
                }}
              >
                Daily Maintenance Checklist
              </p>
            </div>
            <div
              style={{
                background: title =="Central Line Insertion"? "#FFF7EE": "#D2F5FE",
                marginLeft: "10px",
                maxHeight: "200px",
                overflowY: "scroll",
                scrollbarWidth: "thin",
                scrollbarColor: "#888 #F5F9FF",
              }}
            >
              {dailyChecklistItems.map((item) => (
                <FormControlLabel
                  key={item.id}
                  control={
                    <Checkbox
                      checked={item.checked}
                      onChange={() => onCheckboxChange(item.id)}
                    />
                  }
                  label={item.label}
                  labelPlacement="start"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "0.5px solid #918B8B",
                    width: "90%",
                    padding: "2px",
                    mb: 1,
                    "& .MuiFormControlLabel-label": { fontSize: "12px" },
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center", // Ensures vertical centering
                justifyContent: "space-between", // Ensures proper spacing
                marginTop: "20px",
                background: "#1977F3",
                padding: "8px",
                marginLeft: "10px",
                position: "relative",
              }}
            >
              <p
                style={{
                  color: "#ffffff",
                  fontSize: "12px",

                  flex: 1, // Allows centering within available space
                  margin: 0, // Removes default margin
                }}
              >
                Procedure-Specific Checklist
              </p>

              <span
                style={{
                  color: "#ffffff",
                  fontSize: "12px",
                  marginRight: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span style = {{fontWeight:"400", fontSize:"10px"}}>Date: {new Date().toLocaleDateString()}</span>
                <span style = {{fontWeight:"400", fontSize:"10px"}}>
                  Time:{" "}
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </span>
            </div>

            <div
              style={{
                background: "#F5F9FF",
                marginLeft: "10px",
                maxHeight: "200px",
                overflowY: "scroll",
                scrollbarWidth: "thin",
                scrollbarColor: "#888 #F5F9FF",
                position: "absolute",
                width: "38%",
                zIndex: 100,
              }}
            >
              {procedureSpecificCheckList.map((item) => (
                <FormControlLabel
                  key={item.id}
                  control={
                    <Checkbox
                      checked={item.checked}
                      onChange={() => onCheckboxChange(item.id)}
                    />
                  }
                  label={item.label}
                  labelPlacement="start"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "0.5px solid #918B8B",
                    width: "90%",
                    padding: "2px",
                    mb: 1,
                    "& .MuiFormControlLabel-label": { fontSize: "12px" },
                  }}
                />
              ))}
            </div>
          </div>
        </Grid>
      </Grid>
    </DialogContent>
  );
};

export default ScreenForUrinaryCentralLineCatheter;
