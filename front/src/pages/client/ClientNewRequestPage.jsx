// src/pages/client/ClientNewRequestPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Select from "../../components/common/Select.jsx";
import Button from "../../components/common/Button.jsx";
import { createClientRequest, getStaffCategoriesDict } from "../../api/client.js";

export default function ClientNewRequestPage() {
    const [form, setForm] = useState({
        positionTitle: "",
        staffCategoryId: "",
        experienceYears: "",
        salaryFrom: "",
        salaryTo: "",
        currency: "KGS",
        description: "",
        keyRequirements: "",
        isDraft: false,
    });
    const [status, setStatus] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadCategories() {
            try {
                setLoadingCategories(true);
                const data = await getStaffCategoriesDict();
                const list = data?.items || [];
                setCategories(
                    list.map((cat) => ({
                        value: String(cat.id),
                        label: cat.name,
                    }))
                );
            } catch (e) {
                console.error("Ошибка загрузки категорий:", e);
            } finally {
                setLoadingCategories(false);
            }
        }

        loadCategories();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e, isDraft = false) {
        e.preventDefault();
        setStatus("loading");

        try {
            const payload = {
                positionTitle: form.positionTitle,
                staffCategoryId: form.staffCategoryId ? parseInt(form.staffCategoryId, 10) : undefined,
                experienceYears: form.experienceYears ? parseFloat(form.experienceYears) : undefined,
                salaryFrom: form.salaryFrom ? parseFloat(form.salaryFrom) : undefined,
                salaryTo: form.salaryTo ? parseFloat(form.salaryTo) : undefined,
                currency: form.currency || "KGS",
                description: form.description || undefined,
                keyRequirements: form.keyRequirements || undefined,
                isDraft,
            };

            await createClientRequest(payload);
            setStatus("success");

            // Перенаправляем на список заявок
            setTimeout(() => {
                navigate("/client/requests");
            }, 1500);
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    }

    return (
        <div className="page-card">
            <h1>Новая заявка</h1>
            <p className="page-subtitle">
                Заполните форму для создания заявки на подбор персонала
            </p>

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
                    options={categories}
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
                            { value: "KGS", label: "KGS" },
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
                        placeholder="Опишите требования к кандидату, обязанности, условия работы..."
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
                        placeholder="Например: знание языков, навыки, образование..."
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

                    <Button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => navigate("/client/requests")}
                    >
                        Отмена
                    </Button>

                    {status === "success" && (
                        <span className="form-status form-status--success">
                            Заявка создана! Перенаправляем...
                        </span>
                    )}
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
