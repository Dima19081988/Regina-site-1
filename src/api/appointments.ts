import type { Appointment } from "../types/appointments";

const API_URL = "http://localhost:3000/api/appointments";

export async function fetchAppointmentByMonth(year: number, month: number): Promise<Appointment[]> {
    const res = await fetch(`${API_URL}/by-month?year=${year}&month=${month}`);
    if(!res.ok) throw new Error('Ошибка загрузки записей');
    return res.json();
}

export async function createAppointment(data: Appointment): Promise<Appointment> {
    const res = await fetch(API_URL, {
        method: 'POST',
        
    })
    return res.json();
}