import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "@mui/styles";
import discharge_gif from "./../../../../../src/assets/dischargePatient/discharge_summary_gif.gif";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
// import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// import search_icon from "./../../../../src/assets/sidebar/search_icon.png";

import InputLabel from "@mui/material/InputLabel";

import { authPost } from "../../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from '../../../../utility/debounce';
import { selectCurrentUser } from "../../../../store/user/user.selector";
import { useSelector } from "react-redux";
import { selectAllPatient } from "../../../../store/patient/patient.selector";
import { useDispatch } from "react-redux";
import { setAllPatient } from "../../../../store/patient/patient.action";
import { useNavigate } from "react-router-dom";
import { setError, setSuccess } from "../../../../store/error/error.action";
import { searchType } from "../../../../types";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
const useStyles = makeStyles({
  dialogPaper: {
    width: "900px",
    minWidth: "900px",
  },
});

type dischargeDialog = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number | null;
};
const dietList = ["Pinapple", "Miannoase"];
export default function DischargeDialog({
  open,
  setOpen,
  userId,
}: dischargeDialog) {
  //   const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const user = useSelector(selectCurrentUser);
  const allPatient = useSelector(selectAllPatient);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };
  const handleDischarge = async () => {
    // console.log({
    //   dischargeType: formData.dischargeType,
    //   advice: formData.advice,
    //   followUpDate: formData.followUpDate,
    //   followUp: formData.followUp,
    //   diet: diet.selectedList.join(","),
    // });
    if (!validateForm()) {
      return;
    }

    const response = await authPost(
      `patient/${user.hospitalID}/patients/discharge/${userId}`,
      {
        dischargeType: formData.dischargeType,
        advice: formData.advice,
        followUpDate: formData.followUpDate,
        followUp: formData.followUp,
        diet: diet.selectedList.join(","),
      },
      user.token
    );
    // console.log(response);
    if (response.message == "success") {
      const newPatientList = allPatient.filter(
        (patient) => patient.id != userId
      );
      dispatch(setAllPatient(newPatientList));
      dispatch(setSuccess("Patient successfully discharched"));
      setTimeout(() => {
        navigate("../../");
      }, 2000);
      handleClose();
    } else {
      dispatch(setError(response.message));
    }
  };
  const debouncedHandleDischarge = debounce(handleDischarge,DEBOUNCE_DELAY);

  const [diet, setDiet] = React.useState<searchType>({
    searchedList: [],
    selectedList: [],
    search: "",
    istrue: false,
  });

  React.useEffect(() => {
    if (!diet.search) {
      setDiet((prevvalue) => {
        return { ...prevvalue, searchedList: [...dietList] };
      });
    } else {
      setDiet((prevValue) => {
        return {
          ...prevValue,
          searchedList: [
            ...dietList.filter((el) =>
              el.toLowerCase().includes(diet.search.toLowerCase())
            ),
          ],
        };
      });
    }
  }, [diet.search]);
  const [formData, setFormData] = React.useState({
    dischargeType: 0,
    advice: "",
    followUp: 0,
    followUpDate: "",
    diagnosis: "",
    prescription: ""
  });

  const validateForm = (): boolean => {
    // Check dischargeType first
    if (!formData.dischargeType || formData.dischargeType === 0) {
      dispatch(setError("Please select a reason for Discharge"));
      return false;
    }

    

   

    // Check followUpDate if followUp is required
    if (formData.followUp === 1 && !formData.followUpDate.trim()) {
      dispatch(setError("Follow-up date is required."));
      return false;
    }

    

    // Check diagnosis
    if (!formData.diagnosis.trim()) {
      dispatch(setError("Final diagnosis is required."));
      return false;
    }

    return true; // If all validations pass
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle id="alert-dialog-title">Discharge Summary</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: "20px" }}>
            <Grid item container xs={9} spacing={3}>
              <Grid item xs={8}>
                {/* <Stack direction="column" sx={{ width: 0.48, mt: "1rem" }}> */}
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-helper-label">
                    Reason for Discharge
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label="Reason for Discharge"
                    name="reason"
                    value={String(formData.dischargeType)}
                    onChange={(event: SelectChangeEvent) => {
                      setFormData((data) => {
                        return {
                          ...data,
                          dischargeType: Number(event.target.value),
                        };
                      });
                    }}
                  >
                    <MenuItem value={1}>Discharge Success</MenuItem>
                    <MenuItem value={2}>DOPR</MenuItem>
                    <MenuItem value={3}>Absconded</MenuItem>
                    <MenuItem value={4}>left against medical advice</MenuItem>
                    <MenuItem value={5}>Death</MenuItem>
                  </Select>
                  {/* <FormHelperText>{formData.role.message}</FormHelperText> */}
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-required"
                  label="Date"
                  variant="outlined"
                  fullWidth
                  disabled
                  value={formatDate(new Date())}
                />
              </Grid>
               {formData.dischargeType == 1 && (
          <>
                 <Grid xs={12} item>
                {/* ///////////////////Food Allergy////////////////////////////// */}
                <Stack spacing={0} direction="column" rowGap={2}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    columnGap={12}
                  >
                    <h4
                      style={{ margin: "auto 0", transform: "translateY(50%)" }}
                    >
                      {" "}
                      Diet
                    </h4>
                  </Stack>

                 
                      <Stack direction={"column"}>
                        <Grid container xs={12}>
                          <Grid item xs={10}>
                            <Autocomplete
                              freeSolo // Allow the user to input a value that's not in the options list
                              value={diet.search}
                              onChange={(_, newValue: string | null) => {
                                setDiet((prev) => ({
                                  ...prev,
                                  search: newValue || ""
                                }));
                              }}
                              inputValue={diet.search || undefined}
                              onInputChange={(_, newInputValue) => {
                                setDiet((prev) => ({
                                  ...prev,
                                  search: newInputValue || ""
                                }));
                              }}
                              options={dietList}
                              renderInput={(params) => (
                                <TextField {...params} label="Diet" required />
                              )}
                            />
                          </Grid>
                          <Grid xs={2} item>
                            <IconButton
                              aria-label="delete"
                              size="large"
                              onClick={() => {
                                if (
                                  diet.search &&
                                  !diet.selectedList.includes(diet.search)
                                ) {
                                  setDiet((prev) => ({
                                    ...prev,
                                    selectedList: [
                                      ...prev.selectedList,
                                      diet.search
                                    ]
                                  }));
                                }
                                setDiet((prev) => ({
                                  ...prev,
                                  search: ""
                                }));
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ mt: "10px" }}
                              rowGap={2}
                              flexWrap={"wrap"}
                            >
                              {diet.selectedList.map((el) => {
                                return (
                                  <Chip
                                    label={el}
                                    onDelete={() => {
                                      setDiet((curr) => {
                                        return {
                                          ...curr,
                                          selectedList:
                                            curr.selectedList.filter(
                                              (val) => val != el
                                            )
                                        };
                                      });
                                    }}
                                  />
                                );
                              })}
                            </Stack>
                          </Grid>
                        </Grid>
                      </Stack>
                      {/* ////////////////////////Medicinal allergy End/////////////////////// */}
                     
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-required"
                      label="Advice on Discharge"
                      variant="outlined"
                      multiline
                      rows={3}
                      fullWidth
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setFormData((data) => {
                          return { ...data, advice: event.target.value };
                        });
                      }}
                      value={formData.advice}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-required"
                      label="Prescription"
                      variant="outlined"
                      multiline
                      rows={3}
                      fullWidth
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setFormData((data) => {
                          return { ...data, prescription: event.target.value };
                        });
                      }}
                      value={formData.prescription}
                    />
                  </Grid>
                </>
              )}

