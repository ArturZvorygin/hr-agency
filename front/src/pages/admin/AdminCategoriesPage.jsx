// src/pages/admin/AdminCategoriesPage.jsx
import { useEffect, useState } from "react";
import {
    adminGetCategories,
    adminCreateCategory,
    adminUpdateCategory,
    adminDeleteCategory,
} from "../../api/client.js";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ code: "", name: "", description: "" });

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            setLoading(true);
            setError(null);
            const data = await adminGetCategories();
            setCategories(data.categories || []);
        } catch (e) {
            console.error(e);
            setError("Не удалось загрузить категории");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError(null);
            if (editingId) {
                await adminUpdateCategory(editingId, formData);
            } else {
                await adminCreateCategory(formData);
            }
            setFormData({ code: "", name: "", description: "" });
            setEditingId(null);
            await loadCategories();
        } catch (e) {
            console.error(e);
            setError("Не удалось сохранить категорию");
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Удалить категорию?")) return;
        try {
            setError(null);
            await adminDeleteCategory(id);
            await loadCategories();
        } catch (e) {
            console.error(e);
            setError("Не удалось удалить категорию");
        }
    }

    function handleEdit(cat) {
        setEditingId(cat.id);
        setFormData({ code: cat.code, name: cat.name, description: cat.description || "" });
    }

    function handleCancel() {
        setEditingId(null);
        setFormData({ code: "", name: "", description: "" });
    }

    return (
        <div className="page-card">
            <h1>Категории персонала</h1>
            <p className="page-subtitle">Управление категориями персонала для подбора</p>

            {error && <div className="form-status form-status--error">{error}</div>}

            <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Код (например: IT)"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                        style={{ flex: 1 }}
                    />
                    <input
                        type="text"
                        placeholder="Название"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        style={{ flex: 2 }}
                    />
                </div>
                <textarea
                    placeholder="Описание (необязательно)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{ width: "100%", marginBottom: "1rem" }}
                />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="submit" className="btn btn-primary">
                        {editingId ? "Обновить" : "Создать"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={handleCancel} className="btn">
                            Отмена
                        </button>
                    )}
                </div>
            </form>

            {loading && <p>Загрузка...</p>}

            {!loading && categories.length === 0 && <p>Категорий пока нет</p>}

            {!loading && categories.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Код</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.code}</td>
                                <td>{cat.name}</td>
                                <td>{cat.description || "—"}</td>
                                <td>
                                    <button onClick={() => handleEdit(cat)} className="link-button">
                                        Редактировать
                                    </button>
                                    {" | "}
                                    <button onClick={() => handleDelete(cat.id)} className="link-button" style={{ color: "red" }}>
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
