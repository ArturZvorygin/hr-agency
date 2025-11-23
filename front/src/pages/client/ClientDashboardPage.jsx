import Card from "../../components/common/Card.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";

export default function ClientDashboardPage() {
    // пока статические данные. Потом заменишь на fetch с бэка
    const stats = {
        activeRequests: 24,
        newCandidates: 13,
        closedVacancies: 8,
        inSalesWork: 5,
    };

    const requests = [
        {
            id: 1024,
            client: "ООО «ТехСтарт»",
            vacancy: "Frontend-разработчик",
            manager: "Иванова Ольга",
            status: "IN_PROGRESS",
            candidates: 5,
            createdAt: "23.11.2025",
        },
        {
            id: 1023,
            client: "ИП «Петров»",
            vacancy: "HR-менеджер",
            manager: "Смирнов Андрей",
            status: "NEW",
            candidates: 1,
            createdAt: "23.11.2025",
        },
        {
            id: 1022,
            client: "ООО «DigitalPro»",
            vacancy: "Project Manager",
            manager: "Иванова Ольга",
            status: "WAIT_CLIENT",
            candidates: 3,
            createdAt: "22.11.2025",
        },
        {
            id: 1021,
            client: "АО «ИнфоСофт»",
            vacancy: "QA Engineer",
            manager: "Ким Алия",
            status: "DONE",
            candidates: 4,
            createdAt: "20.11.2025",
        },
    ];

    return (
        <>
            <header className="header">
                <div className="header__left">
                    <h1 className="header__title">Главная – личный кабинет</h1>
                    <p className="header__subtitle">
                        Сводка по вашим заявкам и вакансиям за сегодня
                    </p>
                </div>

                <div className="header__right">
                    <div className="header__search">
                        <input
                            type="text"
                            placeholder="Поиск по заявкам и вакансиям…"
                        />
                    </div>
                    <button className="header__icon-button" aria-label="Уведомления">
                        🔔
                    </button>
                    <div className="header__user">
                        <div className="header__user-info">
                            <span className="header__user-name">Клиент</span>
                            <span className="header__user-role">Компания</span>
                        </div>
                        <div className="header__user-avatar">К</div>
                    </div>
                </div>
            </header>

            <section className="cards">
                <Card className="card--primary">
                    <div className="card__label">Активные заявки</div>
                    <div className="card__value">{stats.activeRequests}</div>
                    <div className="card__meta">+4 за сегодня</div>
                </Card>
                <Card>
                    <div className="card__label">Новые кандидаты</div>
                    <div className="card__value">{stats.newCandidates}</div>
                    <div className="card__meta">за последние 24 часа</div>
                </Card>
                <Card>
                    <div className="card__label">Закрытые вакансии</div>
                    <div className="card__value">{stats.closedVacancies}</div>
                    <div className="card__meta">за эту неделю</div>
                </Card>
                <Card>
                    <div className="card__label">В работе у отдела продаж</div>
                    <div className="card__value">{stats.inSalesWork}</div>
                    <div className="card__meta">ожидают согласования</div>
                </Card>
            </section>

            <section className="table-block">
                <div className="table-block__header">
                    <div>
                        <h2 className="table-block__title">Мои заявки</h2>
                        <p className="table-block__subtitle">
                            Последние заявки по всем вакансиям
                        </p>
                    </div>
                    <div className="table-block__actions">
                        <button className="btn btn--ghost">Экспорт</button>
                        <button
                            className="btn btn--primary"
                            onClick={() => (window.location.href = "/request")}
                        >
                            Новая заявка
                        </button>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Компания</th>
                            <th>Вакансия</th>
                            <th>Ответственный</th>
                            <th>Статус</th>
                            <th>Кандидатов</th>
                            <th>Создана</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.map((r) => (
                            <tr key={r.id}>
                                <td>#{r.id}</td>
                                <td>{r.client}</td>
                                <td>{r.vacancy}</td>
                                <td>{r.manager}</td>
                                <td>
                                    <StatusBadge status={r.status} />
                                </td>
                                <td>{r.candidates}</td>
                                <td>{r.createdAt}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
