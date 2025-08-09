import styles from './triageABCDForm.module.scss';

import React, { useCallback, useContext, useEffect } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip,
  FormLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TriageFormContext from '../contexts/TriageFormContext';
import { zoneType } from '../../../../utility/role';
import { TriageLastKnownSequence } from '../contexts/contants';
import { ABCDErrorsType } from '../contexts/types';
import { useWebSocket } from '../contexts/WebSocketContext';

const validateFields = (
  name: string | undefined,
  value: string | unknown
): string => {
  switch (name) {
    case 'capillaryRefill':
    case 'incompleteSentences':
    case 'angioedema':
    case 'stridor':
    case 'cSpineInjury':
    case 'alteredSensorium':
    case 'activeBleeding':
    case 'noisyBreathing':
    case 'activeSeizures':
      if (value === '' || value === null) return 'This field is required.';
      return '';

    default:
      return '';
  }
};

const Form: React.FC = () => {
  const navigate = useNavigate();

  const { formData, setFormData } = useContext(TriageFormContext);
  const { abcd } = formData;
  const {
    sendMessage,
    receivedMessage,
    isMessageConsumed,
    setIsMessageConsumed,
  } = useWebSocket();

  const errors = formData.errors.abcd;
  const back = () => navigate(-1);

  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | { name?: string; value: unknown; type: string }
      >
    ) => {
      const { name, value, type } = event.target;
      let val = value;
      val = name === 'painScale' && isNaN(Number(value)) ? '' : value;

      const err = validateFields(name, value as string);

      setFormData((prevFormData) => ({
        ...prevFormData,
        abcd: {
          ...prevFormData.abcd,
          [name as string]:
            type === 'checkbox'
              ? (event.target as HTMLInputElement).checked
              : val,
        },
        errors: {
          ...prevFormData.errors,
          abcd: {
            ...prevFormData.errors.abcd,
            [name as string]: err,
          },
        },
      }));
    },
    [setFormData]
  );

  const handleNext = useCallback(() => {
    const { abcd } = formData;
    let validForm = true;

    const errs = {
      capillaryRefill: validateFields('capillaryRefill', abcd.capillaryRefill),
      alteredSensorium: validateFields(
        'alteredSensorium',
        abcd.alteredSensorium
      ),
      activeBleeding: validateFields('activeBleeding', abcd.activeBleeding),
      stridor: validateFields('stridor', abcd.stridor),
      cSpineInjury: validateFields('cSpineInjury', abcd.cSpineInjury),
      incompleteSentences: validateFields(
        'incompleteSentences',
        abcd.incompleteSentences
      ),
      radialPulse: validateFields('radialPulse', abcd.radialPulse),
      noisyBreathing: validateFields('noisyBreathing', abcd.noisyBreathing),
      activeSeizures: validateFields('activeSeizures', abcd.activeSeizures),
      angioedema: validateFields('angioedema', abcd.angioedema),
    } as ABCDErrorsType;

    validForm = Object.keys(errs).every(
      (key) => !errs[key as keyof ABCDErrorsType]
    );

    if (!validForm) {
      setFormData((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
          abcd: { ...prevState.errors.abcd, ...errs },
        },
      }));
      return;
    }

    sendMessage({
      type: 'ABCD',
      data: formData.abcd,
    });
  }, [formData, sendMessage, setFormData]);

  const radialPulseChips = [
    { label: 'Absent', value: 'absent' },
    { label: 'Present', value: 'present' },
  ];

  const yesNoChips = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  const handleChipInput = useCallback(
    (name: string, value: string | null) => {
      return () => {
        setFormData((data) => ({
          ...data,
          abcd: { ...data.abcd, [name]: value },
          errors: { ...data.errors, abcd: { ...data.errors.abcd, [name]: '' } },
        }));
      };
    },
    [setFormData]
  );

  useEffect(() => {
    setFormData((p) => ({
      ...p,
      lastKnownSequence: TriageLastKnownSequence.ABCD,
    }));
  }, [setFormData]);

  useEffect(() => {
    if (receivedMessage !== null && !isMessageConsumed) {
      setIsMessageConsumed(true);
      const zone = receivedMessage.zone;
      if (zone) {
        setFormData((p) => ({ ...p, zone: zone }));
        if (zone === zoneType.red) navigate('./../zone-form');
        else navigate('./../gcs');
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
      <div className={styles.container_flex_centered}>
        <form className={styles.form_container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <FormControl fullWidth error={!!errors.radialPulse}>
                <div className={styles.container_chip_input}>
                  <FormLabel>Radial Pulse</FormLabel>
                  {radialPulseChips.map((item) => (
                    <Chip
                      label={item.label}
                      clickable
                      color={
                        abcd.radialPulse === item.value ? 'primary' : 'default'
                      }
                      onClick={handleChipInput(
                        'radialPulse',
                        abcd.radialPulse === item.value ? null : item.value
                      )}
                    />
                  ))}
                </div>
              </FormControl>
            </div>
            <div className={styles.column}>
              <FormControl error={!!errors.alteredSensorium}>
                <div className={styles.container_chip_input}>
                  <FormLabel>Altered Sensorium</FormLabel>
                  {yesNoChips.map((item) => (
                    <Chip
                      label={item.label}
                      clickable
                      color={
                        abcd.alteredSensorium === item.value
                          ? 'primary'
                          : 'default'
                      }
                      onClick={handleChipInput('alteredSensorium', item.value)}
                    />
                  ))}
                </div>
              </FormControl>
            </div>
          </div>
          <div className={styles.row_constrained_width}>
            <FormControl error={!!errors.activeBleeding}>
              <div className={styles.container_chip_input}>
                <FormLabel>Active Bleeding</FormLabel>
                {yesNoChips.map((item) => (
                  <Chip
                    label={item.label}
                    clickable
                    color={
                      abcd.activeBleeding === item.value ? 'primary' : 'default'
                    }
                    onClick={handleChipInput('activeBleeding', item.value)}
                  />
                ))}
              </div>
            </FormControl>
            {abcd.activeBleeding === 'yes' && (
              <FormControl required sx={{ width: '15rem' }} size="small">
                <InputLabel>Active Bleeding Type</InputLabel>
                <Select
                  label="Active Bleeding Type"
                  value={abcd.activeBleedingType}
                  onChange={(e) =>
                    handleInputChange(
                      e as React.ChangeEvent<
                        | HTMLInputElement
                        | { name?: string; value: unknown; type: string }
                      >
                    )
                  }
                  name="activeBleedingType"
                  error={!!errors.activeBleedingType}
                >
                  <MenuItem value="major">Major</MenuItem>
                  <MenuItem value="minor">Minor</MenuItem>
                </Select>
                {!!errors.capillaryRefill && (
                  <FormHelperText error>
                    {errors.capillaryRefill}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <FormControl error={!!errors.stridor}>
                <div className={styles.container_chip_input}>
                  <FormLabel>Stridor</FormLabel>
                  {yesNoChips.map((item) => (
                    <Chip
                      label={item.label}
                      clickable
                      color={
                        abcd.stridor === item.value ? 'primary' : 'default'
                      }
                      onClick={handleChipInput('stridor', item.value)}
                    />
                  ))}
                </div>
              </FormControl>
            </div>

            <div className={styles.column}>
              <FormControl error={!!errors.angioedema}>
                <div className={styles.container_chip_input}>
                  <FormLabel>Angioedema</FormLabel>
                  {yesNoChips.map((item) => (
                    <Chip
                      label={item.label}
                      clickable
                      color={
                        abcd.angioedema === item.value ? 'primary' : 'default'
                      }
                      onClick={handleChipInput('angioedema', item.value)}
                    />
                  ))}
                </div>
              </FormControl>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <FormControl error={!!errors.cSpineInjury}>
                <div className={styles.container_chip_input}>
                  <FormLabel>C Spine Injury</FormLabel>
                  {yesNoChips.map((item) => (
                    <Chip
                      label={item.label}
                      clickable
                      color={
                        abcd.cSpineInjury === item.value ? 'primary' : 'default'
                      }
                      onClick={handleChipInput('cSpineInjury', item.value)}
                    />
                  ))}
                </div>
              </FormControl>
            </div>

            <div className={styles.column}>
              <FormControl fullWidth error={!!errors.activeSeizures}>
                <div className={styles.container_chip_input}>
                  <FormLabel>Active Seizures</FormLabel>
                  {yesNoChips.map((item) => (
                    <Chip
                      label={item.label}
                      clickable
                      color={
                        abcd.activeSeizures === item.value
                          ? 'primary'
                          : 'default'
                      }
                      onClick={handleChipInput('activeSeizures', item.value)}
                    />
                  ))}
                </div>
              </FormControl>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <FormControl error={!!errors.incompleteSentences}>
                <div className={styles.container_chip_input}>
                  <FormLabel>Talking in incomplete sentences</FormLabel>
                  {yesNoChips.map((item) => (
                    <Chip
                      label={item.label}
                      clickable
                      color={
                        abcd.incompleteSentences === item.value
                          ? 'primary'
                          : 'default'
                      }
                      onClick={handleChipInput(
                        'incompleteSentences',
                        item.value
                      )}
                    />
                  ))}
                </div>
              </FormControl>
            </div>

            <div className={styles.column}>
              <FormControl error={!!errors.noisyBreathing}>
                <div className={styles.container_chip_input}>
                  <FormLabel>Noisy Breathing</FormLabel>
                  {yesNoChips.map((item) => (
                    <Chip
                      label={item.label}
                      clickable
                      color={
                        abcd.noisyBreathing === item.value
                          ? 'primary'
                          : 'default'
                      }
                      onClick={handleChipInput('noisyBreathing', item.value)}
                    />
                  ))}
                </div>
              </FormControl>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <FormControl fullWidth required>
                <InputLabel>Capillary Refill</InputLabel>
                <Select
                  label="Capillary Refill"
                  value={abcd.capillaryRefill}
                  onChange={(e) =>
                    handleInputChange(
                      e as React.ChangeEvent<
                        | HTMLInputElement
                        | { name?: string; value: unknown; type: string }
                      >
                    )
                  }
                  name="capillaryRefill"
                  error={!!errors.capillaryRefill}
                >
                  <MenuItem value="<2s">less than 2s</MenuItem>
                  <MenuItem value=">2s">more than 2s</MenuItem>
                </Select>
                {!!errors.capillaryRefill && (
                  <FormHelperText error>
                    {errors.capillaryRefill}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
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
