// src/pages/public/HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../../assets/hero-office.jpg";
import client1 from "../../assets/client-1.png";
import client2 from "../../assets/client-2.png";
import client3 from "../../assets/client-1.png";
import Button from "../../components/common/Button.jsx";
import "./../../styles/HomePage.css";
import {
    getCurrentClient,
    isClientAuthenticated,
    getCurrentAdmin,
    isAdminAuthenticated,
} from "../../api/client.js";

// ====== HEADER NAV (якоря внутри главной) ======

const NAV_LINKS = [
    { label: "Кейсы", to: "#cases" },
    { label: "Услуги", to: "#services" },
    { label: "Отзывы", to: "#reviews" },
    { label: "Контакты", to: "#contacts" },
];

// ====== данные для блоков ======

const METRICS = [
    { value: "300+", label: "закрытых вакансий" },
    { value: "7 дней", label: "средний срок подбора" },
    { value: "24/7", label: "поддержка клиентов" },
];

const BENEFITS = [
    {
        title: "Понимаем бизнес-задачу",
        text: "Разбираем вакансию, команду и KPI, чтобы найти не просто “человека на позицию”, а нужного специалиста.",
    },
    {
        title: "Живой дашборд для клиента",
        text: "Личный кабинет с воронкой подбора: кандидаты, статусы, встречи, рекомендации по офферу.",
    },
    {
        title: "Экономим время руководителя",
        text: "На собеседование попадают уже отобранные кандидаты — без случайных резюме из job-сайтов.",
    },
];

const CLIENTS = [
    {
        logo: client1,
        name: "ООО “ТехСтарт”",
        role: "IT · 7 закрытых позиций",
    },
    {
        logo: client2,
        name: "Сеть кофеен “City Coffee”",
        role: "Ритейл · запуск 3 точек",
    },
    {
        logo: client3,
        name: "“MarketPro”",
        role: "Продажи · отдел с нуля",
    },
];

const SERVICES = [
    {
        id: "mini",
        label: "Пакет “Мини”",
        description:
            "Оптимальное решение, когда нужно оперативно закрыть одну ключевую вакансию без значительных затрат времени и ресурсов.",
        list: [
            "Анализ вакансии и портрета кандидата",
            "Поиск кандидатов по базе и рынку",
            "Предварительный отбор и интервью",
            "Презентация 2–3 лучших кандидатов",
        ],
        timeline:
            "Сроки: от 5 до 10 рабочих дней с момента подписания договора и описания вакансии.",
        price: "5 000 руб.",
    },
    {
        id: "optimal",
        label: "Пакет “Оптимальный”",
        description:
            "Подходит компаниям, которым нужно закрыть несколько позиций в одном отделе и выстроить команду под задачу.",
        list: [
            "Анализ команды и ролей",
            "Подбор нескольких кандидатов в отдел",
            "Сопровождение собеседований",
            "Рекомендации по офферам и адаптации",
        ],
        timeline:
            "Сроки: от 10 до 20 рабочих дней в зависимости от количества позиций.",
        price: "от 15 000 руб.",
    },
    {
        id: "maxi",
        label: "Пакет “Макси”",
        description:
            "Решение “под ключ” для запуска нового направления или филиала: формирование команды с нуля.",
        list: [
            "HR-стратегия под задачу бизнеса",
            "Подбор ключевых и линейных позиций",
            "Оценка soft и hard skills",
            "Сопровождение выхода и испытательного срока",
        ],
        timeline:
            "Сроки обсуждаются индивидуально в зависимости от масштаба задачи.",
        price: "от 30 000 руб.",
    },
];

const REVIEWS = [
    {
        id: 1,
        company: "ООО “Лента”",
        avatar: client1,
        text: "«Наши люди» почувствовали наш бренд с полуслова. Они прислали всего нескольких кандидатов, и каждый был сильным. В итоге мы выбрали идеального по опыту и ценностям. Работа на высшем уровне.»",
        rating: 5,
    },
    {
        id: 2,
        company: "ООО “Диджитал”",
        avatar: client2,
        text: "«Обратились из-за репутации агентства. Команда аккуратно работала с нашей задачей и кандидатами. В итоге закрыли сложную позицию и сохранили конфиденциальность.»",
        rating: 5,
    },
];


