import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { registerClient } from "../../api/client.js";

export default function RegisterPage() {
    const [form, setForm] = useState({
        company: "",
        name: "",
        email: "",
        phone: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        try {
            await registerClient(form);
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError("Ошибка регистрации. Попробуйте позже.");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Регистрация клиента</h1>
                <p className="auth-card__subtitle">
                    После регистрации вы сможете отслеживать заявки в личном кабинете.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <Input
                        label="Компания"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Ваше имя"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Электронная почта"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Телефон"
                        name="phone"
                        value={form.phone}
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
                    {error && <div className="form-status form-status--error">{error}</div>}
                    <Button type="submit">Зарегистрироваться</Button>

                    <div className="auth-form__links">
                        <Link to="/login">Уже есть аккаунт</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
