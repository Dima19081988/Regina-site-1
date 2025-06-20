import React, { useState } from "react";
import AppointmentForm from "./appointmentForm";
import type { Appointment, AppointmentData } from "../../../types/appointments";
import '../styles/calendar.css';

const Calendar: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const dayInMonth = new Date(year, month + 1, 0).getDate();
    const dates = Array.from({ length: dayInMonth }, (_, i) => 
        new Date(year, month, i + 1));
    
    const handleSave = (data: AppointmentData) => {
        if(!selectedDay) return;

        const dataStr = selectedDay.toISOString().slice(0, 10);
        const newAppointment: Appointment = {
            ...data,
            date: dataStr
        };

        setAppointments(prev => [...prev, newAppointment]);
        setSelectedDay(null);
    }

    const handleClose = () => setSelectedDay(null);

    return (
        <div className="calendar-container">
            <h2>Календарь записей</h2>
            <div className="calendar-grid">
                {dates.map(date => {
                    const dateStr = date.toISOString().slice(0, 10);
                    const dayAppointments = appointments.filter(a => a.date === dateStr);
                    return (
                        <div
                            key={dateStr}
                            className={`calendar-day ${dateStr === today.toISOString().slice(0, 10) ? 'today' : ''}`}
                            onClick={() => setSelectedDay(date)}
                        >
                            <div className="date-number">{date.getDate()}</div>
                            <ul className="appointments-list">
                                {dayAppointments.map((a, idx) => (
                                    <li key={idx}>
                                        {a.clientName} ({a.service}) в
                                         {new Date(a.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        {selectedDay && (
            <div className="modal">
                <AppointmentForm date={selectedDay} onSave={handleSave} onClose={handleClose}/>
            </div>
        )}        
        </div>
    );
};

export default Calendar;