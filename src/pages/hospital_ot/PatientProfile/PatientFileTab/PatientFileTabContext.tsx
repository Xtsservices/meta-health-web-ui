import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
} from 'react';

interface PatientFileTabContext {
  formState: FormState | null;
  setFormState: Dispatch<FormState>;
}

const PatientFileTabContext = createContext<PatientFileTabContext | undefined>(
  undefined
);

interface Symptom {
  symptom: string;
  duration: string;
  time: string;
  updatedBy: string;
}

interface Medication {
  name: string;
  days: number;
  dosage: number;
  time: string;
  notify: boolean;
}

type FormState = {
  symptoms: Symptom[];
  vitals: object;
  medications: { [key: string]: Medication[] };
  medicalExaminationHistory: object;
  testReports: object;
};

export const usePatientFile = (): PatientFileTabContext => {
  const context = useContext(PatientFileTabContext);
  if (context === undefined) {
    throw new Error(
      'usePatientFile must be used within a PatientFileTabContext'
    );
  }
  return context;
};

interface PatientFileTabContextProps {
  children: ReactNode;
}

export const PatientFileTabProvider: React.FC<PatientFileTabContextProps> = ({
  children,
}) => {
  const [formState, setFormState] = useState<FormState | null>(null);

  return (
    <PatientFileTabContext.Provider
      value={{
        formState,
        setFormState,
      }}
    >
      {children}
    </PatientFileTabContext.Provider>
  );
};
