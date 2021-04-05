import { components, observable, ObservableArray, observableArray } from "knockout";
import { getStatisticsPlayerNames, getStatisticsPlayerTotalTimes } from "src/helper/KellerApiClient";
import { secondsToHourMin } from "src/helper/TimeToString";

export interface PlayerTime {
  name: string,
  time: string,
}

export class Statistics {
  public loading = observable(true);
  public playerTimes: ObservableArray<PlayerTime> = observableArray();

  constructor() {
    this.load();
  }

  private load = async (): Promise<void> => {
    const [playerNames, playerTimes] = await Promise.all([
      getStatisticsPlayerNames(),
      getStatisticsPlayerTotalTimes()
    ]);

    for (const playerId of Object.keys(playerNames)) {
      this.playerTimes.push({
        name: playerNames[playerId],
        time: secondsToHourMin(playerTimes[playerId])
      });
    }

    this.playerTimes(this.playerTimes().sort((a, b) => a.time > b.time ? -1 : 1));

    this.loading(false);
  }
}

export const registerControl = (name: string): void => {
  if (components.isRegistered(name)) { throw Error(`Component ${name} already registered`); }

  components.register(name, {
    template: require('./Statistics.html')
  });
  require('./Statistics.css');
}