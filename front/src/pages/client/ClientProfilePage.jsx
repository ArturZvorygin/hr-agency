// src/pages/client/ClientProfilePage.jsx
import { useEffect, useState } from "react";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import {
    getClientCompany,
    updateClientCompany,
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await getClientCompany();
                // бэк возвращает { company: {...} }
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
                if (!cancelled) {
                    setError("Не удалось загрузить данные компании");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
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

    return (
        <div className="page-card">
            <h1>Профиль компании</h1>
            <p className="page-subtitle">
                Эти данные используются в заявках и коммуникации менеджеров с вашей компанией.
            </p>

            {loading && <p>Загружаем данные…</p>}

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

            {!loading && (
                <form className="form-grid" onSubmit={handleSubmit}>
                    <Input
                        label="Название компании"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Email компании"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <Input
                        label="Телефон"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                    />
                    <Input
                        label="Сайт"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                    />
                    <Input
                        label="Отрасль"
                        name="industry"
                        value={form.industry}
                        onChange={handleChange}
                    />
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
            )}
        </div>
    );
}
