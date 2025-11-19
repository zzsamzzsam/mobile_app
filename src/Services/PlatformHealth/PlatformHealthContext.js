/* eslint-disable prettier/prettier */
import {useStoreActions, useStoreState} from 'easy-peasy';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import AppleHealthKit from 'react-native-health';
// import {
//   initialize as initializeAndroidHealth,
//   requestPermission as requestPermissionAndroid,
//   readRecords,
//   getSdkStatus,
//   openHealthConnectSettings,
//   openHealthConnectDataManagement,
//   aggregateRecord,
// } from 'react-native-health-connect';

import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
import { startOfDay, subWeeks } from 'date-fns';
import { toFixed } from '../../utils/utils';

const permissions = {};

if (Platform.OS === 'ios') {
  permissions.permissions = {
    read: [
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.ActivitySummary,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    ],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  };
} else {
  permissions.permissions = [
    {accessType: 'read', recordType: 'ActiveCaloriesBurned'},
    {accessType: 'read', recordType: 'HeartRate'},
    {accessType: 'read', recordType: 'BloodPressure'},
    {accessType: 'read', recordType: 'SleepSession'},
    // {accessType: 'read', recordType: 'StepsCadence'},
    {accessType: 'read', recordType: 'Steps'},
    {accessType: 'read', recordType: 'TotalCaloriesBurned'},
    {accessType: 'read', recordType: 'Distance'},
    {accessType: 'read', recordType: 'ExerciseSession'},
  ];
}
const PlatformHealthStateContext = React.createContext({
  isPlatformHealthReady: null,
  initialize: () => {},
});

