import { components, Observable, observable, PureComputed, pureComputed } from 'knockout';
import { getTacviewFiles } from 'src/helper/KellerApiClient';
import { getDateString, getTimeString } from '../../helper/TimeToString';

interface TacviewFile {
    name: string;
    link: string;
    time: string;
    missionName: string;
}

interface TacviewPlayer {
    name: string;
    files: TacviewFile[];
}

interface TacviewDay {
    date: string;
    players: TacviewPlayer[];
}

export class Tacviewrecords {
    private readonly listLoading = observable(true);

    private _tacviewDays: Observable<TacviewDay[]> = observable([]);
    public tacviewDays: PureComputed<TacviewDay[]> = pureComputed({
        read: () => this._tacviewDays()
            .map((d) => {
                d.players = d.players.sort((a, b) => a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1);
                return d;
            })
            .sort((a, b) => a.date > b.date ? -1 : 1)
    });

    constructor() {
        this.loadFiles();
    }

    private loadFiles = async (): Promise<void> => {
        const res = await getTacviewFiles();
        const filesByDateAndPlayer = res
            .reduce((a: { [dayKey: string]: TacviewDay }, b) => {
                if (!b.tacviewFiles || b.tacviewFiles.length === 0) { return a; }

                for (const file of b.tacviewFiles) {
                    const fileDate = new Date(file.time * 1000)
                    const dayKey = `${fileDate.getUTCFullYear()}-${fileDate.getUTCMonth()}-${fileDate.getUTCDate()}`;
                    if (!a[dayKey]) {
                        a[dayKey] = { date: getDateString(fileDate), players: [] };
                    }

                    const dayPlayerIndex = a[dayKey].players.findIndex((p) => p.name === b.playerName);
                    const dayPlayer: TacviewPlayer =
                        dayPlayerIndex === -1 ?
                            (() => {
                                const playerDay: TacviewPlayer = { name: b.playerName, files: [] };
                                a[dayKey].players.push(playerDay)
                                return playerDay;
                            })() :
                            a[dayKey].players[dayPlayerIndex];

                    dayPlayer.files.push({
                        link: file.link,
                        missionName: file.missionName,
                        name: file.name,
                        time: getTimeString(fileDate),
                    });
                }
                return a;
            }, {});


        this._tacviewDays(Object.values(filesByDateAndPlayer).map((key) => key));
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