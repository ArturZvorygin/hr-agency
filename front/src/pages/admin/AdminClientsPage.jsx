// src/pages/admin/AdminClientsPage.jsx
import { useEffect, useState } from "react";
import { adminGetClients } from "../../api/client.js";

export default function AdminClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                        <th>Дата регистрации</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map((c) => (
                        <tr key={c.id}>
                            <td>{c.email}</td>
                            <td>{c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : "—"}</td>
                            <td>{c.phone || "—"}</td>
                            <td>{c.companyName || "—"}</td>
                            <td>
                                {c.createdAt
                                    ? new Date(c.createdAt).toLocaleDateString("ru-RU")
                                    : "—"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
