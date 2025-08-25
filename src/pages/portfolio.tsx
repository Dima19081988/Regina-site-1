import React from "react";
import { portfolioData } from "../data/portfolioData";
import '../styles/portfolio.css';

export const Portfolio: React.FC = () => {
    return (
        <section id="portfolio" className="portfolio-gallery">
            <h2>Галерея</h2>
            <div className="gallery-grid">
                {portfolioData.map(item => (
                    <div key={item.id} className="portfolio-item">
                        <img src={item.imageUrl} alt={item.title}/>
                        <div className="item-descr">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}