import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
// import AnimatedNumber from 'react-native-animated-numbers';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {ActivityIndicator, Button} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
// import ViewX from '../../Components/Common/View';
// import SettingsMenu from '../../Components/HealthHome/SettingsMenu';
// import HeartRateMonitor from '../../Components/HeartRateMonitor';
// import HeartRateMonitorArko from '../../Components/HeartRateMonitorArko';
import {Drawer} from 'react-native-drawer-layout';
// import DrawerX from '../../Components/DrawerX';
import LoadingModal from '../components/common/LoadingModal';
import DrawerX from '../components/health/DrawerX';
import colors from '../themes/Colors';
import {useWatchContext} from '../Services/Watch/WatchContext';
import AnimatedView from '../components/common/AnimatedView';
import SurfaceBox from '../components/common/SurfaceBox';
import Fonts from '../themes/Fonts';
import Text from '../components/common/Text';
import WatchStatus from '../components/health/WatchStatus';
import Devices from '../components/health/Devices';
import HeartRateMonitorArko from '../components/health/HeartRateMonitorArko';
import EventLogs from '../components/health/EventLogs';
import PlatformHealthCard from '../components/health/PlatformHealthCard';
import ViewX from '../components/common/ViewX';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HealthHomeGreetings from '../components/screens/HealthHomeGreetings';
import {LineChart} from 'react-native-gifted-charts';
import ButtonX from '../components/common/BottonX';
import HeartChartBox from '../components/health/HeartChartBox';
import SleepChartBox from '../components/health/SleepChartBox';
import LeadersBoardBox from '../components/health/LeadersBoardBox';
import { useStoreState } from 'easy-peasy';
import StepDetails from '../components/health/StepsDetails';
import { HEALTH_SOURCES } from '../utils/constants';
import { usePlatformHealthContext } from '../Services/PlatformHealth/PlatformHealthContext';
import WatchSettings from '../components/health/WatchSettings';
import ChallengeBox from '../components/health/ChallengeBox';
import AppText from '../components/common/Text';
import Routes from './Routes';
const ptData = [
  {value: 100, date: '1 Apr 2022', color: 'red'},
  {value: 90, date: '2 Apr 2022'},
  {value: 97, date: '3 Apr 2022'},
  {value: 88, date: '4 Apr 2022'},
  {value: 79, date: '5 Apr 2022'},
  {value: 74, date: '6 Apr 2022'},
  {value: 76, date: '7 Apr 2022'},
  {value: 81, date: '8 Apr 2022'},

  {value: 100, date: '9 Apr 2022'},
  {
    value: 120,
    date: '10 Apr 2022',
    label: '10 Apr',
  }
];
const {width} = Dimensions.get('window');
const semiCircleWidth = (60 / 100) * width;



