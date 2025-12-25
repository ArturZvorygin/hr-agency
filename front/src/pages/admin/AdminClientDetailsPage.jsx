// src/pages/admin/AdminClientDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import {
    adminGetClientById,
    adminUpdateClient,
    adminUpdateClientCompany,
    adminDeleteClient,
    adminChangeClientPassword,
} from "../../api/client.js";

export default function AdminClientDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        isActive: true,
    });

    const [companyForm, setCompanyForm] = useState({
        name: "",
        email: "",
        phone: "",
        website: "",
        description: "",
        industry: "",
        size: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        newPassword: "",
    });

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadClient();
    }, [id]);

    async function loadClient() {
        try {
            setLoading(true);
            setError(null);

            const data = await adminGetClientById(id);
            const c = data?.client || data;

            setClient(c);
            setForm({
                email: c.email || "",
                firstName: c.firstName || "",
                lastName: c.lastName || "",
                phone: c.phone || "",
                isActive: c.isActive !== false,
            });

            setCompanyForm({
                name: c.companyName || "",
                email: c.companyEmail || "",
                phone: c.companyPhone || "",
                website: c.companyWebsite || "",
                description: c.companyDescription || "",
                industry: c.companyIndustry || "",
                size: c.companySize || "",
            });
        } catch (e) {
            console.error(e);
            setError("Не удалось загрузить клиента");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }

    function handleCompanyChange(e) {
        const { name, value } = e.target;
        setCompanyForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSave(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            setSaving(true);

            await adminUpdateClient(id, form);
            await adminUpdateClientCompany(id, companyForm);

            setSuccess("Данные клиента обновлены");
            setEditing(false);
            await loadClient();
        } catch (e) {
            console.error(e);
            setError("Не удалось сохранить изменения");
        } finally {
            setSaving(false);
        }
    }

    async function handleChangePassword(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
            setError("Пароль должен быть не менее 6 символов");
            return;
        }

        try {
            setSaving(true);
            await adminChangeClientPassword(id, passwordForm.newPassword);
            setSuccess("Пароль изменен");
            setPasswordForm({ newPassword: "" });
            setShowPasswordForm(false);
        } catch (e) {
            console.error(e);
            setError("Не удалось изменить пароль");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!window.confirm("Удалить этого клиента? Это действие необратимо.")) return;

        try {
            setSaving(true);
            await adminDeleteClient(id);
            navigate("/admin/clients");
        } catch (e) {
            console.error(e);
            setError("Не удалось удалить клиента");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="page-card"><p>Загрузка...</p></div>;

    if (error && !client) {
        return (
            <div className="page-card">
                <div className="form-status form-status--error">{error}</div>
                <button className="btn btn--ghost" onClick={() => navigate("/admin/clients")}>
                    Назад к списку
                </button>
            </div>
        );
    }

    return (
        <div className="page-card">
            <div className="page-card__header">
                <button type="button" className="link-button" onClick={() => navigate("/admin/clients")}>
                    ← Назад к клиентам
                </button>
            </div>

            <h1>Клиент: {client?.email}</h1>

            {error && <div className="form-status form-status--error">{error}</div>}
            {success && <div className="form-status form-status--success">{success}</div>}

            {!editing && (
                <div style={{ marginTop: 24 }}>
                    <h3>Информация о пользователе</h3>
                    <p><strong>Email:</strong> {client?.email || "—"}</p>
                    <p><strong>Имя:</strong> {client?.firstName || "—"}</p>
                    <p><strong>Фамилия:</strong> {client?.lastName || "—"}</p>
                    <p><strong>Телефон:</strong> {client?.phone || "—"}</p>
                    <p><strong>Активен:</strong> {client?.isActive ? "Да" : "Нет"}</p>
                    <p><strong>Дата регистрации:</strong> {client?.createdAt ? new Date(client.createdAt).toLocaleDateString("ru-RU") : "—"}</p>

                    <h3 style={{ marginTop: 24 }}>Информация о компании</h3>
                    <p><strong>Название:</strong> {client?.companyName || "—"}</p>
                    <p><strong>Email компании:</strong> {client?.companyEmail || "—"}</p>
                    <p><strong>Телефон компании:</strong> {client?.companyPhone || "—"}</p>
                    <p><strong>Веб-сайт:</strong> {client?.companyWebsite || "—"}</p>
                    <p><strong>Отрасль:</strong> {client?.companyIndustry || "—"}</p>
                    <p><strong>Размер:</strong> {client?.companySize || "—"}</p>
                    <p><strong>Описание:</strong> {client?.companyDescription || "—"}</p>

                    <div style={{ marginTop: 24, display: "flex", gap: "1rem" }}>
                        <button className="btn btn--primary" onClick={() => setEditing(true)}>
                            Редактировать
                        </button>
                        <button className="btn btn--ghost" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                            {showPasswordForm ? "Скрыть форму смены пароля" : "Сменить пароль"}
                        </button>
                        <button className="btn btn--danger" onClick={handleDelete} disabled={saving}>
                            Удалить клиента
                        </button>
                    </div>

                    {showPasswordForm && (
                        <form onSubmit={handleChangePassword} style={{ marginTop: 24, maxWidth: 400 }}>
                            <h3>Смена пароля</h3>
                            <Input
                                label="Новый пароль"
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ newPassword: e.target.value })}
                                required
                            />
                            <div style={{ marginTop: 12, display: "flex", gap: "0.5rem" }}>
                                <button type="submit" className="btn btn--primary" disabled={saving}>
                                    {saving ? "Сохраняем..." : "Изменить пароль"}
                                </button>
                                <button type="button" className="btn btn--ghost" onClick={() => setShowPasswordForm(false)}>
                                    Отмена
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {editing && (
                <form className="form-grid" onSubmit={handleSave} style={{ marginTop: 24 }}>
                    <h3 className="field--full">Информация о пользователе</h3>
                    <Input label="Email" name="email" value={form.email} onChange={handleChange} required />
                    <Input label="Имя" name="firstName" value={form.firstName} onChange={handleChange} />
                    <Input label="Фамилия" name="lastName" value={form.lastName} onChange={handleChange} />
                    <Input label="Телефон" name="phone" value={form.phone} onChange={handleChange} />
                    <label className="field">
                        <span className="field__label">Активен</span>
                        <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                    </label>

                    <h3 className="field--full" style={{ marginTop: 24 }}>Информация о компании</h3>
                    <Input label="Название компании" name="name" value={companyForm.name} onChange={handleCompanyChange} required />
                    <Input label="Email компании" name="email" type="email" value={companyForm.email} onChange={handleCompanyChange} />
                    <Input label="Телефон компании" name="phone" value={companyForm.phone} onChange={handleCompanyChange} />
                    <Input label="Веб-сайт" name="website" value={companyForm.website} onChange={handleCompanyChange} />
                    <Input label="Отрасль" name="industry" value={companyForm.industry} onChange={handleCompanyChange} />
                    <Input label="Размер компании" name="size" value={companyForm.size} onChange={handleCompanyChange} />
                    <label className="field field--full">
                        <span className="field__label">Описание</span>
                        <textarea className="field__textarea" name="description" value={companyForm.description} onChange={handleCompanyChange} rows={4} />
                    </label>

                    <div className="form-grid__actions field--full">
                        <Button type="submit" disabled={saving}>
                            {saving ? "Сохраняем..." : "Сохранить изменения"}
                        </Button>
                        <Button type="button" className="btn btn--ghost" onClick={() => setEditing(false)}>
                            Отмена
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
