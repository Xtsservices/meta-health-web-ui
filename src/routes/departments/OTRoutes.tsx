import { Route, Routes } from "react-router-dom";
import ProtectedStaffRoute from "../../ProtectedRoute/ProtectedStaffRoute";
import Snackbars from "../../component/Snackbar";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import SimpleBackdrop from "../../component/BackDropLoading/BackDropLoading";
import OT_sidebar from "../../component/sidebar/OTSidebar";
import OTScreenTypeWrapper from "../../pages/hospital_ot/ScreenTypeWrapper";
import OTDashboard from "../../pages/dashboard_ot/dashboard";
import PatientList from "../../pages/hospital_ot/PatientList/PatientList";
import PatientProfileOT from "../../pages/hospital_ot/PatientProfile/PatientProfile";
import PatientEditOT from "../../pages/hospital_ot/PatientEdit/PatientEdit";
import EditMedicalHistory from "../../pages/hospital_staff/PatientEdit/EditMedicalHistory";
import HelpRoutes from "../common/HelpRoutes";
import Managment from "../../component/DoctorsManagment/Managment";

const OTRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedStaffRoute>
            <SimpleBackdrop>
              <Snackbars>
                <OT_sidebar />
              </Snackbars>
            </SimpleBackdrop>
          </ProtectedStaffRoute>
        }
      >
        <Route index element={<OTDashboard />} />
        <Route path="emergency" element={<OTScreenTypeWrapper />}>
          <Route index element={<PatientList />} />
          <Route path=":id" element={<PatientProfileOT />} />
          <Route path=":patientId/edit" element={<PatientEditOT />} />
          <Route
            path=":patientId/edit/medicalHistory"
            element={<EditMedicalHistory />}
          />
        </Route>
        <Route path="elective" element={<OTScreenTypeWrapper />}>
          <Route index element={<PatientList />} />
          <Route path=":id" element={<PatientProfileOT />} />
          <Route path=":patientId/edit" element={<PatientEditOT />} />
          <Route
            path=":patientId/edit/medicalHistory"
            element={<EditMedicalHistory />}
          />
        </Route>
        <Route path="Managment" element={<Managment />} />
        <Route path="profile" element={<ProfileForm />} />
        <Route path="help/*" element={<HelpRoutes />} />
      </Route>
    </Routes>
  );
};
export default OTRoutes;
