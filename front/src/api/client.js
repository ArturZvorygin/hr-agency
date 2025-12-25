// src/api/client.js
const API_URL = "http://localhost:8000/api";

/* ==========================
   helpers для admin-auth
   ========================== */

export function getCurrentAdmin() {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("adminUser");
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function isAdminAuthenticated() {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("adminToken");
    return Boolean(token);
}

/* ==========================
   helpers для client-auth
   ========================== */

export function getCurrentClient() {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("clientUser");
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function isClientAuthenticated() {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token");
    return Boolean(token);
}

export function clearClientAuth() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("clientUser");
}

export function clearAdminAuth() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUser");
}

/* ==========================
   Базовый запрос
   ========================== */

async function request(path, options = {}) {
    const {
        method = "GET",
        body,
        auth = false,
        admin = false,
        headers: extraHeaders = {},
        // _retry = false, // можно будет использовать для auto-refresh
    } = options;

    const headers = {
        "Content-Type": "application/json",
        ...extraHeaders,
    };

    if (auth) {
        const key = admin ? "adminToken" : "token";
        const token =
            typeof window !== "undefined" ? localStorage.getItem(key) : null;
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    const res = await fetch(API_URL + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("API error:", res.status, text);
        throw new Error(`API error: ${res.status}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

/* ==========================
   AUTH (клиент + общий)
   ========================== */

// POST /api/auth/login
export async function loginClient({ email, password }) {
    const data = await request("/auth/login", {
        method: "POST",
        body: { email, password },
    });

    // бэк возвращает { user, accessToken, refreshToken, token }
    if (data.token) {
        localStorage.setItem("token", data.token);
    }
    if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
    }
    if (data.user) {
        localStorage.setItem("clientUser", JSON.stringify(data.user));
    }

    return data;
}

// POST /api/auth/register
export async function registerClient(payload) {
    const data = await request("/auth/register", {
        method: "POST",
        body: payload,
    });

    // можно сразу авторизовать
    if (data.token) {
        localStorage.setItem("token", data.token);
    }
    if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
    }
    if (data.user) {
        localStorage.setItem("clientUser", JSON.stringify(data.user));
    }

    return data;
}

// GET /api/auth/me
export async function fetchMe() {
    return request("/auth/me", {
        method: "GET",
        auth: true,
    });
}

// POST /api/auth/refresh
export async function refreshAuth() {
    if (typeof window === "undefined") {
        throw new Error("Нет доступа к window");
    }
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        throw new Error("Нет refreshToken");
    }

    const data = await request("/auth/refresh", {
        method: "POST",
        body: { refreshToken },
    });

    if (data.token) {
        localStorage.setItem("token", data.token);
    }
    if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
    }
    if (data.user) {
        localStorage.setItem("clientUser", JSON.stringify(data.user));
    }

    return data;
}

// POST /api/auth/logout
export async function logoutClient() {
    if (typeof window === "undefined") return;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
        if (refreshToken) {
            await request("/auth/logout", {
                method: "POST",
                body: { refreshToken },
                auth: true,
            });
        }
    } catch (e) {
        console.warn("logout error:", e);
    } finally {
        clearClientAuth();
    }
}

/* ==========================
   Логин АДМИНА
   ========================== */

// отдельного /api/admin/login нет, используем /api/auth/login
export async function loginAdmin({ email, password }) {
    const data = await request("/auth/login", {
        method: "POST",
        body: { email, password },
    });

    if (!data.user || data.user.role !== "admin") {
        throw new Error("Пользователь не является администратором");
    }

    if (data.token) {
        localStorage.setItem("adminToken", data.token);
    }
    if (data.refreshToken) {
        localStorage.setItem("adminRefreshToken", data.refreshToken);
    }
    if (data.user) {
        localStorage.setItem("adminUser", JSON.stringify(data.user));
    }

    return data;
}

// POST /api/auth/refresh — для админа можно использовать тот же,
// просто подставляя adminRefreshToken / adminToken при желании.
// Пока сделаем простой logout:
export async function logoutAdmin() {
    if (typeof window === "undefined") return;
    const refreshToken = localStorage.getItem("adminRefreshToken");

    try {
        if (refreshToken) {
            await request("/auth/logout", {
                method: "POST",
                body: { refreshToken },
                auth: true,
                admin: true,
            });
        }
    } catch (e) {
        console.warn("logout admin error:", e);
    } finally {
        clearAdminAuth();
    }
}

/* ==========================
   Публичная заявка с лендинга
   ========================== */

// POST /api/public/requests
export async function createPublicRequest(payload) {
    return request("/public/requests", {
        method: "POST",
        body: payload,
    });
}

/* ==========================
   Клиент: компания
   ========================== */

// GET /api/companies/my
export async function getMyCompany() {
    return request("/companies/my", {
        method: "GET",
        auth: true,
    });
}

// PUT /api/companies/my
export async function updateMyCompany(payload) {
    return request("/companies/my", {
        method: "PUT",
        auth: true,
        body: payload,
    });
}

/* ==========================
   Клиент: заявки (личный кабинет)
   ========================== */

// POST /api/requests
export async function createClientRequest(payload) {
    return request("/requests", {
        method: "POST",
        auth: true,
        body: payload,
    });
}

// GET /api/requests/my
export async function getClientRequests(status) {
    const url = status ? `/requests/my?status=${status}` : "/requests/my";
    return request(url, {
        method: "GET",
        auth: true,
    });
}

// GET /api/requests/:id
export async function getClientRequestById(id) {
    return request(`/requests/${id}`, {
        method: "GET",
        auth: true,
    });
}

/* ==========================
   Справочники (dict)
   ========================== */

// GET /api/dict/staff-categories
export async function getStaffCategoriesDict() {
    return request("/dict/staff-categories", {
        method: "GET",
    });
}

// GET /api/dict/services
export async function getServicesDict() {
    return request("/dict/services", {
        method: "GET",
    });
}

/* ==========================
   ADMIN: заявки
   ========================== */

// GET /api/admin/requests
export async function adminGetRequests(status) {
    const url = status ? `/admin/requests?status=${status}` : "/admin/requests";
    return request(url, {
        method: "GET",
        auth: true,
        admin: true,
    });
}

// GET /api/admin/requests/:id
export async function adminGetRequestById(id) {
    return request(`/admin/requests/${id}`, {
        method: "GET",
        auth: true,
        admin: true,
    });
}

// PATCH /api/admin/requests/:id/status
export async function adminChangeRequestStatus(id, status) {
    return request(`/admin/requests/${id}/status`, {
        method: "PATCH",
        auth: true,
        admin: true,
        body: { status },
    });
}

// GET /api/admin/requests/me/assigned
export async function adminGetMyAssignedRequests() {
    return request("/admin/requests/me/assigned", {
        method: "GET",
        auth: true,
        admin: true,
    });
}

/* ==========================
   ADMIN: услуги
   ========================== */

// POST /api/admin/services
export async function adminCreateService(payload) {
    return request("/admin/services", {
        method: "POST",
        auth: true,
        admin: true,
        body: payload,
    });
}

// PUT /api/admin/services/:id
export async function adminUpdateService(id, payload) {
    return request(`/admin/services/${id}`, {
        method: "PUT",
        auth: true,
        admin: true,
        body: payload,
    });
}

// DELETE /api/admin/services/:id
export async function adminDeleteService(id) {
    return request(`/admin/services/${id}`, {
        method: "DELETE",
        auth: true,
        admin: true,
    });
}

/* ==========================
   ADMIN: статистика
   ========================== */

// GET /api/admin/stats/overview
export async function adminGetOverviewStats() {
    return request("/admin/stats/overview", {
        method: "GET",
        auth: true,
        admin: true,
    });
}

/* ==========================
   ВОССТАНОВЛЕНИЕ ПАРОЛЯ
   (эндпоинтов на бэке пока нет)
   ========================== */

export async function forgotPassword(email) {
    // На сервере нет /api/auth/forgot-password — чтобы не было тихих багов,
    // явно кидаем ошибку. Когда добавишь эндпоинт — здесь заменим.
    throw new Error("Функция восстановления пароля ещё не реализована на сервере");
}

export async function resetPassword({ token, password }) {
    throw new Error("Функция сброса пароля ещё не реализована на сервере");
}
// ===== КОМПАНИЯ КЛИЕНТА (профиль) =====

// GET /api/companies/my
export async function getClientCompany() {
    return request("/companies/my", {
        method: "GET",
        auth: true,
    });
}

// PUT /api/companies/my
export async function updateClientCompany(payload) {
    return request("/companies/my", {
        method: "PUT",
        auth: true,
        body: payload,
    });
}
/* ==========================
   ADMIN: компании (клиенты)
   ========================== */

// GET /api/admin/companies
export async function adminGetCompanies() {
    return request("/admin/companies", {
        method: "GET",
        auth: true,
        admin: true,
    });
}

// POST /api/admin/companies
export async function adminCreateCompany(payload) {
    return request("/admin/companies", {
        method: "POST",
        auth: true,
        admin: true,
        body: payload,
    });
}

// PUT /api/admin/companies/:id
export async function adminUpdateCompany(id, payload) {
    return request(`/admin/companies/${id}`, {
        method: "PUT",
        auth: true,
        admin: true,
        body: payload,
    });
}

// DELETE /api/admin/companies/:id
export async function adminDeleteCompany(id) {
    return request(`/admin/companies/${id}`, {
        method: "DELETE",
        auth: true,
        admin: true,
    });
}
/* ==========================
   ADMIN: услуги
   ========================== */

export async function adminGetServices() {
    return request("/admin/services", {
        method: "GET",
        auth: true,
        admin: true,
    });
}
// POST /api/auth/change-password
export async function changeClientPassword(currentPassword, newPassword) {
    return request("/auth/change-password", {
        method: "POST",
        auth: true,
        body: { currentPassword, newPassword },
    });
}

/* ==========================
   ADMIN: назначение менеджера
   ========================== */

// PATCH /api/admin/requests/:id/assign
export async function adminAssignManager(requestId, managerId) {
    return request(`/admin/requests/${requestId}/assign`, {
        method: "PATCH",
        auth: true,
        admin: true,
        body: { managerId },
    });
}

/* ==========================
   ADMIN: комментарии к заявкам
   ========================== */

// POST /api/admin/comments
export async function adminCreateComment(requestId, text) {
    return request("/admin/comments", {
        method: "POST",
        auth: true,
        admin: true,
        body: { requestId, text },
    });
}

// GET /api/admin/comments/request/:requestId
export async function adminGetCommentsByRequest(requestId) {
    return request(`/admin/comments/request/${requestId}`, {
        method: "GET",
        auth: true,
        admin: true,
    });
}

/* ==========================
   ADMIN: категории персонала (CRUD)
   ========================== */

// GET /api/admin/categories
export async function adminGetCategories() {
    return request("/admin/categories", {
        method: "GET",
        auth: true,
        admin: true,
    });
}

// POST /api/admin/categories
export async function adminCreateCategory(payload) {
    return request("/admin/categories", {
        method: "POST",
        auth: true,
        admin: true,
        body: payload,
    });
}

// PUT /api/admin/categories/:id
export async function adminUpdateCategory(id, payload) {
    return request(`/admin/categories/${id}`, {
        method: "PUT",
        auth: true,
        admin: true,
        body: payload,
    });
}

// DELETE /api/admin/categories/:id
export async function adminDeleteCategory(id) {
    return request(`/admin/categories/${id}`, {
        method: "DELETE",
        auth: true,
        admin: true,
    });
}

/* ==========================
   ADMIN: клиенты
   ========================== */

// GET /api/admin/clients
export async function adminGetClients() {
    return request("/admin/clients", {
        method: "GET",
        auth: true,
        admin: true,
    });
}

// GET /api/admin/clients/:id
export async function adminGetClientById(id) {
    return request(`/admin/clients/${id}`, {
        method: "GET",
        auth: true,
        admin: true,
    });
}

// PUT /api/admin/clients/:id
export async function adminUpdateClient(id, payload) {
    return request(`/admin/clients/${id}`, {
        method: "PUT",
        auth: true,
        admin: true,
        body: payload,
    });
}

// PUT /api/admin/clients/:id/company
export async function adminUpdateClientCompany(id, payload) {
    return request(`/admin/clients/${id}/company`, {
        method: "PUT",
        auth: true,
        admin: true,
        body: payload,
    });
}

// DELETE /api/admin/clients/:id
export async function adminDeleteClient(id) {
    return request(`/admin/clients/${id}`, {
        method: "DELETE",
        auth: true,
        admin: true,
    });
}

// POST /api/admin/clients/:id/change-password
export async function adminChangeClientPassword(id, newPassword) {
    return request(`/admin/clients/${id}/change-password`, {
        method: "POST",
        auth: true,
        admin: true,
        body: { newPassword },
    });
}

// PUT /api/admin/requests/:id
export async function adminUpdateRequest(id, payload) {
    return request(`/admin/requests/${id}`, {
        method: "PUT",
        auth: true,
        admin: true,
        body: payload,
    });
}

// DELETE /api/admin/requests/:id
export async function adminDeleteRequest(id) {
    return request(`/admin/requests/${id}`, {
        method: "DELETE",
        auth: true,
        admin: true,
    });
}
