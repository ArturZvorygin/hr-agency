// src/pages/auth/AdminLoginPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { loginAdmin } from "../../api/client.js";

export default function AdminLoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("adminToken")
                : null;
        if (token) {
            navigate("/admin/dashboard", { replace: true });
        }
    }, [navigate]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        try {
            const data = await loginAdmin(form);

            if (!data.user) {
                setError("Ответ сервера без данных пользователя");
                return;
            }

            if (data.user.role !== "admin") {
                setError("У вас нет прав администратора");
                return;
            }

            const from = location.state?.from || "/admin/dashboard";
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            setError("Неверный логин или пароль");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Вход администратора</h1>

                <form onSubmit={handleSubmit} className="auth-form">
                    <Input
                        label="Электронная почта"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Пароль"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    {error && (
                        <div className="form-status form-status--error">{error}</div>
                    )}

                    <Button type="submit">Войти</Button>

                    <div className="auth-form__links">
                        <Link to="/">← На главную</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
