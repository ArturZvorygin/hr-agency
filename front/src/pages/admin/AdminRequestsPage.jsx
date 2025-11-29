// src/pages/admin/AdminRequestsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import {
    adminGetRequests,
    adminChangeRequestStatus,
} from "../../api/client.js";

const STATUS_OPTIONS = [
    { value: "new", label: "Новая" },
    { value: "in_progress", label: "В работе" },
    { value: "wait_client", label: "Ожидает клиента" },
    { value: "done", label: "Закрыта" },
    { value: "canceled", label: "Отменена" },
];

export default function AdminRequestsPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await adminGetRequests();
                // бэк может вернуть { requests: [...] } или сразу массив
                const list = Array.isArray(data?.requests) ? data.requests : data;

                if (!cancelled) {
                    setRows(list || []);
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

    async function handleStatusChange(id, nextStatus) {
        try {
            setUpdatingId(id);
            setError(null);

            await adminChangeRequestStatus(id, nextStatus);

            // Локально обновляем строку
            setRows((prev) =>
                prev.map((r) =>
                    r.id === id
                        ? {
                            ...r,
                            status: nextStatus,
                        }
                        : r
                )
            );
        } catch (e) {
            console.error(e);
            setError("Не удалось изменить статус заявки");
        } finally {
            setUpdatingId(null);
        }
    }

    const normalizeLower = (val) =>
        val ? String(val).toLowerCase() : "";

    return (
        <div className="table-block">
            <div className="table-block__header">
                <div>
                    <h2 className="table-block__title">Заявки клиентов</h2>
                    <p className="table-block__subtitle">
                        Общий список заявок с возможностью смены статуса.
                    </p>
                </div>
            </div>

            <div className="table-wrapper">
                {loading && <div className="table-loading">Загрузка…</div>}

                {error && (
                    <div className="form-status form-status--error">
                        {error}
                    </div>
                )}

                {!loading && !error && rows.length === 0 && (
                    <div className="table-empty">Заявок пока нет.</div>
                )}

                {!loading && !error && rows.length > 0 && (
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Клиент</th>
                            <th>Вакансия</th>
                            <th>Ответственный</th>
                            <th>Статус</th>
                            <th>Создана</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((r) => {
                            const currentStatusLower = normalizeLower(r.status);

                            return (
                                <tr
                                    key={r.id}
                                    className="table-row-clickable"
                                >
                                    <td
                                        onClick={() =>
                                            navigate(`/admin/requests/${r.id}`)
                                        }
                                    >
                                        #{String(r.id).slice(0, 8)}
                                    </td>
                                    <td
                                        onClick={() =>
                                            navigate(`/admin/requests/${r.id}`)
                                        }
                                    >
                                        {r.companyName || "—"}
                                    </td>
                                    <td
                                        onClick={() =>
                                            navigate(`/admin/requests/${r.id}`)
                                        }
                                    >
                                        {r.positionTitle}
                                    </td>
                                    <td
                                        onClick={() =>
                                            navigate(`/admin/requests/${r.id}`)
                                        }
                                    >
                                        {r.managerName || "—"}
                                    </td>
                                    <td
                                        onClick={() =>
                                            navigate(`/admin/requests/${r.id}`)
                                        }
                                    >
                                        <StatusBadge
                                            status={String(r.status).toUpperCase()}
                                        />
                                    </td>
                                    <td
                                        onClick={() =>
                                            navigate(`/admin/requests/${r.id}`)
                                        }
                                    >
                                        {r.createdAt
                                            ? new Date(
                                                r.createdAt
                                            ).toLocaleDateString("ru-RU")
                                            : "—"}
                                    </td>
                                    <td>
                                        <select
                                            className="field__input"
                                            value={currentStatusLower}
                                            disabled={updatingId === r.id}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    r.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {STATUS_OPTIONS.map((opt) => (
                                                <option
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
