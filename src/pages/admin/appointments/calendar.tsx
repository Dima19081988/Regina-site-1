import React, { useState, useEffect } from "react";
import AppointmentForm from "./appointmentForm";
import type { Appointment, AppointmentData } from "../../../types/appointments";
import "../../../styles/calendar.css";

function useIsMobile(breakpoint = 600) {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [breakpoint]);

    return isMobile;
}

const Calendar: React.FC = () => {
    // состояния
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    // управление модальным окном
    const [activeDate, setActiveDate] = useState<string | null>(null);
    // const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editAppointment, setEditAppointment] = useState<Appointment | null>(null);
    // для мобильных устройств
    const isMobile = useIsMobile(600);

    // генерация календаря
    // подсветка сегодняшеного числа
    const today = new Date();
    const todayStr = today.toLocaleDateString('ru-RU').split('.').reverse().join('-');
    // смена месяца
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
        setActiveDate(null);
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
    // добавляем дни текущего месяца
    for (let i = 1; i <= dayInMonth; i++) {
        dates.push(new Date(currentYear, currentMonth, i));
    }
    // добавляем дни следующего месяца
    const totalCells = 42;
    const nextDays = totalCells - dates.length;
    for (let i = 1; i <= nextDays; i++) {
        dates.push(new Date(currentYear, currentMonth + 1, i));
    }

    // Обработчик клика по ячейке календаря
    const handleCellClick = (dateStr: string) => {
        setActiveDate(dateStr);
        setEditAppointment(null);
    }
    // добавление новой записи
    const handleAddAppointment = (data: AppointmentData) => {
        if(!activeDate) return;
        const newAppointment: Appointment = {
            ...data,
            date: activeDate,
        }
        setAppointments(prev => [...prev, newAppointment]);
    }

    // редактирование записи 
    const handleEditAppointment = (data: AppointmentData) => {
        if(!editAppointment) return;
        const updateAppointment = appointments.map(app => 
            app === editAppointment ? { ...data, date: app.date } : app
        );
        setAppointments(updateAppointment);
        setEditAppointment(null);
    }

    // удаление записи
    const handleDeleteAppointment = (appointment: Appointment) => {
        setAppointments(prev => prev.filter(app => app !== appointment))
    }

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
            {/* адаптивнывй рендер */}
            {isMobile ? (
                <div className="calendar-list">
                {dates
                    .filter(date => date.getMonth() === currentMonth)
                    .map(date => {
                        const dateStr = date.toLocaleDateString('ru-RU').split('.').reverse().join('-');
                        const dayAppointments = appointments.filter(a => a.date === dateStr);
                        return (
                            <div
                                key={dateStr}
                                className={`calendar-list-day ${dateStr === todayStr ? 'today' : ''}`}
                                onClick={() => handleCellClick(dateStr)}
                            >
                                <div className="list-date">
                                    <span className="list-date-number">{date.getDate()}</span>
                                    <span className="list-date-weekday">
                                    {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
                                    </span>
                                    {dayAppointments.length > 0 && (
                                    <span className="list-appointments-count">
                                    {dayAppointments.length} {dayAppointments.length === 1 ? 'запись' : 'записи'}
                                    </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div> 
            ) : (
                <div className="calendar-grid">
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                        <div key={index} className="calendar-week-day">{day}</div>
                    ))}
                    {dates.map(date => {
                        const dateStr = date.toLocaleDateString('ru-RU').split('.').reverse().join('-');
                        const isCurrentMonth = date.getMonth() === currentMonth;
                        const dayAppointments = appointments.filter(a => a.date === dateStr)
                    
                        return (
                            <div
                                key={dateStr}
                                className={`calendar-day 
                                    ${dateStr === todayStr ? 'today' : ''}
                                    ${!isCurrentMonth ? 'other-month' : ''}`}
                                onClick={() => handleCellClick(dateStr)}
                            >
                                <div className="date-number">
                                    {date.getDate()}
                                    {dateStr === todayStr && <span> (Сегодня)</span>}
                                </div>
                                {dayAppointments.length > 0 && (
                                    <div className="appoinments-count">
                                        {dayAppointments.length} {dayAppointments.length === 1 ? 
                                        'запись' :
                                        dayAppointments.length > 1 && dayAppointments.length < 5 ? 
                                    'записи' : 'записей'}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div> 
            )}
                  {/* модальное окно */}
            {activeDate && (
                <div className="modal" onClick={() => setActiveDate(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {editAppointment ? (
                            <AppointmentForm
                                date={new Date(editAppointment.date)}
                                onSave={handleEditAppointment}
                                onClose={() => setEditAppointment(null)}
                                initialData={editAppointment}
                            />
                        ) : (
                            <AppointmentForm
                                date={new Date(activeDate)}
                                onSave={handleAddAppointment}
                                onClose={() => setActiveDate(null)}
                            />
                        )}
                        {/* список существующих записей */}
                        <div className="existing-appointments">
                            <h3>Существующие записи</h3>
                            {appointments.filter(a => a.date === activeDate).length === 0 ? (
                                <p>Нет записей</p>
                            ) : (
                                <ul>
                                    {appointments
                                    .filter(a => a.date === activeDate)
                                    .sort((a,b) => new Date(a.time).getTime() - new Date(b.time).getTime())
                                    .map((appointment, index) => (
                                        <li key={index} className="appointment-item">
                                            <div className="appointment-indo">
                                                <div><strong>{appointment.clientName}</strong></div>
                                                <div>Услуга: {appointment.service}</div>
                                                <div>Время: {new Date(appointment.time)
                                                .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                <div>Цена: {appointment.price} ₽</div>
                                                {appointment.comment && <div>Заметки: {appointment.comment}</div>}
                                            </div>
                                            <div className="appointment-actions">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => setEditAppointment(appointment)}
                                                >
                                                Изменить запись
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteAppointment(appointment)}
                                                >
                                                Удалить запись
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;

