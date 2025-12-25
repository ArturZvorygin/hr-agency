// src/pages/admin/AdminClientsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminGetClients } from "../../api/client.js";

export default function AdminClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await adminGetClients();
                const list = Array.isArray(data?.clients) ? data.clients : data;

                if (!cancelled) {
                    setClients(list || []);
                }
            } catch (e) {
                console.error(e);
                if (!cancelled) {
                    setError("Не удалось загрузить клиентов");
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

    return (
        <div className="page-card">
            <h1>Клиенты</h1>
            <p className="page-subtitle">
                Список клиентов системы
            </p>

            {loading && <p>Загружаем клиентов…</p>}

            {error && (
                <div className="form-status form-status--error">
                    {error}
                </div>
            )}

            {!loading && !error && clients.length === 0 && (
                <p>Пока нет ни одного клиента.</p>
            )}

            {!loading && !error && clients.length > 0 && (
                <table className="table">
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Имя</th>
                        <th>Телефон</th>
                        <th>Компания</th>
                        <th>Веб-сайт</th>
                        <th>Отрасль</th>
                        <th>Дата регистрации</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map((c) => (
                        <tr key={c.id} className="table-row-clickable">
                            <td onClick={() => navigate(`/admin/clients/${c.id}`)}>{c.email}</td>
                            <td onClick={() => navigate(`/admin/clients/${c.id}`)}>
                                {c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : "—"}
                            </td>
                            <td onClick={() => navigate(`/admin/clients/${c.id}`)}>{c.phone || "—"}</td>
                            <td onClick={() => navigate(`/admin/clients/${c.id}`)}>{c.companyName || "—"}</td>
                            <td onClick={() => navigate(`/admin/clients/${c.id}`)}>{c.companyWebsite || "—"}</td>
                            <td onClick={() => navigate(`/admin/clients/${c.id}`)}>{c.companyIndustry || "—"}</td>
                            <td onClick={() => navigate(`/admin/clients/${c.id}`)}>
                                {c.createdAt
                                    ? new Date(c.createdAt).toLocaleDateString("ru-RU")
                                    : "—"}
                            </td>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn--ghost"
                                    onClick={() => navigate(`/admin/clients/${c.id}`)}
                                >
                                    Подробнее
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
