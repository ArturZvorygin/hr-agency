// src/pages/client/ClientRequestDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getClientRequestById } from "../../api/client.js";

export default function ClientRequestDetailsPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data = await getClientRequestById(id);
                // бэк возвращает { request: {...} }
                const reqData = data?.request || data;

                if (!cancelled) {
                    setItem(reqData);
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

        if (id) {
            load();
        }

        return () => {
            cancelled = true;
        };
    }, [id]);

    return (
        <div className="page-card">
            <div className="page-card__header">
                <Link to="/client/requests" className="link-button">
                    ← Назад к списку заявок
                </Link>
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
                    <h1>Заявка: {item.positionTitle}</h1>
                    <p className="page-subtitle">
                        Статус: <strong>{item.status}</strong>
                    </p>

                    <div className="details-grid">
                        <div>
                            <h3>Параметры вакансии</h3>
                            <p>
                                <strong>Опыт:</strong>{" "}
                                {item.experienceYears ? `${item.experienceYears} лет` : "не указан"}
                            </p>
                            <p>
                                <strong>Зарплата:</strong>{" "}
                                {item.salaryFrom || item.salaryTo
                                    ? `${item.salaryFrom || ""}${
                                        item.salaryTo ? "–" + item.salaryTo : ""
                                    } ${item.currency || "РУБ"}`
                                    : "не указана"}
                            </p>
                            <p>
                                <strong>Создана:</strong>{" "}
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleString()
                                    : "—"}
                            </p>
                        </div>

                        <div>
                            <h3>Описание вакансии</h3>
                            <p>{item.description || "Нет описания"}</p>

                            <h3 style={{ marginTop: 16 }}>Ключевые требования</h3>
                            <p>{item.keyRequirements || "Не указаны"}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
