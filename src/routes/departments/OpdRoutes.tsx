import { Route, Routes } from "react-router-dom";
import ProtectedStaffRoute from "../../ProtectedRoute/ProtectedStaffRoute";
import Snackbars from "../../component/Snackbar";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import SimpleBackdrop from "../../component/BackDropLoading/BackDropLoading";
import Outpatient_sidebar from "../../component/sidebar/OpdSidebar";
import Dashboard_Outpatient from "../../pages/dashboard_opd";
import PatientProfileOPD from "../../pages/hospital_opd/PatientProfile/PatientProfile";
import PatientEditOPD from "../../pages/hospital_opd/PatientEdit/PatientEdit";
import EditMedicalHistory from "../../pages/hospital_staff/PatientEdit/EditMedicalHistory";
import AddPatient from "../../pages/common/AddPatient/AddPatient";
import FollowupList from "../../pages/hospital_opd/Followup/FollowupList";
import OpdPreviousPatients from "../../pages/hospital_opd/PreviousPatients/OpdPreviousPatients";
import HelpRoutes from "../common/HelpRoutes";
import { patientCategory, patientStatus } from "../../utility/role";
import Managment from "../../component/DoctorsManagment/Managment";
import AddPatientForm from "../../component/reception/addPatient/AddPatient";

const OpdRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedStaffRoute>
            <SimpleBackdrop>
              <Snackbars>
                <Outpatient_sidebar />
              </Snackbars>
            </SimpleBackdrop>
          </ProtectedStaffRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedStaffRoute>
              <Dashboard_Outpatient />
            </ProtectedStaffRoute>
          }
        />
        <Route path="list">
          <Route
            path=":id"
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <PatientProfileOPD />
                </Snackbars>
              </ProtectedStaffRoute>
            }
          />
          <Route
            path=":patientId/edit"
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <PatientEditOPD />
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
        <Route path="addpatient">
          <Route
            index
            element={
              <ProtectedStaffRoute>
                <AddPatient status={`${patientStatus.outpatient}`} />
              </ProtectedStaffRoute>
            }
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
        <Route
          path="followup"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <FollowupList />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="previouspatients"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <OpdPreviousPatients />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
         <Route
          path="managment"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <Managment />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedStaffRoute>
              <Snackbars>
                <ProfileForm />
              </Snackbars>
            </ProtectedStaffRoute>
          }
        />
        <Route path="help/*" element={<HelpRoutes />} />
      </Route>
    </Routes>
  );
};
export default OpdRoutes;
