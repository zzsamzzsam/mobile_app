import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {
  Icon,
  MD3Colors,
  SegmentedButtons,
  Surface,
  Text,
} from 'react-native-paper';
import Svg, {Circle, Path, Text as SvgText} from 'react-native-svg';
import LottieView from 'lottie-react-native';
import {Button} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import { useWatchContext } from '../../Services/Watch/WatchContext';
import colors from '../../themes/Colors';
const HeartRateMonitorArko = ({
  onMeasureStart,
}) => {

  const {measuredData, measureAllData, isMeasuring, setIsMeasuring} = useWatchContext();
  const measureData = measuredData;
  // const [heartRate, setHeartRate] = useState(0); // Assuming you receive heart rate data
  //   const progress = new Animated.Value(0);
  //   const [progress] = useState(new Animated.Value(55));

  //   console.log('progress===========', progress);
  // useEffect(() => {
  //   setIsMeasuring(isMeasuring);
  // }, [isMeasuring]);
  const startStopMeasurement = () => {
    if(!isMeasuring) {
      console.log('measuring====started');
      measureAllData();
    } else {
      console.log('measuring====stopped');
    }
    // console.log('setting value', 50)
    // onMeasureStart && onMeasureStart(!_isMeasuring);
    // setHeartRate(10);
    // Animated.timing(progress, {
    //   toValue: 200, // Assuming the max value is 200
    //   duration: 3000, // Duration for the measurement
    //   useNativeDriver: false,
    // }).start();

    setIsMeasuring(!isMeasuring);
    // Logic to start/stop measuring heart rate
    // This function will be called on button press
  };
  const calculateProgress = () => {
    const heartRate = measureData?.heart || 0;
    return (heartRate / 200) * Math.PI - Math.PI; // Assuming the max value is 200
  };

  const renderProgress = () => {
    const animatedProgress = calculateProgress();

    const startX = 100 - 80 * Math.cos(animatedProgress);
    const startY = 100 - 80 * Math.sin(animatedProgress);
    const endX = 100 + 80 * Math.cos(animatedProgress);
    const endY = 100 + 80 * Math.sin(animatedProgress);

    return (
      <Path
        d={`M${startX} ${startY} A 80 80 0 ${
          animatedProgress > Math.PI ? 1 : 0
        } 1 ${endX} ${endY}`}
        stroke="#0C5356"
        strokeWidth={12}
        strokeLinecap="round"
        fill="transparent"
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <Svg width={200} height={100}>
          <Circle
            stroke="#d6d6d6"
            cx={100}
            cy={100}
            r={80}
            strokeWidth={12}
            fill="transparent"
          />
          {renderProgress()}
          {!isMeasuring && (
            <SvgText
              x="100"
              y="60"
              textAnchor="middle"
              stroke="#000"
              fontSize="22"
              fontWeight="bold">
              {measureData?.heart || 0}
            </SvgText>
          )}
          {!isMeasuring && (
            <SvgText
              x="100"
              y="80"
              textAnchor="middle"
              stroke="#000"
              fontSize="20"
              fontWeight="bold">
              bpm
            </SvgText>
          )}
        </Svg>
        {isMeasuring && (
          <View style={styles.heartAnimation}>
            <LottieView
              style={styles.heartIcon}
              source={require('../../../assets/heart_beat.json')}
              autoPlay
              loop
            />
          </View>
        )}
      </View>

      <Surface style={styles.extrametrics} elevation={3}>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <View style={styles.extraMetaSingle}>
            <Entypo name="drop" color={colors.primary} size={30} />
            <Text style={styles.extraMetaSingleTextInner2}>
              {measureData?.spo || 0}%
            </Text>
            <Text style={styles.extraMetaSingleTextInner1}>SpO2</Text>
          </View>
          <View style={{backgroundColor: 'black', flex: 0, width: 1}}>
            <Text> </Text>
          </View>
          <View style={styles.extraMetaSingle}>
            <Entypo name="thermometer" color={colors.primary} size={30} />
            <Text style={styles.extraMetaSingleTextInner2}>
              {measureData?.lblood || measureData?.h_blood || '00'}/{measureData?.hblood || measureData?.l_blood || '00'}
            </Text>
            <Text style={styles.extraMetaSingleTextInner1}>mmHg</Text>
          </View>
        </View>
      </Surface>
       <Button
        style={[
          styles.button,
          isMeasuring ? styles.stopButton : styles.startButton,
        ]}
        onPress={startStopMeasurement}>
        <Text style={styles.buttonText}>
          {isMeasuring ? 'Stop Measurement' : 'Start Measurement'}
        </Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  extraMetaSingle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraMetaSingleTextInner1: {
    alignSelf: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    // paddingRight: 10,
  },
  extraMetaSingleTextInner2: {
    fontSize: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.secondary,
    fontWeight: 'bold',
  },
  container: {
    // height: '100%',
    paddingBottom: 20,
    alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: '#f5f5f5',
  },
  extrametrics: {
    padding: 0,
    borderRadius: 100,
    // flex: 1,
    width: '100%',
    backgroundColor: '#F3EDF5',
    flexDirection: 'row',
    // height: 80,
    // width:
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    // paddingVertical: 12,
    marginTop: 20,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  animationContainer: {
    position: 'relative',
    alignItems: 'center',
    width: 200,
    height: 120,
  },
  heartAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -150,
    marginLeft: -150,
  },
  heartIcon: {
    width: 300,
    height: 300,
  },
  labelContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#3498db',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
  },
});

export default HeartRateMonitorArko;
