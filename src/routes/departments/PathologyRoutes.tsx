import { Route, Routes } from "react-router-dom";
import ProtectedStaffRoute from "../../ProtectedRoute/ProtectedStaffRoute";
import Snackbars from "../../component/Snackbar";
import ProfileForm from "../../component/ProfileForm/ProfileForm";
import SimpleBackdrop from "../../component/BackDropLoading/BackDropLoading";
import Dashboard from "../../pages/hospital_labs/dashboard/Dashboard";
import LabsDashboard from "../../pages/hospital_labs/labsDashboard/LabsDashboard";
import LabsSale from "../../pages/hospital_labs/labsSale/LabsSale";
import Reports from "../../pages/hospital_labs/labsPatientProfile/reports/Reports";
import LabsPatientList from "../../pages/hospital_labs/labsPatientList/LabsPatientList";
import LabsPatientProfile from "../../pages/hospital_labs/labsPatientProfile/LabsPatientProfile";
import HelpRoutes from "../common/HelpRoutes";
import Managment from "../../component/DoctorsManagment/Managment";
import LabsAlerts from "../../pages/hospital_labs/labsAlerts/LabsAlert";
import OrdersTabs from "../../pages/hospital_pharmacy/OrderManagement/OrdersTabs";
import TestPricing from "../../pages/hospital_labs/testPricing/TestPricing";
import TaxInvoiceTabs from "../../pages/hospital_pharmacy/TaxInvoice/TaxInvoiceTabs";
import UploadSection from "../../pages/hospital_labs/labsPatientProfile/UploadSection/UploadSection";
import PatientEdit from "../../pages/hospital_staff/PatientEdit/PatientEdit";

const PathologyRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedStaffRoute>
            <SimpleBackdrop>
              <Snackbars>
                <Dashboard />
              </Snackbars>
            </SimpleBackdrop>
          </ProtectedStaffRoute>
        }
      >
        <Route index element={<LabsDashboard />} />
        <Route path="walkin" element={<LabsSale />} />
        <Route path="alerts" element={<LabsAlerts />} />
        <Route path="orderManagement" element={<OrdersTabs />} />
        <Route path="testpricing" element={<TestPricing />} />

        <Route path="taxInvoice" element={<TaxInvoiceTabs type="test"/>} />
        <Route path="list">
          <Route index element={<LabsPatientList />} />

          <Route path=":id">
            <Route index element={<LabsPatientProfile />} />
            <Route path="upload" element={<UploadSection />} />
            <Route path="tests" element={<Reports />} />
          </Route>
        </Route>
        <Route path="Managment" element={<Managment />} />
        <Route
                path="list/:patientId/edit"
                element={
                  <ProtectedStaffRoute>
                    <Snackbars>
                      <PatientEdit />
                    </Snackbars>
                  </ProtectedStaffRoute>
                  }
    />
       
        <Route path="profile" element={<ProfileForm />} />
        <Route path="help/*" element={<HelpRoutes />} />
      </Route>
    </Routes>
  );
};

export default PathologyRoutes;
