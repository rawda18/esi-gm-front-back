import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './Context/ThemeContext';
import { RequestProvider } from './Context/RequestContext';
import { ToastProvider } from './Context/ToastContext';

// ============= PUBLIC PAGES (بالأسماء الصحيحة) =============
import LandingPage from './Pages/landing-page'; // تأكدي: landing-page.jsx
import Login from './Pages/Login';
import Register from './Pages/Register';

// ============= DASHBOARDS =============
import SuperAdminDashboard from './Pages/SuperAdminDashboard';
import AdminDashboard from './Pages/AdminDashboard';
import StorekeeperDashboard from './Pages/StorekeeperDashboard';
import StudentDashboard from './Pages/StudentDashboard';

// ============= OTHER PAGES =============
import LaboratoryInventory from './Pages/LaboratoryInventory';
import LaboratoryManagement from './Pages/LaboratoryManagement';
import UserManagement from './Pages/UserManagement';
import RequestWorkflow from './Pages/RequestWorkflow';
import RequestButtonsGuide from './Pages/RequestButtonsGuide';
import MyRequestsPage from './Pages/MyRequestsPage';
import ValidationSlipPage from './Pages/ValidationSlipPage';
import InputOutput from './Pages/inputOutput';
import MaterialTransfers from './Pages/MaterialTransfers';
import QRStockScanner from './Pages/QRStockScanner';
import Maintenance from './Pages/Maintenance';
import MyProject from './Pages/Myproject';
import BrouwseMaterial from './Pages/BrouwseMaterial';
import MaintenanceManagement from './Pages/MaintenanceManagement';
import SettingsPage from './Pages/settings';
import './App.css';

function App() {
  const [dark, setDark] = useState(false);
  const toggleTheme = () => setDark(!dark);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ToastProvider>
          <RequestProvider>
            <div className={dark ? 'dark' : ''}>
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* SUPER ADMIN ROUTES */}
                <Route path="/dashboard/superadmin" element={<SuperAdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/laboratories" element={<LaboratoryManagement />} />

                {/* ADMIN ROUTES */}
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/inventory" element={<LaboratoryInventory />} />
                <Route path="/transfers" element={<MaterialTransfers />} />
                <Route path="/qr-scanner" element={<QRStockScanner />} />
                <Route path="/material-outputs" element={<InputOutput />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* STOREKEEPER ROUTES */}

                <Route
                  path="/dashboard/storekeeper"
                  element={
                    <StorekeeperDashboard
                      onAddMaintenance={(form) =>
                        setMaintenanceList((prev) => [
                          ...prev,
                          {
                            ...form,
                            id: Date.now(),
                            date: new Date().toLocaleDateString('fr-FR'),
                            status: 'Pending',
                          },
                        ])
                      }
                    />
                  }
                />

                <Route path="/maintenance" element={<Maintenance />} />

                {/* STUDENT ROUTES */}
                <Route path="/dashboard/student" element={<StudentDashboard />} />
                <Route path="/projects" element={<MyProject />} />
                <Route path="/requests" element={<RequestWorkflow />} />
                <Route path="/materials/browse" element={<BrouwseMaterial />} />

                <Route
                  path="/my-requests"
                  element={<MyRequestsPage toggleTheme={toggleTheme} dark={dark} />}
                />

                {/* REQUEST WORKFLOW ROUTES */}
                <Route path="/requests/guide" element={<RequestButtonsGuide />} />

                {/* VALIDATION SLIP */}
                <Route path="/validation/:id" element={<ValidationSlipPage dark={dark} />} />

                {/* FALLBACK */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </RequestProvider>
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
