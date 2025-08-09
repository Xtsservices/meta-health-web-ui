export type VitalsFormType = {
  oxygen: number;
  pulse: number;
  temperature: number;
  bpH: number;
  bpL: number;
  respiratoryRate: number;
  time: string | null;
};

export type ABCDFormType = {
  radialPulse: string;
  noisyBreathing: string;
  activeSeizures: string;
  cSpineInjury: string;
  stridor: string;
  angioedema: string;
  activeBleeding: string;
  incompleteSentences: string;
  capillaryRefill: string;
  alteredSensorium: string;
  activeBleedingType: string;
};

export type GCSFormType = {
  eyeMovement: string;
  verbalResponse: string;
  motorResponse: string;
  painScale: number | '';
};

export type TraumaFormType = {
  traumaType: string;
  fracture: boolean;
  fractureRegion: string;
  amputation: boolean;
  neckSwelling: boolean;
  minorHeadInjury: boolean;
  abrasion: boolean;
  suspectedAbuse: boolean;
  fallHeight: string;

  chestInjuryType: string;
  stabInjurySeverity: string;
  stabInjuryLocation: string;

  stabHeadScalp: boolean;
  stabHeadFace: boolean;
  stabHeadNeck: boolean;
  stabChestHeart: boolean;
  stabChestLungs: boolean;
  stabChestMajorBloodVessels: boolean;
  stabAbdomenStomach: boolean;
  stabAbdomenLiver: boolean;
  stabAbdomenKidneys: boolean;
  stabAbdomenSpleen: boolean;
  stabAbdomenIntestines: boolean;
  stabExtremityArm: boolean;
  stabExtremityLeg: boolean;
  stabExtremityMuscles: boolean;
  stabExtremityTendons: boolean;
  stabExtremityNerves: boolean;
  stabExtremityBloodVessels: boolean;
};

export type NonTraumaFormType = {
  pregnancy: boolean;
  pregnancyIssue: string;
  trimester: string;
  breathlessness: boolean;
  edema: boolean;
  internalBleeding: boolean;
  internalBleedingCause: string;
  poisoning: boolean;
  poisoningCause: string;
  burn: boolean;
  burnPercentage: string;
  hanging: boolean;
  drowning: boolean;
  electrocution: boolean;
  heatStroke: boolean;
  fever: boolean;
  feverSymptoms: string;
  drugOverdose: boolean;
  stoolPass: boolean;
  urinePass: boolean;
  swellingWound: boolean;
  dizziness: boolean;
  headache: boolean;
  coughCold: boolean;
  skinRash: boolean;
  medicoLegalExamination: boolean;
};

export type VitalsErrorsType = {
  oxygen: string;
  pulse: string;
  temperature: string;
  respiratoryRate: string;
  bpH: string;
  bpL: string;
};

export type GCSErrorsType = {
  eyeMovement: string;
  verbalResponse: string;
  motorResponse: string;
  painScale: string;
};

export type ABCDErrorsType = {
  radialPulse: string | null;
  noisyBreathing: string | null;
  activeSeizures: string | null;
  cSpineInjury: string | null;
  stridor: string | null;
  angioedema: string | null;
  activeBleeding: string | null;
  incompleteSentences: string | null;
  capillaryRefill: string | null;
  alteredSensorium: string | null;
  activeBleedingType: string | null;
};

export type TraumaErrorsType = {
  traumaType: string;
  fractureRegion: string;
  fallHeight: string;
};

export type NonTraumaErrorsType = {
  poisoningCause: string;
  burnPercentage: string;
  feverSymptoms: string;
  pregnancyIssue: string;
  trimester: string;
  internalBleedingCause: string;
};

export type TriageFormState = {
  zone: number | null;
  ward: string;
  wardID: number | undefined;
  lastKnownSequence: string;
  criticalCondition: string;

  vitals: VitalsFormType;
  abcd: ABCDFormType;
  gcs: GCSFormType;
  trauma: TraumaFormType;
  nonTrauma: NonTraumaFormType;

  errors: {
    vitals: VitalsErrorsType;
    abcd: ABCDErrorsType;
    gcs: GCSErrorsType;
    trauma: TraumaErrorsType;
    nonTrauma: NonTraumaErrorsType;
  };
};