export const usePlatformHealthContext = () => {
  const context = useContext(PlatformHealthStateContext);
  if (!context) {
    throw new Error(
      'usePlatformHealthContext must be used within an PlatformHealthProvider',
    );
  }
  return context;
};
export const PlatformHealthProvider = ({children}) => {
  const [isPlatformHealthReady, setIsPlatformHealthReady] = useState(false);
  const {platformHealthTurnedOn} = useStoreState(state => state.health);
  const {
    addLog,
    clearLogs,
    setPlatformHealthTurnedOn,
    setAppleHealth,
    setSyncedData,
  } = useStoreActions(state => state.health);
  // const openPlatformAppSettings = async () => {
  //   if (Platform.OS === 'android') {
  //     console.log('opening health connect');
  //     await openHealthConnectSettings();
  //     // await openHealthConnectDataManagement();
  //   } else {
  //     // todo
  //   }
  // };
  const checkPlatformHealthAvailable = () =>
    new Promise(async (resolve, reject) => {
      try {
        if (Platform.OS === 'ios') {
          AppleHealthKit.isAvailable((error, available) => {
            // console.log('is health available', available);
            if (error) {
              console.log('error initializing Healthkit: ', error);
              return resolve({
                success: false,
                error,
              });
            }
            return resolve({
              success: available,
              error: available ? null : 'Healthkit not available',
            });
          });
        } else {
          return resolve({
            success: false,
            error: 'android not available',
          });
          // const sdkStatusAndroid = await getSdkStatus();
          // if (sdkStatusAndroid !== 3) {
          //   // sdk not available
          //   setPlatformHealthTurnedOn(false);
          //   Alert.alert(
          //     'Health Connect Missing',
          //     'You need to install HealthConnect to sync your android health data',
          //     [
          //       {
          //         text: 'Cancel',
          //         onPress: () => console.log('Cancel Pressed'),
          //         style: 'cancel',
          //       },
          //       {
          //         text: 'OK',
          //         onPress: () =>
          //           Linking.openURL(
          //             'market://details?id=com.google.android.apps.healthdata&pcampaignid=web_share',
          //           ),
          //       },
          //     ],
          //   );
          //   return resolve({
          //     success: false,
          //   });
          // }
          // // await openPlatformAppSettings();
          // console.log('sdk status====', sdkStatusAndroid);
          // // TODO
          // return resolve({
          //   success: true,
          // });
        }
      } catch (e) {
        return resolve({
          success: false,
          error: e.toString(),
        });
      }
    });

  const getAuthStatus = () =>
    new Promise((resolve, reject) => {
      try {
        if (Platform.OS === 'ios') {
          AppleHealthKit.getAuthStatus(permissions, (error, data) => {
            // console.log('getAuthStatus', data);
            if (error) {
              console.log('error getAuthStatus: ', error);
              return resolve({
                success: false,
                error,
              });
            }
            return resolve({
              success: true,
              data,
            });
          });
        } else {
          // TODO
          return resolve({
            success: true,
            data: {},
          });
        }
      } catch (e) {
        return resolve({
          success: false,
          error: e.toString(),
        });
      }
    });
  const initializeKit = () =>
    new Promise(async (resolve, reject) => {
      try {
        if (Platform.OS === 'ios') {
          AppleHealthKit.initHealthKit(permissions, error => {
            if (error) {
              console.log('[ERROR] Cannot grant permissions!');
              setIsPlatformHealthReady(false);
              resolve({
                success: false,
                error: 'Error getting required permissions',
              });
            }
            setIsPlatformHealthReady(true);
            resolve({
              success: true,
            });
          });
        } else {
          // const isInitialized = await initializeAndroidHealth();
          // const grantedPermissions = await requestPermissionAndroid(
          //   permissions.permissions,
          // );
          setIsPlatformHealthReady(false);
          // console.log('android granted permissions', grantedPermissions);
          // console.log('initializing android');
          // request permissions
        }
      } catch (e) {
        console.log('Error initializing healthkit', e);
        resolve({
          success: false,
          error: 'Error initializing Healthkit',
        });
      }
    });
  const initialize = async () => {
    console.log('main initialize called');
    const {success: availableSuccess, error: availableError} =
      await checkPlatformHealthAvailable();
    if (!availableSuccess) {
      showMessage({
        message: 'Error',
        description: `Healthkit not available ${availableError || ''}`,
        type: 'danger',
        icon: 'danger',
      });
      return;
    }
    const {success: kitSuccess, error: kitError} = await initializeKit();
    if (!kitSuccess) {
      showMessage({
        message: 'Error',
        description: `Initialize Error ${kitError || ''}`,
        type: 'danger',
        icon: 'danger',
      });
      return;
    }
    // console.log('permissions', permissions.permissions);
    const {
      success: authSuccess,
      error: authError,
      data: authData,
    } = await getAuthStatus();
    // console.log('auth=====', authSuccess, authError, authData);
  };
  const getDatas = async () => {
    try {
      const currentDate = new Date();
      const oneDayAgo = startOfDay(currentDate);
      const oneWeekAgo = subWeeks(currentDate, 1);
      clearLogs();
      if (Platform.OS === 'android') {
        return;
        // const TotalCaloriesBurned = await aggregateRecord(
        //   {
        //     recordType: 'TotalCaloriesBurned',
        //     timeRangeFilter: {
        //       operator: 'between',
        //       startTime: oneDayAgo.toISOString(),
        //       endTime: currentDate.toISOString(),
        //     },
        //   },
        // );
        // if(TotalCaloriesBurned?.ENERGY_TOTAL?.inKilocalories) {
        //    setSyncedData({
        //     calories: {
        //       current: toFixed(TotalCaloriesBurned?.ENERGY_TOTAL?.inKilocalories),
        //       history: [],
        //       today: toFixed(TotalCaloriesBurned?.ENERGY_TOTAL?.inKilocalories || 0),
        //     },
        //   });
        // }
        // const AHeartRate = await readRecords('HeartRate', {
        //   pageSize: 10,
        //   timeRangeFilter: {
        //     operator: 'between',
        //     startTime: oneDayAgo.toISOString(),
        //     endTime: currentDate.toISOString(),
        //   },
        // });

        // if(AHeartRate.length) {
        //     const max = Math.max(...AHeartRate.map(s => s.samples[0].beatsPerMinute));
        //     const min = Math.min(...AHeartRate.map(s => s.samples[0].beatsPerMinute));
        //     setSyncedData({
        //       heart: {
        //         min,
        //         max,
        //         current: AHeartRate[AHeartRate.length - 1].samples[0].beatsPerMinute,
        //         history: AHeartRate.map(s => ({
        //           date: s.samples[0].time,
        //           value: s.samples[0].beatsPerMinute,
        //         })),
        //       },
        //     });
        // }


        // const ASteps = await aggregateRecord({
        //   recordType: 'Steps',
        //   timeRangeFilter: {
        //     operator: 'between',
        //     startTime: oneDayAgo.toISOString(),
        //     endTime: currentDate.toISOString(),
        //   },
        // });

        // setSyncedData({
        //     stepsToday: ASteps?.COUNT_TOTAL || 0
        // });

        //  const ADistance = await aggregateRecord({
        //   recordType: 'Distance',
        //   timeRangeFilter: {
        //     operator: 'between',
        //     startTime: oneDayAgo.toISOString(),
        //     endTime: currentDate.toISOString(),
        //   },
        // });
        //  setSyncedData({
        //   distance: {
        //     today: toFixed(ADistance?.DISTANCE?.inMeters),
        //   },
        // });

        // // const ASleepSession = await readRecords('SleepSession', {
        // //   timeRangeFilter: {
        // //     operator: 'between',
        // //     startTime: oneWeekAgo.toISOString(),
        // //     endTime: currentDate.toISOString(),
        // //   },
        // // });
        // //  setSyncedData({
        // //   sleep: {
        // //     today: Number((ADistance?.DISTANCE?.inMeters || 0).toFixed(0)),
        // //   },
        // // });
        // // addLog({
        // //   type: 'SleepSession',
        // //   data: ASleepSession,
        // // });
       
        // // console.log('sleepp=======', JSON.stringify(ASleepSession));
        // return;
      }
      // oneDayAgo.setMonth(currentDate.getMonth() - 1);
      oneDayAgo.setDate(currentDate.getDate() - 1);
      // An object that contains the move, exercise, and stand data for a given day.
      AppleHealthKit.getActivitySummary(
        {
          startDate: new Date().toISOString(), // required
          endDate: new Date().toISOString(), // optional; default now
        },
        (error, results) => {
          if (error) {
            console.log('getActivitySummary error', error);
          }
          // console.log('getActivitySummary are', results);
          addLog({
            type: 'getActivitySummary',
            ...(error && {error}),
            data: results,
          });
        },
      );

      // Query for heart rate samples. The options object is used to setup a query to retrieve relevant samples.
      AppleHealthKit.getHeartRateSamples(
        {
          startDate: oneDayAgo.toISOString(),
          includeManuallyAdded: true,
          limit: 10,
        },
        (error, results) => {
          if (error) {
            console.log('getHeartRateSamples error', error);
          }
          if (results && results.length) {
            const last10 = results.reverse().slice(0, 10);
            const max = Math.max(...last10.map(s => s.value));
            const min = Math.min(...last10.map(s => s.value));
            setSyncedData({
              heart: {
                min: toFixed(min),
                max: toFixed(max),
                current: toFixed(results[0].value),
                history: last10.map(s => ({
                  date: s.endDate || s.startDate,
                  value: toFixed(s.value)
                })),
              },
            });
          }
          // addLog({
          //   type: 'HeartRate',
          //   ...(error && { error }),
          //   data: results,
          // });
        },
      );

      // Query for heart rate samples. The options object is used to setup a query to retrieve relevant samples.
      AppleHealthKit.getDistanceWalkingRunning(
        {
          unit: 'meter',
          // startDate: oneDayAgo.toISOString(),
          includeManuallyAdded: true,
        },
        (error, results) => {
          if (error) {
            console.log('getHeartRateSamples error', error);
          }
          if (results && results.value) {
            // console.log('DistanceWalkRun', results.value);
            setSyncedData({
              distance: {
                today: toFixed(results?.value)
              },
            });
          }
          // addLog({
          //   type: 'Distance',
          //   ...(error && {error}),
          //   data: results,
          // });
        },
      );

      // Query for total steps per day over a specified date range.
      // The options object is used to setup a query to retrieve relevant samples.
      AppleHealthKit.getDailyStepCountSamples(
        {
          startDate: oneDayAgo.toISOString(),
          endDate: new Date().toISOString(),
        },
        (error, results) => {
          if (error) {
            console.log('getDailyStepCountSamples error', error);
          }
          // console.log('Apple daily steps', results?.length);
          setSyncedData({
            steps: {
              current: toFixed(results[0].value),
              history: results.map(s => ({
                date: s.endDate || s.startDate,
                start: s.startDate,
                end: s.endDate,
                value: toFixed(s.value),
              })),
            },
          });
          // addLog({
          //   type: 'StepsPerDay',
          //   ...(error && {error}),
          //   data: results,
          // });
          // console.log('daily step counts', results);
        },
      );

      // A quantity sample type that measures the amount of active energy the user has burned within a period of time.
      // This represents only the Active Kilocalories from the Total Kilocalories for that time period.
      AppleHealthKit.getActiveEnergyBurned(
        {
          startDate: oneDayAgo.toISOString(),
          ascending: true,
          includeManuallyAdded: true,
        },
        (error, results) => {
          if (error) {
            console.log('getActiveEnergyBurned error', error);
          }
          // console.log('getActiveEnergyBurned are', results);
          // console.log('energyburned are', results?.length);
          if (results && results.length) {
            let totalBurned = 0;
            const history = results
              .filter(s =>
                moment(s.endDate || s.startDate)?.isSame(moment(), 'day'),
              )
              .map(s => {
                totalBurned += s.value;
                return {
                  date: s.endDate || s.startDate,
                  value: s.value,
                };
              });

            setSyncedData({
              calories: {
                current: toFixed(results[0].value),
                history,
                today: toFixed(totalBurned)
              },
            });
          }
          // else {
          //   showMessage({
          //     message: 'Faking',
          //     description: 'No HeartData so faking',
          //     type: 'danger',
          //     icon: 'danger',
          //   });
          //   setSyncedData({
          //     calories: {
          //       current: 72,
          //       history: [
          //         {
          //           date: "2024-02-02T17:55:00.000-0400",
          //           value: 72
          //         },
          //         {
          //           date: "2024-02-02T17:55:00.000-0400",
          //           value: 85
          //         },
          //         {
          //           date: "2024-02-02T17:55:00.000-0400",
          //           value: 100
          //         },
          //         {
          //           date: "2024-02-02T17:55:00.000-0400",
          //           value: 89
          //         },
          //       ],
          //       today: 500,
          //     },

          //   });
          // }
          // addLog({
          //   type: 'activeEnergyBurned',
          //   ...(error && { error }),
          //   data: results,
          // });
        },
      );
      // Get the aggregated total steps for a specific day (starting and ending at midnight).
      // An optional options object may be provided containing date field representing the selected day.
      // If date is not set or an options object is not provided then the current day will be used.
      AppleHealthKit.getStepCount(
        {
          // date: new Date().toISOString(),
          includeManuallyAdded: true,
        },
        (error, results) => {
          if (error) {
            console.log('getStepCount error', error);
          }
          // console.log('getStepCount are', results);
          setSyncedData({
            stepsToday: toFixed(results?.value),
          });
          addLog({
            type: 'aggregatedStepsFor Today',
            ...(error && {error}),
            data: results,
          });
        },
      );

      // Query for sleep samples.
      AppleHealthKit.getSleepSamples(
        {
          startDate: oneDayAgo.toISOString(), // required
          endDate: new Date().toISOString(), // optional; default now
          limit: 10, // optional; default no limit
          ascending: true, // optional; default false
        },
        (error, results) => {
          if (error) {
            console.log('getSleepSamples error', error);
          }
          // console.log('getSleepSamples are', results?.length);
          // addLog({
          //   type: 'sleepSamples',
          //   ...(error && {error}),
          //   data: results,
          // });
        },
      );
    } catch (e) {
      console.log('Error getting data', e);
      showMessage({
        message: 'Error',
        description: 'Error Getting health data' + e.toString(),
        type: 'danger',
        icon: 'danger',
      });
      // Alert.alert(
      //   'Health Connect Issue',
      //   'There might be some missing permissions, press ok to open health app',
      //   [
      //     {
      //       text: 'Cancel',
      //       onPress: () => console.log('Cancel Pressed'),
      //       style: 'cancel',
      //     },
      //     {
      //       text: 'OK',
      //       onPress: () => openHealthConnectSettings(),
      //     },
      //   ],
      // );
    }
  };
  useEffect(() => {
    if (platformHealthTurnedOn) {
      if(Platform.OS === 'ios') {
        initialize();
      }
    }
  }, [platformHealthTurnedOn]);
  return (
    <PlatformHealthStateContext.Provider
      value={{
        isPlatformHealthReady,
        initialize,
        getDatas,
      }}>
      {children}
    </PlatformHealthStateContext.Provider>
  );
};

export default PlatformHealthStateContext;
