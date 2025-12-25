// src/pages/client/ClientProfilePage.jsx
import { useEffect, useState } from "react";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import {
    getClientCompany,
    updateClientCompany,
    changeClientPassword,
    logoutClient,
} from "../../api/client.js";

export default function ClientProfilePage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        website: "",
        description: "",
        industry: "",
        size: "",
    });

    // ✅ форма смены пароля
    const [pwd, setPwd] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // ✅ отдельные статусы для пароля
    const [pwdSaving, setPwdSaving] = useState(false);
    const [pwdError, setPwdError] = useState(null);
    const [pwdSuccess, setPwdSuccess] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await getClientCompany();
                const company = data?.company || data;

                if (!cancelled && company) {
                    setForm({
                        name: company.name || "",
                        email: company.email || "",
                        phone: company.phone || "",
                        website: company.website || "",
                        description: company.description || "",
                        industry: company.industry || "",
                        size: company.size || "",
                    });
                }
            } catch (e) {
                console.error(e);
                if (!cancelled) setError("Не удалось загрузить данные компании");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handlePwdChange(e) {
        const { name, value } = e.target;
        setPwd((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            setSaving(true);
            const payload = {
                name: form.name,
                email: form.email || null,
                phone: form.phone || null,
                website: form.website || null,
                description: form.description || null,
                industry: form.industry || null,
                size: form.size || null,
            };

            const data = await updateClientCompany(payload);
            const updated = data?.company || data;

            setForm((prev) => ({
                ...prev,
                name: updated.name || "",
                email: updated.email || "",
                phone: updated.phone || "",
                website: updated.website || "",
                description: updated.description || "",
                industry: updated.industry || "",
                size: updated.size || "",
            }));

            setSuccess("Данные компании обновлены");
        } catch (e) {
            console.error(e);
            setError("Не удалось сохранить изменения");
        } finally {
            setSaving(false);
        }
    }

    // ✅ смена пароля
    async function handleChangePassword(e) {
        e.preventDefault();
        setPwdError(null);
        setPwdSuccess(null);

        const currentPassword = String(pwd.currentPassword || "");
        const newPassword = String(pwd.newPassword || "");
        const confirmPassword = String(pwd.confirmPassword || "");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPwdError("Заполните все поля для смены пароля");
            return;
        }
        if (newPassword.length < 6) {
            setPwdError("Новый пароль должен быть не короче 6 символов");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwdError("Новый пароль и подтверждение не совпадают");
            return;
        }
        if (newPassword === currentPassword) {
            setPwdError("Новый пароль должен отличаться от текущего");
            return;
        }

        try {
            setPwdSaving(true);

            await changeClientPassword(currentPassword, newPassword);

            setPwdSuccess("Пароль успешно изменён. Выполните вход заново.");
            setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });

            // ✅ безопасно: после смены пароля — разлогин
            await logoutClient();
            // если хочешь — можно сделать редирект на /login здесь,
            // но если нет navigate в странице — оставим так.
        } catch (err) {
            console.error(err);
            setPwdError("Не удалось сменить пароль. Проверьте текущий пароль.");
        } finally {
            setPwdSaving(false);
        }
    }

    return (
        <div className="page-card">
            <h1>Профиль компании</h1>
            <p className="page-subtitle">
                Эти данные используются в заявках и коммуникации менеджеров с вашей компанией.
            </p>

            {loading && <p>Загружаем данные…</p>}

            {error && <div className="form-status form-status--error">{error}</div>}
            {success && <div className="form-status form-status--success">{success}</div>}

            {!loading && (
                <>
                    <form className="form-grid" onSubmit={handleSubmit}>
                        <Input label="Название компании" name="name" value={form.name} onChange={handleChange} required />
                        <Input label="Email компании" type="email" name="email" value={form.email} onChange={handleChange} />
                        <Input label="Телефон" name="phone" value={form.phone} onChange={handleChange} />
                        <Input label="Сайт" name="website" value={form.website} onChange={handleChange} />
                        <Input label="Отрасль" name="industry" value={form.industry} onChange={handleChange} />
                        <Input
                            label="Размер компании"
                            name="size"
                            value={form.size}
                            onChange={handleChange}
                            placeholder="например: 11–50 сотрудников"
                        />

                        <label className="field field--full">
                            <span className="field__label">Описание компании</span>
                            <textarea
                                className="field__textarea"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </label>

                        <div className="form-grid__actions">
                            <Button type="submit" disabled={saving}>
                                {saving ? "Сохраняем…" : "Сохранить изменения"}
                            </Button>
                        </div>
                    </form>

                    {/* ✅ Блок смены пароля */}
                    <div style={{ marginTop: 28 }}>
                        <h2 style={{ marginBottom: 6 }}>Смена пароля</h2>
                        <p className="page-subtitle" style={{ marginBottom: 12 }}>
                            Для безопасности после смены пароля нужно будет войти заново.
                        </p>

                        {pwdError && <div className="form-status form-status--error">{pwdError}</div>}
                        {pwdSuccess && <div className="form-status form-status--success">{pwdSuccess}</div>}

                        <form className="form-grid" onSubmit={handleChangePassword}>
                            <Input
                                label="Текущий пароль"
                                type="password"
                                name="currentPassword"
                                value={pwd.currentPassword}
                                onChange={handlePwdChange}
                                autoComplete="current-password"
                            />
                            <Input
                                label="Новый пароль"
                                type="password"
                                name="newPassword"
                                value={pwd.newPassword}
                                onChange={handlePwdChange}
                                autoComplete="new-password"
                            />
                            <Input
                                label="Повторите новый пароль"
                                type="password"
                                name="confirmPassword"
                                value={pwd.confirmPassword}
                                onChange={handlePwdChange}
                                autoComplete="new-password"
                            />

                            <div className="form-grid__actions">
                                <Button type="submit" disabled={pwdSaving}>
                                    {pwdSaving ? "Сохраняем…" : "Сменить пароль"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
