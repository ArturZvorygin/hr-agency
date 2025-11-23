import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { resetPassword } from "../../api/client.js";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("loading");
        try {
            await resetPassword({ token, password });
            setStatus("success");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Смена пароля</h1>

                <form onSubmit={handleSubmit} className="auth-form">
                    <Input
                        label="Новый пароль"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit">
                        {status === "loading" ? "Сохраняем..." : "Сохранить пароль"}
                    </Button>

                    {status === "success" && (
                        <div className="form-status form-status--success">
                            Пароль изменён. Сейчас вы будете перенаправлены.
                        </div>
                    )}
                    {status === "error" && (
                        <div className="form-status form-status--error">
                            Ошибка. Ссылка могла устареть.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
