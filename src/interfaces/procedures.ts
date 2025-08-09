import { SelectChangeEvent } from "@mui/material";

export interface CPRData {
  customCPR: boolean;
  cprDuration: string;
  cprNote: string;
}

interface VentilatorMeasurements {
  FIO2: number;
  IFR: number;
  tidalVolume: number;
  PSL: number;
  RR: number;
  PEEP: number;
  LPL: number;
  HPL: number;
  THP: number;
  TLP: number;
  TMV: number;
  PIP: number;
  [key: string]: number;
}

export interface VentilatorData {
  duration: number;
  durationFormat: string;
  selectedMode: string;
  checkedItems: boolean[];
  showOptionsForCheckbox: boolean;
  ventilatorMeasurements: VentilatorMeasurements;
}

export interface ChecklistItemUrinaryCentralCatheter {
  id: number;
  label: string;
  checked: boolean;
}

export interface VentilatorScreenMeasurementCardProps {
  title: string;
  unit: string;
  imageSrc: string;
  altText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  style: string;
  bgColor: string;
  value: number;
}

export interface TimeUnit {
  singular: string;
  plural: string;
}
export interface ProcedureOption {
  procedureType: string;
  imgSrc: string;
}

export interface SelectComponentProps {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void
  options: ProcedureOption[];
  MenuProps?: object;
  fullWidth?: boolean;
  required?: boolean;
  name: string
}

export interface CPRComponentProps {
  procedureSelected: string;
  handleProcedure: (event: SelectChangeEvent<string>) => void;
  proceduresOptions: { procedureType: string; imgSrc: string }[];
  commonMenuProps: object;
  cprData: CPRData;
  handleChangeForCPR: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: SelectChangeEvent<string>) => void;
}

export interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (event: SelectChangeEvent) => void;
}

export interface CentralLineData {
  patientPreparation: string;
  insertionSite: string;
  lumenType: string;
  localAnesthesiaGuidewireInsertion: string;
  dailyChecklistItems: ChecklistItemUrinaryCentralCatheter[];
  procedureSpecificCheckList: ChecklistItemUrinaryCentralCatheter[];
  days: number
}

export interface UrinaryCatheterData {
  catheterSizes: string;
  typesOfUrinaryCatheter: string;
  patientPositioningAsepticSetup: string;
  dailyChecklistItems: ChecklistItemUrinaryCentralCatheter[];
  procedureSpecificCheckList: ChecklistItemUrinaryCentralCatheter[];
  days: number
} 