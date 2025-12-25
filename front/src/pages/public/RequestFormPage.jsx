// src/pages/public/RequestFormPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Select from "../../components/common/Select.jsx";
import Button from "../../components/common/Button.jsx";
import { createPublicRequest, getStaffCategoriesDict } from "../../api/client.js";

export default function RequestFormPage() {
    const [form, setForm] = useState({
        email: "",
        phone: "",
        company: "",
        position: "",
        staffCategoryId: "", // ✅ вместо categoryId
        experience: "",
        salary: "",
        description: "",
        requirements: "",
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

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("loading");

        try {
            const payload = {
                email: form.email.trim(),
                phone: form.phone.trim(),
                company: form.company.trim(),
                position: form.position.trim(),
                // ✅ отправляем то же имя, что в requests таблице: staffCategoryId
                staffCategoryId: form.staffCategoryId ? Number(form.staffCategoryId) : undefined,

                experience: form.experience?.trim() || undefined,
                salary: form.salary?.trim() || undefined,
                description: form.description?.trim() || undefined,
                requirements: form.requirements?.trim() || undefined,
            };

            console.log("PUBLIC REQUEST PAYLOAD:", payload); // ✅ проверь: staffCategoryId должен быть числом

            await createPublicRequest(payload);

            setStatus("success");
            setForm({
                email: "",
                phone: "",
                company: "",
                position: "",
                staffCategoryId: "",
                experience: "",
                salary: "",
                description: "",
                requirements: "",
            });
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card auth-card--wide">
                <div className="auth-card__top-row">
                    <button type="button" className="link-button" onClick={() => navigate("/")}>
                        ← Назад на главную
                    </button>
                </div>

                <h1>Заявка на подбор персонала</h1>

                <form className="form-grid" onSubmit={handleSubmit}>
                    <Input label="Электронная почта *" type="email" name="email" value={form.email} onChange={handleChange} required />
                    <Input label="Телефон *" name="phone" value={form.phone} onChange={handleChange} required />
                    <Input label="Название компании *" name="company" value={form.company} onChange={handleChange} required />
                    <Input label="Должность для подбора *" name="position" value={form.position} onChange={handleChange} required />

                    <Select
                        label="Категория персонала"
                        name="staffCategoryId"                 // ✅ важно
                        value={form.staffCategoryId}           // ✅ важно
                        onChange={handleChange}
                        options={categories}
                        disabled={loadingCategories}
                        placeholder={loadingCategories ? "Загрузка..." : "Выберите категорию"}
                    />

                    <Input label="Требуемый опыт работы" name="experience" value={form.experience} onChange={handleChange} />
                    <Input label="Ожидаемая зарплата" name="salary" value={form.salary} onChange={handleChange} />

                    <label className="field field--full">
                        <span className="field__label">Описание вакансии</span>
                        <textarea className="field__textarea" name="description" value={form.description} onChange={handleChange} rows={4} />
                    </label>

                    <label className="field field--full">
                        <span className="field__label">Ключевые требования</span>
                        <textarea className="field__textarea" name="requirements" value={form.requirements} onChange={handleChange} rows={3} />
                    </label>

                    <div className="form-grid__actions">
                        <Button type="submit">{status === "loading" ? "Отправляем..." : "Отправить заявку"}</Button>

                        {status === "success" && (
                            <span className="form-status form-status--success">
                Заявка отправлена. Мы свяжемся с вами в ближайшее время.
              </span>
                        )}

                        {status === "error" && (
                            <span className="form-status form-status--error">
                Ошибка отправки. Попробуйте позже.
              </span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
