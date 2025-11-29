// src/layouts/AdminLayout.jsx
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import logo from "../assets/logo-admin.svg";

export default function AdminLayout() {
    const location = useLocation();
    const adminToken =
        typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

    // Если нет adminToken — отправляем на /admin/login
    if (!adminToken) {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{ from: location.pathname + location.search }}
            />
        );
    }

    return (
        <div className="app">
            <aside className="sidebar sidebar--admin">
                <div className="sidebar__logo">
                    <img
                        src={logo}
                        alt="Наши люди – admin"
                        className="sidebar__logo-img"
                    />
                    <span className="sidebar__logo-text">Наши люди · Admin</span>
                </div>
                <NavLink
                    to="/"
                    className="sidebar__item"
                >
                    На сайт
                </NavLink>
                <nav className="sidebar__nav">
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            "sidebar__item" + (isActive ? " sidebar__item--active" : "")
                        }
                    >
                        Главная
                    </NavLink>
                    <NavLink
                        to="/admin/requests"
                        className={({ isActive }) =>
                            "sidebar__item" + (isActive ? " sidebar__item--active" : "")
                        }
                    >
                        Заявки
                    </NavLink>
                    <NavLink
                        to="/admin/clients"
                        className={({ isActive }) =>
                            "sidebar__item" + (isActive ? " sidebar__item--active" : "")
                        }
                    >
                        Клиенты
                    </NavLink>
                    <NavLink
                        to="/admin/services"
                        className={({ isActive }) =>
                            "sidebar__item" + (isActive ? " sidebar__item--active" : "")
                        }
                    >
                        Услуги
                    </NavLink>

                    <div className="sidebar__section-title">Система</div>
                    <button
                        className="sidebar__item sidebar__item--danger"
                        onClick={() => {
                            localStorage.removeItem("adminToken");
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
