import React from "react";
import { Link } from "react-router-dom";
import '../styles/trendSection.css';

const trends = [
    { id: 1, title: 'Уход за кожей', bg: '/pictures/'},
    { id: 2, title: 'Иньекционные методики', bg: '/pictures/'},
    { id: 3, title: 'Ботулотоксин', bg: '/pictures/'},
    { id: 4, title: 'Аппаратная косметология', bg: '/pictures/'},
    { id: 5, title: 'Новые разработки', bg: '/pictures/'}
];

export const TrendSection: React.FC = () => {
    return (
        <section className="trends-section">
            <h2 className="trends-section__title">Новое в мире косметологии</h2>
            <div className="trends-section__list">
                {trends.map(trend => (
                    <Link
                        key={trend.id}
                        to={`/trend/${trend.id}`}
                        className="trend-card"
                        style={{ backgroundImage: `url(${trend.bg})` }}
                    >
                        <span className="trend-card__title">{trend.title}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}