/* eslint-disable prettier/prettier */
import {Box, Text} from 'native-base';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import CustomDivider from '../common/CustomDivider';
import moment from 'moment';
import CommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import AppText from '../common/Text';
import Routes from '../../navigation/Routes';
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';
import {trackUserEvent} from '../../utils';
import {TrackingEventTypes} from '../../constant';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import ViewX from '../common/ViewX';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {Easing} from 'react-native-reanimated';
import {HEALTH_SOURCES} from '../../utils/constants';
import {usePlatformHealthContext} from '../../Services/PlatformHealth/PlatformHealthContext';
import {useWatchContext} from '../../Services/Watch/WatchContext';
const {width} = Dimensions.get('window');
const semiCircleWidth = (60 / 100) * width;
const HealthHomeGreetings = ({
  setDrawerOpen,
  showStepDetails,
  setShowSetStepDetails,
}) => {
  const [greeting, setGreeting] = useState('');

  const {appleHealth, synced, activeSource} = useStoreState(
    state => state.health,
  );
  const navigation = useNavigation();
  const {syncToServer} = useStoreActions(actions => actions.health);
  const ref = useRef();
  const {getDatas, platformHealthTurnedOn} = usePlatformHealthContext();
  const {getDayData, isWatchConnected} = useWatchContext();
  const stepsToday = synced?.stepsToday || 0;
  const fillPercentage = (stepsToday / 10000) * 100;
  useEffect(() => {
    const currentHour = moment().hours();
    if (currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);
  const syncData = useCallback(() => {
    console.log('sync started G');
    let needsSync = false;
    if (activeSource === HEALTH_SOURCES.WATCH && isWatchConnected) {
      getDayData();
      needsSync = true;
    } else if (
      activeSource === HEALTH_SOURCES.PLATFORM &&
      platformHealthTurnedOn
    ) {
      getDatas();
      needsSync = true;
    }
    if (needsSync) {
      setTimeout(() => {
        console.log('syncing after 3 seconds');
        syncToServer();
      }, 4000);
    }
  }, [activeSource, syncToServer, isWatchConnected, platformHealthTurnedOn]);
  useEffect(() => {
    if (fillPercentage && ref && ref.current) {
      ref.current.animate(fillPercentage, 2000, Easing.quad);
    }
  }, [fillPercentage]);
  const onShowBarcodePress = () => {
    trackUserEvent(TrackingEventTypes?.home_barcode_button_pressed, {
      data: {
        message: 'User pressed Home Show Barcode Button',
      },
    });
    navigation.navigate(Routes.BARCODE);
  };
  const onMyScheduleButtonPress = () => {
    trackUserEvent(TrackingEventTypes?.home_myschedule_button_presed, {
      data: {
        message: 'User pressed Home My Schedule Button',
      },
    });
    navigation.navigate(Routes.SCHEDULETOPSTACK, {screen: Routes.MYSCHEDULE});
  };
  return (
    <LinearGradient
      style={{paddingTop: 50}}
      colors={[colors.offerText, colors.primary]}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 0}}>
      <View
        style={{
          paddingHorizontal: 20,
          // paddingTop: 50,
          // backgroundColor: 'green',
          borderRadius: 100,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <ViewX justifyContent="space-between">
          <TouchableOpacity
            onPress={() => {
              setDrawerOpen(true);
            }}>
            <MaterialIcons name="settings" size={30} color="white" />
          </TouchableOpacity>
        </ViewX>
        {/* <ViewX justifyContent="space-between">
          <TouchableOpacity
            onPress={() => {
              syncData();
            }}>
            <MaterialIcons name="sync" size={30} color="white" />
          </TouchableOpacity>
        </ViewX> */}
      </View>
      <Box style={styles.greetingContainer}>
        <Box style={styles.greetingTop}>
          <Box
            style={{
              // flexDirection: 'row',
              // justifyContent: 'space-between',
              // paddingTop: 10,
              paddingBottom: 40,
            }}>
            {/* <Box>
              <Box>
                <Text style={[styles.text]}>{`${greeting},`}</Text>
                <Text style={[styles.name]}>Nirmal</Text>
              </Box>
              <Box style={{paddingTop: 5}}>
                <Text
                  style={[
                    styles.text,
                    {fontFamily: Fonts.medium, fontWeight: 500},
                  ]}>
                  Membership since
                </Text>
                <Text style={styles.text}>Tunturi</Text>
              </Box>
            </Box> */}
            {/* <Box style={{justifyContent: 'flex-end'}}>
              <TouchableOpacity
                onPress={onShowBarcodePress}
                style={styles.viewAccountBox}>
                <AppText
                  text={'Show Barcode'}
                  style={[styles.text, {fontSize: 15, textAlign: 'center'}]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onMyScheduleButtonPress}
                style={[styles.viewAccountBox, {marginTop: 20}]}>
                <AppText
                  text={'My Schedule'}
                  style={[styles.text, {fontSize: 15, textAlign: 'center'}]}
                />
              </TouchableOpacity>
            </Box> */}
            <TouchableOpacity
              style={{
                // backgroundColor: 'red',
                flex: 1
              }}
              onPress={() => {setShowSetStepDetails(true)}}
              >
              <View
                style={{
                  flex: 1,
                  // backgroundColor: 'red',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <AnimatedCircularProgress
                  size={semiCircleWidth}
                  width={20}
                  ref={ref}
                  duration={2000}
                  backgroundWidth={20}
                  style={{height: semiCircleWidth / 2}}
                  fill={fillPercentage}
                  tintColor={colors.secondary}
                  arcSweepAngle={180}
                  rotation={270}
                  // onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor={colors.primary}>
                  {fill => (
                    <View
                      style={{
                        alignItems: 'center',
                        position: 'absolute',
                        top: 30,
                      }}>
                      <AppText
                        text="Steps today"
                        style={{
                          fontFamily: Fonts.book,
                          fontSize: 16,
                          color: colors.white,
                        }}
                      />
                      <AppText
                        text={`${stepsToday}`}
                        style={{
                          fontFamily: Fonts.medium,
                          fontSize: 20,
                          color: colors.white,
                        }}
                      />
                      {/* <AppText
                      text="Goal: 10000"
                      style={{
                        fontFamily: Fonts.book,
                        fontSize: 16,
                        color: colors.white,
                      }}
                    /> */}
                      {/* {!!synced?.historicalW?.steps && <AppText
                      text={`H: ${synced.historicalW.steps}`}
                      style={{
                        fontFamily: Fonts.book,
                        fontSize: 16,
                        color: colors.white,
                      }}
                    />} */}
                    </View>
                  )}
                </AnimatedCircularProgress>
              </View>
            </TouchableOpacity>
          </Box>
          {/* <Box>
            <Text style={[styles.text]} >{`${greeting},`}</Text>
            <Text style={[styles.name]} >{name}</Text>
          </Box>
          <Box style={styles.memberShip}>
            <TouchableOpacity style={styles.membershipBox}>
              {
                membershipSince && <Box>
                  <Text style={[styles.text, { fontFamily: Fonts.medium, fontWeight: 500 }]}>
                    Membership since
                  </Text>
                  <Text style={styles.text}>
                    {membershipSince && moment(membershipSince).format('YYYY-MM-DD')}
                  </Text>
                </Box>
              }
            </TouchableOpacity>
            <Box>
              <TouchableOpacity
                onPress={() => navigation.navigate(Routes.BARCODE)}
                style={styles.viewAccountBox}>
                <AppText text={'Show Barcode'} style={[styles.text, { fontSize: 14 }]} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate(Routes.BARCODE)}
                style={styles.viewAccountBox}>
                <AppText text={'My Schedule'} style={[styles.text, { fontSize: 14 }]} />
              </TouchableOpacity>
            </Box>
          </Box> */}
        </Box>

        <Box style={styles.lastWrapper}>
          <Box style={styles.halfWhiteBar}></Box>
          <Box style={styles.last} shadow="5">
            <Box style={styles.lastContainer}>
              <AppText text={'Distance'} style={styles.metricTitle} />
              <LottieView
                style={{height: 40, width: 50}}
                source={require('../../../assets/treadmill.json')}
                autoPlay
                loop
              />
              <ViewX flexRow>
                <AppText
                  text={`${synced?.distance?.today || 'N/A'}`}
                  style={styles.metricSubtitle}
                />
                <AppText text={' m'} style={styles.metricSubtitle2} />
              </ViewX>
            </Box>
            <CustomDivider />
            <Box style={styles.lastContainer}>
              <AppText text={'Calories'} style={styles.metricTitle} />
              {/* <FontAwesome5 color={colors.black} name="burn" size={25} /> */}
              {/* <OurLottie height={25} width={25} name="burning"/> */}
              <LottieView
                style={{height: 45, width: 50, marginBottom: 5}}
                source={require('../../../assets/fire_trimmed.json')}
                autoPlay
                loop
              />
              <ViewX flexRow>
                <AppText
                  text={synced?.calories?.today || 'N/A'}
                  style={styles.metricSubtitle}
                />
                <AppText text={' Kcal'} style={styles.metricSubtitle2} />
              </ViewX>
            </Box>
            <CustomDivider />
            <Box style={styles.lastContainer}>
              <AppText text={'HeartRates'} style={styles.metricTitle} />
              <LottieView
                style={{height: 40, width: 50, marginTop: 2}}
                source={require('../../../assets/hearting_ico.json')}
                autoPlay
                loop
              />
              <ViewX flexRow>
                <AppText
                  text={synced?.heart?.current || 'N/A'}
                  style={styles.metricSubtitle}
                />
                <AppText text={' Bpm'} style={styles.metricSubtitle2} />
              </ViewX>
            </Box>
          </Box>
        </Box>
      </Box>
    </LinearGradient>
  );
};

export default HealthHomeGreetings;

const styles = StyleSheet.create({
  greetingContainer: {
    position: 'relative',
  },
  greetingTop: {
    // paddingVertical: metrics.s10,
    // paddingHorizontal: metrics.s20,
    paddingBottom: 0,
  },
  metricTitle: {
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 15,
  },
  metricSubtitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: 'bold',
  },
  metricSubtitle2: {
    fontFamily: Fonts.medium,
    // color: colors.gray,
    // fontWeight: 500,
  },
  name: {
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: Fonts.medium,
    textTransform: 'uppercase',
  },
  text: {
    color: colors.white,
    fontFamily: Fonts.book,
  },
  memberShip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: metrics.s10,
    paddingBottom: metrics.s40,
  },
  membershipBox: {},
  halfWhiteBar: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.homeBg,
  },
  lastWrapper: {
    paddingHorizontal: 20,
  },
  last: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    paddingTop: metrics.s10,
    paddingBottom: metrics.s10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  viewAccountBox: {
    // paddingHorizontal: metrics.s8,
    // backgroundColor: colors.secondary,
    backgroundColor: colors.third,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});
