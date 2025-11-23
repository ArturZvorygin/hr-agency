// src/api/client.js
const API_URL = "http://localhost:4000/api";

async function request(path, options = {}) {
    const res = await fetch(API_URL + path, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!res.ok) {
        // Для дебага можно потом добавить вывод текста ошибки
        throw new Error(`API error: ${res.status}`);
    }

    if (res.status === 204) return null;
    const data = await res.json();
    return data;
}

// Публичная заявка с лендинга
export async function createRequest(payload) {
    return request("/public/requests", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// Клиентская авторизация
export async function loginClient({ email, password }) {
    const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
    return data.token;
}

export async function registerClient(payload) {
    return request("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// Восстановление пароля
export async function forgotPassword(email) {
    return request("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export async function resetPassword({ token, password }) {
    return request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
    });
}

// Логин админа
export async function loginAdmin({ email, password }) {
    const data = await request("/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
    return data.token;
}
