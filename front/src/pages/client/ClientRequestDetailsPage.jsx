import { useParams } from "react-router-dom";

export default function ClientRequestDetailsPage() {
    const { id } = useParams();
    return (
        <div className="page-card">
            <h1>Заявка #{id}</h1>
            <p>Карточка заявки с описанием вакансии и статусами подбора.</p>
        </div>
    );
}
