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
        categoryId: "",
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

                // бэк должен вернуть { items: [{id, name}, ...] }
                const list = Array.isArray(data?.items) ? data.items : [];

                if (!cancelled) {
                    setCategories(
                        list.map((cat) => ({
                            value: String(cat.id),
                            label: cat.name,
                        }))
                    );
                }
            } catch (e) {
                console.error("Ошибка загрузки категорий:", e);
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
                ...form,
                categoryId: form.categoryId ? Number(form.categoryId) : null, // <- в БД обычно число
            };

            await createPublicRequest(payload);

            setStatus("success");
            setForm({
                email: "",
                phone: "",
                company: "",
                position: "",
                categoryId: "",
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
                    <button
                        type="button"
                        className="link-button"
                        onClick={() => navigate("/")}
                    >
                        ← Назад на главную
                    </button>
                </div>

                <h1>Заявка на подбор персонала</h1>
                <p className="auth-card__subtitle">
                    Оставьте заявку — мы свяжемся с вами, уточним детали вакансии и
                    предложим формат сотрудничества.
                    <br />
                    Регистрация не требуется: по этой заявке мы создадим карточку компании
                    и назначим менеджера.
                </p>

                <form className="form-grid" onSubmit={handleSubmit}>
                    <Input
                        label="Электронная почта *"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Телефон *"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Название компании *"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Должность для подбора *"
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        required
                    />

                    <Select
                        label="Категория персонала"
                        name="categoryId"                 // ✅ важно
                        value={form.categoryId}           // ✅ важно
                        onChange={handleChange}
                        options={[
                            { value: "", label: loadingCategories ? "Загрузка..." : "Выберите категорию" },
                            ...categories,
                        ]}
                        disabled={loadingCategories}
                    />

                    <Input
                        label="Требуемый опыт работы"
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                    />
                    <Input
                        label="Ожидаемая зарплата"
                        name="salary"
                        value={form.salary}
                        onChange={handleChange}
                    />

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
                            name="requirements"
                            value={form.requirements}
                            onChange={handleChange}
                            rows={3}
                        />
                    </label>

                    <div className="form-grid__actions">
                        <Button type="submit">
                            {status === "loading" ? "Отправляем..." : "Отправить заявку"}
                        </Button>

                        {status === "success" && (
                            <span className="form-status form-status--success">
                Заявка отправлена. Мы свяжемся с вами в ближайшее время. Ваш
                временный пароль password123, Вы сможете сменить его в личном
                кабинете. Для входа пропишите свою почту и пароль{" "}
                                <strong>password123</strong>.
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
