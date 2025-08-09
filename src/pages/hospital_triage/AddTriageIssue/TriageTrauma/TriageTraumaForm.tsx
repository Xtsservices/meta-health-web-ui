import styles from './TriageTraumaForm.module.scss';

import React, { useCallback, useContext, useEffect } from 'react';
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import TriageFormContext from '../contexts/TriageFormContext';
import { useNavigate } from 'react-router-dom';
import { TraumaErrorsType, TraumaFormType } from '../contexts/types';
import { useWebSocket } from '../contexts/WebSocketContext';
import { TriageLastKnownSequence } from '../contexts/contants';

const validateForm = (data: TraumaFormType) => {
  const errors = {
    traumaType: '',
    fractureRegion: '',
  } as TraumaErrorsType;
  if (data.traumaType === '') errors.traumaType = 'This field is required.';

  if (data.fracture && !data.fractureRegion)
    errors.fractureRegion = 'This field is required.';
  return errors;
};

const TriageTraumaForm: React.FC = () => {
  const { formData, setFormData } = useContext(TriageFormContext);

  const { trauma } = formData;
  const { trauma: errors } = formData.errors;
  const navigate = useNavigate();

  const back = () => navigate(-1);

  const {
    sendMessage,
    receivedMessage,
    isMessageConsumed,
    setIsMessageConsumed,
  } = useWebSocket();

  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | { name?: string; value: unknown; type: string }
      >
    ) => {
      const { name } = event.target;

      const errors = validateForm({
        ...formData.trauma,
        [name as string]: (event.target as HTMLInputElement).checked,
      });

      setFormData((prev) => ({
        ...prev,
        trauma: {
          ...prev.trauma,
          [name as string]: (event.target as HTMLInputElement).checked,
        },
        errors: {
          ...prev.errors,
          trauma: {
            ...errors,
          },
        },
      }));
    },
    [setFormData, formData]
  );

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent) => {
      const { name, value } = event.target;
      const errors = validateForm({
        ...formData.trauma,
        [name as string]: value,
      });

      setFormData((prev) => ({
        ...prev,
        trauma: {
          ...prev.trauma,
          [name as string]: value,
        },
        errors: {
          ...prev.errors,
          trauma: {
            ...errors,
          },
        },
      }));
    },
    [setFormData, formData.trauma]
  );

  const handleSubmit = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      let hasErrors = false;
      const errs = validateForm(formData.trauma);

      Object.keys(errs).forEach((k) => {
        if (errs[k as keyof TraumaErrorsType]) hasErrors = true;
      });

      if (hasErrors) {
        setFormData((p) => ({ ...p, errors: { ...p.errors, trauma: errs } }));
        return;
      }

      sendMessage({ type: 'Trauma', data: formData.trauma });
    },
    [formData.trauma, sendMessage, setFormData]
  );

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      let hasErrors = false;
      const errs = validateForm(formData.trauma);

      Object.keys(errs).forEach((k) => {
        if (errs[k as keyof TraumaErrorsType]) hasErrors = true;
      });

      if (hasErrors) {
        setFormData((p) => ({ ...p, errors: { ...p.errors, trauma: errs } }));
        return;
      }

      sendMessage({ type: 'Trauma', data: formData.trauma });
    },
    [formData.trauma, sendMessage, setFormData]
  );

  useEffect(() => {
    setFormData((p) => ({
      ...p,
      lastKnownSequence: TriageLastKnownSequence.TRAUMA,
    }));
  }, [setFormData]);

  useEffect(() => {
    if (receivedMessage !== null && !isMessageConsumed) {
      setIsMessageConsumed(true);
      const zone = receivedMessage.zone;
      if (zone) {
        setFormData((p) => ({ ...p, zone: zone }));
        navigate('./../zone-form');
      }
    }
  }, [
    isMessageConsumed,
    navigate,
    receivedMessage,
    setFormData,
    setIsMessageConsumed,
  ]);

  return (
    <div className={styles.container}>
      <h3>Trauma Form</h3>

      <form onSubmit={handleFormSubmit} className={styles.container_grids}>
        <div className={styles.gridTight}>
          <div className={styles.gridItem}>
            <FormControl fullWidth required>
              <InputLabel>Trauma Type</InputLabel>
              <Select
                label="Trauma Type"
                value={trauma.traumaType}
                onChange={handleSelectChange}
                name="traumaType"
                error={!!errors.traumaType}
              >
                <MenuItem value="gun shot">Gun-Shot</MenuItem>
                <MenuItem value="fall">Fall</MenuItem>
                <MenuItem value="chest">Chest</MenuItem>
                <MenuItem value="stab">Stab Wound</MenuItem>
                <MenuItem value="sexual assault">Sexual Assault</MenuItem>
                <MenuItem value="vehicle">Vehicle</MenuItem>
                <MenuItem value="major vascular injury">
                  Major Vascular Injury
                </MenuItem>
                <MenuItem value="multiple injuries">Multiple Injuries</MenuItem>
                <MenuItem value="significant assault">
                  Significant Assault
                </MenuItem>
              </Select>
              {errors.traumaType && (
                <FormHelperText error>{errors.traumaType}</FormHelperText>
              )}
            </FormControl>
          </div>

          {trauma.traumaType === 'stab' && (
            <div className={styles.gridItem}>
              <FormControl fullWidth required>
                <InputLabel>Stab Injury Severity</InputLabel>
                <Select
                  label="Stab Injury Severity"
                  value={trauma.stabInjurySeverity}
                  onChange={handleSelectChange}
                  name="stabInjurySeverity"
                >
                  <MenuItem value="superficial wound">
                    Superficial Wound
                  </MenuItem>
                  <MenuItem value="deep wound">Deep Wound</MenuItem>
                  <MenuItem value="penetrating wound">
                    Penetrating Wound
                  </MenuItem>
                  <MenuItem value="organ injury">Organ Injury</MenuItem>
                  <MenuItem value="major blood vessel injury">
                    Major Blood Vessel Injury
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          )}

          {trauma.traumaType === 'stab' && (
            <div className={styles.gridItem}>
              <FormControl fullWidth required>
                <InputLabel>Stab Injury Location</InputLabel>
                <Select
                  label="Stab Injury Location"
                  value={trauma.stabInjuryLocation}
                  onChange={handleSelectChange}
                  name="stabInjuryLocation"
                >
                  <MenuItem value="head">Head</MenuItem>
                  <MenuItem value="chest">Chest</MenuItem>
                  <MenuItem value="abdomen">Abdomen</MenuItem>
                  <MenuItem value="groin">Groin</MenuItem>
                  <MenuItem value="extremity">Extremity</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}

          {trauma.traumaType === 'chest' && (
            <div className={styles.gridItem}>
              <FormControl fullWidth required>
                <InputLabel>Chest Injury Type</InputLabel>
                <Select
                  label="Chest Injury Type"
                  value={trauma.chestInjuryType}
                  onChange={handleSelectChange}
                  name="chestInjuryType"
                >
                  <MenuItem value="surgical emphysema">
                    Surgical Emphysema
                  </MenuItem>
                  <MenuItem value="rib fracture">Rib Fracture</MenuItem>
                  <MenuItem value="seat belt fracture">
                    Seat Belt Fracture
                  </MenuItem>
                  <MenuItem value="lung puncture">Lung Puncture</MenuItem>
                  <MenuItem value="internal bleeding">
                    Internal Bleeding
                  </MenuItem>
                  <MenuItem value="pneumothorax">Pneumothorax</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}

          {trauma.traumaType === 'fall' && (
            <div className={styles.gridItem}>
              <FormControl fullWidth required>
                <InputLabel>Fall Height</InputLabel>
                <Select
                  label="Fall Height"
                  value={trauma.fallHeight}
                  onChange={handleSelectChange}
                  name="fallHeight"
                  error={!!errors.fallHeight}
                >
                  <MenuItem value="fall more than 3 times height">
                    &gt; 3 times height of person
                  </MenuItem>
                  <MenuItem value="fall more than 5 stairs">
                    &gt; 5 stairs
                  </MenuItem>
                  <MenuItem value="fall less than 3 times height">
                    &lt; 3 times height of person
                  </MenuItem>
                  <MenuItem value="fall less than 5 stairs">
                    &lt; 5 stairs
                  </MenuItem>
                </Select>
                {errors.fallHeight && (
                  <FormHelperText error>{errors.fallHeight}</FormHelperText>
                )}
              </FormControl>
            </div>
          )}
        </div>

        {trauma.traumaType === 'stab' &&
          trauma.stabInjuryLocation === 'head' && (
            <>
              <div className={styles.flex} style={{ marginBottom: '1rem' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabHeadFace}
                      onChange={handleInputChange}
                      name="stabHeadFace"
                    />
                  }
                  label="Face"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabHeadNeck}
                      onChange={handleInputChange}
                      name="stabHeadNeck"
                    />
                  }
                  label="Neck"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabHeadScalp}
                      onChange={handleInputChange}
                      name="stabHeadScalp"
                    />
                  }
                  label="Scalp"
                />
              </div>
            </>
          )}

        {trauma.traumaType === 'stab' &&
          trauma.stabInjuryLocation === 'chest' && (
            <>
              <div className={styles.flex} style={{ marginBottom: '1rem' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabChestHeart}
                      onChange={handleInputChange}
                      name="stabChestHeart"
                    />
                  }
                  label="Heart"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabChestLungs}
                      onChange={handleInputChange}
                      name="stabChestLungs"
                    />
                  }
                  label="Lungs"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabChestMajorBloodVessels}
                      onChange={handleInputChange}
                      name="stabChestMajorBloodVessels"
                    />
                  }
                  label="Major Blood Vessels"
                />
              </div>
            </>
          )}

        {trauma.traumaType === 'stab' &&
          trauma.stabInjuryLocation === 'abdomen' && (
            <>
              <div className={styles.flex} style={{ marginBottom: '1rem' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabAbdomenIntestines}
                      onChange={handleInputChange}
                      name="stabAbdomenIntestines"
                    />
                  }
                  label="Intestines"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabAbdomenKidneys}
                      onChange={handleInputChange}
                      name="stabAbdomenKidneys"
                    />
                  }
                  label="Kidneys"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabAbdomenLiver}
                      onChange={handleInputChange}
                      name="stabAbdomenLiver"
                    />
                  }
                  label="Liver"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabAbdomenSpleen}
                      onChange={handleInputChange}
                      name="stabAbdomenSpleen"
                    />
                  }
                  label="Spleen"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabAbdomenStomach}
                      onChange={handleInputChange}
                      name="stabAbdomenStomach"
                    />
                  }
                  label="Stomach"
                />
              </div>
            </>
          )}

        {trauma.traumaType === 'stab' &&
          trauma.stabInjuryLocation === 'extremity' && (
            <>
              <div className={styles.flex} style={{ marginBottom: '1rem' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabExtremityArm}
                      onChange={handleInputChange}
                      name="stabExtremityArm"
                    />
                  }
                  label="Arm"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabExtremityBloodVessels}
                      onChange={handleInputChange}
                      name="stabExtremityBloodVessels"
                    />
                  }
                  label="Blood Vessels"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabExtremityLeg}
                      onChange={handleInputChange}
                      name="stabExtremityLeg"
                    />
                  }
                  label="Leg"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabExtremityMuscles}
                      onChange={handleInputChange}
                      name="stabExtremityMuscles"
                    />
                  }
                  label="Muscles"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabExtremityNerves}
                      onChange={handleInputChange}
                      name="stabExtremityNerves"
                    />
                  }
                  label="Nerves"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={trauma.stabExtremityTendons}
                      onChange={handleInputChange}
                      name="stabExtremityTendons"
                    />
                  }
                  label="Tendons"
                />
              </div>
            </>
          )}

        <div className={styles.grid}>
          <div className={styles.gridItem}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={trauma.fracture}
                  onChange={handleInputChange}
                  name="fracture"
                />
              }
              label="Fracture"
            />
          </div>
          <div className={styles.gridItem}>
            {trauma.fracture && (
              <FormControl variant="outlined" fullWidth required>
                <InputLabel id="fractureRegion">Region</InputLabel>
                <Select
                  label="Region"
                  value={trauma.fractureRegion}
                  onChange={handleSelectChange}
                  name="fractureRegion"
                  error={!!errors.fractureRegion}
                >
                  <MenuItem value="pelvic">Pelvic Fracture</MenuItem>
                  <MenuItem value="multiple">Multiple Fractures</MenuItem>
                  <MenuItem value="open hand and feet">
                    Open Fractures of Hand & Feet
                  </MenuItem>
                  <MenuItem value="open fractures excluding hand and feet">
                    Open Fractures excluding of hand and feet
                  </MenuItem>
                  <MenuItem value="closed hand and feet">
                    Closed Fractures of Hand & Feet
                  </MenuItem>
                  <MenuItem value="isolated long bone fracture">
                    Isolated Long Bone Fracture
                  </MenuItem>
                  <MenuItem value="isolated small bones of hand and feet">
                    Isolated Small Bones of Hand and Feet
                  </MenuItem>
                </Select>
                {errors.fractureRegion && (
                  <FormHelperText error>{errors.fractureRegion}</FormHelperText>
                )}
                <FormHelperText>
                  For two or more long bone fracture use Multiple
                </FormHelperText>
              </FormControl>
            )}
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.gridItem}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={trauma.amputation}
                  onChange={handleInputChange}
                  name="amputation"
                />
              }
              label="Amputation"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={trauma.neckSwelling}
                  onChange={handleInputChange}
                  name="neckSwelling"
                />
              }
              label="Neck Swelling"
            />
          </div>
          <div className={styles.gridItem}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={trauma.minorHeadInjury}
                  onChange={handleInputChange}
                  name="minorHeadInjury"
                />
              }
              label="Minor Head Injury"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={trauma.abrasion}
                  onChange={handleInputChange}
                  name="abrasion"
                />
              }
              label="Abrasions/Laceration/Contusion/Bruises"
            />
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.gridItem}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={trauma.suspectedAbuse}
                  onChange={handleInputChange}
                  name="suspectedAbuse"
                />
              }
              label="Suspected Abuse"
            />
          </div>
        </div>
      </form>
      <div className={styles.container_bottom}>
        <button onClick={back}>Back</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default TriageTraumaForm;
