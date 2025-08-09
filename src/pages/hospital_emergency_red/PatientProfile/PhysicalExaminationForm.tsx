import React, { useState } from "react";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { selectCurrPatient } from "../../../store/currentPatient/currentPatient.selector";
import PhysicalExaminationCanvas from "./components/PhysicalExaminationCanvas";
import { Button, Grid, TextField } from "@mui/material";
import { setError, setSuccess } from "../../../store/error/error.action";

const INITIAL_STATE = {
  general: "",
  head: "",
  ent: "",
  neuroPsych: "", // Use 'neuroPsych' for clarity
  neckSpine: "",
  respiratory: "",
  cardiac: "",
  abdominal: "",
  pelvis: "",
  guRectal: "",
  musculoskeletal: "",
  skin: "",
};

const PhysicalExaminationForm = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const user = useSelector(selectCurrentUser);
  const currentPatient = useSelector(selectCurrPatient);
  const dispatch = useDispatch();
  const isCustomerCare = location.pathname.includes("customerCare") || location.pathname.includes("admin");


  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name: string; value: string; type: string }
    >
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const PhysicalExaminationFormRedZone = async () => {
    const response = await authPost(
      `ot/${user.hospitalID}/${currentPatient.patientTimeLineID}/redzone/physicalExamination`,
      { physicalExaminationData: formData },
      user.token
    );
    if (response.status === 201) {
      dispatch(setSuccess("Physical Examination "));
    } else {
      dispatch(setError("Physical Examination Failed"));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    PhysicalExaminationFormRedZone();
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);

  // Check if at least one formData value is filled
  const isSubmitEnabled = Object.values(formData).some(
    (value) => value.trim() !== ""
  );

  return (
    <>
      <PhysicalExaminationCanvas />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          debouncedHandleSubmit(e);
        }}
      >
        <Grid container spacing={2} marginTop={8}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="General"
              name="general"
              value={formData.general}
              onChange={handleChange}
              fullWidth
              disabled={isCustomerCare}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Head"
              name="head"
              value={formData.head}
              onChange={handleChange}
              fullWidth
              disabled={isCustomerCare}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ENT"
              name="ent"
              value={formData.ent}
              onChange={handleChange}
              fullWidth
              disabled={isCustomerCare}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Neuro/Psych"
              name="neuroPsych"
              value={formData.neuroPsych}
              onChange={handleChange}
              fullWidth
              disabled={isCustomerCare}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Neck/Spine"
              name="neckSpine"
              value={formData.neckSpine}
              onChange={handleChange}
              fullWidth
              disabled={isCustomerCare}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Respiratory"
              name="respiratory"
              value={formData.respiratory}
              onChange={handleChange}
              fullWidth
              disabled={isCustomerCare}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cardiac"
              name="cardiac"
              value={formData.cardiac}
              onChange={handleChange}
              fullWidth
              disabled={isCustomerCare}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Abdominal"
              name="abdominal"
              value={formData.abdominal}
              onChange={handleChange}
              fullWidth
              disabled={isCustomerCare}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Pelvis"
              name="pelvis"
              value={formData.pelvis}
              onChange={handleChange}
              fullWidth
              disabled={isCustomerCare}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="GU/Rectal"
              name="guRectal"
              value={formData.guRectal}
              onChange={handleChange}
              fullWidth
              disabled={isCustomerCare}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Musculoskeletal Survey"
              name="musculoskeletal"
              value={formData.musculoskeletal}
              onChange={handleChange}
              fullWidth
              disabled={isCustomerCare}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Skin"
              name="skin"
              value={formData.skin}
              onChange={handleChange}
              fullWidth
              disabled={isCustomerCare}
            />
          </Grid>
          <Grid item xs={12} sm={12} display={"flex"} justifyContent={"end"}>
            {!isCustomerCare && <Button
              variant="contained"
              type="submit"
              disabled={!isSubmitEnabled} // Disable button if no value is added
            >
              Submit
            </Button>}
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default PhysicalExaminationForm;
