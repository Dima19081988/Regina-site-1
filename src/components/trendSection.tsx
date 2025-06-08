import React from "react";
import '../styles/trendSection.css';

const trends = [
    { id: 1, title: 'Уход за кожей', link: '#', bg: '/pictures/'},
    { id: 2, title: 'Иньекционные методики', link: '#', bg: '/pictures/'},
    { id: 1, title: 'Ботулотоксин', link: '#', bg: '/pictures/'},
    { id: 1, title: 'Аппаратная косметология', link: '#', bg: '/pictures/'},
    { id: 1, title: 'Новые разработки', link: '#', bg: '/pictures/'}
];

export const TrendSection: React.FC = () => {
    return (
        <section className="trends-section">
            <h2 className="trends-section__title">Новое в мире косметологии</h2>
            <div className="trends-section__list">
                {trends.map(trend => (
                    <a
                    key={trend.id}
                    href={trend.link}
                    className="trend-card"
                    style={{ backgroundImage: `url(${trend.bg})` }}
                    >
                        <span className="trend-card__title">{trend.title}</span>
                    </a>
                ))}
            </div>
        </section>
    );
}