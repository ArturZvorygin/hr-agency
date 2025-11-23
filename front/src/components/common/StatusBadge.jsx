const map = {
    NEW: "badge badge--new",
    IN_PROGRESS: "badge badge--in-progress",
    WAIT_CLIENT: "badge badge--waiting",
    DONE: "badge badge--done",
    CANCELED: "badge badge--canceled",
};

export default function StatusBadge({ status }) {
    const cls = map[status] || "badge";
    const text =
        {
            NEW: "Новая",
            IN_PROGRESS: "В работе",
            WAIT_CLIENT: "Ожидание клиента",
            DONE: "Закрыта",
            CANCELED: "Отменена",
        }[status] || status;

    return <span className={cls}>{text}</span>;
}
