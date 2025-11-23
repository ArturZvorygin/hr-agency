export default function AdminDashboardPage() {
    return (
        <>
            <header className="header">
                <div className="header__left">
                    <h1 className="header__title">Главная – администратор</h1>
                    <p className="header__subtitle">
                        Сводка по заявкам и активности клиентов.
                    </p>
                </div>
            </header>

            <section className="cards">
                <div className="card card--primary">
                    <div className="card__label">Новые заявки</div>
                    <div className="card__value">7</div>
                    <div className="card__meta">за сегодня</div>
                </div>
                <div className="card">
                    <div className="card__label">В работе</div>
                    <div className="card__value">18</div>
                    <div className="card__meta">подбор кандидатов</div>
                </div>
                <div className="card">
                    <div className="card__label">Закрыто</div>
                    <div className="card__value">42</div>
                    <div className="card__meta">за месяц</div>
                </div>
                <div className="card">
                    <div className="card__label">Клиентов в системе</div>
                    <div className="card__value">65</div>
                    <div className="card__meta">активные</div>
                </div>
            </section>
        </>
    );
}