<Grid item xs={12}>
                <TextField
                  id="outlined-required"
                  label="Final Diagnosis"
                  variant="outlined"
                  multiline
                  rows={3}
                  fullWidth
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((data) => {
                      return { ...data, diagnosis: event.target.value };
                    });
                  }}
                  value={formData.diagnosis}
                />
              </Grid>

             {formData.dischargeType == 1 && (
              <>
               <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-helper-label">
                    Follow up required?
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label="Follow up required?"
                    name="reason"
                    onChange={(event: SelectChangeEvent) => {
                      setFormData((data) => {
                        return {
                          ...data,
                          followUp: Number(event.target.value),
                        };
                      });
                    }}
                    value={String(formData.followUp)}
                  >
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </Select>
                  {/* <FormHelperText>{formData.role.message}</FormHelperText> */}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  id="outlined-required"
                  label="Follow up Date"
                  variant="outlined"
                  fullWidth
                  disabled={formData.followUp ? false : true}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((data) => {
                      return { ...data, followUpDate: event.target.value };
                    });
                  }}
                  type="date"
                  value={formData.followUpDate}
                />
              </Grid>
              </>
              )}
              
              {/* <Item>xs=8</Item> */}
            </Grid>
            <Grid item container xs={3} height={1}>
              <Grid xs={12} height={1}>
                <img
                  src={discharge_gif}
                  alt=" "
                  style={{
                    margin: "o 1rem",
                    height: "15rem",
                    width: "13rem",
                    objectFit: "contain",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={debouncedHandleDischarge} autoFocus variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function formatDate(date: Date) {
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString(
    undefined,
    options as Intl.DateTimeFormatOptions
  );
  const formattedTime = date.toLocaleTimeString(
    undefined,
    options as Intl.DateTimeFormatOptions
  );

  return `${formattedDate}, ${formattedTime}`;
}
