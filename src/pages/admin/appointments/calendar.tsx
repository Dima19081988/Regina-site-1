import React, { useState } from "react";
import AppointmentForm from "./appointmentForm";
import type { Appointment, AppointmentData } from "../../../types/appointments";
import "../../../styles/calendar.css";


const Calendar: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());

    const changeMonth = (offset: number) => {
        let newMonth = currentMonth + offset;
        let newYear = currentYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedDate(null);
    }

    // количество дней в месяце
    const dayInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // первый день месяца
    const firstDay = new Date(currentYear, currentMonth, 1);
    // смещение для понедельника
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    // генерация массива дат
    const dates: Date[] = [];
    // добавляем дни пред.месяца
    for (let i = startOffset; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, 1 - i);
        dates.push(prevDate);
    }
    // довляем дни текущего месяца
    for (let i = 1; i <= dayInMonth; i++) {
        dates.push(new Date(currentYear, currentMonth, i));
    }
    // добавляем дни следующего месяца
    const totalCells = 42;
    const nextDays = totalCells - dates.length;
    for (let i = 1; i <= nextDays; i++) {
        dates.push(new Date(currentYear, currentMonth + 1, i));
    }
    const today = new Date();
    const todayStr = today.toLocaleDateString('ru-RU').split('.').reverse().join('-');

    const handleSave = (data: AppointmentData) => {
        if(!selectedDate) return;

        const dataStr = selectedDate
        .toLocaleDateString('ru-RU')
        .split('.')
        .reverse()
        .join('-');

        const newAppointment: Appointment = {
            ...data,
            date: dataStr,
        };

        setAppointments(prev => [...prev, newAppointment]);
        setSelectedDate(null);
    }

    const handleClose = () => setSelectedDate(null);

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={() => changeMonth(-1)} aria-label="Предыдущий месяц" className="btn-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Назад
                </button>
                <h2>Календарь - {new Date(currentYear, currentMonth).toLocaleDateString('ru-RU',
                 { month: "long", year: "numeric"})}</h2>
                <button onClick={() => changeMonth(1)} aria-label="Следующий месяц" className="btn-arrow">
                    Вперёд
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
            <div className="calendar-grid">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                    <div key={index} className="calendar-week-day">{day}</div>
                ))}
                {dates.map(date => {
                    const dateStr = date.toLocaleDateString('ru-RU').split('.').reverse().join('-');
                    const isCurrentMonth = date.getMonth() === currentMonth;
                    const dayAppointments = appointments
                    .filter(a => a.date === dateStr)
                    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
                    return (
                        <div
                            key={dateStr}
                            className={`calendar-day 
                                ${dateStr === todayStr ? 'today' : ''}
                                ${!isCurrentMonth ? 'other-month' : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <div className="date-number">
                                {date.getDate()}
                                {dateStr === todayStr && <span> (Сегодня)</span>}
                            </div>
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
        {selectedDate && (
            <div className="modal">
                <AppointmentForm date={selectedDate} onSave={handleSave} onClose={handleClose}/>
            </div>
        )}        
        </div>
    );
};

export default Calendar;