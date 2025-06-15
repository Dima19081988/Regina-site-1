import React, { Suspense, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/header.css';
import logo from '../assets/logos/logo.png';

const Login = React.lazy(() => import('../pages/admin/login'));

interface HeaderProps {
  isAdmin: boolean;
  onLogout: () => void;
  onLogin: () => void;
  isAuthenticated: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isAdmin, onLogout, onLogin, isAuthenticated }) => {
    return (
        <header className={`header ${isAdmin ? 'admin-mode' : 'user-mode'}`}>
            <div className="header__logo">
                <img src={logo} alt="Логотип" style={{ maxHeight: '50px' }}/>
            </div>
            <nav className="header__nav">
                {isAdmin ? (
                <>
                    <Link to="/admin/dashboard">Панель администратора</Link>
                    <button onClick={onLogout} style={{ marginLeft: '10px'}}>Выйти</button>
                </>
                ) : (
                <>
                    <Link to="/">Главная страница</Link>
                    <Link to="#biografy">Биография</Link>
                    <Link to="#portfolio">Портфолио</Link>
                    <Link to="#articles">Статьи</Link>
                    <Link to="/pricelist">Прайслист</Link>
                    <Link to="#contacts">Контакты</Link>
                    {!isAuthenticated && !isAdmin && (
                        <div className="header__login-form">
                            <Suspense fallback={<div>Загрузка формы входа...</div>}>
                                <Login onLogin={onLogin} />
                            </Suspense>
                        </div>
                    )}
                </>
            )}
            </nav>
            {!isAdmin && <h1 className="header__title">Ваш косметолог Регина</h1>}
        </header>
    );
};