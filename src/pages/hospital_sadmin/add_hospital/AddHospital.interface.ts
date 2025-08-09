export interface HospitalInfo {
  name: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  parent: {
    valid: boolean;
    value: string | null;
    showError: boolean;
    message: string;
  };
  email: {
    valid: boolean;
    value: string | null;
    showError: boolean;
    message: string;
  };
  address: {
    valid: boolean;
    value: string | null;
    showError: boolean;
    message: string;
  };
  website: {
    valid: boolean;
    value: string | null;
    showError: boolean;
    message: string;
  };
  city: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  state: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  country: {
    valid: boolean;
    value: string | null;
    showError: boolean;
    message: string;
  };
  pinCode: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  phoneNo: {
    valid: boolean;
    value: number | null;
    showError: boolean;
    message: string;
  };
}

export interface AdminDetails {
  firstName: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  lastName: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  email: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  address: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  city: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  state: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  pinCode: {
    valid: boolean;
    value: number | null;
    showError: boolean;
    message: string;
  };
  phoneNo: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  dob: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  gender: {
    valid: boolean;
    value: number | null;
    showError: boolean;
    message: string;
  };
  password: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  confirmPassword: {
    valid: boolean;
    value: string;
    showError: boolean;
    message: string;
  };
  scope: {
    valid: boolean;
    showError: boolean;
    value: string[];
    message: string;
    name: string;
  };
}
