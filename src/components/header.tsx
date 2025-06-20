import React, { Suspense, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/header.css';

const Login = React.lazy(() => import('../pages/admin/login'));

interface HeaderProps {
  isAdmin: boolean;
  isAuthenticated: boolean;
  onLogout: () => void;
  onLogin: () => void;

}

export const Header: React.FC<HeaderProps> = ({ isAdmin, onLogout, onLogin,
    isAuthenticated }) => {
    const [loginVisible, setLoginVisible] = useState(false);
    const toggleLogin = () => setLoginVisible(prev => !prev)
    return (
        <header className={`header ${isAdmin ? 'admin-mode' : 'user-mode'}`}>
            {/* <div className="header__logo">
                <img src={logo} alt="Логотип" className="header__logo img"/>
            </div> */}
            <nav className="header__nav">
                {isAdmin ? (
                <>
                    <Link to="/admin/dashboard">Панель администратора</Link>
                    <Link to="/admin/appointments">Расписание</Link>
                    <Link to="/admin/dashboard">Заметки</Link>
                    <button className="button logout" onClick={onLogout}>Выйти</button>
                </>
                ) : (
                <>
                    <div className="nav-left">
                        <Link to="/">Главная страница</Link>
                        <Link to="#biografy">Биография</Link>
                        <Link to="#portfolio">Портфолио</Link>
                    </div>
                    <div className="nav-right">
                        <Link to="#articles">Статьи</Link>
                        <Link to="/pricelist">Прайслист</Link>
                        <Link to="#contacts">Контакты</Link>
                        {!isAuthenticated && !isAdmin && (
                            <button
                                className="button login-toggle"
                                onClick={toggleLogin}
                                aria-expanded={loginVisible}
                                aria-controls="login-form"
                            >
                                Войти        
                            </button>
                        )}  
                    </div>  
                </>
                )}
                {loginVisible && !isAuthenticated && !isAdmin && (
                    <div className="header__login-form" id="login-form">
                        <Suspense fallback={<div>Загрузка формы входа...</div>}>
                            <Login onLogin={onLogin} />
                        </Suspense>
                    </div>
                )}
            </nav>
            {!isAdmin && <h1 className="header__title"></h1>}
        </header>
    );
};