// src/pages/client/ClientRequestDetailsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getClientRequestById, getStaffCategoriesDict } from "../../api/client.js";

function pick(v, fallback = "—") {
    const s = String(v ?? "").trim();
    return s ? s : fallback;
}

function pickCreatedAt(r) {
    return r?.createdAt ?? r?.created_at ?? r?.date ?? r?.created;
}

function normalizeCurrency(v) {
    const s = String(v || "").trim().toUpperCase();
    if (!s) return "РУБ";
    if (s === "RUB") return "РУБ";
    return s;
}

function formatMoneyRange(from, to, currency) {
    const c = normalizeCurrency(currency);

    const hasFrom =
        typeof from === "number" ? Number.isFinite(from) : !!String(from ?? "").trim();
    const hasTo =
        typeof to === "number" ? Number.isFinite(to) : !!String(to ?? "").trim();

    const f = hasFrom ? Number(from) : undefined;
    const t = hasTo ? Number(to) : undefined;

    if (!Number.isFinite(f) && !Number.isFinite(t)) return "не указана";
    if (Number.isFinite(f) && Number.isFinite(t)) return `${f}–${t} ${c}`;
    if (Number.isFinite(f)) return `от ${f} ${c}`;
    return `до ${t} ${c}`;
}

function formatDateTime(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// пытаемся достать id категории из разных возможных полей
function pickStaffCategoryId(item) {
    const raw =
        item?.staffCategoryId ??
        item?.staff_category_id ??
        item?.categoryId ??
        item?.category_id ??
        item?.staffCategory?.id ??
        item?.staffCategory?._id;

    if (raw === undefined || raw === null) return undefined;

    // если ObjectId/строка — оставим как есть, если число/число-строка — приведем
    const s = String(raw).trim();
    if (!s) return undefined;

    const n = Number(s);
    return Number.isFinite(n) ? n : s;
}

export default function ClientRequestDetailsPage() {
    const { id } = useParams();

    const [item, setItem] = useState(null);
    const [dict, setDict] = useState([]); // [{id, name}]
    const [loading, setLoading] = useState(true);
    const [loadingDict, setLoadingDict] = useState(true);
    const [error, setError] = useState(null);

    // 1) грузим заявку
    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await getClientRequestById(id);
                const reqData = data?.request || data;

                if (!cancelled) setItem(reqData || null);
            } catch (e) {
                console.error(e);
                if (!cancelled) setError("Не удалось загрузить заявку");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        if (id) load();

        return () => {
            cancelled = true;
        };
    }, [id]);

    // 2) грузим справочник категорий (чтобы отрисовать имя по staffCategoryId)
    useEffect(() => {
        let cancelled = false;

        async function loadDict() {
            try {
                setLoadingDict(true);
                const data = await getStaffCategoriesDict();
                const list = Array.isArray(data?.items) ? data.items : [];
                if (!cancelled) setDict(list);
            } catch (e) {
                console.error("Не удалось загрузить справочник категорий:", e);
                if (!cancelled) setDict([]);
            } finally {
                if (!cancelled) setLoadingDict(false);
            }
        }

        loadDict();

        return () => {
            cancelled = true;
        };
    }, []);

    const createdAt = useMemo(() => formatDateTime(pickCreatedAt(item)), [item]);

    const staffCategoryName = useMemo(() => {
        // 1) если бэк уже отдает объект/строку
        const direct =
            item?.staffCategory?.name ||
            item?.staffCategoryName ||
            item?.categoryName ||
            (typeof item?.staffCategory === "string" ? item.staffCategory : "") ||
            "";

        if (direct) return direct;

        // 2) если только id — ищем в dict
        const idVal = pickStaffCategoryId(item);
        if (idVal === undefined) return "—";

        const found = dict.find((c) => {
            // dict id обычно number
            if (typeof idVal === "number") return Number(c.id) === idVal;
            // на случай строкового id
            return String(c.id) === String(idVal);
        });

        // 3) если dict не успел загрузиться — покажем "…"
        if (!found && loadingDict) return "…";

        return found?.name || "—";
    }, [item, dict, loadingDict]);

    const salaryText = useMemo(
        () => formatMoneyRange(item?.salaryFrom, item?.salaryTo, item?.currency),
        [item]
    );

    return (
        <div className="page-card">
            <div className="page-card__header">
                <Link to="/client/requests" className="link-button">
                    ← Назад к списку заявок
                </Link>
            </div>

            {loading && <p>Загружаем заявку…</p>}

            {error && <div className="form-status form-status--error">{error}</div>}

            {!loading && !error && !item && <p>Заявка не найдена.</p>}

            {!loading && !error && item && (
                <>
                    <h1>Заявка: {pick(item.positionTitle)}</h1>
                    <p className="page-subtitle">
                        Статус: <strong>{pick(item.status)}</strong>
                    </p>

                    <div className="details-grid">
                        <div>
                            <h3>Параметры вакансии</h3>

                            <p>
                                <strong>Категория персонала:</strong> {staffCategoryName}
                            </p>

                            <p>
                                <strong>Опыт:</strong>{" "}
                                {item.experienceYears !== undefined &&
                                item.experienceYears !== null &&
                                String(item.experienceYears).trim() !== ""
                                    ? `${item.experienceYears} лет`
                                    : "не указан"}
                            </p>

                            <p>
                                <strong>Зарплата:</strong> {salaryText}
                            </p>

                            <p>
                                <strong>Валюта:</strong> {normalizeCurrency(item.currency)}
                            </p>

                            <p>
                                <strong>Создана:</strong> {createdAt}
                            </p>

                            <p>
                                <strong>ID:</strong> {pick(item.id || item._id)}
                            </p>
                        </div>

                        <div>
                            <h3>Описание вакансии</h3>
                            <p>{pick(item.description, "Нет описания")}</p>

                            <h3 style={{ marginTop: 16 }}>Ключевые требования</h3>
                            <p>{pick(item.keyRequirements, "Не указаны")}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
