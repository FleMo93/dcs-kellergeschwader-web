export interface PlayerNames {
    [playerId: string]: string
}

export interface PlayerTotalTimes {
    [playerId: string]: number
}

async function simpleFetch<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
        throw res.text()
    }

    return await res.json()
}

export async function getStatisticsPlayerNames(): Promise<PlayerNames> {
    return await simpleFetch('./api/statistics/player-names.json')
}

export async function getStatisticsPlayerTotalTimes(): Promise<PlayerTotalTimes> {
    return await simpleFetch('./api/statistics/total-times.json');
}


export interface WeatherInfo {
    speed: number,
    dir: number
}

export interface Weather {
    wind: {
        at8000: WeatherInfo,
        at2000: WeatherInfo,
        atGround: WeatherInfo
    },
    season: {
        temperature: number
    },
    clouds: {
        density: number,
        base: number,
        thickness: number,
        iprecptns: number
    }
}

export interface Player {
    id: number;
    name: string;
    role: string;
    onlineTime: number;
}

export interface ServerContent {
    players: Player[];
    ipAddress: string;
    port: string;
    missionName: string;
    missionTimeLeft: number;
    weather: Weather;
    time: number;
}

export interface ServerInfo {
    id: string;
    serverName: string;
    online: boolean;
    serverStatus?: ServerContent;
}

export async function getServers(): Promise<ServerInfo[]> {
    return await simpleFetch('./api/servers.json');
}

export interface TacviewFile {
    name: string;
    link: string;
    time: number;
    missionName: string;
}

export interface TacviewPlayer {
    playerName: string;
    tacviewFiles: TacviewFile[] | null;
}

export async function getTacviewFiles(): Promise<TacviewPlayer[]> {
    return await simpleFetch('./api/tacview/index.json');
    
}