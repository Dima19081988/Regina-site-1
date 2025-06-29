import React, { useEffect, useState } from "react";
import type { AppointmentData, AppointmentFormProps } from "../../../types/appointments";
import "../../../styles/appointmentForm.css";


const AppointmentForm: React.FC<AppointmentFormProps> = ({ date, onSave, onClose, initialData }) => {
    const [form, setForm] = useState<AppointmentData>({
        clientName: initialData?.clientName || '',
        service: initialData?.service || '',
        time: initialData?.time
            ? new Date(initialData.time).toLocaleTimeString('ru-RU', { hour12: false, hour: '2-digit', minute: '2-digit' })
            : '',
        price: initialData?.price || '',
        comment: initialData?.comment || '',
        date: date.toISOString().split('T')[0],
    });

     // При смене даты или initialData сбрасываем или обновляем форму
    useEffect(() => {
        setForm({
            clientName: initialData?.clientName || '',
            service: initialData?.service || '',
            time: initialData?.time
                ? new Date(initialData.time).toLocaleTimeString('ru-RU', { hour12: false, hour: '2-digit', minute: '2-digit' })
                : '',
            price: initialData?.price || '',
            comment: initialData?.comment || '',
            date: date.toISOString().split('T')[0],
        });
    }, [date, initialData]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement |
        HTMLTextAreaElement>) => {
            setForm({...form, [e.target.name]: e.target.value});
        }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!form.clientName) {
            alert('Нужно заполнить все поля');
            return;
        }

        const dateTime = new Date(date);
        const[hours, minutes] = form.time.split(':').map(Number);
        dateTime.setHours(hours, minutes, 0, 0);

        onSave({
            clientName: form.clientName,
            service: form.service,
            time: dateTime.toISOString(),
            price: form.price,
            comment: form.comment,
            date: form.date,
        })

        if (!initialData) {
            setForm({ clientName: '', service: '', time: '', price: '', comment: '', date: form.date });
        }

        onClose();
    }

    return (
        <form className="appointment-form" onSubmit={handleSubmit} noValidate>
            <h2 className="form-title">Запись на {date.toLocaleDateString()}</h2>
            <label htmlFor="clientName">Имя клиента *</label>
            <input
                id="clientName"
                type="text"
                name="clientName"
                placeholder="Введите имя"
                value={form.clientName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={50}
            />
            <label htmlFor="service">Услуга</label>
            <select 
                id="service"
                name="service"
                value={form.service}
                onChange={handleChange}
            >
                <option value="" disabled>Выберите услугу</option>
                <option value="Аппаратные методы">Аппаратные методы</option>
                <option value="Филлеры">Филлеры</option>
                <option value="Ботулотоксин">Ботулотоксин</option>
            </select>
            <label htmlFor="price">Цена</label>
            <input
                id="price"
                type="number" 
                name="price"
                placeholder="Введите цену"
                value={form.price}
                onChange={handleChange}
                min={0}
                step={0.01}
            />
            <label htmlFor="time">Время записи</label>
            <input
                id="time" 
                type="time" 
                name="time"
                value={form.time}
                onChange={handleChange}
            />
            <label htmlFor="comment">Комментарий</label>
            <textarea 
                id="comment"   
                name="comment"
                placeholder="Дополнительная информация"
                value={form.comment}
                onChange={handleChange}
                rows={4}
            >
            </textarea>
            <div className="form-buttons">
                <button type="submit" className="btn-submit">
                    Добавить запись
                </button>
                <button type="button" className="btn-close" onClick={onClose}>
                    Отмена
                </button>
            </div>
        </form>
    );
};

export default AppointmentForm;