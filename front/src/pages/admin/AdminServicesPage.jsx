// src/pages/admin/AdminServicesPage.jsx
import { useEffect, useState } from "react";
import {
    adminGetServices,
    adminCreateService,
    adminUpdateService,
    adminDeleteService,
} from "../../api/client.js";

const emptyForm = {
    name: "",
    basePrice: "",
    description: "",
    isActive: true,
};

export default function AdminServicesPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [mode, setMode] = useState(null); // null | "create" | "edit"
    const [selectedId, setSelectedId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // ====== Загрузка списка услуг ======
    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await adminGetServices();
                const list = Array.isArray(data?.services) ? data.services : data;

                if (!cancelled) {
                    setItems(list || []);
                }
            } catch (e) {
                console.error(e);
                if (!cancelled) {
                    setError("Не удалось загрузить услуги");
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

    // ====== helpers ======
    function openCreateForm() {
        setMode("create");
        setSelectedId(null);
        setForm(emptyForm);
    }

    function openEditForm(service) {
        setMode("edit");
        setSelectedId(service.id);
        setForm({
            name: service.name || "",
            basePrice: service.basePrice != null ? String(service.basePrice) : "",
            description: service.description || "",
            isActive: Boolean(service.isActive),
        });
    }

    function resetForm() {
        setMode(null);
        setSelectedId(null);
        setForm(emptyForm);
        setSaving(false);
        setDeleting(false);
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    // ====== CREATE / UPDATE ======
    async function handleSubmit(e) {
        e.preventDefault();
        if (!mode) return;

        setSaving(true);
        setError(null);

        const payload = {
            name: form.name.trim(),
            basePrice: form.basePrice.trim() || null, // numeric как string
            description: form.description.trim() || null,
            isActive: Boolean(form.isActive),
        };

        try {
            if (!payload.name) {
                setError("Название услуги обязательно");
                setSaving(false);
                return;
            }

            if (mode === "create") {
                const data = await adminCreateService(payload);
                const created = data?.service || data;
                setItems((prev) => [created, ...prev]);
            }

            if (mode === "edit" && selectedId) {
                const data = await adminUpdateService(selectedId, payload);
                const updated = data?.service || data;
                setItems((prev) =>
                    prev.map((s) => (s.id === selectedId ? updated : s))
                );
            }

            resetForm();
        } catch (e) {
            console.error(e);
            setError("Не удалось сохранить изменения");
        } finally {
            setSaving(false);
        }
    }

    // ====== DELETE ======
    async function handleDelete() {
        if (!selectedId) return;
        if (!window.confirm("Удалить эту услугу?")) return;

        setDeleting(true);
        setError(null);

        try {
            await adminDeleteService(selectedId);
            setItems((prev) => prev.filter((s) => s.id !== selectedId));
            resetForm();
        } catch (e) {
            console.error(e);
            setError("Не удалось удалить услугу");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="page-card">
            <div className="page-card__header">
                <div>
                    <h1>Услуги и категории персонала</h1>
                    <p className="page-subtitle">
                        Типовые услуги агентства и базовые цены. Здесь можно
                        добавлять, редактировать и отключать услуги.
                    </p>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn--primary"
                        onClick={openCreateForm}
                    >
                        + Добавить услугу
                    </button>
                </div>
            </div>

            {loading && <p>Загружаем услуги…</p>}

            {error && (
                <div className="form-status form-status--error">{error}</div>
            )}

            {!loading && !error && items.length === 0 && (
                <p>Пока нет ни одной услуги.</p>
            )}

            {!loading && !error && items.length > 0 && (
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Базовая цена</th>
                            <th>Активна</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((s) => (
                            <tr key={s.id}>
                                <td>{s.name}</td>
                                <td style={{ maxWidth: 320 }}>
                                    {s.description || "—"}
                                </td>
                                <td>{s.basePrice ?? "—"}</td>
                                <td>{s.isActive ? "Да" : "Нет"}</td>
                                <td style={{ textAlign: "right" }}>
                                    <button
                                        type="button"
                                        className="btn btn--ghost"
                                        onClick={() => openEditForm(s)}
                                    >
                                        Редактировать
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Форма создания / редактирования */}
            {mode && (
                <div style={{ marginTop: 32 }}>
                    <h2>
                        {mode === "create"
                            ? "Новая услуга"
                            : "Редактирование услуги"}
                    </h2>

                    <form className="form-grid" onSubmit={handleSubmit}>
                        <label className="field field--full">
                            <span className="field__label">Название услуги *</span>
                            <input
                                className="field__input"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">Базовая цена</span>
                            <input
                                className="field__input"
                                name="basePrice"
                                value={form.basePrice}
                                onChange={handleChange}
                                placeholder="например: 90000"
                            />
                        </label>

                        <label className="field field--full">
                            <span className="field__label">Описание</span>
                            <textarea
                                className="field__textarea"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </label>

                        <label className="field">
                            <span className="field__label">Активна</span>
                            <div className="field__checkbox-row">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                />
                                <span>Показывать услугу клиентам и менеджерам</span>
                            </div>
                        </label>

                        <div className="form-grid__actions">
                            <button
                                type="submit"
                                className="btn btn--primary"
                                disabled={saving}
                            >
                                {saving
                                    ? "Сохраняем…"
                                    : mode === "create"
                                        ? "Создать услугу"
                                        : "Сохранить изменения"}
                            </button>

                            <button
                                type="button"
                                className="btn btn--ghost"
                                onClick={resetForm}
                                disabled={saving || deleting}
                            >
                                Отмена
                            </button>

                            {mode === "edit" && selectedId && (
                                <button
                                    type="button"
                                    className="btn btn--danger"
                                    onClick={handleDelete}
                                    disabled={deleting || saving}
                                >
                                    {deleting ? "Удаляем…" : "Удалить услугу"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
