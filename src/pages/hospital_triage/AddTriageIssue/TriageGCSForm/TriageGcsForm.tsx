import styles from './triageGcsForm.module.scss';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TriageFormContext from '../contexts/TriageFormContext';
import { zoneType } from '../../../../utility/role';
import GcsScoreIndicator from '../components/TriageGCSScore';
import { TriageLastKnownSequence } from '../contexts/contants';
import { useWebSocket } from '../contexts/WebSocketContext';

const validateFields = (
  name: string | undefined,
  value: string | unknown,
  range: number[] | null
): string => {
  switch (name) {
    case 'painScale':
      if (value === '' || isNaN(Number(value)))
        return 'Please enter a valid number.';
      else if (range) {
        const painValue = parseFloat(value as string);
        if (painValue < range[0] || painValue > range[1])
          return `Pain scale should be between ${range[0]} and ${range[1]}.`;
      }
      return '';
    case 'eyeMovement':
    case 'verbalResponse':
    case 'motorResponse':
      if (value === '' || value === null) return 'This field is required.';
      return '';

    default:
      return '';
  }
};

const Form: React.FC = () => {
  const navigate = useNavigate();

  const { formData, setFormData } = useContext(TriageFormContext);
  const { gcs } = formData;

  const {
    sendMessage,
    receivedMessage,
    isMessageConsumed,
    setIsMessageConsumed,
  } = useWebSocket();

  const errors = formData.errors.gcs;
  const back = () => navigate(-1);
  const [gcsScore, setGcsScore] = useState(0);
  const [formSubmissionInitiated, setFormSubmissionInitiated] = useState(false);

  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | { name?: string; value: unknown; type: string }
      >
    ) => {
      const { name, value, type } = event.target;
      let val = value;
      val = name === 'painScale' && isNaN(Number(value)) ? '' : value;

      const err =
        name === 'painScale'
          ? validateFields(name, value, [1, 10])
          : validateFields(name, value as string, null);

      setFormData((prevFormData) => ({
        ...prevFormData,
        gcs: {
          ...prevFormData.gcs,
          [name as string]:
            type === 'checkbox'
              ? (event.target as HTMLInputElement).checked
              : val,
        },
        errors: {
          ...prevFormData.errors,
          gcs: {
            ...prevFormData.errors.gcs,
            [name as string]: err,
          },
        },
      }));

      sendMessage({
        type: 'GCS',
        data: formData.gcs,
      });
    },
    [setFormData, sendMessage, formData.gcs]
  );

  const handleNext = useCallback(() => {
    const { gcs } = formData;
    let validForm = true;

    const errs = {
      painScale: validateFields('painScale', gcs.painScale, [1, 10]),
      eyeMovement: validateFields('eyeMovement', gcs.eyeMovement, null),
      verbalResponse: validateFields('eyeMovement', gcs.verbalResponse, null),
      motorResponse: validateFields('eyeMovement', gcs.motorResponse, null),
    };

    validForm = !(
      errs.painScale ||
      errs.eyeMovement ||
      errs.verbalResponse ||
      errs.motorResponse
    );

    if (!validForm) {
      setFormData((prevState) => ({
        ...prevState,
        errors: { ...prevState.errors, gcs: errs },
      }));
      return;
    }

    sendMessage({
      type: 'GCS',
      data: formData.gcs,
    });

    setFormSubmissionInitiated(true);
  }, [formData, sendMessage, setFormData]);

  useEffect(() => {
    setFormData((p) => ({
      ...p,
      lastKnownSequence: TriageLastKnownSequence.GCS,
    }));
  }, [setFormData]);

  useEffect(() => {
    if (receivedMessage !== null && !isMessageConsumed) {
      setIsMessageConsumed(true);
      const zone = receivedMessage.zone;
      const score = receivedMessage.score;
      if (score) setGcsScore(score);
      if (zone && formSubmissionInitiated) {
        setFormData((p) => ({ ...p, zone: zone }));
        if (zone === zoneType.red) navigate('./../zone-form');
        else navigate('./../type');
      }
    }
  }, [
    isMessageConsumed,
    formSubmissionInitiated,
    navigate,
    receivedMessage,
    setFormData,
    setGcsScore,
    setIsMessageConsumed,
  ]);

  useEffect(() => {
    sendMessage({
      type: 'GCS',
      data: formData.gcs,
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.container_flex_centered}>
        <div style={{ marginBottom: '1rem' }}>
          <GcsScoreIndicator score={gcsScore} />
        </div>
        <form onSubmit={handleNext} className={styles.form_container}>
          <div className={styles.row}>
            <FormControl fullWidth required>
              <InputLabel>Eye Movement</InputLabel>
              <Select
                label="Eye Movement"
                value={gcs.eyeMovement}
                onChange={(e) =>
                  handleInputChange(
                    e as React.ChangeEvent<
                      | HTMLInputElement
                      | { name?: string; value: unknown; type: string }
                    >
                  )
                }
                name="eyeMovement"
                error={!!errors.eyeMovement}
              >
                <MenuItem value="spontaneous">Spontaneous</MenuItem>
                <MenuItem value="to sound">To Sound</MenuItem>
                <MenuItem value="to pressure">To Pressure</MenuItem>
                <MenuItem value="none">None</MenuItem>
              </Select>
              {!!errors.eyeMovement && (
                <FormHelperText error>{errors.eyeMovement}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Verbal Response</InputLabel>
              <Select
                label="Verbal Response"
                value={gcs.verbalResponse}
                onChange={(e) =>
                  handleInputChange(
                    e as React.ChangeEvent<
                      | HTMLInputElement
                      | { name?: string; value: unknown; type: string }
                    >
                  )
                }
                name="verbalResponse"
                error={!!errors.verbalResponse}
              >
                <MenuItem value="oriented">Oriented</MenuItem>
                <MenuItem value="confused">Confused</MenuItem>
                <MenuItem value="words">Words</MenuItem>
                <MenuItem value="sounds">Sounds</MenuItem>
                <MenuItem value="none">None</MenuItem>
              </Select>
              {!!errors.verbalResponse && (
                <FormHelperText error>{errors.verbalResponse}</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className={styles.row}>
            <FormControl fullWidth required>
              <InputLabel>Motor Response</InputLabel>
              <Select
                label="Motor Response"
                value={gcs.motorResponse}
                onChange={(e) =>
                  handleInputChange(
                    e as React.ChangeEvent<
                      | HTMLInputElement
                      | { name?: string; value: unknown; type: string }
                    >
                  )
                }
                name="motorResponse"
                error={!!errors.motorResponse}
              >
                <MenuItem value="obey commands">Obey commands</MenuItem>
                <MenuItem value="localising">Localising</MenuItem>
                <MenuItem value="normal flexion">Normal Flexion</MenuItem>
                <MenuItem value="abnormal flexion">Abnormal Flexion</MenuItem>
                <MenuItem value="extension">Extension</MenuItem>
                <MenuItem value="none">None</MenuItem>
              </Select>
              {!!errors.motorResponse && (
                <FormHelperText error>{errors.motorResponse}</FormHelperText>
              )}
            </FormControl>

            <TextField
              label="Pain Scale"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{ inputProps: { min: 1, max: 10 } }}
              value={gcs.painScale || ''}
              onChange={handleInputChange}
              name="painScale"
              required
              error={!!errors.painScale}
              helperText={errors.painScale}
            />
          </div>
        </form>
      </div>
      <div className={styles.container_bottom}>
        <button onClick={back}>back</button>
        {<button onClick={handleNext}>next</button>}
      </div>
    </div>
  );
};

export default Form;