function PublicHeader() {
    const navigate = useNavigate();

    const handleNavClick = (hash) => {
        if (!hash || !hash.startsWith("#")) return;
        const el = document.querySelector(hash);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // кто сейчас залогинен
    const client = getCurrentClient();
    const admin = getCurrentAdmin();
    const clientAuthed = isClientAuthenticated();
    const adminAuthed = isAdminAuthenticated();

    const handleCabinetClick = () => {
        if (adminAuthed) {
            navigate("/admin/dashboard");
        } else if (clientAuthed) {
            navigate("/client/dashboard");
        } else {
            navigate("/login");
        }
    };

    let userLabel = "";
    let initials = "";

    if (adminAuthed && admin) {
        userLabel = admin.firstName || admin.email || "Администратор";
    } else if (clientAuthed && client) {
        userLabel = client.firstName || client.email || "Клиент";
    }

    if (userLabel) {
        initials = userLabel[0].toUpperCase();
    }

    const isLoggedIn = adminAuthed || clientAuthed;

    return (
        <header className="public-header">
            <div className="public-header-inner">
                {/* Логотип слева, ведёт на главную */}
                <div
                    className="public-logo"
                    onClick={() => navigate("/")}
                    role="button"
                >
                    <div className="public-logo-mark">↻</div>
                    <span className="public-logo-text">Наши люди</span>
                </div>

                {/* Якоря по секциям главной */}
                <nav className="public-nav">
                    {NAV_LINKS.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            className="public-nav-link"
                            onClick={() => handleNavClick(item.to)}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Правый блок */}
                <div className="public-header-actions">
                    {isLoggedIn && (
                        <div className="public-header-user">
                            <div className="public-header-avatar">
                                {initials || "•"}
                            </div>
                            <div className="public-header-user-text">
                                <div className="public-header-user-name">
                                    {userLabel}
                                </div>
                                <div className="public-header-user-role">
                                    {adminAuthed ? "Администратор" : "Клиент"}
                                </div>
                            </div>
                        </div>
                    )}

                    {!isLoggedIn && (
                        <button
                            type="button"
                            className="btn btn--muted"
                            onClick={() => navigate("/login")}
                        >
                            Вход
                        </button>
                    )}

                    <button
                        type="button"
                        className="btn btn--primary"
                        onClick={isLoggedIn ? handleCabinetClick : () => navigate("/request")}
                    >
                        {isLoggedIn ? "В кабинет" : "Оставить заявку"}
                    </button>
                </div>
            </div>
        </header>
    );
}

function PublicFooter() {
    return (
        <footer className="public-footer" id="contacts">
            <div className="public-footer-inner">
                <div className="footer-contacts">
                    <h3>НАШИ ЛЮДИ</h3>
                    <p className="footer-lead">
                        Мы всегда рады ответить на ваши вопросы и обсудить детали
                        сотрудничества!
                    </p>
                    <p className="footer-label">Основные каналы связи:</p>
                    <ul className="footer-list">
                        <li>
                            Телефон: +7 (999) 555 88 77 (многоканальный, приём звонков
                            ежедневно с 9:00 до 18:00)
                        </li>
                        <li>
                            Мобильный: +7 (999) 888 77 55 (доступен в рабочее время и по
                            экстренным вопросам)
                        </li>
                        <li>
                            E-mail: info@nashi-lyudi.ru (отвечаем в течение 1–2 рабочих часов)
                        </li>
                        <li>
                            WhatsApp / Telegram: +7 (999) 999 99 99 (для быстрых консультаций
                            и обмена документами)
                        </li>
                    </ul>
                </div>

                <div className="footer-address">
                    <p className="footer-label">Адрес офиса:</p>
                    <p>г. Москва, ул. Московская, д. 25, офис 205</p>
                    <p>Режим работы: пн–пт, с 9:00 до 18:00, сб–вс — выходной</p>
                </div>
            </div>
        </footer>
    );
}

// ====== ГЛАВНАЯ СТРАНИЦА ======

export default function HomePage() {
    const navigate = useNavigate();
    const [activeServiceId, setActiveServiceId] = useState("mini");

    const activeService = SERVICES.find((s) => s.id === activeServiceId);

    return (
        <div className="home">
            <PublicHeader />

            {/* HERO */}
            <section className="home-hero">
                <div className="home-hero-inner">
                    <div className="home-hero-content">
                        <div className="home-hero-pill">HR-агентство полного цикла</div>
                        <h1>
                            Закрываем сложные вакансии
                            <span> быстрее и надёжнее</span>
                        </h1>
                        <p className="home-hero-subtitle">
                            “HR-agency” берёт на себя подбор персонала, чтобы у тебя оставалось
                            время на бизнес, а не на бесконечные собеседования.
                        </p>

                        <div className="home-hero-actions">
                            <Button
                                variant="primary"
                                onClick={() => navigate("/request")}
                            >
                                Оставить заявку
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/client/dashboard")}
                            >
                                Войти в кабинет клиента
                            </Button>
                        </div>

                        <div className="home-hero-metrics">
                            {METRICS.map((m) => (
                                <div className="metric" key={m.label}>
                                    <div className="metric-value">{m.value}</div>
                                    <div className="metric-label">{m.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="home-hero-image-wrap">
                        <div className="home-hero-card">
                            <img src={heroImg} alt="HR-команда в офисе" />
                        </div>
                        <div className="home-hero-floating-card">
                            <p className="floating-title">Новая заявка</p>
                            <p className="floating-text">
                                Менеджер по продажам в IT · срочно
                            </p>
                            <p className="floating-label">В работе · 3 кандидата</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Почему с нами спокойно */}
            <section className="home-section" id="about">
                <div className="home-section-header">
                    <h2>Почему с нами спокойно</h2>
                    <p>
                        Мы выстраиваем подбор так, чтобы ты видел прозрачный статус по
                        каждой вакансии и мог планировать результат.
                    </p>
                </div>

                <div className="home-benefits-grid">
                    {BENEFITS.map((b) => (
                        <div className="home-benefit-card" key={b.title}>
                            <h3>{b.title}</h3>
                            <p>{b.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Нам доверяют (кейсы) */}
            <section className="home-section home-section-alt" id="cases">
                <div className="home-section-header">
                    <h2>Нам доверяют</h2>
                    <p>
                        С нами работают компании из IT, ритейла, услуг и производства. Мы
                        берём на себя рутину, чтобы собственники могли масштабироваться.
                    </p>
                </div>

                <div className="home-clients">
                    {CLIENTS.map((client) => (
                        <div className="home-client-card" key={client.name}>
                            <img src={client.logo} alt={client.name} />
                            <div>
                                <p className="client-name">{client.name}</p>
                                <p className="client-role">{client.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* УСЛУГИ */}
            <section className="home-section services-section" id="services">
                <div className="home-section-header home-section-header-left">
                    <h2>Услуги</h2>
                </div>

                <div className="services-layout">
                    <div className="service-tabs">
                        {SERVICES.map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                className={
                                    "service-tab" +
                                    (s.id === activeServiceId ? " service-tab--active" : "")
                                }
                                onClick={() => setActiveServiceId(s.id)}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <div className="service-content">
                        <p className="service-description">
                            {activeService.description}
                        </p>
                        <p>Что входит:</p>
                        <ul className="service-list">
                            {activeService.list.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <p className="service-timeline">{activeService.timeline}</p>

                        <div className="service-bottom-row">
                            <Button
                                variant="primary"
                                onClick={() => navigate("/request")}
                            >
                                Подать заявку
                            </Button>
                            <div className="service-price">{activeService.price}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ОТЗЫВЫ */}
            <section
                className="home-section home-section-alt reviews-section"
                id="reviews"
            >
                <div className="home-section-header home-section-header-left">
                    <h2>Отзывы</h2>
                </div>

                <div className="reviews-grid">
                    {REVIEWS.map((review) => (
                        <article className="review-card" key={review.id}>
                            <div className="review-header">
                                <div className="review-avatar-wrap">
                                    <img
                                        src={review.avatar}
                                        alt={review.company}
                                        className="review-avatar"
                                    />
                                </div>
                                <div className="review-company">
                                    <p>{review.company}</p>
                                    <p className="review-stars">
                                        {"★".repeat(review.rating)}
                                    </p>
                                </div>
                            </div>
                            <p className="review-text">{review.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
