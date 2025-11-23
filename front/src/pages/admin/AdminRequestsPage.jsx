import { useParams } from "react-router-dom";

export default function AdminRequestDetailsPage() {
    const { id } = useParams();
    return (
        <div className="page-card">
            <h1>Заявка #{id}</h1>
            <p>
                Здесь администратор видит полную информацию о заявке, историю статусов и
                комментарии.
            </p>
        </div>
    );
}
