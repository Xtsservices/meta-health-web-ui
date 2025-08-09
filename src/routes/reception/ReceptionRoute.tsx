import { Route, Routes } from "react-router-dom";
import HospitalReceptionDashboard from "../../pages/hospital_reception/receptionDashboard/HospitalReceptionDashboard";
import Dashboard1 from "../../pages/dashboard_reception/Dashboard/Dashboard1";
import AlertsTabs from "../../pages/hospital_reception/alerts/AlertsTabs";
import AddPatientInReception from "../../pages/hospital_reception/AddPatient/AddPatient";
import AddPatient from "../../pages/common/AddPatient/AddPatient";
import ProtectedStaffRoute from "../../ProtectedRoute/ProtectedStaffRoute";
import Snackbars from "../../component/Snackbar";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import AddNeonate from "../../component/AddPatient/AddNeonate";
import AddAdult from "../../component/AddPatient/AddAdult";
import AddChild from "../../component/AddPatient/AddChild";
import PatientProfile from "../../pages/hospital_staff/PatientProfile/PatientProfile";
import WardManagement from "../../pages/hospital_reception/wardManagement/WardManagement";
import DoctorManagement from "../../pages/hospital_reception/doctorManagement/DoctorManagement";
import TaxInvoice from "../../pages/hospital_reception/TaxInvoice/TaxInvoice";
import PatientBilling from "../../pages/hospital_reception/TaxInvoice/PatientBilling";
import AllTaxInvoice from "../../pages/hospital_reception/TaxInvoice/AllTaxInvoice";
import Appointment from "../../pages/hospital_reception/Appointment/Appointment";
import Insurance from "../../pages/hospital_reception/Insurance/Insurance";
import HospitalReceptionPatientList from "../../pages/hospital_reception/PatientList/HospitalReceptionPatientList";
import PatientEdit from "../../pages/hospital_staff/PatientEdit/PatientEdit";
import EditMedicalHistory from "../../pages/hospital_staff/PatientEdit/EditMedicalHistory";
import { patientCategory, patientStatus } from "../../utility/role";
import AddPatientForm from "../../component/reception/addPatient/AddPatient";
import HelpRoutes from "../common/HelpRoutes";

const ReceptionRoute: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedStaffRoute>
            <Snackbars>
              <HospitalReceptionDashboard />
            </Snackbars>
          </ProtectedStaffRoute>
        }
      >
        <Route index element={<Dashboard1 />} />
        <Route path="alerts" element={<AlertsTabs />} />
        <Route path="addPatient/">
          <Route index element={<AddPatientInReception />} />
          <Route path="opd">
            <Route
              index
              element={<AddPatient status={`${patientStatus.outpatient}`} />}
            />
            <Route
              path="neonate/:ptype"
              element={
                <ProtectedStaffRoute>
                  <Snackbars>
                    <AddPatientForm category={`${patientCategory.neonate}`} />
                  </Snackbars>
                </ProtectedStaffRoute>
              }
            />
            <Route
              path="adult/:ptype"
              element={
                <ProtectedStaffRoute>
                  <Snackbars>
                    <AddPatientForm category={`${patientCategory.adult}`} />
                  </Snackbars>
                </ProtectedStaffRoute>
              }
            />
            <Route
              path="child/:ptype"
              element={
                <ProtectedStaffRoute>
                  <Snackbars>
                    <AddPatientForm category={`${patientCategory.child}`} />
                  </Snackbars>
                </ProtectedStaffRoute>
              }
            />
          </Route>
          <Route path="ipd">
            <Route
              index
              element={<AddPatient status={`${patientStatus.inpatient}`} />}
            />
            <Route
              path="neonate/:ptype"
              element={
                <ProtectedStaffRoute>
                  <Snackbars>
                    <AddNeonate />
                  </Snackbars>
                </ProtectedStaffRoute>
              }
            />
            <Route
              path="adult/:ptype"
              element={
                <ProtectedStaffRoute>
                  <Snackbars>
                    <AddAdult />
                  </Snackbars>
                </ProtectedStaffRoute>
              }
            />
            <Route
              path="child/:ptype"
              element={
                <ProtectedStaffRoute>
                  <Snackbars>
                    <AddChild />
                  </Snackbars>
                </ProtectedStaffRoute>
              }
            />
          </Route>
          <Route path="emergency">
            <Route
              index
              element={<AddPatient status={`${patientStatus.emergency}`} />}
            />
            <Route
              path="neonate/:ptype"
              element={
                <ProtectedStaffRoute>
                  <Snackbars>
                    <AddNeonate />
                  </Snackbars>
                </ProtectedStaffRoute>
              }
            />
            <Route
              path="adult/:ptype"
              element={
                <ProtectedStaffRoute>
                  <Snackbars>
                    <AddAdult />
                  </Snackbars>
                </ProtectedStaffRoute>
              }
            />
            <Route
              path="child/:ptype"
              element={
                <ProtectedStaffRoute>
                  <Snackbars>
                    <AddChild />
                  </Snackbars>
                </ProtectedStaffRoute>
              }
            />
          </Route>
        </Route>
        <Route path="patientProfile" element={<PatientProfile />} />

        <Route path="wardManagement" element={<WardManagement />} />
        <Route path="doctorManagement" element={<DoctorManagement />} />
        <Route path="tax-invoice" element={<TaxInvoice />} />
        <Route path="tax-invoice/patientBilling" element={<PatientBilling />} />
        <Route path="tax-invoice/allTaxInvoices" element={<AllTaxInvoice />} />
        <Route path="appointment" element={<Appointment />} />
        <Route path="insurance" element={<Insurance />} />
        <Route path="profile" element={<ProfileForm />} />

        <Route path="list">
          <Route
            index
            element={
              <Snackbars>
                <HospitalReceptionPatientList />
              </Snackbars>
            }
          />
          <Route
            path=":id"
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  {/* <ReceptionPatientProfile /> */}
                  <PatientProfile />
                </Snackbars>
              </ProtectedStaffRoute>
            }
          />
          <Route
            path=":patientId/edit"
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <PatientEdit />
                </Snackbars>
              </ProtectedStaffRoute>
            }
          />
          <Route
            path=":patientId/edit/medicalHistory"
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <EditMedicalHistory />
                </Snackbars>
              </ProtectedStaffRoute>
            }
          />
        </Route>
        <Route path="help/*" element={<HelpRoutes />} />
      </Route>
    </Routes>
  );
};

export default ReceptionRoute;
