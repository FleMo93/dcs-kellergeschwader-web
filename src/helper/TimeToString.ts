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
    const hours = Math.floor((seconds / 60 / 60)).toString().padStart(2, '00')
    const minutes = Math.floor((seconds / 60 % 60)).toString().padStart(2, '00')
    const secs = Math.floor((seconds % 60)).toString().padStart(2, '00')
    return hours + ":" + minutes + ":" + secs;
}

export function secondsToHourMin(seconds: number): string {
    const hours = Math.floor((seconds / 60 / 60)).toString().padStart(2, '00')
    const minutes = Math.floor((seconds / 60 % 60)).toString().padStart(2, '00')

    return hours + "h " + minutes + "m"
}