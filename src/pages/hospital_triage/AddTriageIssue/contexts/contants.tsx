export const TriageLastKnownSequence = {
  CRITICAL_CONDITION: 'CRITICAL_CONDITION',
  VITALS: 'VITALS',
  ABCD: 'ABCD',
  GCS: 'GCS',
  TRAUMA: 'TRAUMA',
  NON_TRAUMA: 'NON_TRAUMA',
};

export const LastKnownSequenceStage = {
  [TriageLastKnownSequence.CRITICAL_CONDITION]: 0,
  [TriageLastKnownSequence.VITALS]: 1,
  [TriageLastKnownSequence.ABCD]: 2,
  [TriageLastKnownSequence.GCS]: 3,
  [TriageLastKnownSequence.TRAUMA]: 4, // - Need to resolve logic when Stage is 4
  [TriageLastKnownSequence.NON_TRAUMA]: 4, // - As Both trauma and non trauma are stage 4 in form
};
