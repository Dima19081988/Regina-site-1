import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
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
        <section className="login-form">
            <form onSubmit={handleSubmit} className="login-form-fields">
                <input
                    type="password"
                    placeholder="пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="button btn-log-admin">Войти</button>
            </form>
        </section>
    );
};

export default Login;