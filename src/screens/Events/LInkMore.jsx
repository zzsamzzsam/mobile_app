/* eslint-disable prettier/prettier */
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import AppText from '../../components/common/Text';
import { InputX } from '../../components/common/InputX';
import metrics from '../../themes/Metrics';
import ButtonX from '../../components/common/BottonX';
import colors from '../../themes/Colors';
import ContainerBox from '../../components/common/CenterX';
import Fonts from '../../themes/Fonts';
import KeywordAvoidingViewX from '../../components/common/KeywordAvoidingViewX';
import Routes from '../../navigation/Routes';
import { useMutation } from '@apollo/client';
import { LINK_BARCODE } from '../../Apollo/Mutations';
import { trackUserEvent } from '../../utils';
import { TrackingEventTypes } from '../../constant';

const LinkMore = () => {
  const navigation = useNavigation();
  const [formData, setData] = React.useState({ id1: '', id2: '' });
  const [errors, setErrors] = React.useState({
    id1Error: '',
    id2Error: '',
  });
  const [linkEventBarcode, { loading }] = useMutation(LINK_BARCODE);

  const linkBarCode = async () => {
    let valid = true;
    if (formData.id1 === '') {
      valid = false;
      setErrors(e => ({ ...e, id1Error: 'Event code is required' }));
    }
    if (formData.id2 === '') {
      valid = false;
      setErrors(e => ({ ...e, id2Error: 'Passphrase is required' }));
    }

    if (valid) {
      try {
        const { data } = await linkEventBarcode({
          variables: {
            type: 'League_Events',
            id1: formData.id1,
            id2: formData.id2,
          },
        });
        if (data) {
          trackUserEvent(TrackingEventTypes.barcode_link, {
            barcode_type: 'League / Events',
            data: formData,
          });
          AsyncStorage.setItem("Barcode", JSON.stringify(data?.linkAppBarcode));
          showMessage({
            message: "Success",
            description: "Your event code linked successfully",
            type: 'success',
            icon: 'success',
          });
          navigation.navigate(Routes.UNLINKEVENT);
        }
      } catch (err) {
        showMessage({
          message: "Link Error",
          description: "Sorry, those credentials do not match an event",
          type: 'danger',
          icon: 'danger',
        });
      }

    }

  };
  useFocusEffect(
    useCallback(() => {
      setData({ id1: '', id2: '' });
    }, [navigation]),
  );

  return (
    <KeywordAvoidingViewX>
      <ContainerBox>
        <AppText text="Enter your event code" style={styles.heading} />
        <InputX
          value={formData.id1}
          containerStyle={{ marginBottom: 15 }}
          type="text"
          onFocus={() => setErrors({ ...errors, id1Error: '' })}
          onChangeText={value => setData({ ...formData, id1: value })}
          error={errors.id1Error}
        />
        <AppText text={'Enter your passphrase'} style={[styles.heading]} />
        <InputX
          value={formData.id2}
          type="text"
          onFocus={() => setErrors({ ...errors, id2Error: '' })}
          onChangeText={value => setData({ ...formData, id2: value })}
          error={errors.id2Error}
        />
        <ButtonX
          title="Save"
          isLoading={loading}
          isLoadingText="Saving"
          onPress={linkBarCode}
          style={styles.saveBtn}
        />
      </ContainerBox>
    </KeywordAvoidingViewX>
  );
};

export default LinkMore;

const styles = StyleSheet.create({
  heading: {
    fontSize: metrics.s20,
    fontFamily: Fonts.book,
    marginBottom: 10,
  },
  saveBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: metrics.s20
  },
});
