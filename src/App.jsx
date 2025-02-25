import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './Components/Auth/AuthContext';
import { getUserPermissions } from './Components/Auth/passwords';
import Home from './Components/Home/Home';
import Login from './Components/Home/Login';
import AdminDashboard from './Components/Dashbord/Admin/AdminDashboard/';
import UserManagement from './Components/Dashbord/Admin/UserManagement/UserManagement';
import Settings from './Components/Dashbord/Admin/Settings/Settings';
import PatientDashboard from './Components/Dashbord/Patient/PatientDashboard';
import PhysicianDashboard from './Components/Dashbord/Physician/PhysicianDashboard';
import ReceptionistDashboard from './Components/Dashbord/Reception/ReceptionistDashboard';
import RequestAdvice from './Components/Dashbord/Patient/RequestAdvice';
import AddAppointment from './Components/Dashbord/Patient/AddAppointment';
import Recommendations from './Components/Dashbord/Patient/Recommendations';
import Feedback from './Components/Dashbord/Patient/Feedback';
import RegisterPatient from './Components/Dashbord/Reception/RegisterPatient';
import AssignPhysician from './Components/Dashbord/Reception/AssignPhysician';
import GenerateReport from './Components/Dashbord/Physician/GenerateReport';
import InsertAdvice from './Components/Dashbord/Physician/InsertAdvice';
import ApproveRecommendations from './Components/Dashbord/Physician/ApproveRecommendations';
import ViewPatients from './Components/Dashbord/Physician/ViewPatients';
import ViewAppointments from './Components/Dashbord/Physician/ViewAppointments';
import UpdatePatient from './Components/Dashbord/Physician/UpdatePatient';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const { user, updatePermissions, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Try to restore user session from localStorage on page load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      login(parsedUser);
    }
    setLoading(false);
  }, [login]);

  const getDefaultPermissions = useCallback((role) => {
    const defaultPermissions = {
      admin: ['all_access', 'manage_users', 'manage_settings'],
      patient: ['view_appointments', 'book_appointments', 'view_profile'],
      receptionist: ['manage_appointments', 'view_patients', 'schedule_appointments']
    };
    return defaultPermissions[role] || [];
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPermissions = async () => {
      if (!user) {
        setLoading(false);
        updatePermissions([]);
        return;
      }

      try {
        setLoading(true);
        const rolePermissions = getDefaultPermissions(user.role);
        
        let serverPermissions = [];
        if (user.id) {
          try {
            serverPermissions = await getUserPermissions(user.id);
          } catch (err) {
            console.error('Error fetching server permissions:', err);
          }
        }

        if (isMounted) {
          const allPermissions = [...new Set([...rolePermissions, ...serverPermissions])];
          updatePermissions(allPermissions);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error in permission setup:', err);
          const rolePermissions = getDefaultPermissions(user.role);
          updatePermissions(rolePermissions);
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchPermissions();

    return () => {
      isMounted = false;
    };
  }, [user, updatePermissions, getDefaultPermissions]);

  if (loading) return <p>Loading permissions...</p>;
  if (error) return <p>Error loading permissions: {error.message}</p>;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Routes>
            <Route path="admin/*" element={
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            } />
            <Route path="patient/*" element={
              <Routes>
                <Route index element={<PatientDashboard />} />
                <Route path="request-advice" element={<RequestAdvice />} />
                <Route path="add-appointment" element={<AddAppointment />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="feedback" element={<Feedback />} />
              </Routes>
            } />
            <Route path="physician/*" element={
              <Routes>
                <Route index element={<PhysicianDashboard />} />
                <Route path="generate-report" element={<GenerateReport />} />
                <Route path="insert-advice" element={<InsertAdvice />} />
                <Route path="approve-recommendations" element={<ApproveRecommendations />} />
                <Route path="view-patients" element={<ViewPatients />} />
                <Route path="view-appointments" element={<ViewAppointments />} />
                <Route path="update-patient" element={<UpdatePatient />} />
              </Routes>
            } />
            <Route path="receptionist/*" element={
              <Routes>
                <Route index element={<ReceptionistDashboard />} />
                <Route path="register-patient" element={<RegisterPatient />} />
                <Route path="assign-physician" element={<AssignPhysician />} />
              </Routes>
            } />
          </Routes>
        </ProtectedRoute>
      } />

      {/* Default route - redirects based on user role or to login if no user */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={`/dashboard/${user.role}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch all route */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to={`/dashboard/${user.role}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;