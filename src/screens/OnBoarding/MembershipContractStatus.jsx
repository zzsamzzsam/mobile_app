/* eslint-disable prettier/prettier */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import Routes from '../../navigation/Routes';
import ButtonX from '../../components/common/BottonX';
import AppText from '../../components/common/Text';
import metrics from '../../themes/Metrics';
import ContainerBox from '../../components/common/CenterX';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME_USER } from '../../Apollo/Queries';
import { LINK_BARCODE } from '../../Apollo/Mutations';
import Fonts from '../../themes/Fonts';
import { trackUserEvent } from '../../utils';
import { TrackingEventTypes } from '../../constant';

const MembershipContractStatus = () => {
  const navigation = useNavigation();

  const { data: userData } = useQuery(GET_ME_USER);
  const [linkBarcodeMutation, { loading }] = useMutation(LINK_BARCODE);

  const onLinkMembership = async () => {
    const clientId = userData?.meAppUser?.clientId;
    const membershipNumber = userData?.meAppUser?.membershipNumber;
    if (!clientId) {
      showMessage({
        message: "Link Error",
        description: "Credentials not match",
        type: 'danger',
        icon: 'danger'
      })
    }
    try {
      await linkBarcodeMutation({
        variables: {
          type: 'Member',
          id1: `${clientId}`,
          id2: `${membershipNumber}`,
        },
      });
      trackUserEvent(TrackingEventTypes?.barcode_added, {
        barcode_type: 'Member',
        data: {
          client_id: clientId,
          membership_number: membershipNumber,
        },
      });
      showMessage({
        message: "Link Success",
        description: 'Linked Successfully',
        type: 'success',
        icon: 'success'
      })
      navigation.navigate(Routes.MLINKCOMPSCREEN);
    } catch (err) {
      console.log("Error in linking membership", err)
      showMessage({
        message: "Link Error",
        description: err?.message || "Unable to link membership",
        type: 'danger',
        icon: 'danger'
      })
    }
  }
  const noticeText =
    'By adding your card to this app, it will deactivate your physical membership card. Should you wish to return to your physical membership card you may delete it from the app, however it will take up to 24 hours for your physical membership card to be reactivated. You are still bound by all the terms and conditions of Toronto Pan Am Sports Centre policies and procedures.';
  return (
    <ContainerBox>
      <AppText
        text={"Would you like to link your TPASC membership card to the app?"}
        style={{ textAlign: 'center' }}
        fontSize={metrics.s20}
      />
      <ButtonX
        title="Yes"
        isLoading={loading}
        isLoadingText={'Linking'}
        onPress={onLinkMembership}
        style={{ width: '100%', marginTop: metrics.s20 + metrics.s20 }}
      />
      <ButtonX
        title="Skip"
        onPress={() => navigation.navigate(Routes.ASKUTSCSTUDENTORSTAFF)}
        style={{ width: '100%', marginTop: metrics.s20 }}
      />

      <AppText
        text={`PLEASE NOTE:  ${noticeText}`}
        style={{ marginTop: metrics.s20 + metrics.s20, lineHeight: 16, fontFamily: Fonts.medium, }}
        fontSize={metrics.s12}
      />
    </ContainerBox>
  );
};

export default MembershipContractStatus;

