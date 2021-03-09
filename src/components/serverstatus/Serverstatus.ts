import { components, pureComputed, PureComputed } from "knockout";
import { observable, Observable, observableArray, ObservableArray } from "knockout"

interface ServerInfo {
  id: string;
  serverName: string;
  online: boolean;
  serverStatus?: ServerContent;
}

interface ServerContent {
  players: Player[];
  ipAddress: string;
  port: string;
  missionName: string;
}

interface Player {
  id: number;
  name: string;
  role: string;
  onlineTime: number;
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
  playerCount: number;
  moduleGroups: ModuleGroup[];
}

export class ServerStatus {
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

              let onlineString = Math.floor(p.onlineTime / 60 / 60).toString().padStart(2, '0');
              onlineString += ':' + Math.floor(p.onlineTime / 60 % 60).toString().padStart(2, '0');
              onlineString += ':' + Math.floor(p.onlineTime % 60).toString().padStart(2, '0');
              onlineString += ' h';
              planeGroups[p.role].player.push({
                name: p.name,
                onlineString: onlineString
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
            moduleGroups: modules
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