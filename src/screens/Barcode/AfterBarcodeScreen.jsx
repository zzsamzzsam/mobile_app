/* eslint-disable prettier/prettier */
import { Box, ScrollView } from 'native-base';
import React from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import ButtonX from '../../components/common/BottonX';
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import AppText from '../../components/common/Text';
import Fonts from '../../themes/Fonts';
import { useMutation, useQuery } from '@apollo/client';
import { LINK_BARCODE } from '../../Apollo/Mutations';
import { GET_BARCODES, GET_ME_USER } from '../../Apollo/Queries';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import { trackUserEvent } from '../../utils';
import { TrackingEventTypes } from '../../constant';

const AfterBarcodeLink = () => {
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
        icon: 'danger',
      });
    }
    try {

      await linkBarcodeMutation({
        variables: {
          type: 'Member',
          id1: `${clientId}`,
          id2: `${membershipNumber}`,
        },
        refetchQueries: [{ query: GET_ME_USER }, { query: GET_BARCODES }]
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
        icon: 'success',
      });
    } catch (err) {
      console.log("Error in linking membership", err);
      showMessage({
        message: "Link Error",
        description: err?.message || "Unable to link membership",
        type: 'danger',
        icon: 'danger',
      });
    }
  };
  const noticeText =
    'By adding your card to this app, it will deactivate your physical membership card. Should you wish to return to your physical membership card you may delete it from the app, however it will take up to 24 hours for your physical membership card to be reactivated. You are still bound by all the terms and conditions of Toronto Pan Am Sports Centre policies and procedures.';
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <KeyboardAvoidingView>
        <AppText
          text="What card would you like to add?"
          style={[
            styles.heading,
            {
              marginBottom: metrics.s20,
            },
          ]}
        />{
          (userData?.meAppUser?.membershipContractStatus === 'Active' && !!userData?.meAppUser?.membershipType) && (
            <ButtonX
              title="TPASC Membership Card"
              isLoading={loading}
              isLoadingText="Linking"
              onPress={onLinkMembership}
              style={{ width: '100%', marginTop: metrics.s20 }}
            />
          )
        }
        <ButtonX
          title="U of T Student Card"
          onPress={() => navigation.navigate(Routes.LINKSTUDENTORSTAFFCARDFROMHOME, { fromHome: true })}
          style={{ width: '100%', marginTop: metrics.s20 }}
        />
        <ButtonX
          title="City of Toronto Keytag"
          onPress={() => navigation.navigate(Routes.LINKTAGNUMBERFROMHOME, { type: "City", fromHome: true })}
          style={{ width: '100%', marginTop: metrics.s20 }}
        />
        <ButtonX
          title="Walking Track Keytag"
          onPress={() => navigation.navigate(Routes.LINKTAGNUMBERFROMHOME, { type: "Track_Walker", fromHome: true })}
          style={{ width: '100%', marginTop: metrics.s20 }}
        />
        <Box>
          <AppText
            text={`PLEASE NOTE:  ${noticeText}`}
            style={{ marginTop: metrics.s20 + metrics.s20, lineHeight: 16, fontFamily: Fonts.medium }}
            fontSize={metrics.s12}
          />
        </Box>
      </KeyboardAvoidingView>
    </ScrollView >
  );
};

export default AfterBarcodeLink;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: metrics.s20,
    backgroundColor: colors.white
  },
  heading: {
    textAlign: 'center',
    fontSize: metrics.s20,
    fontFamily: Fonts.book,
    lineHeight: 24,
  },
});
