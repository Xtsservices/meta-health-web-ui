export interface userType {
  token: string;
  id: number;
  role: number | null;
  scope: string;
  hospitalID: number;
  isLoggedIn: boolean;
  status: "error" | "success";
  firstName?: string;
  lastName?: string;
  photo?: string;
  email?: string | null;
  phoneNo?: number | null;
  imageURL: string | undefined;
  city: string;
  state: string;
  address: string;
  pinCode: number | null;
  dob: string;
  gender: number;
  roleName: string;
  departmentID:number;
}
export interface errorType {
  message: string;
  status: "error" | "success";
}
