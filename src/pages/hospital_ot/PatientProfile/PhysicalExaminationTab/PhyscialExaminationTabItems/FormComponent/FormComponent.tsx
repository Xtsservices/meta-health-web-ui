import React from "react";
import {
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  ButtonGroup,
  Button,
  FormLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import styles from "./Form.module.scss";
import usePhysicalExaminationForm from "../../../../../../store/formStore/ot/usePhysicalExaminationForm";
import useOTConfig from "../../../../../../store/formStore/ot/useOTConfig";

const FormComponent: React.FC = () => {
  const { mainFormFields, setMainFormFields } = usePhysicalExaminationForm();
  const isInitialTabsAPICallAllowed = useOTConfig((state) =>
    state.isInitialTabsAPICallAllowed()
  );
  const { physicalExaminationReadOnly } = useOTConfig();

  const handleCheckboxChange = (
    field: keyof typeof mainFormFields,
    value: boolean
  ) => {
    if (isInitialTabsAPICallAllowed) setMainFormFields({ [field]: value });
  };

  const handleButtonGroupChange = (
    field: keyof typeof mainFormFields,
    value: string
  ) => {
    if (isInitialTabsAPICallAllowed) setMainFormFields({ [field]: value });
  };

  const handleTextFieldInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMainFormFields({ [name]: value });
  };

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.formSection}>
        <Typography variant="body1">Airways</Typography>
        <FormGroup className={styles.airwayFieldset}>
          <FormControlLabel
            control={
              <Checkbox
                checked={mainFormFields.mp1}
                onChange={(e) => handleCheckboxChange("mp1", e.target.checked)}
              />
            }
            label="MP 1"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mainFormFields.mp2}
                onChange={(e) => handleCheckboxChange("mp2", e.target.checked)}
              />
            }
            label="MP 2"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mainFormFields.mp3}
                onChange={(e) => handleCheckboxChange("mp3", e.target.checked)}
              />
            }
            label="MP 3"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mainFormFields.mp4}
                onChange={(e) => handleCheckboxChange("mp4", e.target.checked)}
              />
            }
            label="MP 4"
          />
        </FormGroup>

        <Box className={styles.labelGroup}>
          <TextField
            label="TM Distance"
            variant="outlined"
            value={mainFormFields.tmDistance}
            disabled={physicalExaminationReadOnly}
            onChange={handleTextFieldInput}
            name="tmDistance"
          />

          <Box className={styles.buttonGroup}>
            <FormLabel>Mouth Opening:</FormLabel>
            <ButtonGroup>
              <Button
                variant={
                  mainFormFields.mouthOpening === "yes"
                    ? "contained"
                    : "outlined"
                }
                onClick={() => handleButtonGroupChange("mouthOpening", "yes")}
              >
                Yes
              </Button>
              <Button
                variant={
                  mainFormFields.mouthOpening === "no"
                    ? "contained"
                    : "outlined"
                }
                onClick={() => handleButtonGroupChange("mouthOpening", "no")}
              >
                No
              </Button>
            </ButtonGroup>
          </Box>

          <Box className={styles.buttonGroup}>
            <FormLabel>Neck Rotation:</FormLabel>
            <ButtonGroup>
              <Button
                variant={
                  mainFormFields.neckRotation === "full"
                    ? "contained"
                    : "outlined"
                }
                onClick={() => handleButtonGroupChange("neckRotation", "full")}
              >
                Full
              </Button>
              <Button
                variant={
                  mainFormFields.neckRotation === "limited"
                    ? "contained"
                    : "outlined"
                }
                onClick={() =>
                  handleButtonGroupChange("neckRotation", "limited")
                }
              >
                Limited
              </Button>
              <Button
                variant={
                  mainFormFields.neckRotation === "no"
                    ? "contained"
                    : "outlined"
                }
                onClick={() => handleButtonGroupChange("neckRotation", "no")}
              >
                No
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </Box>

      <Box className={styles.formSection}>
        <Box className={styles.checkboxGroup}>
          <FormControlLabel
            control={
              <Checkbox
                checked={mainFormFields.morbidObesity}
                onChange={(e) =>
                  handleCheckboxChange("morbidObesity", e.target.checked)
                }
              />
            }
            label="Morbid Obesity"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mainFormFields.difficultAirway}
                onChange={(e) =>
                  handleCheckboxChange("difficultAirway", e.target.checked)
                }
              />
            }
            label="H/O Difficult Airway"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mainFormFields.teethPoorRepair}
                onChange={(e) =>
                  handleCheckboxChange("teethPoorRepair", e.target.checked)
                }
              />
            }
            label="Teeth Poor Repair/Loose"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mainFormFields.micrognathia}
                onChange={(e) =>
                  handleCheckboxChange("micrognathia", e.target.checked)
                }
              />
            }
            label="Micrognathia"
          />
        </Box>
        <Box className={styles.checkboxGroup}>
          <FormControlLabel
            control={
              <Checkbox
                checked={mainFormFields.edentulous}
                onChange={(e) =>
                  handleCheckboxChange("edentulous", e.target.checked)
                }
              />
            }
            label="Edentulous"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mainFormFields.beard}
                onChange={(e) =>
                  handleCheckboxChange("beard", e.target.checked)
                }
              />
            }
            label="Beard"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mainFormFields.shortMuscularNeck}
                onChange={(e) =>
                  handleCheckboxChange("shortMuscularNeck", e.target.checked)
                }
              />
            }
            label="Short Muscular Neck"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mainFormFields.prominentIncisors}
                onChange={(e) =>
                  handleCheckboxChange("prominentIncisors", e.target.checked)
                }
              />
            }
            label="Prominent Incisors"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FormComponent;
