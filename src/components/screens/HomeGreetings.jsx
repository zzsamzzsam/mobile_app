/* eslint-disable prettier/prettier */
import { Box, HStack, Image, Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity as TouchableOpacityBase } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import CustomDivider from '../common/CustomDivider';
import moment from 'moment';
import CommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import AppText from '../common/Text';
import Routes from '../../navigation/Routes';
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';
import { trackUserEvent } from '../../utils';
import { TrackingEventTypes } from '../../constant';
import { TouchableHighlight } from '@gorhom/bottom-sheet';

const HomeGreetings = ({ name, membershipSince, lastCheckIn, membershipStatus }) => {
  const [greeting, setGreeting] = useState('');

  const navigation = useNavigation();

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
  const onShowBarcodePress = () => {
    trackUserEvent(TrackingEventTypes?.home_barcode_button_pressed, {
      data: {
        message: "User pressed Home Show Barcode Button"
      },
    });
    navigation.navigate(Routes.BARCODE);
  };
  const onMyScheduleButtonPress = () => {
    trackUserEvent(TrackingEventTypes?.home_myschedule_button_presed, {
      data: {
        message: "User pressed Home My Schedule Button"
      },
    });
    navigation.navigate(Routes.SCHEDULETOPSTACK, { screen: Routes.MYSCHEDULE });
  };
  const onFriendlierButtonPress = () => {
    // trackUserEvent(TrackingEventTypes?.home_myschedule_button_presed, {
    //   data: {
    //     message: "User pressed Home My Schedule Button"
    //   },
    // });
    navigation.navigate(Routes.FRIENDLIER, { });
  };
  
  return (
    <LinearGradient
      colors={[colors.offerText, colors.primary]}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 0}}>
      <Box style={styles.greetingContainer}>
        <Box style={styles.greetingTop}>
          <Box
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 10,
              paddingBottom: 40,
            }}>
            <Box>
              <Box>
                <Text style={[styles.text]}>{`${greeting},`}</Text>
                <Text style={[styles.name]}>{name}</Text>
              </Box>
              {membershipSince && (
                <Box style={{paddingTop: 5}}>
                  <Text
                    style={[
                      styles.text,
                      {fontFamily: Fonts.medium, fontWeight: 500},
                    ]}>
                    Membership since
                  </Text>
                  <Text style={styles.text}>
                    {membershipSince &&
                      moment(membershipSince).format('YYYY-MM-DD')}
                  </Text>
                </Box>
              )}
            </Box>
            <Box
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
              }}>
              {/* <View style={[styles.viewAccountBox, {backgroundColor: 'green'}]}> */}
              <HStack style={{justifyContent: 'space-between'}}>
                <TouchableOpacityBase
                  style={[styles.viewAccountBoxHalf]}
                  onPress={onShowBarcodePress}>
                  <CommunityIcons
                    name="barcode-scan"
                    color={colors.white}
                    size={30}
                  />
                  {/* <Text style={{color: 'red'}}>sssdf</Text> */}
                </TouchableOpacityBase>
                <View style={{width: 5}}></View>
                <TouchableOpacityBase
                  style={[styles.viewAccountBoxHalf]}
                  onPress={onMyScheduleButtonPress}>
                  <View>
                    <Entypo name="calendar" color={colors.white} size={30} />
                    <View style={styles.absWrapper}>
                      <Text
                        style={{
                          fontFamily: Fonts.bold,
                          fontSize: 6,
                          fontWeight: 'bold',
                          color: colors.white,
                        }}>
                        My
                      </Text>
                    </View>
                  </View>
                </TouchableOpacityBase>
              </HStack>
              {/* </View> */}
              <TouchableOpacity
                onPress={onFriendlierButtonPress}
                style={[
                  styles.viewAccountBox,
                  {marginTop: 0, padding: 5, alignItems: 'center'},
                ]}>
                <Image
                  style={{width: 100, height: 20}}
                  resizeMode="contain"
                  source={require('../../public/friendlier_logo_500.png')}
                  alt="Logo"
                />
              </TouchableOpacity>
            </Box>
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
              <CommunityIcons
                color={colors.black}
                name="window-shutter-open"
                size={25}
              />
              <Box style={{marginLeft: metrics.s10}}>
                <AppText
                  text={
                    lastCheckIn
                      ? moment(lastCheckIn).format('YYYY-MM-DD')
                      : 'N/A'
                  }
                  style={{fontFamily: Fonts.medium}}
                />
                <AppText
                  text={'Last Check in'}
                  style={{
                    marginTop: -5,
                    fontFamily: Fonts.medium,
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
            <CustomDivider />
            <Box style={styles.lastContainer}>
              <CommunityIcons
                color={colors.black}
                name="calendar-month-outline"
                size={25}
              />
              <Box style={{marginLeft: metrics.s10}}>
                <AppText
                  text={membershipStatus || 'None'}
                  style={{fontFamily: Fonts.medium}}
                />
                <AppText
                  text={'Membership Status'}
                  style={{
                    marginTop: -5,
                    fontFamily: Fonts.medium,
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </LinearGradient>
  );
};

export default HomeGreetings;

const styles = StyleSheet.create({
  greetingContainer: {
    position: 'relative',
  },
  greetingTop: {
    paddingVertical: metrics.s10,
    paddingHorizontal: metrics.s20,
    paddingBottom: 0,
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
  membershipBox: {
  },
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
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  viewAccountBox: {
    // paddingHorizontal: metrics.s8,
    // backgroundColor: colors.secondary,
    backgroundColor: colors.third,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  viewAccountBoxHalf: {
    // paddingHorizontal: metrics.s8,
    // backgroundColor: colors.secondary,
    backgroundColor: colors.third,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  absWrapper: {position: 'absolute', top:10, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}
});
