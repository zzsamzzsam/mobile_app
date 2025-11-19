/* eslint-disable prettier/prettier */
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import Routes from '../../navigation/Routes';
import ButtonX from '../../components/common/BottonX';
import AppText from '../../components/common/Text';
import metrics from '../../themes/Metrics';
import ContainerBox from '../../components/common/CenterX';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BARCODES, GET_ME_USER } from '../../Apollo/Queries';
import { LINK_BARCODE } from '../../Apollo/Mutations';
import Fonts from '../../themes/Fonts';
import { trackUserEvent } from '../../utils';
import { TrackingEventTypes } from '../../constant';

const LinkStudentCardScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { data, type } = route.params;
    const { data: userData } = useQuery(GET_ME_USER);
    const [linkBarcodeMutation, { loading }] = useMutation(LINK_BARCODE);

    const onLinkStudentCard = async () => {
        const clientId = userData?.meAppUser?.clientId;
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
                    type: 'Student',
                    id1: `${data.id1}`,
                    id2: `${data.id2}`,
                },
                refetchQueries: [{ query: GET_BARCODES }]
            });
            trackUserEvent(TrackingEventTypes?.barcode_added, {
                barcode_type: 'Student',
                data,
            });
            showMessage({
                message: "Link Success",
                description: 'Linked Successfully',
                type: 'success',
                icon: 'success',
            });
            navigation.navigate(Routes.ASKTCITYORWALKING);
        } catch (err) {
            console.log("Error in linking membership", err)
            showMessage({
                message: "Link Error",
                description: err?.message || "Unable to link membership",
                type: 'danger',
                icon: 'danger',
            });
        }
    };
    const noticeText =
        'By adding your T-Card to this app, it will deactivate your T-Card for entry in to TPASC. Should you wish to return to your physical T-Card you may delete it from the app, however it will take up to 24 hours for your physical T-Card to be reactivated. You are still bound by all of the terms and conditions of the Toronto Pan Am Sports Centre policies and procedures as well as the Student Code of Conduct. ';
    return (
        <ContainerBox>
            <AppText
                text={"Would you like to add your T-Card to the app?"}
                style={{ textAlign: 'center' }}
                fontSize={metrics.s20}
            />
            <ButtonX
                title="Yes"
                isLoading={loading}
                isLoadingText={'Linking'}
                onPress={onLinkStudentCard}
                style={{ width: '100%', marginTop: metrics.s20 + metrics.s20 }}
            />
            <ButtonX
                title="Skip"
                onPress={() => navigation.navigate(Routes.ASKTCITYORWALKING)}
                style={{ width: '100%', marginTop: metrics.s20 }}
            />

            <AppText
                text={`PLEASE NOTE:  ${noticeText}`}
                style={{ marginTop: metrics.s20 + metrics.s20, lineHeight: 16, fontFamily: Fonts.medium }}
                fontSize={metrics.s12}
            />
        </ContainerBox>
    );
};

export default LinkStudentCardScreen;

