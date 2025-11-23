// src/layouts/ClientLayout.jsx
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import logo from "../assets/logo-main.svg";

export default function ClientLayout() {
    const location = useLocation();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Если нет токена — отправляем на /login
    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname + location.search }}
            />
        );
    }

    return (
        <div className="app">
            <aside className="sidebar">
                <div className="sidebar__logo">
                    <img src={logo} alt="Наши люди" className="sidebar__logo-img" />
                    <span className="sidebar__logo-text">Наши люди</span>
                </div>

                <nav className="sidebar__nav">
                    <NavLink
                        to="/client/dashboard"
                        className={({ isActive }) =>
                            "sidebar__item" + (isActive ? " sidebar__item--active" : "")
                        }
                    >
                        Главная
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
                            window.location.href = "/login";
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
