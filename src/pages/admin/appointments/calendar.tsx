import React, { useState, useEffect } from "react";
import AppointmentForm from "./appointmentForm";
import type { Appointment, AppointmentData } from "../../../types/appointments";
import { 
    fetchAppointmentsByMonth, 
    createAppointment, 
    updateAppointment, 
    deleteAppointment } from "../../../api/appointments";
import "../../../styles/calendar.css";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { formatDateLocal } from "../../../utils/calendarUtils";
import { generateCalendarDates } from "../../../utils/calendarUtils";

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

    useEffect(() => {
        fetchAppointmentsByMonth(currentYear, currentMonth)
            .then(data => {
                console.log('Raw data from server:', data);
                setAppointments(data);
            })
            .catch(e => alert('Ошибка загрузки календаря: ' + e.message));
    }, [currentYear, currentMonth]);

    // генерация календаря
    // подсветка сегодняшеного числа
    const today = new Date();
    const todayStr = formatDateLocal(today);
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

    const dates = generateCalendarDates(currentYear, currentMonth);

    // Обработчик клика по ячейке календаря
    const handleCellClick = (date: Date) => {
        setActiveDate(formatDateLocal(date));
        setEditAppointment(null);
    }
    // добавление новой записи
    const handleAddAppointment = async (data: AppointmentData) => {
        if (!activeDate) return;
        try {
            await createAppointment({ ...data, date: activeDate });
            fetchAppointmentsByMonth(currentYear, currentMonth).then(data => {
            setAppointments(data);
            });
            setActiveDate(null);
        } catch (e: any) {
            alert("Ошибка добавления: " + e.message);
        }
    }

    // редактирование записи 
    const handleEditAppointment = async (data: AppointmentData) => {
        if(!editAppointment) return;
        try {
            await updateAppointment(editAppointment.id, { ...data, date: editAppointment.date });
            fetchAppointmentsByMonth(currentYear, currentMonth).then(data => {
            setAppointments(data);
            }); 
            setEditAppointment(null);
        } catch (e: any) {
            alert("Ошибка изменения: " + e.message);
        }
    }

    // удаление записи
    const handleDeleteAppointment = async (appointment: Appointment) => {
        try {
            await deleteAppointment(appointment.id);
            fetchAppointmentsByMonth(currentYear, currentMonth).then(data => {
            setAppointments(data);
            });
        } catch (e: any) {
            alert("Ошибка удаления: " + e.message);
        }
    }
    console.log('Rendering with appointments:', appointments);

    //рендер
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
                        const dateStr = formatDateLocal(date);
                        console.log('activeDate:', activeDate);
                        console.log('appointments:', appointments);
                        const dayAppointments = appointments.filter(a => a.date === dateStr);
                        console.log('Дата ячейки:', dateStr, 'Записи:', dayAppointments);
                        return (
                            <div
                                key={dateStr}
                                className={`calendar-list-day ${dateStr === todayStr ? 'today' : ''}`}
                                onClick={() => handleCellClick(date)}
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
                        const dateStr = formatDateLocal(date);
                        const isCurrentMonth = date.getMonth() === currentMonth;
                        console.log('activeDate:', activeDate);
                        console.log('appointments:', appointments);
                        const dayAppointments = appointments.filter(a => a.date === dateStr);
                        console.log('Дата ячейки:', dateStr, 'Записи:', dayAppointments);
                        return (
                            <div
                                key={dateStr}
                                className={`calendar-day 
                                    ${dateStr === todayStr ? 'today' : ''}
                                    ${!isCurrentMonth ? 'other-month' : ''}`}
                                onClick={() => handleCellClick(date)}
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
                                    .sort((a, b) => {
                                            const [aH, aM] = a.time.split(':').map(Number);
                                            const [bH, bM] = b.time.split(':').map(Number);
                                            return aH !== bH ? aH - bH : aM - bM;
                                        })
                                    .map((appointment) => (
                                        <li key={appointment.id} className="appointment-item">
                                            <div className="appointment-info">
                                                <div><strong>{appointment.clientName}</strong></div>
                                                <div>Услуга: {appointment.service}</div>
                                                <div>Время: {appointment.time}</div>
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

