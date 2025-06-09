import { useParams } from "react-router-dom";

export const TrendDetail:React.FC = () => {
    const { id } = useParams<{id: string}>();
    return (
        <section>
            <h2>Подробней про: {id}</h2>
            {}
        </section>
    );
}