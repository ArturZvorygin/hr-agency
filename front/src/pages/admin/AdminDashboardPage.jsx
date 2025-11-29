// src/pages/admin/AdminDashboardPage.jsx
import { useEffect, useState } from "react";
import { adminGetRequests } from "../../api/client.js";

export default function AdminDashboardPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await adminGetRequests();
                // бэк может вернуть { requests: [...] } или массив
                const list = Array.isArray(data?.requests) ? data.requests : data;

                if (!cancelled) {
                    setRows(list || []);
                }
            } catch (e) {
                console.error(e);
                if (!cancelled) {
                    setError("Не удалось загрузить статистику по заявкам");
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

    const lower = (s) => (s ? String(s).toLowerCase() : "");

    // Считаем реальные цифры по статусам
    const newRequests = rows.filter((r) => lower(r.status) === "new").length;
    const inWork = rows.filter((r) => {
        const s = lower(r.status);
        return s === "in_progress" || s === "wait_client";
    }).length;
    const closed = rows.filter((r) => lower(r.status) === "done").length;

    // Кол-во клиентов по уникальным companyId / companyName
    const clientKeys = new Set(
        rows.map((r) => r.companyId || r.companyName).filter(Boolean)
    );
    const clientsCount = clientKeys.size;

    return (
        <>
            <header className="header">
                <div className="header__left">
                    <h1 className="header__title">Главная – администратор</h1>
                    <p className="header__subtitle">
                        Сводка по заявкам и активности клиентов.
                    </p>
                </div>
            </header>

            {error && (
                <div className="form-status form-status--error" style={{ marginBottom: 16 }}>
                    {error}
                </div>
            )}

            <section className="cards">
                <div className="card card--primary">
                    <div className="card__label">Новые заявки</div>
                    <div className="card__value">
                        {loading ? "…" : newRequests}
                    </div>
                    <div className="card__meta">за всё время</div>
                </div>
                <div className="card">
                    <div className="card__label">В работе</div>
                    <div className="card__value">
                        {loading ? "…" : inWork}
                    </div>
                    <div className="card__meta">подбор кандидатов</div>
                </div>
                <div className="card">
                    <div className="card__label">Закрыто</div>
                    <div className="card__value">
                        {loading ? "…" : closed}
                    </div>
                    <div className="card__meta">по всем клиентам</div>
                </div>
                <div className="card">
                    <div className="card__label">Клиентов в системе</div>
                    <div className="card__value">
                        {loading ? "…" : clientsCount}
                    </div>
                    <div className="card__meta">с активными заявками</div>
                </div>
            </section>
        </>
    );
}