const AnimatedDial = () => {};
const HealthHomeScreen = ({navigation, showPage, setShowPage}) => {
  const [data, setData] = useState([30, 10, 40, 95, 85, 60, 40]); // Sample data
  const [scrollX] = useState(new Animated.Value(0));
  const chartWidth = 300; // Adjust the width of the chart as needed
  const dataLength = data.length;
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [showStepDetails, setShowSetStepDetails] = useState(false);
  const {isLoading, setIsLoading, isScanning} = useWatchContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // const [_isLoading, setIsLoading] = useState(isLoading);
  const [showDial, setShowDial] = useState(true);
  const lineChartRef = useRef(null);
  const {activeSource, platformHealthTurnedOn} = useStoreState(state => state.health);
  const {isPlatformHealthReady} = usePlatformHealthContext();
  const dialRef = useRef();
  const [x, setX] = useState(1223);
  // const animatedValue = useRef(new Animated.Value(1000)).current;
  // const [animateToNumber, setAnimateToNumber] = React.useState(7979);
  useEffect(() => {
    if (!showDial) {
      setShowDial(true);
    }
  }, [showDial]);
  const simulateRefresh = () => {
    // setIsLoading(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowDial(false);
      dialRef &&
        dialRef.current &&
        dialRef.current.animate(100, 8000, Easing.quad);
      const rand = getRandomValue();
      changeValue(rand);
      console.log('random value', rand);
      // setAnimateToNumber(rand);
      // Animated.timing(animatedValue, {
      //   toValue: rand,
      //   duration: 2000, // Adjust the duration as needed
      //   useNativeDriver: false, // Make sure to set useNativeDriver to false for Text component
      // }).start();
    }, 4000);
  };
  const changeValue = val => {
    let value = 0;
    const interval = setInterval(() => {
      if (value < 20) {
        // 3 seconds (30 * 100 milliseconds)
        value = value + 2;
        setX(val + value);
        console.log('Current value:', value);
      } else {
        clearInterval(interval); // Stop the interval after 3 seconds
      }
    }, 100);
  };

  const getRandomValue = () => {
    const minValue = 1000;
    const maxValue = 2000;
    const randomValue =
      Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    return randomValue;
  };
   const scrollToRight = () => {
    if (lineChartRef.current) {
      lineChartRef.current.scrollToEnd({ animated: true });
    }
  };
  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={require('../../assets/tpasc_bg_top_var1.png')} // Replace with your image path
        style={{flex: 1}}> */}
        <DrawerX drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} setIsConnectionModalOpen={setIsConnectionModalOpen} isConnectionModalOpen={isConnectionModalOpen}>
          {/* <View style={{height: 60}} /> */}
          <ScrollView
            style={{}}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={isLoading}
            //     onRefresh={simulateRefresh}
            //   />
            // }
            >
            <HealthHomeGreetings setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} showStepDetails={showStepDetails} setShowSetStepDetails={setShowSetStepDetails}/>
            {/* <AnimatedView horizontal skipOpacity>

        </AnimatedView> */}
            <SurfaceBox noPadding>
            </SurfaceBox>
            <SurfaceBox>
              <WatchStatus
                setDrawerOpen={setDrawerOpen}
                drawerOpen={drawerOpen}
                isConnectionModalOpen={isConnectionModalOpen}
                setIsConnectionModalOpen={setIsConnectionModalOpen}
              />
            </SurfaceBox>
            {<SurfaceBox outerStyle={{padding: 0, paddingHorizontal: 10}}>
              <LeadersBoardBox
                setDrawerOpen={setDrawerOpen}
                drawerOpen={drawerOpen}
              />
            </SurfaceBox>}
              {activeSource === HEALTH_SOURCES.PLATFORM && platformHealthTurnedOn && <StepDetails showStepDetails={showStepDetails} setShowSetStepDetails={setShowSetStepDetails}/>}
            <HeartChartBox />
          {/* {<SurfaceBox outerStyle={{ padding: 0, paddingHorizontal: 10 }}>
            <ChallengeBox
              setDrawerOpen={setDrawerOpen}
              drawerOpen={drawerOpen}
            />
          </SurfaceBox>} */}
            {/* <SleepChartBox /> */}
            {/* {isScanning && (
              <SurfaceBox>
                <Devices
                // setDrawerOpen={setDrawerOpen}
                // drawerOpen={drawerOpen}
                />
              </SurfaceBox>
            )} */}
            {/* <SurfaceBox>
                <PlatformHealthCard />
            </SurfaceBox> */}
            {/* <SurfaceBox>
                <EventLogs
                // setDrawerOpen={setDrawerOpen}
                // drawerOpen={drawerOpen}
                />
              </SurfaceBox> */}
            {/* <ViewX flexRow>
          <AnimatedView horizontal delayLevel={1} skipOpacity><SurfaceBox><Text>One Two</Text></SurfaceBox></AnimatedView>
          <AnimatedView horizontal delayLevel={2} skipOpacity><SurfaceBox><Text>One Two</Text></SurfaceBox></AnimatedView>
          <AnimatedView horizontal delayLevel={3} skipOpacity><SurfaceBox><Text>One Tw</Text></SurfaceBox></AnimatedView>
        </ViewX> */}
            {/* <AnimatedView delayLevel={1}>
              <SurfaceBox>
                <View style={{flexDirection: 'column', height: 170}}>
                  <Text style={{textAlign: 'center', fontWeight: '300'}}>
                    Today
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text bold>{x}</Text>
                      <Text style={{color: 'grey'}}>Steps</Text>
                    </View>
                    <View />
                    <View
                      style={{
                        width: '50%',
                        alignItems: 'center',
                        paddingTop: 10,
                      }}>
                      {showDial && (
                        <AnimatedCircularProgress
                          size={150}
                          width={6}
                          backgroundWidth={16}
                          fill={70}
                          // ref={dialRef}
                          duration={1000}
                          arcSweepAngle={270}
                          lineCap="round"
                          rotation={225}
                          tintColor={colors.pink}
                          backgroundColor={colors.two}
                        />
                      )}
                      <View
                        style={{
                          // borderWidth: 2,
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          position: 'absolute',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text bold style={{fontSize: 18}}>
                          {1235 + x}
                        </Text>
                        <Text>calories</Text>
                      </View>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text bold>{2232 + x}</Text>
                      <Text style={{color: 'grey'}}>Next</Text>
                    </View>
                  </View>
                </View>
              </SurfaceBox>
            </AnimatedView> */}
            {/* <AnimatedView delayLevel={2}>
              <SurfaceBox>
                <HeartRateMonitorArko />
              </SurfaceBox>
            </AnimatedView> */}
            {/* <SurfaceBox noPadding={true}>
              <ImageBackground
                source={require('../../assets/girl.png')} // Replace with your image path
                style={{height: 200}}
              />
            </SurfaceBox> */}
            {/* <View style={{height: 500}} /> */}
          </ScrollView>
          {/* {isLoading && <LoadingModal title="loading global" />} */}
        </DrawerX>
      {/* </ImageBackground> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 50,
    // flexDirection: 'row',
    // justifyContent: 'center',
    alignSelf: 'stretch',
    // backgroundColor: 'red'
    // alignItems: 'center',
  },
});

export default HealthHomeScreen;
