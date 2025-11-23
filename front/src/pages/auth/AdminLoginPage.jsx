// src/pages/auth/AdminLoginPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { loginAdmin } from "../../api/client.js";

export default function AdminLoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Если уже залогинен как админ — в админ-панель
    useEffect(() => {
        const adminToken = localStorage.getItem("adminToken");
        if (adminToken) {
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
            const token = await loginAdmin(form);
            localStorage.setItem("adminToken", token);
            navigate("/admin/dashboard");
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
                        label="Email"
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

                    <div className="auth-form__buttons">
                        <Button type="submit">Войти</Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/")}
                        >
                            Назад
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
