// src/pages/auth/LoginPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { loginClient } from "../../api/client.js";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Если уже есть токен — сразу в кабинет
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/client/dashboard", { replace: true });
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
            const token = await loginClient(form);
            localStorage.setItem("token", token);
            navigate("/client/dashboard");
        } catch (err) {
            console.error(err);
            setError("Неверный логин или пароль");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Вход в личный кабинет</h1>
                <p className="auth-card__subtitle">
                    Используйте email, указанный при регистрации.
                </p>

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

                    <div className="auth-form__links">
                        <Link to="/register">Зарегистрироваться</Link>
                        <Link to="/forgot-password">Забыли пароль?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
