/* eslint-disable prettier/prettier */
import { StyleSheet, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box } from 'native-base';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AppText from '../common/Text';
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import { Easing } from 'react-native-reanimated';
import { useQuery } from '@apollo/client';
import { GET_PARKING_REAL } from '../../Apollo/Queries/GetParking';
import axios from 'axios';
const { width: SCREENWIDTH } = Dimensions.get('window');
import Icons from 'react-native-vector-icons/Entypo';
// import ProgressBar from '../common/ProgressBar';

const CircularProgress = ({}) => {
    const {data: parkingLotUrlData, refetch} = useQuery(GET_PARKING_REAL, {
      fetchPolicy: 'network-only',
      onCompleted: handleUrlChange,
    });
    const [currentFills, setCurrentFills] = useState({
      north: 0,
      east: 0,
      east_status: '',
      north_status: '',
    });
    const ref1 = useRef();
    const ref2 = useRef();
    const handleUrlChange = useCallback(async () => {
      try {
        const parkingUrl = parkingLotUrlData?.parkingRealtime?.url;
        if(!parkingUrl) {
          return false;
        }
        console.log('parking url', parkingUrl);
        setCurrentFills({
          north: 0,
          east: 0,
          east_status: '',
          north_status: '',
        });
        if (parkingUrl) {
          const {data: parkingData} = await axios.get(parkingUrl);
          const parkingObj = parkingData?.result?.[0];
          // console.log('paring object', parkingObj);
          let eastPercent = 0;
          let northPercent = 0
          setCurrentFills({
            north: 0,
            east: 0,
            current_est_time: parkingObj?.current_est_time || null,
            east_status: parkingObj?.east_status || '',
            east_status2: parkingObj?.east_status2 || '',
            north_status: parkingObj?.north_status || '',
            north_status2: parkingObj?.north_status2 || '',
            east_direction: parkingObj?.east_direction || '',
            north_direction: parkingObj?.north_direction || '',
            north_max_capacity: parkingObj?.north_max_capacity || '',
            north_taken_spots: parkingObj?.north_taken_spots || '',
            east_max_capacity: parkingObj?.east_max_capacity || '',
            east_taken_spots: parkingObj?.east_taken_spots || '',
          });
          if (parkingObj?.east_max_capacity) {
            eastPercent = ((parkingObj?.east_taken_spots || 0) / parkingObj?.east_max_capacity) * 100;
            eastPercent = Number(eastPercent.toFixed(2));
          }
          if (parkingObj?.north_max_capacity) {
             northPercent =
               ((parkingObj?.north_taken_spots || 0) /
                 parkingObj?.north_max_capacity) *
               100;
              northPercent = Number(northPercent.toFixed(2));
          }
          ref1 &&
            ref1.current &&
            ref1.current.animate(
              northPercent,
              1000,
              Easing.quad,
            );
          ref2 &&
            ref2.current &&
            ref2.current.animate(eastPercent, 1000, Easing.quad);
        }
      } catch (e) {
        console.log('Error pulling parking Data', e);
      }
    }, [setCurrentFills, parkingLotUrlData, ref1, ref2]);
    useEffect(() => {
      handleUrlChange();
    }, [parkingLotUrlData]);
    useEffect(() => {
      const interval = setInterval(() => {
        refetch();
      }, 10000);
      return () => clearInterval(interval);
    }, []);
    return (
      <Box style={{marginHorizontal: metrics.s20}}>
        <AppText
          text={'Parking'}
          bold
          fontSize={14}
          style={{paddingVertical: 10, paddingBottom: 0, color: colors.primary}}
        />
        {!!currentFills?.current_est_time && (
          <AppText
            text={`Last Updated: ${currentFills.current_est_time}`}
            bold
            fontSize={12}
            style={{color: colors.secondary}}
          />
        )}
        <Box style={styles.container}>
          <Box style={styles.box1}>
            <Box>
              <Box style={{marginTop: 10}}>
                <AppText
                  color={colors.primary}
                  bold
                  fontSize={14}
                  style={styles.lotTitle}>
                  North Lot
                </AppText>
              </Box>
              <AnimatedCircularProgress
                size={(SCREENWIDTH * 40) / 100 - 10}
                width={15}
                ref={ref1}
                fill={0}
                // arcSweepAngle={180}
                // rotation={-90}
                backgroundWidth={5}
                lineCap="round"
                // dashedBackground={{gap: 2, width: 10}}
                // tintColor="yellow"
                // tintColorSecondary="red"
                tintColor={'green'}
                // tintColorSecondary="red"
                // tintColor={colors.secondary}
                tintColorSecondary={colors.primary}
                // backgroundColor="#F5F5F5"
                backgroundColor="white"
                // renderCap={({center}) => (
                //   <Icons name="inbox" color="red"/>
                // )}
                // renderCap={({center}) => (
                //   <Circle
                //     cx={center.x}
                //     cy={center.y}
                //     r="10"
                //     fill={colors.primary}
                //   />
                // )}
              >
                {fill => (
                  <Box alignItems={'center'}>
                    {/* <AppText fontSize={16} style={styles.innerText2}>
                      {currentFills?.north_taken_spots}/
                      {currentFills?.north_max_capacity}
                    </AppText> */}
                    <AppText fontSize={16} style={styles.innerText}>
                      {currentFills.north_status}
                    </AppText>
                  </Box>
                )}
              </AnimatedCircularProgress>
              {!!currentFills?.north_status2 && (
                <Box
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    maxWidth: (SCREENWIDTH * 40) / 100 - 10,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                  {currentFills.north_direction && (
                    <Icons
                      name={
                        currentFills.north_direction === 'Up'
                          ? 'arrow-bold-up'
                          : 'arrow-bold-down'
                      }
                      color={
                        currentFills.north_direction === 'Up' ? 'red' : 'green'
                      }
                      size={24}
                      style={{marginRight: 5}}
                    />
                  )}
                  <AppText
                    color={colors.primary}
                    bold
                    fontSize={14}
                    style={styles.lotDescription}>
                    {currentFills.north_status2}
                  </AppText>
                </Box>
              )}
            </Box>
          </Box>
          <Box style={styles.box1}>
            <Box>
              <Box style={{marginTop: 10}}>
                <AppText
                  color={colors.primary}
                  bold
                  fontSize={14}
                  style={styles.lotTitle}>
                  East Lot
                </AppText>
              </Box>
              <AnimatedCircularProgress
                size={(SCREENWIDTH * 40) / 100 - 10}
                width={15}
                ref={ref2}
                fill={0}
                // arcSweepAngle={180}
                // rotation={-90}
                // backgroundWidth={10}
                lineCap="round"
                // dashedBackground={{gap: 2, width: 10}}
                // tintColor="green"
                // tintColorSecondary="red"
                backgroundColor="white"
                tintColor="green"
                tintColor={colors.secondary}
                tintColorSecondary={colors.primary}
                backgroundWidth={5}
                // renderCap={({center}) => (
                //   <Icons name="inbox" color="red" style={{top: center.x, left: center.y}}/>
                // )}
                // renderCap={({center}) => (
                //   <Circle
                //     cx={center.x}
                //     cy={center.y}
                //     r="10"
                //     fill={colors.primary}
                //   />
                // )}
              >
                {fill => (
                  <Box>
                    {/* <AppText fontSize={16} style={styles.innerText2}>
                      {currentFills?.east_taken_spots}/
                      {currentFills?.east_max_capacity}
                    </AppText> */}
                    <AppText fontSize={16} style={styles.innerText}>
                      {currentFills.east_status}
                    </AppText>
                  </Box>
                )}
              </AnimatedCircularProgress>
              {/* <ProgressBar filledSlots={currentFills?.east_taken_spots} totalSlots={100} Label="East Lot"/> */}
              {!!currentFills?.east_status2 && (
                <Box
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    maxWidth: (SCREENWIDTH * 40) / 100 - 10,
                    justifyContent: 'center',
                  }}>
                  {currentFills.east_direction && (
                    <Icons
                      name={
                        currentFills.east_direction === 'Up'
                          ? 'arrow-bold-up'
                          : 'arrow-bold-down'
                      }
                      color={
                        currentFills.east_direction === 'Up' ? 'red' : 'green'
                      }
                      size={24}
                      style={{marginRight: 5}}
                    />
                  )}
                  <AppText
                    color={colors.primary}
                    bold
                    fontSize={14}
                    style={styles.lotDescription}>
                    {currentFills.east_status2}
                  </AppText>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    // backgroundColor: colors.white,
    // padding: metrics.s10,
    justifyContent: 'space-between',
  },
  box1: {
    // backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
  },
  box2: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
  },
  innerText: {
    // color: colors.secondary,
    // padding: 10,
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  innerText2: {
    color: colors.secondary,
    // padding: 10,
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  lotTitle: {
    textAlign: 'center',
  },
  lotDescription: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 16,
    // marginLeft: 10
  },
});

export default CircularProgress