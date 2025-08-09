import React, { createContext, useState } from "react";
import { zoneType } from "../../../../utility/role";
import { ABCDFormType, TriageFormState } from "./types";
import { TriageLastKnownSequence } from "./contants";

export const CriticalCondition = {
  CHEST_PAIN: "chest pain",
  STROKE: "stroke",
  UNCONCIOUS: "unconscious",
};

const initialFormState = {
  zone: null,
  ward: "",
  wardID: 0,
  lastKnownSequence: "",
  criticalCondition: "",
  vitals: {
    oxygen: 0,
    pulse: 0,
    temperature: 0,
    bpH: 0,
    bpL: 0,
    respiratoryRate: 0,
    time: null,
  },
  abcd: {
    radialPulse: "", // should be absent/present or ''
    noisyBreathing: "",
    activeSeizures: "",
    cSpineInjury: "",
    angioedema: "",
    stridor: "",
    activeBleeding: "",
    incompleteSentences: "",
    capillaryRefill: "",
    alteredSensorium: "",
    activeBleedingType: "",
  },
  gcs: {
    eyeMovement: "",
    verbalResponse: "",
    motorResponse: "",
    painScale: "",
  },
  trauma: {
    traumaType: "",
    fallHeight: "",
    fracture: false,
    fractureRegion: "",
    amputation: false,
    neckSwelling: false,
    minorHeadInjury: false,
    abrasion: false,
    suspectedAbuse: false,
    chestInjuryType: "",
    stabInjurySeverity: "",
    stabInjuryLocation: "",
    stabHeadScalp: false,
    stabHeadFace: false,
    stabHeadNeck: false,
    stabChestHeart: false,
    stabChestLungs: false,
    stabChestMajorBloodVessels: false,
    stabAbdomenStomach: false,
    stabAbdomenLiver: false,
    stabAbdomenKidneys: false,
    stabAbdomenSpleen: false,
    stabAbdomenIntestines: false,
    stabExtremityArm: false,
    stabExtremityLeg: false,
    stabExtremityMuscles: false,
    stabExtremityTendons: false,
    stabExtremityNerves: false,
    stabExtremityBloodVessels: false,
  },
  nonTrauma: {
    pregnancy: false,
    pregnancyIssue: "",
    trimester: "",
    breathlessness: false,
    edema: false,
    internalBleeding: false,
    internalBleedingCause: "",
    poisoning: false,
    poisoningCause: "",
    burn: false,
    burnPercentage: "",
    hanging: false,
    drowning: false,
    electrocution: false,
    heatStroke: false,
    fever: false,
    feverSymptoms: "",
    drugOverdose: false,
    stoolPass: false,
    urinePass: false,
    swellingWound: false,
    dizziness: false,
    headache: false,
    coughCold: false,
    skinRash: false,
    medicoLegalExamination: false,
  },

  errors: {
    vitals: {
      oxygen: "",
      pulse: "",
      temperature: "",
      respiratoryRate: "",
      bpH: "",
      bpL: "",
    },
    abcd: {
      radialPulse: "",
      noisyBreathing: "",
      activeSeizures: "",
      cSpineInjury: "",
      angioedema: "",
      stridor: "",
      activeBleeding: "",
      incompleteSentences: "",
      capillaryRefill: "",
      alteredSensorium: "",
      activeBleedingType: "",
    },
    gcs: {
      eyeMovement: "",
      verbalResponse: "",
      motorResponse: "",
      painScale: "",
    },
    trauma: {
      traumaType: "",
      fractureRegion: "",
      fallHeight: "",
    },
    nonTrauma: {
      poisoningCause: "",
      burnPercentage: "",
      feverSymptoms: "",
      trimester: "",
      pregnancyIssue: "",
      internalBleedingCause: "",
    },
  },
} as TriageFormState;

const boolFields = [
  "noisyBreathing",
  "alteredSensorium",
  "activeBleeding",
  "stridor",
  "angioedema",
  "cSpineInjury",
  "activeSeizures",
  "incompleteSentences",
] as const;

const convertToBool = (val: string): boolean => {
  return val === "yes";
};

export const GetTriageFormDataObject = (data: TriageFormState) => {
  let processedData = {} as any;

  switch (data.lastKnownSequence) {
    case TriageLastKnownSequence.CRITICAL_CONDITION:
      processedData = {
        criticalCondition: data.criticalCondition,
      };
      break;
    case TriageLastKnownSequence.VITALS:
      processedData = { ...data.vitals };
      break;
    case TriageLastKnownSequence.ABCD:
      processedData = { ...data.abcd, ...data.vitals };
      break;
    case TriageLastKnownSequence.GCS:
      processedData = { ...data.abcd, ...data.gcs, ...data.vitals };
      break;
    case TriageLastKnownSequence.TRAUMA:
      processedData = {
        ...data.abcd,
        ...data.gcs,
        ...data.vitals,
        ...data.trauma,
      };
      break;
    case TriageLastKnownSequence.NON_TRAUMA:
      processedData = {
        ...data.abcd,
        ...data.gcs,
        ...data.vitals,
        ...data.nonTrauma,
      };
      break;
  }

  if (data.ward) {
    processedData.ward = data.ward;
  }

  // Convert to appropriate fields for backend
  if (data.abcd.radialPulse === "absent") {
    processedData.radialPulse = false;
  } else if (data.abcd.radialPulse === "present") {
    processedData.radialPulse = true;
  }

  boolFields.forEach((field) => {
    if (field in data.abcd) {
      processedData[field] = convertToBool(
        data.abcd[field as keyof ABCDFormType]
      );
    }
  });

  processedData.zone = data.zone || zoneType.green;

  return processedData;
};

const TriageFormContext = createContext<{
  formData: TriageFormState;
  setFormData: React.Dispatch<React.SetStateAction<TriageFormState>>;
}>({ formData: initialFormState, setFormData: () => undefined });

export const TriageFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formData, setFormData] = useState<TriageFormState>(initialFormState);

  return (
    <TriageFormContext.Provider value={{ formData, setFormData }}>
      {children}
    </TriageFormContext.Provider>
  );
};

export default TriageFormContext;
