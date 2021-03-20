import { components, Observable, observable, PureComputed, pureComputed } from 'knockout';

interface APITacviewFile {
    name: string;
    link: string;
    time: number;
    missionName: string;
}

interface APITacviewPlayer {
    playerName: string;
    tacviewFiles: APITacviewFile[] | null;
}

class TacviewFile {
    public readonly link: string;
    public readonly missionName: string;
    public readonly date: string;
    public readonly timeStamp: string;

    constructor(apiTacviewFile: APITacviewFile) {
        this.link = apiTacviewFile.link;
        this.missionName = apiTacviewFile.missionName;
        const date = new Date(apiTacviewFile.time * 1000)

        this.date = date.getUTCFullYear() + '-' +
            date.getUTCMonth().toString().padStart(2, '00') + '-' +
            date.getUTCDate().toString().padEnd(2, '00');

        this.timeStamp = date.getUTCHours() + ':' +
            date.getUTCMinutes().toString().padEnd(2, '00') + ':' +
            date.getUTCSeconds().toString().padEnd(2, '00') + ' UTC';
    }
}

class TacviewPlayer {
    public readonly playerName: string;
    public readonly tacviewFiles: TacviewFile[];

    constructor(apiTacviewPlayer: APITacviewPlayer) {
        this.playerName = apiTacviewPlayer.playerName;
        this.tacviewFiles = (apiTacviewPlayer.tacviewFiles && apiTacviewPlayer.tacviewFiles
            .sort((a, b) => a.time > b.time ? -1 : 1)
            .map((f) => new TacviewFile(f))) ?? [];
    }
}

export class Tacviewrecords {
    private readonly listLoading = observable(true);

    private _tacviewPlayers: Observable<TacviewPlayer[]> = observable([]);
    public tacviewPlayers: PureComputed<TacviewPlayer[]> = pureComputed({ read: this._tacviewPlayers });

    constructor() {
        this.loadFiles();
    }

    private loadFiles = async (): Promise<void> => {
        const res = await fetch('./api/tacview/index.json');
        const json = await res.json() as APITacviewPlayer[];
        this._tacviewPlayers(json
            .filter(p => p.tacviewFiles && p.tacviewFiles.length > 0)
            .sort((a, b) => a.playerName > b.playerName ? 1 : -1)
            .map((t) => new TacviewPlayer(t)));
        this.listLoading(false);
    }
}

export const registerControl = (name: string): void => {
    if (components.isRegistered(name)) { throw Error(`Component ${name} already registered`); }

    components.register(name, {
        template: require('./Tacviewrecords.html')
    });
    require('./Tacviewrecords.css');
}