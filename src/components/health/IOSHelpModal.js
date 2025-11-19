import {Box, Divider, Modal, Button, Image} from 'native-base';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../themes/Colors';
import ModalX from '../common/Modal';
import SurfaceBox from '../common/SurfaceBox';
import AppText from '../common/Text';

const IOSHelpModal = ({type, title, onClose, onConfirm}) => {
  if (!['calling', 'disconnect'].includes(type)) {
    return null;
  }
  return (
    <ModalX
      visible={true}
      hideCross
      onDismiss={onClose}
      // height="auto"
      width="80%"
      title={
        type === 'disconnect' ? 'Delete all data and remove device ?' : 'Notice'
      }>
      {type === 'calling' && (
        <>
          <AppText
            textAlign="center"
            bold
            style={{textAlign: 'left', fontSize: 16, lineHeight: 18}}>
            If you need to use Bluetooth call or Bluetooth music function {'\n'}
          </AppText>
          <AppText
            textAlign="center"
            style={{textAlign: 'left', fontSize: 14, lineHeight: 18}}>
            1. Go to <AppText bold>Setting -> Bluetooth -> </AppText>Turn on Bluetooth  and set the
            bluetooth to be discoverable {'\n'}
          </AppText>
          <AppText
            textAlign="center"
            style={{textAlign: 'left', fontSize: 14, lineHeight: 18}}>
            1. Find <AppText bold>TPASCWatch</AppText> in the list to pair and connect. After the pairing is completed, there will be 2 paired devices called TPASCWatch. {'\n'}
          </AppText>
        </>
      )}
      {type === 'disconnect' && (
        <>
          <AppText
            textAlign="center"
            bold
            style={{fontSize: 16, lineHeight: 18}}>
            You must disconnect as shown {'\n'}
          </AppText>
          <Box flexDir="row">
            <Image
              source={require('../../public/disconect.png')}
              alt="Disconnect bluetooth"
              alignSelf={'center'}
              resizeMode="contain"
              height={200}
            />
          </Box>
          <AppText style={{textAlign: 'left', fontSize: 14, lineHeight: 18}}>
            {'\n'}1. Go to <AppText bold>Setting -> Bluetooth</AppText> and
            Press ⓘ on <AppText bold>TPASCWatch</AppText> {'\n'}
          </AppText>
          <AppText style={{textAlign: 'left', fontSize: 14, lineHeight: 18}}>
            2. Press <AppText bold>Forget This Device</AppText>
            {'\n'}
          </AppText>
        </>
      )}
      <Box>
        {!!onConfirm && (
          <Button
            backgroundColor={colors.primary}
            onPress={onConfirm}
            marginLeft="5px"
            marginRight="5px">
            Confirm
          </Button>
        )}
        <Button
          backgroundColor={colors.primary}
          onPress={onClose}
          marginLeft="5px"
          marginRight="5px">
          {onConfirm ? 'Cancel' : 'Ok'}
        </Button>
      </Box>
    </ModalX>
  );
};
const styles = StyleSheet.create({});

export default IOSHelpModal;
