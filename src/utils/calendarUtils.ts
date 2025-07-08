export const formatDateLocal = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error('Invalid date:', date);
        return formatDateLocal(new Date());
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatTime = (timeString?: string): string => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    if (!hours || !minutes) return "";
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

export const generateTimeOptions = (start = 9, end = 22, step = 10) => {
    const options = [];
    for (let hour = start; hour <= end; hour++) {
        for (let minute = 0; minute <= 60; minute += step) {
            const h = String(hour).padStart(2, '0');
            const m = String(minute).padStart(2, '0');
            options.push(`${h}:${m}`);
        }
    }
    return options;
}

export function generateCalendarDates(year: number, month: number): Date[] {
    // количество дней в месяце
    const dayInMonth = new Date(year, month + 1, 0).getDate();
    // первый день месяца
    const firstDay = new Date(year, month, 1);
    // смещение для понедельника
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    // генерация массива дат
    const dates: Date[] = [];
    // добавляем дни пред.месяца
    for (let i = startOffset; i > 0; i--) {
        const prevDate = new Date(year, month, 1 - i);
        dates.push(prevDate);
    }
    // добавляем дни текущего месяца
    for (let i = 1; i <= dayInMonth; i++) {
        dates.push(new Date(year, month, i));
    }
    // добавляем дни следующего месяца
    const totalCells = 42;
    const nextDays = totalCells - dates.length;
    for (let i = 1; i <= nextDays; i++) {
        dates.push(new Date(year, month + 1, i));
    }
    return dates;
}