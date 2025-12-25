// src/pages/admin/AdminDashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { adminGetRequests } from "../../api/client.js";

const TZ = "Asia/Bishkek";

function normStatus(s) {
    return String(s || "").trim().toUpperCase();
}

function pickStatus(r) {
    return normStatus(r?.status ?? r?.requestStatus ?? r?.state);
}

function pickCreatedRaw(r) {
    return r?.createdAt ?? r?.created_at ?? r?.date ?? r?.created ?? r?.createdOn ?? r?.created_on;
}

// fallback: вытащить дату из Mongo ObjectId
function dateFromObjectId(id) {
    if (!id || typeof id !== "string") return null;
    if (!/^[a-f0-9]{24}$/i.test(id)) return null;
    const ts = parseInt(id.slice(0, 8), 16) * 1000;
    const d = new Date(ts);
    return Number.isNaN(d.getTime()) ? null : d;
}

function parseAnyDate(value, fallbackId) {
    if (!value) return dateFromObjectId(fallbackId);

    // Date
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? dateFromObjectId(fallbackId) : value;

    // number timestamp
    if (typeof value === "number") {
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? dateFromObjectId(fallbackId) : d;
    }

    // string
    if (typeof value === "string") {
        const s = value.trim();

        // ISO ok
        let d = new Date(s);
        if (!Number.isNaN(d.getTime())) return d;

        // "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss"
        if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(s)) {
            d = new Date(s.replace(" ", "T"));
            if (!Number.isNaN(d.getTime())) return d;
        }

        // "DD.MM.YYYY" (+ optional time)
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

export default function AdminDashboardPage() {
    console.log('jjjj')
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
                const list = Array.isArray(data?.requests) ? data.requests : data;

                if (!cancelled) setRows(Array.isArray(list) ? list : []);
            } catch (e) {
                console.error(e);
                if (!cancelled) setError("Не удалось загрузить статистику по заявкам");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const todayRows = useMemo(() => {
        const now = new Date();
        return rows.filter((r) => {
            const raw = pickCreatedRaw(r);
            const d = parseAnyDate(raw, r?._id);
            if (!d) return false;
            return sameDayInTZ(d, now);
        });
    }, [rows]);
    // ВАЖНО: это именно "созданы сегодня"
    const todayTotal = todayRows.length;

    // статусы внутри сегодняшних (если нужно)
    const newByStatus = useMemo(() => {
        return todayRows.filter((r) => {
            const s = pickStatus(r);
            return s === "NEW" || s === "DRAFT";
        }).length;
    }, [todayRows]);

    const inWork = useMemo(() => {
        return todayRows.filter((r) => {
            const s = pickStatus(r);
            return s === "IN_PROGRESS" || s === "SOURCING" || s === "INTERVIEWS";
        }).length;
    }, [todayRows]);

    const closed = useMemo(() => {
        return todayRows.filter((r) => pickStatus(r) === "CLOSED").length;
    }, [todayRows]);

    const clientsCount = useMemo(() => {
        const clientKeys = new Set(todayRows.map((r) => r.companyId || r.companyName).filter(Boolean));
        return clientKeys.size;
    }, [todayRows]);

    return (
        <>
            <header className="header">
                <div className="header__left">
                    <h1 className="header__title">Главная – администратор</h1>
                    <p className="header__subtitle">Сводка по заявкам и активности клиентов.</p>
                </div>
            </header>

            {error && (
                <div className="form-status form-status--error" style={{ marginBottom: 16 }}>
                    {error}
                </div>
            )}

            <section className="cards">
                <div className="card card--primary">
                    <div className="card__label">Заявки сегодня</div>
                    <div className="card__value">{loading ? "…" : todayTotal}</div>
                    <div className="card__meta">созданы сегодня</div>
                </div>

                <div className="card">
                    <div className="card__label">Новые (по статусу)</div>
                    <div className="card__value">{loading ? "…" : newByStatus}</div>
                    <div className="card__meta">NEW / DRAFT</div>
                </div>

                <div className="card">
                    <div className="card__label">В работе</div>
                    <div className="card__value">{loading ? "…" : inWork}</div>
                    <div className="card__meta">сегодня</div>
                </div>

                <div className="card">
                    <div className="card__label">Закрыто</div>
                    <div className="card__value">{loading ? "…" : closed}</div>
                    <div className="card__meta">сегодня</div>
                </div>

                <div className="card">
                    <div className="card__label">Клиентов сегодня</div>
                    <div className="card__value">{loading ? "…" : clientsCount}</div>
                    <div className="card__meta">с заявками</div>
                </div>
            </section>
        </>
    );
}
