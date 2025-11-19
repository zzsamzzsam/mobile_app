import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import ButtonX from '../../components/common/BottonX';
import metrics from '../../themes/Metrics';
import AppText from '../../components/common/Text';
import ContainerBox from '../../components/common/CenterX';
import Fonts from '../../themes/Fonts';
import { Image } from 'native-base';

const CityOrWalking = () => {
  const navigation = useNavigation();

  return (
      <ContainerBox>
        <Image
          style={{height: '30%'}}
          resizeMode="contain"
          source={require('../../public/swimming_boy.gif')}
          alt="Logo"
        />
        <AppText
          text="Do you have a City of Toronto Key tag or a TPASC Walking Track Keytag?"
          style={styles.heading}
        />
        <ButtonX
          title="City of Toronto Keytag"
          onPress={() => navigation.navigate(Routes.LINKTAGNUMBER, { type: "City" })}
          style={{ width: '100%', marginTop: metrics.s20 + metrics.s20 }}
        />
        <ButtonX
          title="Walking Track Keytag"
          onPress={() => navigation.navigate(Routes.LINKTAGNUMBER, { type: "Track_Walker" })}
          style={{ width: '100%', marginTop: metrics.s20 }}
        />
        <ButtonX
          title="No, I don't have either"
          onPress={() => navigation.navigate(Routes.NOTIFICATIONPREF)}
          style={{ width: '100%', marginTop: metrics.s20 }}
        />
      </ContainerBox>
  );
};

export default CityOrWalking;

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: metrics.s20,
    fontFamily: Fonts.book,
    lineHeight: 24,
  },
});
