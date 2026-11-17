import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './design-system/components/Toast';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { UsersPage } from './pages/users/UsersPage';
import { CoursesPage } from './pages/courses/CoursesPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { SchedulePage } from './pages/schedule/SchedulePage';
import { GradesPage } from './pages/grades/GradesPage';
import { PaymentsPage } from './pages/payments/PaymentsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Ochiq yo'nalishlar */}
              <Route path="/login" element={<LoginPage />} />

              {/* Himoyalangan asosiy yo'nalishlar */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/schedule" element={<SchedulePage />} />
                  <Route path="/grades" element={<GradesPage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/forbidden" element={<ForbiddenPage />} />
                </Route>
              </Route>

              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
