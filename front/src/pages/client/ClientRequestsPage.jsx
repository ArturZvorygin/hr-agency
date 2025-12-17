// src/pages/client/ClientRequestsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClientRequests } from "../../api/client.js";

export default function ClientRequestsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await getClientRequests(filterStatus || undefined);
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
    }, [filterStatus]);

    return (
        <div className="page-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                    <h1>Мои заявки</h1>
                    <p className="page-subtitle">
                        Здесь отображаются заявки на подбор персонала по вашей компании.
                    </p>
                </div>
                <Link to="/client/requests/new" className="btn btn-primary">
                    Создать заявку
                </Link>
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label>
                    Фильтр по статусу:{" "}
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">Все</option>
                        <option value="DRAFT">Черновик</option>
                        <option value="NEW">Новая</option>
                        <option value="IN_PROGRESS">В работе</option>
                        <option value="SOURCING">Подбор кандидатов</option>
                        <option value="INTERVIEWS">Собеседования</option>
                        <option value="CLOSED">Закрыта</option>
                        <option value="CANCELLED">Отменена</option>
                    </select>
                </label>
            </div>

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
