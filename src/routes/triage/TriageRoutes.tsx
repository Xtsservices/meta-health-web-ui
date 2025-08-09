import { Route, Routes } from "react-router-dom";
import ProtectedStaffRoute from "../../ProtectedRoute/ProtectedStaffRoute";
import ProtectedScopeRoute from "../../ProtectedRoute/ProtectedScopeRoute";
import Snackbars from "../../component/Snackbar";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import { WebSocketProvider } from "../../pages/hospital_triage/AddTriageIssue/contexts/WebSocketContext";
import SimpleBackdrop from "../../component/BackDropLoading/BackDropLoading";
import TriageSidebar from "../../component/sidebar/TriageSidebar";
import TriageDashboard from "../../pages/dashboard_triage/dashboard";
import TriagePatientList from "../../pages/hospital_triage/PatientList/PatientList";
import AddPatient from "../../pages/common/AddPatient/AddPatient";
import AddNeonate from "../../component/AddPatient/AddNeonate";
import AddAdult from "../../component/AddPatient/AddAdult";
import AddChild from "../../component/AddPatient/AddChild";
import { TriageFormProvider } from "../../pages/hospital_triage/AddTriageIssue/contexts/TriageFormContext";
import TriageFormsCommonLayout from "../../pages/hospital_triage/AddTriageIssue/TriageFormsCommonLayout";
import AddTriageIssue from "../../pages/hospital_triage/AddTriageIssue/AddTriageIssue";
import TriageVitals from "../../pages/hospital_triage/AddTriageIssue/TriageVitals/TriageVitalsForm";
import TriageABCDForm from "../../pages/hospital_triage/AddTriageIssue/TriageABCDForm/TriageABCDForm";
import TriageGCSForm from "../../pages/hospital_triage/AddTriageIssue/TriageGCSForm/TriageGcsForm";
import TriageTraumaType from "../../pages/hospital_triage/AddTriageIssue/TriageTrauma/TriageTraumaType";
import TriageTraumaForm from "../../pages/hospital_triage/AddTriageIssue/TriageTrauma/TriageTraumaForm";
import TriageNonTraumaForm from "../../pages/hospital_triage/AddTriageIssue/TriageTrauma/TriageNonTraumaForm";
import TriageZone from "../../pages/hospital_triage/AddTriageIssue/TriageZone/TriageZoneFinal";
import TriageExplicitZoneForm from "../../pages/hospital_triage/AddTriageIssue/TriageTrauma/TriageExplicitZoneForm";
import { patientStatus, SCOPE_LIST } from "../../utility/role";
import HelpRoutes from "../common/HelpRoutes";
import Managment from "../../component/DoctorsManagment/Managment";

const TriageRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedStaffRoute>
            <ProtectedScopeRoute scope={SCOPE_LIST.triage}>
              <WebSocketProvider>
                <SimpleBackdrop>
                  <Snackbars>
                    <TriageSidebar />
                  </Snackbars>
                </SimpleBackdrop>
              </WebSocketProvider>
            </ProtectedScopeRoute>
          </ProtectedStaffRoute>
        }
      >
        <Route index element={<TriageDashboard />} />
        <Route path="profile" element={<ProfileForm />} />
        <Route path="addpatient">
          <Route
            index
            element={
              <ProtectedStaffRoute>
                <AddPatient status={`${patientStatus.emergency}`} />
              </ProtectedStaffRoute>
            }
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
        <Route
            path="Managment"
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <Managment />
                </Snackbars>
              </ProtectedStaffRoute>
            }
          />
        <Route path="help" element={<HelpRoutes />} />
        <Route path="list" element={<TriagePatientList />} />
        <Route
          path="list/:id"
          element={
            <TriageFormProvider>
              <TriageFormsCommonLayout />
            </TriageFormProvider>
          }
        >
          <Route index element={<AddTriageIssue />} />
          <Route path="vitals" element={<TriageVitals />} />
          <Route path="abcd" element={<TriageABCDForm />} />
          <Route path="gcs" element={<TriageGCSForm />} />
          <Route path="type" element={<TriageTraumaType />} />
          <Route path="trauma" element={<TriageTraumaForm />} />
          <Route path="non-trauma" element={<TriageNonTraumaForm />} />
          <Route path="zone" element={<TriageZone />} />
          <Route path="zone-form" element={<TriageExplicitZoneForm />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default TriageRoutes;
