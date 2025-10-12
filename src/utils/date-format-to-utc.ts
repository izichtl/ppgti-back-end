import { toZonedTime, format } from 'date-fns-tz';

export const formatFortalezaDate = (isoDate: string): string => {
    console.log('entrada', isoDate)
    const utcDate = new Date(isoDate);
    const fortalezaDate = toZonedTime(utcDate, 'America/Fortaleza');
    const formatted = format(fortalezaDate, 'dd/MM/yyyy - HH:mm', { timeZone: 'America/Fortaleza' });  
    return formatted
};