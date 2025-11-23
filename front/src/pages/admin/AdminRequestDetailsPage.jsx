import StatusBadge from "../../components/common/StatusBadge.jsx";

export default function AdminRequestsPage() {
    const rows = [
        {
            id: 1024,
            client: "ООО «ТехСтарт»",
            vacancy: "Frontend-разработчик",
            manager: "Иванова Ольга",
            status: "IN_PROGRESS",
            createdAt: "23.11.2025",
        },
    ];

    return (
        <div className="table-block">
            <div className="table-block__header">
                <div>
                    <h2 className="table-block__title">Заявки клиентов</h2>
                    <p className="table-block__subtitle">
                        Общий список заявок с фильтрами по статусам.
                    </p>
                </div>
            </div>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Клиент</th>
                        <th>Вакансия</th>
                        <th>Ответственный</th>
                        <th>Статус</th>
                        <th>Создана</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((r) => (
                        <tr key={r.id}>
                            <td>#{r.id}</td>
                            <td>{r.client}</td>
                            <td>{r.vacancy}</td>
                            <td>{r.manager}</td>
                            <td>
                                <StatusBadge status={r.status} />
                            </td>
                            <td>{r.createdAt}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
