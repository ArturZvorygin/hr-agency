// src/pages/client/ClientChangePasswordPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { changeClientPassword } from "../../api/client.js";

export default function ClientChangePasswordPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (form.newPassword !== form.confirmPassword) {
            setError("Новый пароль и подтверждение не совпадают");
            return;
        }

        if (form.newPassword.length < 6) {
            setError("Новый пароль должен быть не менее 6 символов");
            return;
        }

        try {
            setLoading(true);
            await changeClientPassword(form.currentPassword, form.newPassword);
            setSuccess("Пароль успешно изменен");
            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (e) {
            console.error(e);
            setError("Не удалось изменить пароль. Проверьте текущий пароль.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page-card">
            <h1>Смена пароля</h1>
            <p className="page-subtitle">
                Измените пароль для входа в систему
            </p>

            {error && (
                <div className="form-status form-status--error">
                    {error}
                </div>
            )}

            {success && (
                <div className="form-status form-status--success">
                    {success}
                </div>
            )}

            <form className="form-grid" onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
                <Input
                    label="Текущий пароль *"
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Новый пароль *"
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Подтвердите новый пароль *"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <div className="form-grid__actions">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Сохраняем..." : "Изменить пароль"}
                    </Button>
                    <Button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => navigate("/client/profile")}
                    >
                        Отмена
                    </Button>
                </div>
            </form>
        </div>
    );
}
