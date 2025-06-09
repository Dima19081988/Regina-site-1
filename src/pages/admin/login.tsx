import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
    onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(password === 'rimadima6') {
            onLogin();
            navigate('/admin/dashboard');
        } else {
            alert('Неверный пароль');
        }
    };

    return (
        <section>
            <h2>Вход для врача</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="введите пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Войти</button>
            </form>
        </section>
    );
};