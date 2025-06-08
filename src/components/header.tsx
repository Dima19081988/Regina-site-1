import React from "react";
import { Link } from "react-router-dom";
import '../styles/header.css';
import logo from '../assets/logos/logo.png'

export const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header__logo">
                <img src={logo} alt="Логотип" style={{ maxHeight: '50px' }}/>
            </div>
            <nav className="header__nav">
                <Link to="/">Главная страница</Link>
                <Link to="#biografy">Биография</Link>
                <Link to="#portfolio">Портфолио</Link>
                <Link to="#articles">Статьи</Link>
                <Link to="/pricelist">Прайслист</Link>
                <Link to="#contacts">Контакты</Link>
            </nav>
            <h1 className="header__title">Ваш косметолог Регина</h1>
        </header>
    );
};