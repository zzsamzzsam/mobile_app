import React, { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import AppText from '../common/Text';
import colors from '../../themes/Colors';
import {Box} from 'native-base';
import ModalX from '../common/Modal';
const avatars = [
  'aquafit.png',
  'archery.png',
  'arts-crafts.png',
  'badminton.png',
  'ball-hockey.png',
  'basketball.png',
  'climbing.png',
  'cricket.png',
  'cycling.png',
  'dance.png',
  'family-fitness.png',
  'fitness.png',
  'guitar.png',
  'martial-arts.png',
  'pickleball.png',
  'soccer.png',
  'swimming.png',
  'ultimate-frisbee.png',
  'volleyball.png',
  'walking.png',
  'yoga.png',
];
const AvatarPicker = ({value, onChange, disabled}) => {
  const src = value
    ? {
        uri: value,
      }
    : require('../../public/transparentEffect.png');
  const [pickerOpen, setPickerOpen] = useState(false)
  return (
    <TouchableOpacity
      onPress={() => {
        setPickerOpen(true);
      }}
      style={{alignSelf: 'flex-start', paddingTop: 10, paddingBottom: 10}}>
      <Box style={{alignSelf: 'flex-start'}}>
        <Image
          width={100}
          height={100}
          resizeMode="cover"
          source={src}
          style={styles.imageStyle}
        />
        {!disabled && (
          <Box
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: colors.secondary,
              borderRadius: 100,
              padding: 5,
            }}>
            <MaterialIcons size={20} name="edit" color={colors.white} />
          </Box>
        )}
      </Box>
      <ModalX
        visible={pickerOpen}
        hideCross
        onDismiss={() => {}}
        // height="auto"
        width="80%"
        title={'Pick Avatar'}>
        <Box flexDir="row">
          <FlatList
            scrollEnabled
            numColumns={3}
            style={{height: 400}}
            data={avatars}
            contentContainerStyle={{
              justifyContent: 'space-between',
              flexGrow: 1,
            }}
            renderItem={({item, index}) => {
              console.log('on', item);
              return (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => {
                    onChange(`https://tpascapp.s3.amazonaws.com/${item}`);
                    setPickerOpen(false);
                  }}>
                  <Image
                    style={[styles.imageStyle, styles.pickerImageStyle]}
                    key={index}
                    source={{
                      uri: `https://tpascapp.s3.amazonaws.com/${item}`,
                    }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </Box>
      </ModalX>
    </TouchableOpacity>
  );
};

export default AvatarPicker;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  imageStyle: {
    height: 100,
    width: 100,
    borderRadius: 100,
    borderWidth: 2,
    padding: 5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // alignSelf: 'flex-start',
    alignItems: 'center',
  },
  pickerImageStyle: {
    height: 80,
    width: 80,
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
});
