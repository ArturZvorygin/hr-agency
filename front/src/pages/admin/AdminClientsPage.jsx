// src/pages/admin/AdminClientsPage.jsx
import { useEffect, useState } from "react";
import { adminGetRequests } from "../../api/client.js";

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

                const data = await adminGetRequests();
                const list = Array.isArray(data?.requests) ? data.requests : data;

                const map = new Map();

                (list || []).forEach((r) => {
                    const key = r.companyId || r.companyName || "unknown";
                    const name = r.companyName || "Без названия";
                    const status = r.status ? String(r.status).toLowerCase() : "";
                    const createdAt = r.createdAt ? new Date(r.createdAt) : null;

                    if (!map.has(key)) {
                        map.set(key, {
                            key,
                            name,
                            totalRequests: 0,
                            activeRequests: 0,
                            lastRequestAt: null,
                        });
                    }

                    const entry = map.get(key);
                    entry.totalRequests += 1;

                    if (
                        status === "new" ||
                        status === "in_progress" ||
                        status === "wait_client"
                    ) {
                        entry.activeRequests += 1;
                    }

                    if (createdAt) {
                        if (!entry.lastRequestAt || createdAt > entry.lastRequestAt) {
                            entry.lastRequestAt = createdAt;
                        }
                    }
                });

                const result = Array.from(map.values()).sort((a, b) =>
                    (b.lastRequestAt?.getTime() || 0) - (a.lastRequestAt?.getTime() || 0)
                );

                if (!cancelled) {
                    setClients(result);
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
                Компании, по которым есть заявки в системе.
            </p>

            {loading && <p>Загружаем клиентов…</p>}

            {error && (
                <div className="form-status form-status--error">
                    {error}
                </div>
            )}

            {!loading && !error && clients.length === 0 && (
                <p>Пока нет ни одного клиента с заявками.</p>
            )}

            {!loading && !error && clients.length > 0 && (
                <table className="table">
                    <thead>
                    <tr>
                        <th>Компания</th>
                        <th>Всего заявок</th>
                        <th>Активные</th>
                        <th>Последняя заявка</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map((c) => (
                        <tr key={c.key}>
                            <td>{c.name}</td>
                            <td>{c.totalRequests}</td>
                            <td>{c.activeRequests}</td>
                            <td>
                                {c.lastRequestAt
                                    ? c.lastRequestAt.toLocaleDateString("ru-RU")
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
