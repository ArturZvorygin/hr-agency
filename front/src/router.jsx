import { Routes, Route, Navigate } from "react-router-dom";

import ClientLayout from "./layouts/ClientLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import HomePage from "./pages/public/HomePage.jsx";
import RequestFormPage from "./pages/public/RequestFormPage.jsx";

import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";
import AdminLoginPage from "./pages/auth/AdminLoginPage.jsx";

import ClientDashboardPage from "./pages/client/ClientDashboardPage.jsx";
import ClientRequestsPage from "./pages/client/ClientRequestsPage.jsx";
import ClientNewRequestPage from "./pages/client/ClientNewRequestPage.jsx";
import ClientRequestDetailsPage from "./pages/client/ClientRequestDetailsPage.jsx";
import ClientProfilePage from "./pages/client/ClientProfilePage.jsx";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminRequestsPage from "./pages/admin/AdminRequestsPage.jsx";
import AdminRequestDetailsPage from "./pages/admin/AdminRequestDetailsPage.jsx";
import AdminClientsPage from "./pages/admin/AdminClientsPage.jsx";
import AdminServicesPage from "./pages/admin/AdminServicesPage.jsx";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage.jsx";

export default function AppRouter() {
    return (
        <Routes>
            {/* Публичная часть */}
            <Route path="/" element={<HomePage />} />
            <Route path="/request" element={<RequestFormPage />} />

            {/* Клиентская авторизация */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Админский вход */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Личный кабинет клиента */}
            <Route element={<ClientLayout />}>
                <Route path="/client/dashboard" element={<ClientDashboardPage />} />
                <Route path="/client/requests" element={<ClientRequestsPage />} />
                <Route path="/client/requests/new" element={<ClientNewRequestPage />} />
                <Route
                    path="/client/requests/:id"
                    element={<ClientRequestDetailsPage />}
                />
                <Route path="/client/profile" element={<ClientProfilePage />} />
            </Route>

            {/* Админка */}
            <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/requests" element={<AdminRequestsPage />} />
                <Route
                    path="/admin/requests/:id"
                    element={<AdminRequestDetailsPage />}
                />
                <Route path="/admin/clients" element={<AdminClientsPage />} />
                <Route path="/admin/services" element={<AdminServicesPage />} />
                <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
