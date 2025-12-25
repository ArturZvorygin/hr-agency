// src/pages/client/ClientNewRequestPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Select from "../../components/common/Select.jsx";
import Button from "../../components/common/Button.jsx";
import { createClientRequest, getStaffCategoriesDict } from "../../api/client.js";

function toNumberOrUndefined(v) {
    const s = String(v ?? "").trim();
    if (!s) return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
}

export default function ClientNewRequestPage() {
    const [form, setForm] = useState({
        positionTitle: "",
        staffCategoryId: "", // строка для select, но в payload будет number
        experienceYears: "",
        salaryFrom: "",
        salaryTo: "",
        currency: "РУБ",
        description: "",
        keyRequirements: "",
        isDraft: false,
    });

    const [status, setStatus] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        async function loadCategories() {
            try {
                setLoadingCategories(true);
                const data = await getStaffCategoriesDict();

                // твой ответ реально: { items: [...] }
                const list = Array.isArray(data?.items) ? data.items : [];

                const mapped = list.map((cat) => ({
                    value: String(cat.id), // select любит строки
                    label: cat.name,
                }));

                if (!cancelled) setCategories(mapped);
            } catch (e) {
                console.error("Ошибка загрузки категорий:", e);
                if (!cancelled) setCategories([]);
            } finally {
                if (!cancelled) setLoadingCategories(false);
            }
        }

        loadCategories();
        return () => {
            cancelled = true;
        };
    }, []);

    const categoryOptions = useMemo(
        () => [{ value: "", label: "Не выбрано" }, ...categories],
        [categories]
    );

    // ✅ универсальный обработчик (важно для твоего кастомного Select)
    function handleChange(eOrName, maybeValue) {
        // вариант: onChange("staffCategoryId", "2")
        if (typeof eOrName === "string") {
            setForm((prev) => ({ ...prev, [eOrName]: maybeValue }));
            return;
        }

        // вариант: onChange({ name, value })
        if (eOrName && typeof eOrName === "object" && "name" in eOrName && "value" in eOrName) {
            setForm((prev) => ({ ...prev, [eOrName.name]: eOrName.value }));
            return;
        }

        // обычный event
        const { name, value, type, checked } = eOrName.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }

    async function handleSubmit(e, isDraft = false) {
        e.preventDefault();
        setStatus("loading");

        try {
            const payload = {
                positionTitle: form.positionTitle.trim(),
                // ✅ ВАЖНО: отправляем staffCategoryId, не categoryId
                // ✅ ВАЖНО: конвертируем в number, потому что dict id = number
                staffCategoryId: form.staffCategoryId ? Number(form.staffCategoryId) : undefined,

                experienceYears: toNumberOrUndefined(form.experienceYears),
                salaryFrom: toNumberOrUndefined(form.salaryFrom),
                salaryTo: toNumberOrUndefined(form.salaryTo),

                currency: form.currency || "РУБ",
                description: form.description?.trim() || undefined,
                keyRequirements: form.keyRequirements?.trim() || undefined,
                isDraft,
            };

            console.log("CREATE REQUEST PAYLOAD:", payload); // ✅ проверь тут

            await createClientRequest(payload);

            setStatus("success");
            navigate("/client/requests");
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    }

    return (
        <div className="page-card">
            <h1>Новая заявка</h1>
            <p className="page-subtitle">Заполните форму для создания заявки на подбор персонала</p>

            <form className="form-grid" onSubmit={(e) => handleSubmit(e, false)}>
                <Input
                    label="Должность *"
                    name="positionTitle"
                    value={form.positionTitle}
                    onChange={handleChange}
                    required
                />

                <Select
                    label="Категория персонала"
                    name="staffCategoryId"
                    value={form.staffCategoryId}
                    onChange={handleChange}
                    options={categoryOptions}
                    disabled={loadingCategories}
                />

                <Input
                    label="Требуемый опыт работы (лет)"
                    type="number"
                    step="0.5"
                    name="experienceYears"
                    value={form.experienceYears}
                    onChange={handleChange}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    <Input
                        label="Зарплата от"
                        type="number"
                        name="salaryFrom"
                        value={form.salaryFrom}
                        onChange={handleChange}
                    />
                    <Input
                        label="Зарплата до"
                        type="number"
                        name="salaryTo"
                        value={form.salaryTo}
                        onChange={handleChange}
                    />
                    <Select
                        label="Валюта"
                        name="currency"
                        value={form.currency}
                        onChange={handleChange}
                        options={[
                            { value: "РУБ", label: "РУБ" },
                            { value: "USD", label: "USD" },
                            { value: "RUB", label: "RUB" },
                            { value: "EUR", label: "EUR" },
                        ]}
                    />
                </div>

                <label className="field field--full">
                    <span className="field__label">Описание вакансии</span>
                    <textarea
                        className="field__textarea"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                    />
                </label>

                <label className="field field--full">
                    <span className="field__label">Ключевые требования</span>
                    <textarea
                        className="field__textarea"
                        name="keyRequirements"
                        value={form.keyRequirements}
                        onChange={handleChange}
                        rows={3}
                    />
                </label>

                <div className="form-grid__actions" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <Button type="submit" disabled={status === "loading"}>
                        {status === "loading" ? "Создаём..." : "Создать заявку"}
                    </Button>

                    <Button
                        type="button"
                        className="btn btn--ghost"
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={status === "loading"}
                    >
                        Сохранить как черновик
                    </Button>

                    <Button type="button" className="btn btn--ghost" onClick={() => navigate("/client/requests")}>
                        Отмена
                    </Button>

                    {status === "error" && (
                        <span className="form-status form-status--error">
              Ошибка создания заявки. Проверьте данные и попробуйте снова.
            </span>
                    )}
                </div>
            </form>
        </div>
    );
}
