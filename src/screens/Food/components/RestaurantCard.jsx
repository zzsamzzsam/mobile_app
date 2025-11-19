/* eslint-disable prettier/prettier */
import { View, Text, Pressable, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import React from 'react';
import colors from '../../../themes/Colors';
import AppText from '../../../components/common/Text';
import { Box, Hidden } from 'native-base';
import { Avatar } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { convertCloverTime } from '../../../utils/utils';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RestaurantCard = ({ heroImage, icon, title, subtitle, horizontal, onPress, item }) => {
    const isOpen =
      item?.meta?.serviceHoursInformation?.PICKUP?.serviceHoursState === 'OPEN';
    const nextTime = (!isOpen ? item?.meta?.serviceHoursInformation?.PICKUP?.nextOpenTime : null) || null;
    const convertedTime = nextTime ? convertCloverTime(nextTime) : null;
    const nextText = nextTime ? (!isOpen ? `- Opens ${convertedTime}` : null) : '';
    return (
      <Box
        style={[
          styles.container,
          horizontal ? {width: SCREEN_WIDTH - 100, paddingHorizontal: 5} : {},
        ]}>
        <TouchableOpacity onPress={onPress}>
          <ImageBackground
            resizeMode="cover"
            source={heroImage}
            style={styles.hero}></ImageBackground>
          <Box style={styles.below}>
            <Box style={styles.iconWrapper} shadow={5}>
              <ImageBackground
                resizeMode="contain"
                source={icon}
                style={styles.icon}></ImageBackground>
            </Box>
            <AppText color={colors.white} bold fontSize={20}>
              {item?.meta?.name || title}
            </AppText>
            {!!item?.meta && (
              <AppText color={colors.white} fontSize={14}>
                {isOpen ? 'Open' : 'Closed'} {nextText || ''}
              </AppText>
            )}
          </Box>
        </TouchableOpacity>
      </Box>
    );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    // flex: 1,
  },
  hero: {
    // flex: 1,
    height: 150,
  },
  below: {
    // overflow: 'hidden',
    height: 90,
    backgroundColor: colors.primary,
    // paddingTop: 20,
    justifyContent: 'center',
    // alignItems: 'center',
    paddingLeft: 15,
  },
  iconWrapper: {
    position: 'absolute',
    // backgroundColor: colors.primary,
    backgroundColor: colors.white,
    top: -65,
    left: 15,
    borderWidth: 4,
    borderColor: colors.offerText,
    borderRadius: 10,
    padding: 5,
  },
  icon: {
    height: 60,
    width: 60,
  },
});


export default RestaurantCard;