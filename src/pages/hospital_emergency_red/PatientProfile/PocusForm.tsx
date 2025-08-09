import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Typography,
  Button,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { useDispatch, useSelector } from "react-redux";
import { selectTimeline } from "../../../store/currentPatient/currentPatient.selector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { setSuccess } from "../../../store/error/error.action";
import { authFetch } from "../../../axios/useAuthFetch";

interface FormValues {
  rightPleuralEffusion: string;
  leftPleuralEffusion: string;
  rightPneumothorax: string;
  heart: string;
  abdomen: string;
  ivc: string;
  abg: string;
  ecg: string;
  cxr: string;
  leftPneumothorax: string;
}

interface PocusData {
  id: number;
  abdomen?: string;
  abg?: string;
  cxr?: string;
  ecg?: string;
  heart?: string;
  ivc?: string;
  leftPleuralEffusion?: string;
  leftPneumothorax?: string;
  rightPleuralEffusion?: string;
  rightPneumothorax?: string;
  patientTimeLineId?: number;
  userID?: number;
}

const PocusForm: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const timeline = useSelector(selectTimeline);
  const dispatch = useDispatch();
  const [pocusData, setPocusData] = useState<PocusData[]>([]);
  const isCustomerCare = location.pathname.includes("customerCare") || location.pathname.includes("admin");

  const [formValues, setFormValues] = useState<FormValues>({
    rightPleuralEffusion: "",
    leftPleuralEffusion: "",
    leftPneumothorax: "",
    rightPneumothorax: "",
    heart: "",
    abdomen: "",
    ivc: "",
    abg: "",
    ecg: "",
    cxr: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<FormValues>>({});
  const [showFields, setShowFields] = useState({
    pleuralEffusion: false,
    pneumothorax: false,
    heart: false,
    abdomen: false,
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setShowFields((prev) => ({ ...prev, [name]: checked }));

    if (!checked) {
      const updatedValues = { ...formValues };
      if (name === "pleuralEffusion") {
        updatedValues.rightPleuralEffusion = "";
        updatedValues.leftPleuralEffusion = "";
      }
      if (name === "pneumothorax") {
        updatedValues.rightPneumothorax = "";
        updatedValues.leftPneumothorax = "";
      }
      if (name === "heart") {
        updatedValues.heart = "";
      }
      if (name === "abdomen") {
        updatedValues.abdomen = "";
      }
      setFormValues(updatedValues);
    }
  };

  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | { name?: string; value: unknown; type: string }
      >
    ) => {
      const { name, value } = event.target;
      if (name) {
        const keyValuePairs = { [name]: value as string };
        setFormValues((data) => ({ ...data, ...keyValuePairs }));
      }
      if (name)
        setFormErrors((data) => ({
          ...data,
          [name]: !value ? "This field is required" : "",
        }));
    },
    [setFormErrors, setFormValues]
  );

  const handleSelectionChange = useCallback(
    (e: SelectChangeEvent) =>
      handleInputChange(
        e as React.ChangeEvent<
          HTMLInputElement | { name?: string; value: unknown; type: string }
        >
      ),
    [handleInputChange]
  );

  // const response = await authPost(
  //   `pocus/${user.hospitalID}/${timeline.id}`,
  //   {
  //     userID: user.id,
  //    formValues

  //   },
  //   user.token
  // );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch(
          `pocus/${user.hospitalID}/${timeline.id}`,
          user.token
        );
        if (response.message === "success") {
          setPocusData(response.pocus);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the async function
    fetchData();
  }, [user.hospitalID, timeline.id, user.token]); // Add dependencies here

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: Partial<FormValues> = {};

    // Validate form values
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key as keyof FormValues]) {
        errors[key as keyof FormValues] = "This field is required";
      }
    });

    // Remove fields from errors based on `showFields`
    if (!showFields.abdomen) delete errors.abdomen;
    if (!showFields.heart) delete errors.heart;
    if (!showFields.pneumothorax) {
      delete errors.leftPneumothorax;
      delete errors.rightPneumothorax;
    }
    if (!showFields.pleuralEffusion) {
      delete errors.leftPleuralEffusion;
      delete errors.rightPleuralEffusion;
    }

    setFormErrors(errors);

    // Submit the form if there are no errors
    if (Object.keys(errors).length === 0) {
      try {
        const response = await authPost(
          `pocus/${user.hospitalID}/${timeline.id}`,
          {
            userID: user.id,
            ...formValues,
          },
          user.token
        );

        if (response.message == "success") {
          dispatch(setSuccess("Pocus successfully added"));
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);

  return (
    <Container>
      {pocusData.length >= 1 && (
        <TableContainer
          component={Paper}
          sx={{ marginBottom: 2, marginTop: 5 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography fontWeight="bold">ID</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Abdomen</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">ABG</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">CXR</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">ECG</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Heart</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">IVC</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">
                    Left Pleural Effusion
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Left Pneumothorax</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">
                    Right Pleural Effusion
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Right Pneumothorax</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pocusData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.userID}</TableCell>
                  <TableCell>{row.abdomen}</TableCell>
                  <TableCell>{row.abg}</TableCell>
                  <TableCell>{row.cxr}</TableCell>
                  <TableCell>{row.ecg}</TableCell>
                  <TableCell>{row.heart}</TableCell>
                  <TableCell>{row.ivc}</TableCell>
                  <TableCell>{row.leftPleuralEffusion}</TableCell>
                  <TableCell>{row.leftPneumothorax}</TableCell>
                  <TableCell>{row.rightPleuralEffusion}</TableCell>
                  <TableCell>{row.rightPneumothorax}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Typography
        variant="h5"
        fontWeight={"bold"}
        marginTop={4}
        marginBottom={2}
        gutterBottom
      >
        POCUS
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          debouncedHandleSubmit(e);
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showFields.pleuralEffusion}
                  onChange={handleCheckboxChange}
                  name="pleuralEffusion"
                  disabled={isCustomerCare}
                />
              }
              label="Pleural Effusion"
            />
          </Grid>
          {showFields.pleuralEffusion && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.leftPleuralEffusion}>
                  <InputLabel id="left-plexal-effusion-label">
                    Left Pleural Effusion
                  </InputLabel>
                  <Select
                    labelId="left-plexal-effusion-label"
                    id="leftPleuralEffusion"
                    value={formValues.leftPleuralEffusion}
                    onChange={handleSelectionChange}
                    label="Left Pleural Effusion"
                    name="leftPleuralEffusion"
                    disabled={isCustomerCare}
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="indeterminate">Indeterminate</MenuItem>
                    <MenuItem value="free fluid in morrison's pouch">
                      Free fluid in Morrison's pouch
                    </MenuItem>{" "}
                    <MenuItem value="free fluid in perihepatic space">
                      Free fluid in Perihepatic space
                    </MenuItem>
                    <MenuItem value="free air">Free Air</MenuItem>
                  </Select>
                  {formErrors.leftPleuralEffusion && (
                    <FormHelperText>
                      {formErrors.leftPleuralEffusion}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={!!formErrors.rightPleuralEffusion}
                >
                  <InputLabel id="right-plexal-effusion-label">
                    Right Pleural Effusion
                  </InputLabel>
                  <Select
                    labelId="right-plexal-effusion-label"
                    id="rightPleuralEffusion"
                    value={formValues.rightPleuralEffusion}
                    onChange={handleSelectionChange}
                    label="Right Pleural Effusion"
                    name="rightPleuralEffusion"
                    disabled={isCustomerCare}
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="indeterminate">Indeterminate</MenuItem>
                    <MenuItem value="free fluid in morrison's pouch">
                      Free fluid in Morrison's pouch
                    </MenuItem>{" "}
                    <MenuItem value="free fluid in perihepatic space">
                      Free fluid in Perihepatic space
                    </MenuItem>
                    <MenuItem value="free air">Free Air</MenuItem>
                  </Select>
                  {formErrors.rightPleuralEffusion && (
                    <FormHelperText>
                      {formErrors.rightPleuralEffusion}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showFields.pneumothorax}
                  onChange={handleCheckboxChange}
                  name="pneumothorax"
                  disabled={isCustomerCare}
                />
              }
              label="Pneumothorax"
            />
          </Grid>

          {showFields.pneumothorax && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.leftPneumothorax}>
                  <InputLabel id="left-pneumothorax-label">
                    Left Pneumothorax
                  </InputLabel>
                  <Select
                    labelId="left-pneumothorax-label"
                    id="leftPneumothorax"
                    value={formValues.leftPneumothorax}
                    onChange={handleSelectionChange}
                    label="Left Pneumothorax"
                    name="leftPneumothorax"
                    disabled={isCustomerCare}
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="indeterminate">Indeterminate</MenuItem>
                    <MenuItem value="free fluid in morrison's pouch">
                      Free fluid in Morrison's pouch
                    </MenuItem>{" "}
                    <MenuItem value="free fluid in perihepatic space">
                      Free fluid in Perihepatic space
                    </MenuItem>
                    <MenuItem value="free air">Free Air</MenuItem>
                  </Select>
                  {formErrors.leftPneumothorax && (
                    <FormHelperText>
                      {formErrors.leftPneumothorax}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.rightPneumothorax}>
                  <InputLabel id="right-pneumothorax-label">
                    Right Pneumothorax
                  </InputLabel>
                  <Select
                    labelId="right-pneumothorax-label"
                    id="rightPneumothorax"
                    value={formValues.rightPneumothorax}
                    onChange={handleSelectionChange}
                    label="Right Pneumothorax"
                    name="rightPneumothorax"
                    disabled={isCustomerCare}
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="indeterminate">Indeterminate</MenuItem>
                    <MenuItem value="free fluid in morrison's pouch">
                      Free fluid in Morrison's pouch
                    </MenuItem>{" "}
                    <MenuItem value="free fluid in perihepatic space">
                      Free fluid in Perihepatic space
                    </MenuItem>
                    <MenuItem value="free air">Free Air</MenuItem>
                  </Select>
                  {formErrors.rightPneumothorax && (
                    <FormHelperText>
                      {formErrors.rightPneumothorax}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showFields.heart}
                  onChange={handleCheckboxChange}
                  name="heart"
                  disabled={isCustomerCare}
                />
              }
              label="Heart"
            />
          </Grid>

          {showFields.heart && (
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.heart}>
                <InputLabel id="heart-label">Heart</InputLabel>
                <Select
                  labelId="heart-label"
                  id="heart"
                  value={formValues.heart}
                  onChange={handleSelectionChange}
                  label="Heart"
                  name="heart"
                  disabled={isCustomerCare}
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="ejection fraction">
                    Ejection Fraction
                  </MenuItem>
                  <MenuItem value="abnormal wall motion">
                    Abnormal Wall Motion
                  </MenuItem>
                </Select>
                {formErrors.heart && (
                  <FormHelperText>{formErrors.heart}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showFields.abdomen}
                  onChange={handleCheckboxChange}
                  name="abdomen"
                  disabled={isCustomerCare}
                />
              }
              label="Abdomen"
            />
          </Grid>

          {showFields.abdomen && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="abdomen"
                name="abdomen"
                label="Abdomen"
                value={formValues.abdomen}
                onChange={handleInputChange}
                error={!!formErrors.abdomen}
                helperText={formErrors.abdomen}
                disabled={isCustomerCare}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography
              variant="h6"
              fontWeight={"bold"}
              marginTop={4}
              marginBottom={2}
              gutterBottom
            >
              Tests
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="ivc"
              name="ivc"
              label="IVC"
              value={formValues.ivc}
              onChange={handleInputChange}
              error={!!formErrors.ivc}
              helperText={formErrors.ivc}
              disabled={isCustomerCare}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="abg"
              name="abg"
              label="ABG"
              value={formValues.abg}
              onChange={handleInputChange}
              error={!!formErrors.abg}
              helperText={formErrors.abg}
              disabled={isCustomerCare}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="cxr"
              name="cxr"
              label="CXR"
              value={formValues.cxr}
              onChange={handleInputChange}
              error={!!formErrors.cxr}
              helperText={formErrors.cxr}
              disabled={isCustomerCare}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="ecg"
              name="ecg"
              label="ECG"
              value={formValues.ecg}
              onChange={handleInputChange}
              error={!!formErrors.ecg}
              helperText={formErrors.ecg}
              disabled={isCustomerCare}
            />
          </Grid>

          <Grid
            item
            xs={12}
            marginTop={2}
            display="flex"
            justifyContent="center"
          >
            {!isCustomerCare && <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{
                width: "auto",
                padding: "5px 16px",
                borderRadius: "16px",
              }} // Ensure width adjusts to content
            >
              Submit
            </Button>}
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default PocusForm;
