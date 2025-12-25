// src/pages/client/ClientDashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { getClientRequests, getCurrentClient } from "../../api/client.js";

const TZ = "Asia/Bishkek";

function normStatus(s) {
    return String(s || "").trim().toUpperCase();
}
function pickStatus(r) {
    return normStatus(r?.status ?? r?.requestStatus ?? r?.state);
}
function pickId(r) {
    return r?.id ?? r?._id ?? r?.requestId;
}
function pickCreatedRaw(r) {
    return r?.createdAt ?? r?.created_at ?? r?.date ?? r?.created ?? r?.createdOn ?? r?.created_on;
}
function dateFromObjectId(id) {
    if (!id || typeof id !== "string") return null;
    if (!/^[a-f0-9]{24}$/i.test(id)) return null;
    const ts = parseInt(id.slice(0, 8), 16) * 1000;
    const d = new Date(ts);
    return Number.isNaN(d.getTime()) ? null : d;
}
function parseAnyDate(value, fallbackId) {
    if (!value) return dateFromObjectId(fallbackId);

    if (value instanceof Date) return Number.isNaN(value.getTime()) ? dateFromObjectId(fallbackId) : value;

    if (typeof value === "number") {
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? dateFromObjectId(fallbackId) : d;
    }

    if (typeof value === "string") {
        const s = value.trim();

        // ISO
        let d = new Date(s);
        if (!Number.isNaN(d.getTime())) return d;

        // "YYYY-MM-DD HH:mm:ss"
        if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(s)) {
            d = new Date(s.replace(" ", "T"));
            if (!Number.isNaN(d.getTime())) return d;
        }

        // "DD.MM.YYYY" (+time)
        if (/^\d{2}\.\d{2}\.\d{4}/.test(s)) {
            const [datePart, timePart] = s.split(/\s+/);
            const [dd, mm, yyyy] = datePart.split(".").map(Number);
            const [HH = 0, MM = 0, SS = 0] = (timePart || "0:0:0").split(":").map(Number);
            d = new Date(yyyy, (mm || 1) - 1, dd || 1, HH, MM, SS);
            if (!Number.isNaN(d.getTime())) return d;
        }
    }

    return dateFromObjectId(fallbackId);
}
function sameDayInTZ(a, b) {
    const fmt = new Intl.DateTimeFormat("ru-RU", {
        timeZone: TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return fmt.format(a) === fmt.format(b);
}
function formatDate(isoOrAny, fallbackId) {
    const d = parseAnyDate(isoOrAny, fallbackId);
    if (!d) return "—";
    return d.toLocaleDateString("ru-RU", { timeZone: TZ });
}

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
                const list = Array.isArray(data?.requests) ? data.requests : data;

                if (!cancelled) setRequests(Array.isArray(list) ? list : []);
            } catch (e) {
                console.error(e);
                if (!cancelled) setError("Не удалось загрузить заявки");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    // заявки "сегодня"
    const todayRequests = useMemo(() => {
        const now = new Date();
        return requests.filter((r) => {
            const id = pickId(r);
            const raw = pickCreatedRaw(r);
            const d = parseAnyDate(raw, id);
            return d ? sameDayInTZ(d, now) : false;
        });
    }, [requests]);

    // Активные заявки (по статусам, но НОРМАЛИЗУЕМ!)
    const activeRequests = useMemo(() => {
        return requests.filter((r) => {
            const s = pickStatus(r);
            return s === "NEW" || s === "DRAFT" || s === "IN_PROGRESS" || s === "SOURCING" || s === "INTERVIEWS";
        }).length;
    }, [requests]);

    const closedVacancies = useMemo(() => {
        return requests.filter((r) => pickStatus(r) === "CLOSED").length;
    }, [requests]);

    const inSalesWork = useMemo(() => {
        return requests.filter((r) => {
            const s = pickStatus(r);
            return s === "SOURCING" || s === "INTERVIEWS";
        }).length;
    }, [requests]);

    // пока "новые кандидаты" считаем как количество активных заявок
    const newCandidates = activeRequests;

    // "+N за сегодня" — сколько заявок создали сегодня
    const createdToday = todayRequests.length;

    const userName = currentClient?.firstName || currentClient?.email || "Клиент";
    const userCompany = currentClient?.companyName || currentClient?.email || "Моя компания";

    return (
        <>
            <header className="header">
                <div className="header__left">
                    <h1 className="header__title">Главная – личный кабинет</h1>
                    <p className="header__subtitle">Сводка по вашим заявкам и вакансиям</p>
                </div>

                <div className="header__right">
                    <div className="header__search">
                        <input type="text" placeholder="Поиск по заявкам и вакансиям…" />
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
                    <div className="card__value">{loading ? "…" : activeRequests}</div>
                </Card>

                <Card>
                    <div className="card__label">Новые кандидаты</div>
                    <div className="card__value">{loading ? "…" : newCandidates}</div>
                    <div className="card__meta">по активным заявкам</div>
                </Card>

                <Card>
                    <div className="card__label">Закрытые вакансии</div>
                    <div className="card__value">{loading ? "…" : closedVacancies}</div>
                    <div className="card__meta">за всё время</div>
                </Card>

                <Card>
                    <div className="card__label">В работе у отдела продаж</div>
                    <div className="card__value">{loading ? "…" : inSalesWork}</div>
                    <div className="card__meta">ожидают согласования</div>
                </Card>
            </section>

            <section className="table-block">
                <div className="table-block__header">
                    <div>
                        <h2 className="table-block__title">Личные данные</h2>
                        <p className="table-block__subtitle">Информация о вашем аккаунте и компании</p>
                    </div>
                </div>

                <div
                    style={{
                        padding: "20px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        marginBottom: "24px",
                    }}
                >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                            <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Email</div>
                            <div style={{ fontSize: "16px", fontWeight: "500" }}>{currentClient?.email || "—"}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Имя</div>
                            <div style={{ fontSize: "16px", fontWeight: "500" }}>{currentClient?.firstName || "—"}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Фамилия</div>
                            <div style={{ fontSize: "16px", fontWeight: "500" }}>{currentClient?.lastName || "—"}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Компания</div>
                            <div style={{ fontSize: "16px", fontWeight: "500" }}>{currentClient?.companyName || "—"}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Телефон</div>
                            <div style={{ fontSize: "16px", fontWeight: "500" }}>{currentClient?.phone || "—"}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Роль</div>
                            <div style={{ fontSize: "16px", fontWeight: "500" }}>{currentClient?.role || "—"}</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="table-block">
                <div className="table-block__header">
                    <div>
                        <h2 className="table-block__title">Мои заявки</h2>
                        <p className="table-block__subtitle">Последние заявки по всем вакансиям</p>
                    </div>
                    <div className="table-block__actions">
                        <button className="btn btn--ghost">Экспорт</button>
                        <button className="btn btn--primary" onClick={() => navigate("/client/requests/new")}>
                            Новая заявка
                        </button>
                    </div>
                </div>

                <div className="table-wrapper">
                    {loading && <div className="table-loading">Загрузка…</div>}
                    {error && <div className="form-status form-status--error">{error}</div>}
                    {!loading && !error && requests.length === 0 && (
                        <div className="table-empty">У вас пока нет заявок. Оставьте первую через форму.</div>
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
                            {requests.map((r) => {
                                const id = pickId(r);
                                return (
                                    <tr
                                        key={id}
                                        className="table-row-clickable"
                                        onClick={() => navigate(`/client/requests/${id}`)}
                                    >
                                        <td>#{String(id).slice(0, 8)}</td>
                                        <td>{r.positionTitle}</td>
                                        <td>
                                            <StatusBadge status={pickStatus(r)} />
                                        </td>
                                        <td>{formatDate(pickCreatedRaw(r), id)}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </>
    );
}
