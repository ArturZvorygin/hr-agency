// src/pages/admin/AdminRequestDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import {
    adminGetRequestById,
    adminChangeRequestStatus,
    adminGetCommentsByRequest,
    adminCreateComment,
    adminAssignManager,
    adminDeleteRequest,
} from "../../api/client.js";

const STATUS_OPTIONS = [
    { value: "DRAFT", label: "Черновик" },
    { value: "NEW", label: "Новая" },
    { value: "IN_PROGRESS", label: "В работе" },
    { value: "SOURCING", label: "Подбор кандидатов" },
    { value: "INTERVIEWS", label: "Собеседования" },
    { value: "CLOSED", label: "Закрыта" },
    { value: "CANCELLED", label: "Отменена" },
];

export default function AdminRequestDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statusValue, setStatusValue] = useState("");
    const [savingStatus, setSavingStatus] = useState(false);

    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [savingComment, setSavingComment] = useState(false);

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
                console.log(data, 'reqData')
                if (!cancelled) {
                    setItem(reqData || null);
                    setStatusValue(reqData?.status || "");

                    // Загружаем комментарии
                    if (reqData?.id) {
                        loadComments(reqData.id);
                    }
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

    async function loadComments(requestId) {
        try {
            setLoadingComments(true);
            const data = await adminGetCommentsByRequest(requestId);
            setComments(data?.comments || []);
        } catch (e) {
            console.error("Ошибка загрузки комментариев:", e);
        } finally {
            setLoadingComments(false);
        }
    }

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
        setStatusValue("CANCELLED");
        await handleStatusSave("CANCELLED");
    }

    async function handleAddComment(e) {
        e.preventDefault();
        if (!commentText.trim() || !item?.id) return;

        try {
            setSavingComment(true);
            await adminCreateComment(item.id, commentText.trim());
            setCommentText("");
            await loadComments(item.id);
        } catch (e) {
            console.error("Ошибка создания комментария:", e);
            setError("Не удалось добавить комментарий");
        } finally {
            setSavingComment(false);
        }
    }

    async function handleDelete() {
        if (!window.confirm("Удалить эту заявку? Это действие необратимо.")) return;

        try {
            setSavingStatus(true);
            await adminDeleteRequest(item.id);
            navigate("/admin/requests");
        } catch (e) {
            console.error(e);
            setError("Не удалось удалить заявку");
        } finally {
            setSavingStatus(false);
        }
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

                                <button
                                    type="button"
                                    className="btn btn--danger"
                                    disabled={savingStatus}
                                    onClick={handleDelete}
                                    style={{ marginLeft: "auto" }}
                                >
                                    Удалить заявку
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
                                } ${item.currency || "РУБ"}`
                                : "не указана"}
                        </p>

                        <h3 style={{ marginTop: 16 }}>Описание вакансии</h3>
                        <p>{item.description || "Нет описания"}</p>

                        <h3 style={{ marginTop: 16 }}>Ключевые требования</h3>
                        <p>{item.keyRequirements || "Не указаны"}</p>
                    </div>
                </div>

                {/* Комментарии */}
                <div style={{ marginTop: 32 }}>
                    <h3>Внутренние комментарии</h3>
                    <p className="page-subtitle">
                        Комментарии видны только менеджерам и администраторам
                    </p>

                    <form onSubmit={handleAddComment} style={{ marginTop: 16 }}>
                        <textarea
                            className="field__textarea"
                            rows={3}
                            placeholder="Добавить комментарий..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={savingComment}
                        />
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={savingComment || !commentText.trim()}
                            style={{ marginTop: 8 }}
                        >
                            {savingComment ? "Сохраняем..." : "Добавить комментарий"}
                        </button>
                    </form>

                    <div style={{ marginTop: 24 }}>
                        {loadingComments && <p>Загрузка комментариев...</p>}
                        {!loadingComments && comments.length === 0 && (
                            <p style={{ color: "#666" }}>Комментариев пока нет</p>
                        )}
                        {!loadingComments && comments.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        style={{
                                            padding: "12px",
                                            background: "#f5f5f5",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
                                            {displayDateTime(comment.createdAt)}
                                        </div>
                                        <div>{comment.text}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </>
        )}
    </div>
);
}
