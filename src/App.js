import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import ntsaTheme from "./theme/ntsaTheme";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProgramsPage from "./pages/ProgramsPage";
import ProgramDetailPage from "./pages/ProgramDetailPage";
import ActivityDetailPage from "./pages/ActivityDetailPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import RolesPage from "./pages/RolesPage";
import TeamMembersPage from "./pages/TeamMembersPage";
import RoadSafetyActorsPage from "./pages/RoadSafetyActorsPage";
import ReportingPage from "./pages/ReportingPage";
import ResourceCentrePage from "./pages/ResourceCentrePage";
import StakeholdersPage from "./pages/StakeholdersPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="program/:programId" element={<ProgramDetailPage />} />
        <Route path="activity/:activityId" element={<ActivityDetailPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="team-members" element={<TeamMembersPage />} />
        <Route path="road-safety-actors" element={<RoadSafetyActorsPage />} />
        <Route path="reporting" element={<ReportingPage />} />
        <Route path="resource-centre" element={<ResourceCentrePage />} />
        <Route path="stakeholders" element={<StakeholdersPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>
    </Routes>
  );
}

export default App;
