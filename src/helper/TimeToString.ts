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

export function secondsToTime(seconds: number): string {
    const hours = (seconds / 60 / 60).toString().padStart(2, '00')
    const minutes = (seconds / 60 % 60).toString().padStart(2, '00')
    const secs = (seconds % 60).toString().padStart(2, '00')
    return hours + ":" + minutes + ":" + secs;
}