import React from "react";
import '../styles/header.css';
import logo from '../assets/logos/logo.png'

export const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header__logo">
                <img src={logo} alt="Логотип" style={{ maxHeight: '50px' }}/>
            </div>
            <nav className="header__nav">
                <a href="#biografy">Биография</a>
                <a href="#portfolio">Портфолио</a>
                <a href="#articles">Статьи</a>
                <a href="#pricelist">Прайслист</a>
                <a href="#contacts">Контакты</a>
            </nav>
            <h1 className="header__title">Ваш косметолог Регина</h1>
        </header>
    );
};