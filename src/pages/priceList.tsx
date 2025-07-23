import React from "react";
import { priceListData } from "../data/pricelistData";
import '../styles/pricelist.css';

export const PriceList: React.FC = () => {
    return (
        <section className="pricelist">
            <h2>Прайслист</h2>
            {priceListData.map(category =>(
                <div key={category.id} className="pricelist-category">
                    <h3>{category.title}</h3>
                    <table className="pricelist-table">
                        <thead>
                            <tr>
                                <th>Наименование</th>
                                <th>Объем</th>
                                {/* <th>Стоимость (₽)</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {category.services.map(service => (
                                <tr key={service.id}>
                                    <td>{service.name}</td>
                                    <td>{service.volume}</td>
                                    {/* <td>{service.price.toLocaleString('ru-RU')}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </section>
    );
};