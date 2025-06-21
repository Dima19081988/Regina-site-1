import React from "react";
import Calendar from "./calendar";
import "../../../styles/appointmentsPage.css"

const AppointmentsPage: React.FC = () => {
    return (
        <div className="appointments-page">
        <h1>Управление записью</h1>
        <Calendar />
    </div>
    )
}
export default AppointmentsPage;