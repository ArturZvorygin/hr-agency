// src/pages/client/ClientRequestsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClientRequests } from "../../api/client.js";

export default function ClientRequestsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log(items, loading, error, "items, loading, error")
    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await getClientRequests();
                // бэк возвращает { requests: [...] }
                const list = Array.isArray(data?.requests) ? data.requests : data;

                if (!cancelled) {
                    setItems(list || []);
                }
            } catch (e) {
                console.error(e);
                if (!cancelled) {
                    setError("Не удалось загрузить заявки");
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
            <h1>Мои заявки</h1>
            <p className="page-subtitle">
                Здесь отображаются заявки на подбор персонала по вашей компании.
            </p>

            {loading && <p>Загружаем заявки…</p>}

            {error && (
                <div className="form-status form-status--error">
                    {error}
                </div>
            )}

            {!loading && !error && items.length === 0 && (
                <p>Пока нет ни одной заявки.</p>
            )}

            {!loading && !error && items.length > 0 && (
                <table className="table">
                    <thead>
                    <tr>
                        <th>Должность</th>
                        <th>Статус</th>
                        <th>Зарплата</th>
                        <th>Создана</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((req) => {
                        const created =
                            req.createdAt && new Date(req.createdAt).toLocaleDateString();
                        const salary =
                            req.salaryFrom || req.salaryTo
                                ? `${req.salaryFrom || ""}${
                                    req.salaryTo ? "–" + req.salaryTo : ""
                                } ${req.currency || "RUB"}`
                                : "—";

                        return (
                            <tr key={req.id}>
                                <td>{req.positionTitle}</td>
                                <td>{req.status}</td>
                                <td>{salary}</td>
                                <td>{created || "—"}</td>
                                <td>
                                    <Link
                                        to={`/client/requests/${req.id}`}
                                        className="link-button"
                                    >
                                        Открыть
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
