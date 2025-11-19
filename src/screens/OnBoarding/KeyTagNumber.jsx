/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import Routes from '../../navigation/Routes';
import { InputX } from '../../components/common/InputX';
import metrics from '../../themes/Metrics';
import ButtonX from '../../components/common/BottonX';
import ContainerBox from '../../components/common/CenterX';
import AppText from '../../components/common/Text';
import { useMutation } from '@apollo/client';
import { LINK_BARCODE } from '../../Apollo/Mutations';
import { GET_BARCODES } from '../../Apollo/Queries';
import Fonts from '../../themes/Fonts';
import { trackUserEvent } from '../../utils';
import { TrackingEventTypes } from '../../constant';
import { Box } from 'native-base';

const KeyTagNumber = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params;
  const fromHome = route?.params?.fromHome || false;

  // const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ id1: '', id2: '' });
  const [errors, setErrors] = useState({
    lastNameError: '',
    KeyTagError: '',
  });
  const [linkBarcodeMutation, { loading }] = useMutation(LINK_BARCODE);

  const onLinkKeyTag = async () => {
    let valid = true;
    if (data.id1 === '') {
      valid = false;
      setErrors(e => ({ ...e, lastNameError: 'last name is required' }));
    }
    if (data.id2 === '') {
      valid = false;
      setErrors(e => ({ ...e, KeyTagError: 'key tag number is required' }));
    }
    if (valid) {
      try {
        await linkBarcodeMutation({
          variables: {
            type,
            id1: `${data.id1}`,
            id2: `${data.id2}`,
          },
          refetchQueries: [{ query: GET_BARCODES }],
        });
        trackUserEvent(TrackingEventTypes?.barcode_added, {
          barcode_type: type,
          data,
        });
        showMessage({
          message: "Link Success",
          description: 'Linked Successfully',
          type: 'success',
          icon: 'success',
        });
        if (fromHome) {
          navigation.goBack();
        } else {
          navigation.navigate(Routes.NOTIFICATIONPREF);
        }
      } catch (err) {
        console.log("error", err, err?.message)
        console.log(`Error in linking`)
        showMessage({
          message: "Link Error",
          description: err?.message || `Unable to link`,
          type: 'danger',
          icon: 'danger'
        })
      }
    }
  }

  return (
    <ContainerBox>
      <AppText
        text="Please Enter your Last name and your key tag number."
        style={styles.heading}
      />
      <InputX
        containerStyle={{marginTop: metrics.s20}}
        onChangeText={value => setData({...data, id1: value})}
        placeholder="Last Name"
        style={{width: '100%'}}
        placeholderTextColor="#000"
        onFocus={() => setErrors({...errors, lastNameError: ''})}
        error={errors.lastNameError}
      />
      <InputX
        containerStyle={{marginTop: metrics.s20}}
        onChangeText={value => setData({...data, id2: value})}
        placeholder="Key Tag Number"
        placeholderTextColor="#000"
        onFocus={() => setErrors({...errors, KeyTagError: ''})}
        error={errors.lastNameError}
      />
      <ButtonX
        title={fromHome ? 'Save' : 'Next'}
        isLoading={loading}
        isLoadingText={fromHome ? 'Saving' : 'Linking'}
        onPress={onLinkKeyTag}
        style={{width: '100%', marginTop: metrics.s20}}
      />
      {type === 'City' && <Box>
        <AppText
          text={`PLEASE NOTE: NOTE: Only FitnessTO Memberships & Registered Program keytags can be added to the TPASC App. Multi-visit passes (Punch passes) cannot be added.`}
          style={{
            marginTop: metrics.s20 + metrics.s20,
            lineHeight: 16,
            fontFamily: Fonts.medium,
          }}
          fontSize={metrics.s12}
        />
      </Box>}
    </ContainerBox>
  );
};

export default KeyTagNumber;

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: metrics.s20,
    fontFamily: Fonts.book,
    lineHeight: 24,
  },
});
