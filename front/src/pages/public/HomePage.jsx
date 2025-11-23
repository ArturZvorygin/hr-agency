import { Link } from "react-router-dom";
import heroImg from "../../assets/hero-office.jpg";
import client1 from "../../assets/client-1.png";
import client2 from "../../assets/client-2.png";
import client3 from "../../assets/client-2.png";
import Button from "../../components/common/Button.jsx";

export default function HomePage() {
    return (
        <div className="public">
            <header className="public-header">
                <div className="public-header__left">
                    <div className="public-logo">Наши люди</div>
                    <nav className="public-nav">
                        <a href="#services">Услуги</a>
                        <a href="#cases">Кейсы</a>
                        <a href="#benefits">Преимущества</a>
                    </nav>
                </div>
                <div className="public-header__right">
                    <Link to="/login" className="link">
                        Вход
                    </Link>
                    <Button>
                        <Link to="/request" className="btn__link">
                            Оставить заявку
                        </Link>
                    </Button>
                </div>
            </header>

            <section className="hero">
                <div className="hero__info">
                    <h1>Кадровое агентство «Наши люди»</h1>
                    <p>
                        Помогаем владельцам бизнеса, HR-директорам и руководителям отделов
                        закрывать сложные вакансии: от топ-менеджмента до линейного
                        персонала.
                    </p>
                    <div className="hero__actions">
                        <Button>
                            <Link to="/request" className="btn__link">
                                Оставить заявку на подбор
                            </Link>
                        </Button>
                        <Link to="/register" className="link link--muted">
                            Зарегистрироваться как клиент
                        </Link>
                    </div>
                    <div className="hero__meta">
                        <span>3–7 дней до первых кандидатов</span>
                        <span>90% заявок закрываем в срок</span>
                    </div>
                </div>
                <div className="hero__image">
                    <img src={heroImg} alt="Офис и команда" />
                </div>
            </section>

            <section id="services" className="section">
                <h2>Кого мы подбираем</h2>
                <div className="cards cards--services">
                    {[
                        "Топ-менеджмент",
                        "IT-специалисты",
                        "Административный персонал",
                        "Производственный персонал",
                        "Специалисты продаж",
                    ].map((title) => (
                        <div key={title} className="card card--service">
                            <h3>{title}</h3>
                            <p>
                                Подбор кандидатов под задачи бизнеса с учётом опыта, навыков и
                                корпоративной культуры.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="cases" className="section">
                <h2>Кейсы закрытых вакансий</h2>
                <div className="cards cards--cases">
                    <div className="card card--case">
                        <h3>IT-директор для производственной компании</h3>
                        <p>Срок подбора – 28 дней, 3 финальных кандидата.</p>
                    </div>
                    <div className="card card--case">
                        <h3>Руководитель отдела продаж B2B</h3>
                        <p>Срок подбора – 21 день, рост выручки на 35% за 6 месяцев.</p>
                    </div>
                    <div className="card card--case">
                        <h3>Линейный персонал для сети магазинов</h3>
                        <p>Одновременно закрыто 17 вакансий в 3 регионах.</p>
                    </div>
                </div>
            </section>

            <section id="benefits" className="section section--light">
                <h2>Почему с нами удобно работать</h2>
                <div className="cards cards--benefits">
                    <div className="card">
                        <h3>Прозрачная CRM</h3>
                        <p>Вы видите статус каждой заявки и этап работы по кандидатам.</p>
                    </div>
                    <div className="card">
                        <h3>Отбор в несколько этапов</h3>
                        <p>Интервью, проверка рекомендаций, оценка мотивации.</p>
                    </div>
                    <div className="card">
                        <h3>Гарантийный период</h3>
                        <p>Бесплатная замена кандидата в течение согласованного срока.</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <h2>Отзывы клиентов</h2>
                <div className="cards cards--testimonials">
                    {[client1, client2, client3].map((avatar, idx) => (
                        <div key={idx} className="card card--testimonial">
                            <div className="testimonial__header">
                                <img src={avatar} alt="Клиент" className="testimonial__avatar" />
                                <div>
                                    <div className="testimonial__name">Клиент #{idx + 1}</div>
                                    <div className="testimonial__role">руководитель компании</div>
                                </div>
                            </div>
                            <p>
                                «Наши люди» помогли быстро закрыть сложные вакансии и сняли
                                нагрузку с HR-отдела. Видно, как агентство вовлечено в задачи
                                бизнеса.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="public-footer">
                <div>© {new Date().getFullYear()} Кадровое агентство «Наши люди»</div>
                <div>Политика конфиденциальности</div>
            </footer>
        </div>
    );
}
