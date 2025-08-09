import { Route, Routes } from "react-router-dom";
import ProtectedStaffRoute from "../../ProtectedRoute/ProtectedStaffRoute";
import Snackbars from "../../component/Snackbar";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import EditMedicalHistory from "../../pages/hospital_staff/PatientEdit/EditMedicalHistory";
import InpatientList from "../../pages/hospital_staff/InpatientList/InpatientList";
import DischargePatientProfile from "../../pages/hospital_staff/PatientDischargeProfile/PatientProfile";
import Staff_dashboard from "../../pages/dashboard_staff/dashboard";
import SimpleBackdrop from "../../component/BackDropLoading/BackDropLoading";
import Staff_sidebar from "../../component/sidebar/InPatientSidebar";
import PatientProfile from "../../pages/hospital_staff/PatientProfile/PatientProfile";
import PatientEdit from "../../pages/hospital_staff/PatientEdit/PatientEdit";
import AddPatient from "../../pages/common/AddPatient/AddPatient";
import AddNeonate from "../../component/AddPatient/AddNeonate";
import AddAdult from "../../component/AddPatient/AddAdult";
import AddChild from "../../component/AddPatient/AddChild";
import DischargePatient from "../../pages/hospital_staff/DischargePatient/DischargePatient";
import Alert from "../../pages/hospital_staff/Alert/AlertTable";
import HelpRoutes from "../common/HelpRoutes";
import { patientStatus } from "../../utility/role";
import Managment from "../../component/DoctorsManagment/Managment";

const InPatientRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedStaffRoute>
            <SimpleBackdrop>
              <Snackbars>
                <Staff_sidebar />
              </Snackbars>
            </SimpleBackdrop>
          </ProtectedStaffRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedStaffRoute>
              <Staff_dashboard />
            </ProtectedStaffRoute>
          }
        />
        <Route path="list">
          <Route
            index
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <InpatientList />
                </Snackbars>
              </ProtectedStaffRoute>
            }
          />
          <Route
            path=":id"
            element={
              <ProtectedStaffRoute>
                <Snackbars>
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
        <Route path="addpatient">
          <Route
            index
            element={
              <ProtectedStaffRoute>
                <AddPatient status={`${patientStatus.inpatient}`} />
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
        <Route path="dischargepatient">
          <Route
            index
            element={
              <ProtectedStaffRoute>
                <DischargePatient />
              </ProtectedStaffRoute>
            }
          />
          <Route
            path=":id"
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <DischargePatientProfile />
                </Snackbars>
              </ProtectedStaffRoute>
            }
          />
        </Route>

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
        
        <Route path="alerts">
          <Route
            index
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <Alert />
                </Snackbars>
              </ProtectedStaffRoute>
            }
          />
          <Route
            path=":id"
            element={
              <ProtectedStaffRoute>
                <Snackbars>
                  <PatientProfile />
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

export default InPatientRoutes;
