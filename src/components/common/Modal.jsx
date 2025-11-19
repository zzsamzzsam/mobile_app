/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {Box, Text} from 'native-base';
import React from 'react';
import {IconButton, Modal, Portal} from 'react-native-paper';
import {Modal as ModalBase} from 'native-base';
import colors from '../../themes/Colors';
import AppText from './Text';

const ModalX = ({children, visible, onDismiss, height, width, title, dismissable = true, hideCross = false}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={{
          width: width ? '100%' : '80%',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}
        dismissable={dismissable}
        onDismiss={dismissable && onDismiss}>
        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            paddingBottom: 10,
            ...(height && {height}),
            ...(width && {width}),
          }}>
          {title && (
            <ModalBase.Header
              backgroundColor={colors.secondary}
              borderTopLeftRadius={8}
              borderTopRightRadius={8}
              // backgroundColor="red"
            >
              {dismissable && !hideCross && <ModalBase.CloseButton onPress={onDismiss} />}
              <AppText
                bold
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  textAlign: 'center',
                  paddingTop: 5,
                  color: colors.primary,
                }}>
                {title}
              </AppText>
            </ModalBase.Header>
          )}
          <ModalBase.Body paddingLeft="20px" paddingRight="20px">
            {children}
          </ModalBase.Body>
        </Box>
      </Modal>
    </Portal>
  );
};

export default ModalX;
