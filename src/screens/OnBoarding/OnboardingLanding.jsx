/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import Routes from '../../navigation/Routes';
import ButtonX from '../../components/common/BottonX';
import AppText from '../../components/common/Text';
import metrics from '../../themes/Metrics';

import { useMutation, useQuery } from '@apollo/client';
import { GET_ME_USER } from '../../Apollo/Queries';
import { StyleSheet } from 'react-native';
import { Box, Image, Radio } from 'native-base';
import colors from '../../themes/Colors';
import { UPDATE_EZ_USER } from '../../Apollo/Mutations/User';
import ContainerBox from '../../components/common/CenterX';

const OnboardingLanding = () => {
    const navigation = useNavigation();

    return (
      <ContainerBox style={{justifyContent: 'center'}}>
        <Image
          style={{height: '30%'}}
          resizeMode="contain"
          source={require('../../public/girl_curls.gif')}
          alt="Logo"
        />
        <AppText
          text="Welcome to the Toronto Pan Am Sports Centre App. "
          style={styles.heading}
        />
        <AppText
          text="Let's get you set up so you can enjoy the benefits of the app."
          style={styles.heading}
        />
        <AppText
          text="You may change any settings or you can redo this setup by going to your profile."
          style={styles.heading}
        />
        <ButtonX
          title="Start"
          onPress={() => navigation.navigate(Routes.UPDATEUSER)}
          style={{width: '100%', marginTop: metrics.s20 + metrics.s20}}
        />
      </ContainerBox>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: metrics.s20,
        paddingVertical: metrics.s10,
    },
    heading: {
        textAlign: 'center',
        fontSize: metrics.s18, marginTop: metrics.s20,
        lineHeight:metrics.s20,
    }
})
export default OnboardingLanding;

