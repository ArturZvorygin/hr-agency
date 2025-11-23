import { useState } from "react";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { forgotPassword } from "../../api/client.js";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("loading");
        try {
            await forgotPassword(email);
            setStatus("success");
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Восстановление пароля</h1>
                <p className="auth-card__subtitle">
                    Укажите email, на который вы получите ссылку для смены пароля.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <Input
                        label="Электронная почта"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button type="submit">
                        {status === "loading" ? "Отправляем..." : "Отправить ссылку"}
                    </Button>

                    {status === "success" && (
                        <div className="form-status form-status--success">
                            Если такой email есть в системе, мы отправили на него письмо.
                        </div>
                    )}
                    {status === "error" && (
                        <div className="form-status form-status--error">
                            Ошибка. Попробуйте позже.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
