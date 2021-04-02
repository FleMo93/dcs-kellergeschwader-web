export function getDateString(date: Date): string {
    return date.getUTCFullYear() + '-' +
        (date.getUTCMonth() + 1).toString().padStart(2, '00') + '-' +
        date.getUTCDate().toString().padStart(2, '00');
}

export function getTimeString(date: Date): string {
    return date.getUTCHours() + ':' +
        date.getUTCMinutes().toString().padStart(2, '00') + ':' +
        date.getUTCSeconds().toString().padStart(2, '00') + '';
}