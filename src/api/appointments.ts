import type { Appointment, AppointmentData } from "../types/appointments.ts";

const API_URL = "http://localhost:3000/api/appointments";

export async function fetchAppointmentsByMonth(year: number, month: number): Promise<Appointment[]> {
    const res = await fetch(`${API_URL}/by-month?year=${year}&month=${month}`);
    if(!res.ok) throw new Error('Ошибка загрузки записей');
    const data = await res.json();
    console.log('Загруженные записи:', data);
    return data;
}

export async function createAppointment(data: AppointmentData): Promise<Appointment> {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if(!res.ok) throw new Error('Ошибка создания записи');
    return res.json();
}

export async function updateAppointment(id: number, data: AppointmentData): Promise<Appointment> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error('Ошибка изменения записи');
    return res.json();
}

export async function deleteAppointment(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if(!res.ok) throw new Error('Ошибка удаления записи');
}