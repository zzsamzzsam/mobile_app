/* eslint-disable prettier/prettier */
import {action, Action, persist, Thunk, thunk} from 'easy-peasy';
import AppAsyncStorage from '../../Services/AsyncStorage';
import { trackUserEvent } from '../../utils';
// import { HEALTH_SOURCES } from '../../utils/constants';

const HealthModel = persist(
  {
    platformHealthTurnedOn: false,
    setPlatformHealthTurnedOn: action((state, payload) => {
      state.platformHealthTurnedOn = payload;
    }),
    optedChallenges: [],
    setOptedChallenges: action((state, payload) => {
      state.optedChallenges = payload;
    }),
    leaderBoardSetting: {
      leaderBoardOptedIn: false,
      leaderBoardAsked: false,
      avatarPermission: false,
      customAvatar: false,
      challengesOptedIn: false,
      useCustomAvatar: false,
    },
    setLeaderBoardSetting: action((state, payload) => {
      state.leaderBoardSetting = {
        ...state.leaderBoardSetting,
        ...payload,
      }
    }),
    logs: [],
    body: {
      history: [],
      
    },
    fitness: {},
    synced: {
      heart: {
        current: 0,
        history: []
      },
      steps: {
        current: 0,
        history: []
      },
      sleep: {
        current: 0,
        history: []
      },
      distance: {
        current: 0,
        history: []
      },
      calory: {
        current: 0,
        history: []
      }
    },
    setSyncedData: action((state, payload) => {
        if(!payload) {
          state.synced = {};
        } else {
          state.synced = {...state.synced, ...payload};
        }
        // console.log('done health save', JSON.stringify(state.synced));
    }),
    lastServerSync: null,
    setLastServerSync: action((state, payload) => {
        state.lastServerSync = payload
    }),
    activeSource: null,
    setActiveSource: action((state, payload) => {
        state.activeSource = payload
    }),
    addLog: action((state, payload) => {
        state.logs = [...state.logs, payload];
    }),
    clearLogs: action((state) => {
        state.logs = [];
    }),
    syncToServer: thunk(async (actions, payload, helpers) => {
        // const { synced } = payload;
        try {
        const { health: { synced, activeSource }, login } = helpers.getStoreState();
        trackUserEvent("HEALTH_DATA", {
            clientId: login?.actualUser?.clientId,
            firstName: login?.actualUser?.firstName,
            currentTime: new Date().toISOString(),
            activeSource,
            lastWatchSynced: synced?.lastWatchSynced || null,
            steps: synced?.stepsToday,
            distance: synced?.distance?.today || 0,
            calories: synced?.calories?.today || 0,
            heart: synced?.heart?.current || 0
        });
        actions.setLastServerSync(new Date().toISOString());
        // console.log('sending CIOOOOO', )
        // console.log('syncing now ====', JSON.stringify(synced));
        } catch (err) {
            console.log("Error syncing to server", err.toString());
            throw new Error("Error syncing to server", err.toString())
        }
    }),
  },
  {
    // allow: ['events', 'currentEvents'],
    deny: ['setLastServerSync', 'historicalW', 'health', 'appleHealth', 'logs', 'syncToServer', 'clearLogs', 'setAppleHealth', 'addLog', 'setActiveSource', 'setSyncedData', 'setPlatformHealthTurnedOn', 'setLeaderBoardSetting', 'setOptedChallenges'],
    storage: AppAsyncStorage,
  },
);

export default HealthModel;
