/* eslint-disable prettier/prettier */
import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import {
  connectionType,
  DATA_MAPPING,
  DEVICE_ASYNC_KEY,
  MEASURE_DATA_KEY,
} from '../../utils/constants';
import { checkAndAskAndroidPermissionsForWatch } from '../../utils/permissions';
import StorageHelper from '../AsyncStorage';

let RM;
if (Platform.OS === 'ios') {
  const { RNFitPro } = NativeModules;
  RM = RNFitPro;
} else {
  const { ReactNativeFitProModule } = NativeModules;
  RM = ReactNativeFitProModule;
}

// console.log('RM module======', RM);


const WatchStateContext = React.createContext(null);
let listners = [];
export const useWatchContext = () => {
  const context = useContext(WatchStateContext);
  if (!context) {
    throw new Error(
      'useWatchContext must be used within an WatchContextProvider',
    );
  }
  return context;
};
export const WatchContextProvider = ({ children }) => {
  //   const {isConnected} = useNetInfo();
  const [isWatchConnected, setIsWatchConnected] = useState(false);
  const [showEventLog, setShowEventLog] = useState(false);
  const [eventLogs, setEventLogs] = useState([{ test: 1, dummy: 2 }]);
  const [connectionLogs, setConnectionLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measuredData, setMeasuredData] = useState({});
  const [isScanning, setIsScanning] = useState(false);
  const { setSyncedData } = useStoreActions(action => action.health);
  const { synced } = useStoreState(state => state.health);
  const checkExisting = () => {
    return  existingHeartHistory = synced?.heart?.history || [];
  }
  const measureAllData = () => {
    if (Platform.OS === 'ios') {
      setIsMeasuring(true);
      RM.measureAll();
    } else {
      setIsMeasuring(true);
      RM.startMeasureHeatRate();
      // TODO: do android
    }
  };
  const takePhoto = () => {
    if (Platform.OS === 'ios') {
      RM.takePhoto();
    } else {
      // RM.startMeasureHeatRate(); // TODO
      // TODO: do android
    }
  };
  const [devices, setDevices] = useState([
    // {address: 'FF:FF:6F:11:F7:A9', name: 'LT716', rssi: -68},
    // {
    //   control: 'present',
    //   info: {
    //     kCBAdvDataIsConnectable: 1,
    //     kCBAdvDataLocalName: 'LT716',
    //     kCBAdvDataManufacturerData: null,
    //     kCBAdvDataRxPrimaryPHY: 129,
    //     kCBAdvDataRxSecondaryPHY: 0,
    //     kCBAdvDataTimestamp: 724223056.327945,
    //   },
    //   mac: 'ff:12:12:12:45:23',
    //   address: 'ff:12:12:12:45:23',
    //   name: 'Dummy Test',
    //   peripheral: '06585E1A-9A50-9233-E953-EDA686082B57',
    //   rssi: -88,
    //   verifyWorld: 'Dymmy Test',
    // },
  ]);

  const initializeSDK = () => {
    RM?.initialize && RM.initialize();
  };
  const initializeListeners = () => {
    const eventEmitter = new NativeEventEmitter(RM);
    const listnerId = new Date().toISOString();
    if (Platform.OS === 'android') {
      const rawEventListener = eventEmitter.addListener('rawEvent', state => {
        console.log('Received state:', state);
      });
      const newDataListener = eventEmitter.addListener('hasNewData', state => {
        if (state === 'measure') {
          console.log('listner====',listnerId);
          fetchMeasureData();
        }
      });
      const SQL_LOGSListner = eventEmitter.addListener('SQL_LOGS', state => {
       console.log('sql logs====', state);
      });
      const DDataListner = eventEmitter.addListener('DData', _data => {
        console.log('listner====',listnerId);
        const data = JSON.parse(_data);
        console.log("DData===", data, data.type);
        if(data.type === "heart") {
          const dd = data.data;
          const _measuredData = {
            heart: dd[DATA_MAPPING.android.HEARTRATE],
            h_blood: dd[DATA_MAPPING.android.H_BLOOD],
            l_blood: dd[DATA_MAPPING.android.L_BLOOD],
            spo: dd[DATA_MAPPING.android.SPO],
            date: new Date().toISOString(),
          };
          console.log("DData to measure==========", _measuredData);
          StorageHelper.setItem(MEASURE_DATA_KEY, _measuredData);
          const existingHeartHistory = synced?.heart?.history || [];
          const last10 = [
            ...existingHeartHistory.slice(0, 10),
            {
              date: new Date().toISOString(),
              value: _measuredData.heart,
            },
          ];
          const max = Math.max(...last10.map(s => s.value));
          const min = Math.min(...last10.map(s => s.value));
          setSyncedData({
            heart: {
              ...synced?.heart,
              current: _measuredData.heart,
              min,
              max,
              history: [...last10],
            },
          });
          setMeasuredData(_measuredData);
        }
      });
      const connectedListener = eventEmitter.addListener(
        'isWatchConnected',
        state => {
          if(isWatchConnected && state === 'YES') {
            return;
          }
          // console.log('isWatchConnected======event', state);
          if (state === 'YES') {
            setIsWatchConnected(true);
          } else {
            setIsWatchConnected(false);
          }
          // Handle the state received from native module
        },
      );
      const devicesListener = eventEmitter.addListener(
        'BluetoothDevices',
        state => {
          const stateObject = JSON.parse(state);
          console.log('received devices', stateObject);
          setDevices(stateObject);
          // setTimeout(() => {
          //   RM.scanDevices(false);
          // }, 2000);
        },
      );
      listners = [
        rawEventListener,
        newDataListener,
        connectedListener,
        devicesListener,
        DDataListner,
        SQL_LOGSListner
      ];
    } else {
      const devicesListener = eventEmitter.addListener(
        'BluetoothDeviceFound',
        event => {
          console.log(
            'Received Bluetooth device data ios:',
            event,
            typeof event,
          );
          try {
            const newDevice = {
              ...event,
              address: event.mac,
            };
            setDevices(prev => {
              const x = prev.filter(s => s.address !== newDevice.address);
              return [...x, newDevice];
            });
          } catch (e) {
            console.log('error showing devices', e);
          }
        },
      );
      const logListener = eventEmitter.addListener('Log', event => {
        console.log('New log received', event);
        setConnectionLogs(prev => {
          return [...prev, {
            date: moment(new Date().toISOString()).format('HH:mm:ss'),
            event,
            status: event.message,
          }];
        })
      });
      const dataListener = eventEmitter.addListener('DData', event => {
        try {
          console.log('Received DData', event, typeof event);
          setEventLogs(prev => {
            return [
              ...prev,
              {
                time: new Date().toISOString(),
                event,
              },
            ];
          });
          switch (event.type) {
            case 'heart':
            case 'all':
              setIsMeasuring(false);
              if (event && event.data && event.data[0]) {
                const dd = event.data[0];
                const _measuredData = {
                  heart: dd[DATA_MAPPING.ios.HEARTRATE],
                  h_blood: dd[DATA_MAPPING.ios.H_BLOOD],
                  l_blood: dd[DATA_MAPPING.ios.L_BLOOD],
                  spo: dd[DATA_MAPPING.ios.SPO],
                  date: new Date().toISOString(),
                };
                // console.log('Storing measure data', _measuredData);
                StorageHelper.setItem(MEASURE_DATA_KEY, _measuredData);
                const existingHeartHistory = synced?.heart?.history || [];
                console.log('existing', existingHeartHistory);
                console.log('existing from function========', checkExisting());
                const last10 = [
                  ...existingHeartHistory.slice(0, 10),
                  {
                    date: new Date().toISOString(),
                    value: _measuredData.heart,
                  },
                ];
                // console.log('last 10', existingHeartHistory)
                const max = Math.max(...last10.map(s => s.value));
                const min = Math.min(...last10.map(s => s.value));
                console.log('now setting', last10);
                setSyncedData({
                  heart: {
                    ...synced?.heart,
                    current: _measuredData.heart,
                    min,
                    max,
                    history: [...last10],
                  },
                });
                setMeasuredData(_measuredData);
                if (dd.type === 'all') {
                  showMessage({
                    position: 'bottom',
                    message: 'Successs',
                    description: 'New Data Received',
                    type: 'success',
                    icon: 'success',
                  });
                }
              } else {
                console.log('event no array');
              }
              break;
            case 'steps':
              console.log('received steps data', event.data);
              // if(event.subtype === 'array') {
              //   setEventLogs(prev => {
              //   // const ram = prev.filter(s => )
              //   return [...prev, {
              //     time: new Date().toISOString(),
              //     event: {
              //       "name": "Manual_log",
              //       "log": "starting calculation"
              //     },
              //   }];
              // })
              // const allSteps = [
              //   ...synced?.steps?.history,
              //   ...(event.data.map(ss => ({value: ss.steps, date: new Date(ss.date)})))
              // ].filter(s => s.value && s.date);
              // const allDistances = [
              //   ...synced?.distance?.history,
              //   ...(event.data.map(ss => ({value: ss.distance, date: new Date(ss.date)})))
              // ].filter(s => s.value && s.date);
              // const allCalories = [
              //   ...synced?.distance?.calories,
              //   ...(event.data.map(ss => ({value: ss.calories, date: new Date(ss.date)})))
              // ].filter(s => s.value && s.date);
              // setEventLogs(prev => {
              //   // const ram = prev.filter(s => )
              //   return [...prev, {
              //     time: new Date().toISOString(),
              //     event: {
              //       "name": "Manual_log combined",
              //       "log": {
              //         allSteps: allSteps.length,
              //         allDistances: allDistances.length,
              //         allCalories: allCalories.length,
              //       }
              //     },
              //   }];
              // })
              // const allStepsFiltered = allSteps.filter(s => moment(s.date)?.isSame(moment(), 'day'))
              // const allDistancesFiltered = allDistances.filter(s => moment(s.date)?.isSame(moment(), 'day'))
              // const allCaloriesFiltered = allCalories.filter(s => moment(s.date)?.isSame(moment(), 'day'))
              // const stepsToday = allStepsFiltered.reduce((acc, cur) => (acc + cur.value), 0);
              // const distanceToday = allDistancesFiltered.reduce((acc, cur) => (acc + cur.value), 0);
              // const caloriesToday = allCaloriesFiltered.reduce((acc, cur) => (acc + cur.value), 0);
              // setEventLogs(prev => {
              //   // const ram = prev.filter(s => )
              //   return [...prev, {
              //     time: new Date().toISOString(),
              //     event: {
              //       "name": "Manual_log filtered",
              //       "log": {
              //         allSteps: allStepsFiltered.length,
              //         allDistances: allDistancesFiltered.length,
              //         allCalories: allCaloriesFiltered.length,
              //         stepsToday,
              //         distanceToday,
              //         caloriesToday
              //       }
              //     },
              //   }];
              // })
              //    setSyncedData({
              //     steps: {
              //       current: event.data[0].steps,
              //       history: existingHeartHistory,
              //       today: !isNaN(stepsToday) ? Number((stepsToday || 0).toFixed(2)) : 'NAN',
              //     },
              //     stepsToday,
              //     distance: {
              //       today: !isNaN(distanceToday) ? Number((distanceToday || 0).toFixed(2)) : 'NAN',
              //       history: allDistancesFiltered,
              //     },
              //     calories: {
              //       today: !isNaN(caloriesToday) ? Number((caloriesToday || 0).toFixed(2)) : 'NAN',
              //       history: allCaloriesFiltered,
              //     }
              //   });
              // } else if(event.subtype === 'historical') {

              // }
              if (event.subtype === 'historical') {
                const existingSynced = synced;
                // if(synced && synced.lastWatchSynced) {

                // } else {

                // }
                setSyncedData({
                  lastWatchSynced: new Date().toISOString(),
                  steps: {
                    current: event.data.steps,
                    total: event.data.steps,
                    // history: [],
                  },
                  stepsToday: event.data.steps,
                  calories: {
                    today: event.data.calory || event.data.calories || 0,
                  },
                  distance: {
                    today: event.data.distance,
                  },
                });
              }

              break;
            default:
              console.log('unhandled DData', event.data);
              break;
          }

        } catch (e) {
            showMessage({
                    position: 'top',
                    message: 'Sync Failed',
                    description: e.toString(),
                    type: 'success',
                    icon: 'success',
                  });
        }
      });

      const connectionEventListener = eventEmitter.addListener(
        'ConnectionEvent',
        event => {
          console.log('ConnectionEvent', event);
          showMessage({
            position: 'bottom',
            message: 'Watch Status',
            description: event.type,
            type:
              event.type === connectionType.CONNECTED ? 'success' : 'danger',
            icon:
              event.type === connectionType.CONNECTED ? 'success' : 'danger',
          });
          setIsWatchConnected(event.type === connectionType.CONNECTED);
        },
      );
      listners = [devicesListener, connectionEventListener, dataListener, logListener];
    }
  }
  const fetchMeasureData = async () => {
    try {
      setIsMeasuring(false);
      const data = await RM.getData();
      const dataObj = JSON.parse(data);
      console.log('measure data===', dataObj);
      // if (dataObj && dataObj.steps) {
      //   setEventLogs(prev => {
      //     // const ram = prev.filter(s => )
      //     return [...prev, {
      //       time: new Date().toISOString(),
      //       event: dataObj.steps,
      //     }];
      //   })
      // }
      if(dataObj.heart) {
        const existingHeartHistory = synced?.heart?.history || [];
        console.log('checking old new', dataObj.heart, synced?.heart?.current);
        if(dataObj.heart !== synced?.heart?.current) {
          console.log('not same');
          const last10 = [
            ...existingHeartHistory.slice(0, 10),
            {
              date: new Date().toISOString(),
              value: dataObj.heart,
            },
          ].map(s => {
            s.value = Number(s.value);
            return s;
          });
          console.log('last 10 done', last10);
          // console.log('last 10', existingHeartHistory)
          const max = Math.max(...last10.map(s => s.value));
          const min = Math.min(...last10.map(s => s.value));
          console.log('checking min max', min, max);
          setSyncedData({
            heart: {
              ...synced?.heart,
              current: Number(dataObj.heart),
              min,
              max,
              history: [...last10],
            },
          });
        } else {
          console.log('old vs new same');
        }
      }
      if(dataObj.steps?.length) {
        let steps = 0;
        let calories = 0;
        let distance = 0;
        for(let singleStep of dataObj.steps) {
          steps += Number(singleStep.steps || singleStep.stept || singleStep.step || 0);
          calories += Number(singleStep.calory || singleStep.calories || 0);
          distance += Number(singleStep.distance || 0);
        }
        calories = Number(calories / 1000).toFixed(0);
        setSyncedData({
          lastWatchSynced: new Date().toISOString(),
          stepsToday: steps,
          calories: {
            today: calories,
          },
          distance: {
            today: distance
          },
        });
      }
      setMeasuredData(dataObj);
    } catch (e) { 
      console.log('Error measuring data', e);
    }
  };

  const checkIfDeviceExists = async () => {
    let exists = false;
    if (Platform.OS === 'ios') {
      const _exists = await RM.checkIfExistDevice();
      // console.log('Rest from ios==', _exists);
      exists = _exists;
    } else {
      try {

        const Data = await RM.getInfo();
        const dataObj = JSON.parse(Data);
        console.log('check connected=======', dataObj)
        exists = !!dataObj?.connected;
      } catch (e) {
        exists = false;
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    // if (isWatchConnected) {
    //   setTimeout(() => {
    //     setShowPage(pages.HOME);
    //   }, 2000);
    // }
    // showMessage({
    //   position: 'bottom',
    //   message: 'Watch Status',
    //   description: !exists ? 'Disconnected' : 'Connected',
    //   type: exists ? 'success' : 'danger',
    //   icon: exists ? 'success' : 'danger',
    // });
    setIsWatchConnected(exists);
    return exists;
  };

  const checkAndReConnect = async () => {
    if (Platform.OS === 'ios') {
      await RM.checkAndReConnect();
    } else {
      //   todo: do android
    }
  };
  const removeListeners = () => {
    listners.map((s, i) => {
      try {
        s.remove();
      } catch (e) {
        console.error('Error removing listener', i);
      }
    });
  };
  const fetchAllData = useCallback(() => {
    fetchMeasureData();
  }, []);
  const findWatch = async () => {
    if (Platform.OS === 'android') {
      try {
        const Data = await RM.sendCommand('findWatch');
        console.log('info=====', Data);
      } catch (e) {
        console.log('info error====', e);
      }
    } else {
      RM.findMe();
    }
  };
  const startScan = async () => {
    console.log('we are scanning');
    setIsScanning(true);
    if (Platform.OS === 'ios') {
      RM.startBluetoothScan();
    } else {
      await checkAndAskAndroidPermissionsForWatch();
      RM.scanDevices(true);
      // setTimeout(() => {
      //   RM.scanDevices(false);
      // }, 2000);
    }
  };
  const removeDevice = async () => {
    if (Platform.OS === 'ios') {
      RM.removeDevice();
      // RM.resetDevice();
    } else {
      try {
        const Data = await RM.removeDevice();
        console.log('info=====', Data);
      } catch (e) {
        console.log('info error====', e);
      }
    }
  };

  const stopScan = () => {
    setIsScanning(false);
    if (Platform.OS === 'ios') {
      RM.stopBluetoothScan();
    } else {
      RM.scanDevices(false);
    }
  };
  const turnonRealTimeStepNotification = () => {
    setIsScanning(false);
    if (Platform.OS === 'ios') {
      RM.turnonRealTimeStepNotification();
    } else {
      // RM.scanDevices(false); // TODO:
    }
  };
  const getDayData = () => {
    if (Platform.OS === 'ios') {
      RM.getDayData();
    } else {
      fetchMeasureData();
      // RM.getTotalSportData();
      // RM.scanDevices(false); // TODO:
    }
  };
  const reconnectLastDevice = async () => {
    try {
      const lastDevice = await StorageHelper.getItem(DEVICE_ASYNC_KEY);
      if (lastDevice && lastDevice.address) {
        connectDevice(lastDevice);
      } else {
        showMessage({
          position: 'bottom',
          message: 'Error',
          description: 'No Device Found',
          type: 'danger',
          icon: 'danger',
        });
      }
    } catch (e) {
      showMessage({
        position: 'bottom',
        message: 'Error',
        description: 'Error Connecting',
        type: 'danger',
        icon: 'danger',
      });
    }
  };
  const connectDevice = async device => {
    stopScan();
    await StorageHelper.setItem(DEVICE_ASYNC_KEY, device);
    console.log('connecting to', device);
    if (Platform.OS === 'ios') {
      console.log(
        'connecting to',
        device.peripheral,
        device.rssi,
        device.address,
        device.verifyWorld,
      );
      if (device.rssi && device.peripheral) {
        RM.connectToDevice(
          device.peripheral,
          device.rssi,
          device.address,
          device.verifyWorld,
        );
      }
    } else {
      RM.connectDevice(device.address);
    }
  };
  const handleWrist = async () => {
    if(Platform.OS === 'ios') {
      // TODO: not handled
    } else {
      RM.getWristInfo();
      RM.setWatchLongSit();
    }
  }
  const restoreLastMeasuredData = async () => {
    try {
      const lastMeasuredData = await StorageHelper.getItem(MEASURE_DATA_KEY);
      if (lastMeasuredData && lastMeasuredData.heart) {
        setMeasuredData(lastMeasuredData);
        // console.log('RestoreData success', lastMeasuredData)
      } else {
        console.log('RestoreData failed', "no data", lastMeasuredData);
      }
    } catch (e) {
      console.log('RestoreData failed error', e.toISOString());
    }
  }
  useEffect(() => {
    if (isWatchConnected) {
      console.log('Watch Connected, fetching data');
      checkIfDeviceExists();
      fetchAllData();
    } else {
      console.log('Watch not connected');
    }
  }, [fetchAllData, isWatchConnected]);

  useEffect(() => {
    setIsLoading(true);
    if(Platform.OS === 'ios') {
      initializeSDK();
      restoreLastMeasuredData();
      checkIfDeviceExists();
    }
    
  }, []);
  useEffect(() => {
    initializeListeners();
    return () => {
      removeListeners();
    };
  }, [synced])
  return (
    <WatchStateContext.Provider
      value={{
        measureAllData,
        isWatchConnected,
        isMeasuring,
        isScanning,
        isLoading,
        setIsLoading,
        connectDevice,
        startScan,
        stopScan,
        removeDevice,
        checkIfDeviceExists,
        devices,
        findWatch,
        reconnectLastDevice,
        measuredData,
        checkAndReConnect,
        setIsMeasuring,
        turnonRealTimeStepNotification,
        getDayData,
        eventLogs,
        setShowEventLog,
        showEventLog,
        takePhoto,
        connectionLogs,
        setEventLogs,
        setConnectionLogs,
        setIsWatchConnected,
        handleWrist
      }}>
      {children}
    </WatchStateContext.Provider>
  );
};

export default WatchStateContext;
