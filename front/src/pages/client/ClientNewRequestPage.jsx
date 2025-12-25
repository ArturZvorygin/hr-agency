// src/pages/client/ClientNewRequestPage.jsx
import { useEffect, useMemo, useState } from "react";
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

function normCurrency(v) {
    const s = String(v || "").trim().toUpperCase();
    if (!s) return "РУБ";
    if (s === "RUB") return "РУБ"; // чтобы не плодить разные варианты
    return s;
}

export default function ClientNewRequestPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        positionTitle: "",
        staffCategoryId: "", // строка для select, в payload -> number
        experienceYears: "",
        salaryFrom: "",
        salaryTo: "",
        currency: "РУБ",
        description: "",
        keyRequirements: "",
    });

    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadCategories() {
            try {
                setLoadingCategories(true);
                const data = await getStaffCategoriesDict();
                const list = Array.isArray(data?.items) ? data.items : [];

                const mapped = list.map((cat) => ({
                    value: String(cat.id),
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

    // ✅ универсальный обработчик (под твой кастомный Select)
    function handleChange(eOrName, maybeValue) {
        // onChange("staffCategoryId", "2")
        if (typeof eOrName === "string") {
            setForm((prev) => ({ ...prev, [eOrName]: maybeValue }));
            return;
        }

        // onChange({ name, value })
        if (
            eOrName &&
            typeof eOrName === "object" &&
            "name" in eOrName &&
            "value" in eOrName
        ) {
            setForm((prev) => ({ ...prev, [eOrName.name]: eOrName.value }));
            return;
        }

        // обычный event
        const { name, value } = eOrName.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function validate() {
        const title = String(form.positionTitle || "").trim();
        if (!title) return "Укажите должность";
        return null;
    }

    async function submit(isDraft) {
        const err = validate();
        if (err) {
            setStatus("error");
            alert(err);
            return;
        }

        setStatus("loading");

        try {
            const payload = {
                positionTitle: String(form.positionTitle || "").trim(),

                // отправляем именно staffCategoryId (number)
                staffCategoryId: form.staffCategoryId
                    ? Number(form.staffCategoryId)
                    : undefined,

                experienceYears: toNumberOrUndefined(form.experienceYears),
                salaryFrom: toNumberOrUndefined(form.salaryFrom),
                salaryTo: toNumberOrUndefined(form.salaryTo),

                currency: normCurrency(form.currency),

                description: String(form.description || "").trim() || undefined,
                keyRequirements: String(form.keyRequirements || "").trim() || undefined,

                isDraft: Boolean(isDraft),
            };

            console.log("CREATE REQUEST PAYLOAD:", payload);

            await createClientRequest(payload);

            setStatus("success");
            navigate("/client/requests");
        } catch (e) {
            console.error(e);
            setStatus("error");
        }
    }

    const disabled = status === "loading";

    return (
        <div className="page-card">
            <h1>Новая заявка</h1>
            <p className="page-subtitle">
                Заполните форму для создания заявки на подбор персонала
            </p>

            <form
                className="form-grid"
                onSubmit={(e) => {
                    e.preventDefault();
                    submit(false);
                }}
            >
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
                    disabled={loadingCategories || disabled}
                />

                <Input
                    label="Требуемый опыт работы (лет)"
                    type="number"
                    step="0.5"
                    name="experienceYears"
                    value={form.experienceYears}
                    onChange={handleChange}
                    disabled={disabled}
                />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "1rem",
                    }}
                >
                    <Input
                        label="Зарплата от"
                        type="number"
                        name="salaryFrom"
                        value={form.salaryFrom}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    <Input
                        label="Зарплата до"
                        type="number"
                        name="salaryTo"
                        value={form.salaryTo}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    <Select
                        label="Валюта"
                        name="currency"
                        value={form.currency}
                        onChange={handleChange}
                        options={[
                            { value: "РУБ", label: "РУБ" },
                            { value: "USD", label: "USD" },
                            { value: "EUR", label: "EUR" },
                        ]}
                        disabled={disabled}
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
                        disabled={disabled}
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
                        disabled={disabled}
                    />
                </label>

                <div
                    className="form-grid__actions"
                    style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <Button type="submit" disabled={disabled}>
                        {disabled ? "Создаём..." : "Создать заявку"}
                    </Button>

                    <Button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => submit(true)}
                        disabled={disabled}
                    >
                        Сохранить как черновик
                    </Button>

                    <Button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => navigate("/client/requests")}
                        disabled={disabled}
                    >
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
