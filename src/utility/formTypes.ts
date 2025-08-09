export type staffFormType = {
  firstName: string;
  lastName: string;
  role: number | string;
  scope: string;
  departmentID: number | string;
  phoneNo: number | null | string;
  gender: number | string;
  dob: string;
  city: string;
  state: string;
  pinCode: number | null;
  address: string;
  email: string;
  password: string;
  hospitalIds?: string;
  multiState?: string;
  multiDist?: string;
  multiCity?: string;
};

export type staffFormIndex =
  | "firstName"
  | "password"
  | "email"
  | "address"
  | "pinCode"
  | "state"
  | "city"
  | "dob"
  | "gender"
  | "phoneNo"
  | "departmentID"
  | "role"
  | "scope";

export type formDataStaff = {
  firstName: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
  lastName: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
  role: {
    valid: boolean;
    showError: boolean;
    value: number | string;
    message: string;
    name: string;
  };
  hospitalIds: {
    valid: boolean;
    showError: boolean;
    value: string[];
    message: string;
    name: string;
  };
  multiState: {
    valid: boolean;
    showError: boolean;
    value: string[];
    message: string;
    name: string;
  };
  multiDist: {
    valid: boolean;
    showError: boolean;
    value: string[];
    message: string;
    name: string;
  };
  multiCity: {
    valid: boolean;
    showError: boolean;
    value: string[];
    message: string;
    name: string;
  };
  scope: {
    valid: boolean;
    showError: boolean;
    value: string[];
    message: string;
    name: string;
  };
  departmentID: {
    valid: boolean;
    showError: boolean;
    value: number | string;
    message: string;
    name: string;
  };
  reportTo: {
    valid: boolean;
    showError: boolean;
    value: number | string;
    message: string;
    name: string;
  };
  phoneNo: {
    valid: boolean;
    showError: boolean;
    value: number | null;
    message: string;
    name: string;
  };
  gender: {
    valid: boolean;
    showError: boolean;
    value: number | string;
    message: string;
    name: string;
  };
  dob: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
  city: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
  state: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
  pinCode: {
    valid: boolean;
    showError: boolean;
    value: number | null;
    message: string;
    name: string;
  };
  address: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };

  email: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
  password: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
    name: string;
  };
};

export type profileFormDataType = {
  firstName: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
  };
  lastName: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
  };
  phoneNo: {
    valid: boolean;
    showError: boolean;
    value: number | null;
    message: string;
  };
  state: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
  };
  city: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
  };
  pinCode: {
    valid: boolean;
    showError: boolean;
    value: number | null;
    message: string;
  };
  address: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
  };
  dob: {
    valid: boolean;
    showError: boolean;
    value: string;
    message: string;
  };
  gender: {
    valid: boolean;
    showError: boolean;
    value: number;
    message: string;
  };
};

export type profileFormDataObj = {
  firstName: string;
  lastName: string;
  phoneNo: number | null;
  gender: number | null;
  dob: string;
  city: string;
  state: string;
  pinCode: number | null;
  address: string;
};

export type CustomerCareUser = {
  id: number;
  hospitalID: number | null;
  departmentID: number | null;
  email: string;
  password: string;
  role: number;
  countryCode: string | null;
  phoneNo: string;
  pin: number | null;
  forgotToken: string | null;
  refreshToken: string | null;
  firstName: string;
  lastName: string;
  photo: string | null;
  dob: string;
  gender: number;
  address: string;
  city: string;
  state: string;
  pinCode: number;
  addedOn: string;
  lastOnline: string | null;
  lastUpdated: string;
  isDeleted: number;
  scope: string;
  zone: string | null;
  reportTo: string | null;
  hospitalIds: number[];
  hospitalNames?: string[];
  multiState:string[];
  multiDist:string[];
  multiCity:string[];
  isDeactivated:number;
};
