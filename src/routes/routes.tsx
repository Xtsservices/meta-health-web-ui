import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/login/login";
import Home from "../pages/home/home";
import ProtectedHomeRoute from "../ProtectedRoute/ProtectedHomeRoute";
import Snackbars from "../component/Snackbar";
import YantramWebsite from "../pages/website/YantramWebsite";
import TermsOfService from "../pages/home/termsOfService";
import PrivacyPolicy from "../pages/home/PrivacyAndPolicy";
import InPatientRoutes from "../routes/departments/InPatientRoutes";
import OpdRoutes from "../routes/departments/OpdRoutes";
import AdminRoutes from "../routes/admin/AdminRoutes";
import SuperAdminRoutes from "../routes/admin/SuperAdminRoutes";
import TriageRoutes from "../routes/triage/TriageRoutes";
import EmergencyRedRoutes from "../routes/emergency/EmergencyRedRoutes";
import EmergencyYellowRoutes from "../routes/emergency/EmergencyYellowRoutes";
import EmergencyGreenRoutes from "../routes/emergency/EmergencyGreenRoutes";
import OTRoutes from "../routes/departments/OTRoutes";
import PathologyRoutes from "../routes/departments/PathologyRoutes";
import RadiologyRoutes from "../routes/departments/RadiologyRoutes";
import PharamacyRoutes from "../routes/departments/PharmacyRoutes";
import ReceptionRoute from "../routes/reception/ReceptionRoute";
import NurseRoutes from "./nurse/NurseRoutes";
import DeleteAccountForm from "../pages/website/DeleteAccountForm";
import CustomerCareRoutes from "./admin/CustomerCareRoutes";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<YantramWebsite />} />
      <Route path="/deleteuser" element={<DeleteAccountForm />} />
      <Route
        path="/hospital-dashboard"
        element={
          <ProtectedHomeRoute>
            <Home />
          </ProtectedHomeRoute>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <ProtectedHomeRoute>
            <PrivacyPolicy />
          </ProtectedHomeRoute>
        }
      />
      <Route
        path="/terms-of-service"
        element={
          <ProtectedHomeRoute>
            <TermsOfService />
          </ProtectedHomeRoute>
        }
      />
      <Route
        path="/login"
        element={
          <Snackbars>
            <Login />
          </Snackbars>
        }
      />
      <Route
        path="/hospital-dashboard/inpatient/*"
        element={<InPatientRoutes />}
      />
      <Route path="/hospital-dashboard/opd/*" element={<OpdRoutes />} />
      <Route path="/inpatient/admin/*" element={<AdminRoutes />} />
      <Route path="/nurse/*" element={<NurseRoutes />} />
      <Route path="sadmin/*" element={<SuperAdminRoutes />} />
      <Route path="customerCare/*" element={<CustomerCareRoutes />} />
      <Route path="/hospital-dashboard/triage/*" element={<TriageRoutes />} />
      <Route
        path="/hospital-dashboard/emergency-red/*"
        element={<EmergencyRedRoutes />}
      />
      <Route
        path="/hospital-dashboard/emergency-yellow/*"
        element={<EmergencyYellowRoutes />}
      />
      <Route
        path="/hospital-dashboard/emergency-green/*"
        element={<EmergencyGreenRoutes />}
      />
      <Route path="/hospital-dashboard/ot/*" element={<OTRoutes />} />
      <Route
        path="/hospital-dashboard/pathology/*"
        element={<PathologyRoutes />}
      />
      <Route
        path="/hospital-dashboard/radiology/*"
        element={<RadiologyRoutes />}
      />
      <Route path="hospital-dashboard/pharmacy/*" element={<PharamacyRoutes />} />
      <Route
        path="/hospital-dashboard/reception/*"
        element={<ReceptionRoute />}
      />
    </Routes>
  );
};

export default AppRoutes;
