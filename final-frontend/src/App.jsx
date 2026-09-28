import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgetPassword";
import VerifyOTP from "./components/VerifyOTP";
import ResetPassword from "./components/ResetPassword";
import Main from "./pages/Main";
import useAuth from "./store/useAuth";
import ProjectDetails from "./components/ProjectDetails";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import Project from "./components/Projects.jsx"
import Tasks from "./components/Tasks";
import Calendar from "./components/Calendar";
import Team from "./components/Team";
import Settings from "./components/Settings";

function App() {
  const token = useAuth((state) => state.token);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/main"
          element={token ? <Main /> : <Navigate to="/login" replace />}
        />

        <Route path="/forget" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/"
          element={<Navigate to={token ? "/main" : "/login"} replace />}
        />
        <Route
          path="/projects/:id"
          element={<ProjectDetails />}
        />
        <Route
          path="/messages"
          element={<Messages />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects" element={<Project />} />

        <Route
          path="/tasks"
          element={token ? <Tasks /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/calendar"
          element={token ? <Calendar /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/team"
          element={token ? <Team /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/settings"
          element={token ? <Settings /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;