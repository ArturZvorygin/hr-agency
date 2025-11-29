// src/pages/admin/AdminRequestDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import {
    adminGetRequestById,
    adminChangeRequestStatus,
} from "../../api/client.js";

const STATUS_OPTIONS = [
    { value: "new", label: "Новая" },
    { value: "in_progress", label: "В работе" },
    { value: "wait_client", label: "Ожидает клиента" },
    { value: "done", label: "Закрыта" },
    { value: "canceled", label: "Отменена" },
];

export default function AdminRequestDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statusValue, setStatusValue] = useState("");
    const [savingStatus, setSavingStatus] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                const data = await adminGetRequestById(id);
                // бэк может вернуть { request: {...} } или сразу объект
                const reqData = data?.request || data;

                if (!cancelled) {
                    setItem(reqData || null);
                    const st = reqData?.status ? String(reqData.status).toLowerCase() : "";
                    setStatusValue(st);
                }
            } catch (e) {
                console.error(e);
                if (!cancelled) {
                    setError("Не удалось загрузить заявку");
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
    }, [id]);

    async function handleStatusSave(nextStatus) {
        if (!item?.id) return;

        try{
        setSavingStatus(true);
        setError(null);

        // если передали значение — используем его, иначе берём из состояния
        const statusToSave = nextStatus || statusValue;

        await adminChangeRequestStatus(item.id, statusToSave);

        // обновляем локально
        setItem((prev) =>
            prev
                ? {
                    ...prev,
                    status: statusToSave,
                }
                : prev
        );
    } catch (e) {
        console.error(e);
        setError("Не удалось сохранить статус");
    } finally {
        setSavingStatus(false);
    }
}

async function handleMarkCanceled() {
    setStatusValue("canceled");
    await handleStatusSave("canceled");
}

const displayDateTime = (val) =>
    val ? new Date(val).toLocaleString("ru-RU") : "—";

const displayDate = (val) =>
    val ? new Date(val).toLocaleDateString("ru-RU") : "—";

return (
    <div className="page-card">
        <div className="page-card__header">
            <button
                type="button"
                className="link-button"
                onClick={() => navigate("/admin/requests")}
            >
                ← Назад к заявкам
            </button>
        </div>

        {loading && <p>Загружаем заявку…</p>}

        {error && (
            <div className="form-status form-status--error">
                {error}
            </div>
        )}

        {!loading && !error && !item && (
            <p>Заявка не найдена.</p>
        )}

        {!loading && !error && item && (
            <>
                <h1>Заявка #{String(item.id).slice(0, 8)}</h1>
                <p className="page-subtitle">
                    Вакансия:{" "}
                    <strong>{item.positionTitle || "Без названия"}</strong>
                </p>

                <div className="details-grid" style={{ marginTop: 24 }}>
                    {/* Блок слева: общая информация */}
                    <div>
                        <h3>Общая информация</h3>
                        <p>
                            <strong>Компания:</strong>{" "}
                            {item.companyName || "—"}
                        </p>
                        <p>
                            <strong>Контактное лицо (клиент):</strong>{" "}
                            {item.clientName || item.clientEmail || "—"}
                        </p>
                        <p>
                            <strong>Ответственный менеджер:</strong>{" "}
                            {item.managerName || "—"}
                        </p>
                        <p>
                            <strong>Создана:</strong>{" "}
                            {displayDateTime(item.createdAt)}
                        </p>
                        <p>
                            <strong>Обновлена:</strong>{" "}
                            {displayDateTime(item.updatedAt)}
                        </p>

                        <p style={{ marginTop: 12 }}>
                            <strong>Статус:</strong>{" "}
                            <StatusBadge
                                status={
                                    item.status
                                        ? String(item.status).toUpperCase()
                                        : ""
                                }
                            />
                        </p>

                        <div style={{ marginTop: 16 }}>
                            <label className="field">
                                    <span className="field__label">
                                        Изменить статус
                                    </span>
                                <select
                                    className="field__input"
                                    value={statusValue}
                                    disabled={savingStatus}
                                    onChange={(e) =>
                                        setStatusValue(e.target.value)
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
                            </label>

                            <div className="form-grid__actions" style={{ marginTop: 12 }}>
                                <button
                                    type="button"
                                    className="btn btn--primary"
                                    disabled={savingStatus}
                                    onClick={() => handleStatusSave()}
                                >
                                    {savingStatus
                                        ? "Сохраняем…"
                                        : "Сохранить статус"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn--ghost"
                                    disabled={savingStatus}
                                    onClick={handleMarkCanceled}
                                >
                                    Пометить как отменённую
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Блок справа: параметры вакансии */}
                    <div>
                        <h3>Параметры вакансии</h3>
                        <p>
                            <strong>Категория персонала:</strong>{" "}
                            {item.staffCategoryName || "—"}
                        </p>
                        <p>
                            <strong>Требуемый опыт:</strong>{" "}
                            {item.experienceYears
                                ? `${item.experienceYears} лет`
                                : "не указан"}
                        </p>
                        <p>
                            <strong>Зарплата:</strong>{" "}
                            {item.salaryFrom || item.salaryTo
                                ? `${item.salaryFrom || ""}${
                                    item.salaryTo
                                        ? "–" + item.salaryTo
                                        : ""
                                } ${item.currency || "KGS"}`
                                : "не указана"}
                        </p>

                        <h3 style={{ marginTop: 16 }}>Описание вакансии</h3>
                        <p>{item.description || "Нет описания"}</p>

                        <h3 style={{ marginTop: 16 }}>Ключевые требования</h3>
                        <p>{item.keyRequirements || "Не указаны"}</p>
                    </div>
                </div>

                {/* Дополнительный блок — можно потом расширить под историю статусов и комментарии */}
                <div style={{ marginTop: 32 }}>
                    <h3>Работа с заявкой</h3>
                    <p className="page-subtitle">
                        Здесь позже можно добавить историю изменений,
                        комментарии рекрутеров и файлы кандидатов.
                    </p>
                </div>
            </>
        )}
    </div>
);
}
