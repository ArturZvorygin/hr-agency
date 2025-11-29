// src/pages/client/ClientDashboardPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { getClientRequests, getCurrentClient } from "../../api/client.js";

export default function ClientDashboardPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const currentClient = getCurrentClient();

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
                    setRequests(list || []);
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

    // нормализация статуса под бейдж (в БД status = 'new' | 'in_progress' и т.п.)
    const normalizeStatus = (status) => {
        if (!status) return "";
        return String(status).toUpperCase();
    };

    const lower = (s) => (s ? String(s).toLowerCase() : "");

    // вычисляем статистику из реальных заявок
    const activeRequests = requests.filter((r) => {
        const s = lower(r.status);
        return s === "new" || s === "in_progress" || s === "wait_client";
    }).length;

    const closedVacancies = requests.filter(
        (r) => lower(r.status) === "done"
    ).length;

    const inSalesWork = requests.filter(
        (r) => lower(r.status) === "wait_client"
    ).length;

    // пока "новые кандидаты" считаем как количество активных заявок
    const newCandidates = activeRequests;

    const userName = currentClient?.firstName || currentClient?.email || "Клиент";
    const userCompany =
        currentClient?.companyName || currentClient?.email || "Моя компания";

    return (
        <>
            <header className="header">
                <div className="header__left">
                    <h1 className="header__title">Главная – личный кабинет</h1>
                    <p className="header__subtitle">
                        Сводка по вашим заявкам и вакансиям
                    </p>
                </div>

                <div className="header__right">
                    <div className="header__search">
                        <input
                            type="text"
                            placeholder="Поиск по заявкам и вакансиям…"
                            // логика поиска — позже, сейчас это просто UI
                        />
                    </div>
                    <button className="header__icon-button" aria-label="Уведомления">
                        🔔
                    </button>
                    <div className="header__user">
                        <div className="header__user-info">
                            <span className="header__user-name">{userName}</span>
                            <span className="header__user-role">{userCompany}</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="cards">
                <Card className="card--primary">
                    <div className="card__label">Активные заявки</div>
                    <div className="card__value">{activeRequests}</div>
                    <div className="card__meta">+0 за сегодня</div>
                </Card>
                <Card>
                    <div className="card__label">Новые кандидаты</div>
                    <div className="card__value">{newCandidates}</div>
                    <div className="card__meta">по активным заявкам</div>
                </Card>
                <Card>
                    <div className="card__label">Закрытые вакансии</div>
                    <div className="card__value">{closedVacancies}</div>
                    <div className="card__meta">за всё время</div>
                </Card>
                <Card>
                    <div className="card__label">В работе у отдела продаж</div>
                    <div className="card__value">{inSalesWork}</div>
                    <div className="card__meta">ожидают согласования</div>
                </Card>
            </section>

            <section className="table-block">
                <div className="table-block__header">
                    <div>
                        <h2 className="table-block__title">Мои заявки</h2>
                        <p className="table-block__subtitle">
                            Последние заявки по всем вакансиям
                        </p>
                    </div>
                    <div className="table-block__actions">
                        <button className="btn btn--ghost">Экспорт</button>
                        <button
                            className="btn btn--primary"
                            onClick={() => navigate("/request")}
                        >
                            Новая заявка
                        </button>
                    </div>
                </div>

                <div className="table-wrapper">
                    {loading && <div className="table-loading">Загрузка…</div>}
                    {error && (
                        <div className="form-status form-status--error">
                            {error}
                        </div>
                    )}
                    {!loading && !error && requests.length === 0 && (
                        <div className="table-empty">
                            У вас пока нет заявок. Оставьте первую через форму.
                        </div>
                    )}

                    {!loading && !error && requests.length > 0 && (
                        <table className="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Вакансия</th>
                                <th>Статус</th>
                                <th>Создана</th>
                            </tr>
                            </thead>
                            <tbody>
                            {requests.map((r) => (
                                <tr
                                    key={r.id}
                                    className="table-row-clickable"
                                    onClick={() =>
                                        navigate(`/client/requests/${r.id}`)
                                    }
                                >
                                    <td>#{String(r.id).slice(0, 8)}</td>
                                    <td>{r.positionTitle}</td>
                                    <td>
                                        <StatusBadge
                                            status={normalizeStatus(r.status)}
                                        />
                                    </td>
                                    <td>
                                        {r.createdAt
                                            ? new Date(
                                                r.createdAt
                                            ).toLocaleDateString("ru-RU")
                                            : "—"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </>
    );
}
