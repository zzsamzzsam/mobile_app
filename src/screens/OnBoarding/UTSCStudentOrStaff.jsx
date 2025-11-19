import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import ButtonX from '../../components/common/BottonX';
import metrics from '../../themes/Metrics';
import AppText from '../../components/common/Text';
import ContainerBox from '../../components/common/CenterX';
import { Image } from 'native-base';



const UTSC_Student_Staff = () => {
  const navigation = useNavigation();

  return (
      <ContainerBox style={{justifyContent: 'center'}}>
        {/* <AppText
          text="Welcome to the Toronto Pan Am Sports Centre App. Let's get your account set up"
          style={styles.heading}
        /> */}
        <Image
          style={{height: '30%'}}
          resizeMode="contain"
          source={require('../../public/student_waving.gif')}
          alt="Logo"
        />
        <AppText
          text="Are you a UTSC Student or Staff with a T-Card?"
          style={[styles.heading, { fontSize: metrics.s18, marginTop: metrics.s20 }]}
          fontSize={metrics.s18}
        />
        <ButtonX
          title='Yes'
          onPress={() => navigation.navigate(Routes.LINKSTUDENTORSTAFFCARD)}
          style={{ width: '100%', marginTop: metrics.s20 + metrics.s20 }}
        />
        <ButtonX
          title='No'
          onPress={() => navigation.navigate(Routes.ASKTCITYORWALKING)}
          style={{ width: '100%', marginTop: metrics.s20 }}
        />
      </ContainerBox>
  );
};

export default UTSC_Student_Staff;

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: metrics.s20
  },
});
