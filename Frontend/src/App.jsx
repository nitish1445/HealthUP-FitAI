import { Routes, Route } from "react-router-dom";
import {
  ProtectedRoute,
  PublicOnlyRoute,
  AdminRoute,
} from "./routes/ProtectedRoute";

import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Onboarding from "./pages/auth/Onboarding";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import Workout from "./pages/dashboard/Workout";
import Diet from "./pages/dashboard/Diet";
import Progress from "./pages/dashboard/Progress";
import Measurements from "./pages/dashboard/Measurements";
import Habits from "./pages/dashboard/Habits";
import Recovery from "./pages/dashboard/Recovery";
import Analytics from "./pages/dashboard/Analytics";
import Roadmap from "./pages/dashboard/Roadmap";
import Coach from "./pages/dashboard/Coach";
import Settings from "./pages/dashboard/Settings";

import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTemplates from "./pages/admin/AdminTemplates";

export default function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes with Header*/}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>

        {/* Auth Public Routes without header */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes for User */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="workout" element={<Workout />} />
            <Route path="diet" element={<Diet />} />
            <Route path="progress" element={<Progress />} />
            <Route path="measurements" element={<Measurements />} />
            <Route path="habits" element={<Habits />} />
            <Route path="recovery" element={<Recovery />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="coach" element={<Coach />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Protected Routes for Admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="templates" element={<AdminTemplates />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
