// src/layouts/ClientLayout.jsx
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import logo from "../assets/logo-main.svg";
import { getCurrentClient, isClientAuthenticated } from "../api/client.js";

export default function ClientLayout() {
    const location = useLocation();

    // проверка авторизации через хелпер
    const authed = isClientAuthenticated();
    const currentClient = getCurrentClient();

    // защита роутов: если не залогинен — уводим на /login
    if (!authed) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname + location.search }}
            />
        );
    }

    const userLabel =
        currentClient?.firstName ||
        currentClient?.email ||
        "Клиент";

    const initials =
        userLabel?.[0]?.toUpperCase() || "К";

    return (
        <div className="app">
            <aside className="sidebar">
                {/* Лого */}
                <div className="sidebar__logo">
                    <img src={logo} alt="Наши люди" className="sidebar__logo-img" />
                    <span className="sidebar__logo-text">Наши люди</span>
                </div>

                {/* Блок пользователя в сайдбаре */}
                <div className="sidebar__user">
                    <div className="sidebar__user-avatar">{initials}</div>
                    <div className="sidebar__user-info">
                        <div className="sidebar__user-name">
                            {userLabel}
                        </div>
                        <div className="sidebar__user-role">
                            {/* тут просто пояснение, кто это */}
                            Клиент компании
                        </div>
                    </div>
                </div>

                {/* Меню клиента */}
                <nav className="sidebar__nav">
                    <NavLink
                        to="/client/dashboard"
                        className={({ isActive }) =>
                            "sidebar__item" + (isActive ? " sidebar__item--active" : "")
                        }
                    >
                        Главная
                    </NavLink>

                    <NavLink to="/" className="sidebar__item">
                        На сайт
                    </NavLink>

                    <NavLink
                        to="/client/requests"
                        className={({ isActive }) =>
                            "sidebar__item" + (isActive ? " sidebar__item--active" : "")
                        }
                    >
                        Мои заявки
                    </NavLink>

                    <NavLink
                        to="/client/profile"
                        className={({ isActive }) =>
                            "sidebar__item" + (isActive ? " sidebar__item--active" : "")
                        }
                    >
                        Профиль
                    </NavLink>

                    <div className="sidebar__section-title">Система</div>
                    <button
                        className="sidebar__item sidebar__item--danger"
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("refreshToken");
                            localStorage.removeItem("clientUser");
                            window.location.href = "/";
                        }}
                    >
                        Выйти
                    </button>
                </nav>
            </aside>

            <main className="main">
                <Outlet />
            </main>
        </div>
    );
}
