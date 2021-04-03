import { bindingHandlers, components, pureComputed, PureComputed } from "knockout";
import { observable, Observable, observableArray, ObservableArray } from "knockout"
import { getTimeString, secondsToTime } from "src/helper/TimeToString";

const weatherIconSunny = '&#x2600;';
const weatherIconPartialCloudy = '&#x1F324;';
const weatherIconPartialCloudyRainy = '&#x1F326;';
const weatherIconCloudy = '&#x2601;';
const weatherIconCloudyRainy = '&#x1F327;';
const weatherIconStormy = '&#x26C8;';

bindingHandlers.weatherText = {
  update: (htmlElement: HTMLElement, weatherAccessor: () => Weather) => {
    const weather = weatherAccessor();

    let cloudStatus = '';
    let cloudStatusIcon = '';

    if (weather.clouds.density <= 2) {
      cloudStatus = 'Sonnig';
      cloudStatusIcon = weatherIconSunny;
    } else if (weather.clouds.density <= 5) {
      cloudStatus = 'Teils bewölkt';
      cloudStatusIcon = weatherIconPartialCloudy;
    } else {
      cloudStatus = 'Bedeckt'
      cloudStatusIcon = weatherIconCloudy;
    }

    if (weather.clouds.iprecptns == 1) {
      cloudStatus += ' regnerisch';

      if (weather.clouds.density <= 8) {
        cloudStatusIcon = weatherIconPartialCloudyRainy;
      } else {
        cloudStatusIcon = weatherIconCloudyRainy;
      }
    } else if (weather.clouds.iprecptns == 2) {
      cloudStatus += ' stürmisch';
      cloudStatusIcon = weatherIconStormy;
    }

    let weatherString = '';
    weatherString += weather.season.temperature + '°C ';
    weatherString += cloudStatusIcon;
    weatherString += cloudStatus;
    weatherString += ` auf ${weather.clouds.base} ft für ${weather.clouds.thickness} ft<br><br>`;
    weatherString += '<b>Wind</b><br>';

    weatherString += 'Am Boden:&emsp;&emsp;';
    weatherString += `hdg ${weather.wind.atGround.dir.toString().padStart(3, '000')} - `
    weatherString += `${weather.wind.atGround.speed.toString().padStart(2, '00')} kn<br>`;

    weatherString += 'Auf 6.500 ft:&nbsp;&nbsp;&emsp;';
    weatherString += `hdg ${weather.wind.at2000.dir.toString().padStart(3, '000')} - `
    weatherString += `${weather.wind.at2000.speed.toString().padStart(2, '00')} kn<br>`;

    weatherString += 'Auf 26.000 ft:&emsp;';
    weatherString += `hdg ${weather.wind.at8000.dir.toString().padStart(3, '000')} - `
    weatherString += `${weather.wind.at8000.speed.toString().padStart(2, '00')} kn<br>`;

    htmlElement.innerHTML = weatherString;
  }
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

interface ServerContent {
  players: Player[];
  ipAddress: string;
  port: string;
  missionName: string;
  missionTimeLeft: number;
  weather: Weather;
  time: number;
}

interface Player {
  id: number;
  name: string;
  role: string;
  onlineTime: number;
}

interface ServerInfo {
  id: string;
  serverName: string;
  online: boolean;
  serverStatus?: ServerContent;
}

export interface PlayerInfo {
  name: string;
  onlineString: string;
}


export interface ModuleGroup {
  name: string;
  player: PlayerInfo[];
}

export interface Server {
  name: string;
  online: boolean;
  ipAddress: string;
  port: string;
  mission: string;
  missionTimeLeft: string;
  playerCount: number;
  moduleGroups: ModuleGroup[];
  weather: Weather | null;
  serverTime: string;
  lastUpdate: string;
}

export class ServerStatus {
  private static secondsToTimeString(time: number): string {
    let timeString = Math.floor(time / 60 / 60).toString().padStart(2, '0');
    timeString += ':' + Math.floor(time / 60 % 60).toString().padStart(2, '0');
    timeString += ':' + Math.floor(time % 60).toString().padStart(2, '0');
    timeString += ' h';

    return timeString
  }

  private readonly serverInfos: ObservableArray<ServerInfo> = observableArray();
  public readonly error: Observable<boolean> = observable(false);
  public readonly server: PureComputed<Server[]> = pureComputed({
    read: () => {
      return this.serverInfos()
        .sort((a, b) => a.serverName < b.serverName ? -1 : 1)
        .map((s) => {
          const planeGroups: { [moduleName: string]: ModuleGroup } = {};
          if (s.serverStatus) {
            s.serverStatus.players.forEach((p) => {
              if (!planeGroups[p.role]) {
                planeGroups[p.role] = {
                  name: p.role,
                  player: []
                };
              }

              planeGroups[p.role].player.push({
                name: p.name,
                onlineString: ServerStatus.secondsToTimeString(p.onlineTime)
              });
            });
          }

          Object.values(planeGroups).forEach((p) => p.player.sort((a, b) => a.name < b.name ? -1 : 1));

          const modules = Object.values(planeGroups)
            .sort((a, b) => a.name < b.name ? -1 : 1);

          const server: Server = {
            name: s.serverName,
            online: s.online,
            ipAddress: s.serverStatus ? s.serverStatus.ipAddress : '',
            port: s.serverStatus ? s.serverStatus.port : '',
            mission: s.serverStatus ? s.serverStatus.missionName : '',
            playerCount: s.serverStatus ? s.serverStatus.players.length : 0,
            moduleGroups: modules,
            missionTimeLeft: s.serverStatus ? ServerStatus.secondsToTimeString(s.serverStatus.missionTimeLeft) : '',
            weather: s.serverStatus ? s.serverStatus.weather : null,
            serverTime: s.serverStatus ? getTimeString(new Date(s.serverStatus.time * 1000)) : '',
            lastUpdate: new Date(Date.now()).toUTCString()
          };

          return server;
        })
    }
  });

  constructor(updateIntervall: number) {
    this.startUpdateIntervall(updateIntervall);
  }

  private startUpdateIntervall = async (intervall: number): Promise<void> => {
    await (async (): Promise<void> => {
      try {
        const res = await fetch('/api/servers.json');
        if (res.ok) {
          const text = await res.text();
          const parsed: ServerInfo[] = JSON.parse(text);
          this.serverInfos(parsed);
        } else {
          this.serverInfos.splice(0);
        }
      } catch (err) {
        console.error(err);
        this.serverInfos.splice(0);
      }
    })();

    setTimeout(() => this.startUpdateIntervall(intervall), intervall);
  }
}

export const registerControl = (name: string): void => {
  if (components.isRegistered(name)) { throw Error(`Component ${name} already registered`); }

  components.register(name, {
    template: require('./Serverstatus.html')
  });
  require('./Serverstatus.css');
}