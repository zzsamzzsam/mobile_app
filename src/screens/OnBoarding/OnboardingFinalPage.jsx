/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import ButtonX from '../../components/common/BottonX';
import AppText from '../../components/common/Text';
import metrics from '../../themes/Metrics';

import { useMutation, useQuery } from '@apollo/client';
import { GET_ME_USER } from '../../Apollo/Queries';
import { StyleSheet } from 'react-native';
import { Box, Image } from 'native-base';
import colors from '../../themes/Colors';
import { useStoreActions } from 'easy-peasy';
import { APP_STATE } from '../../Store/Models/App';
import { UPDATE_APP_BOAEDED } from '../../Apollo/Mutations';
import { trackUserEvent } from '../../utils';
import { TrackingEventTypes } from '../../constant';

const OnboardingFinalPage = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const { data: userData } = useQuery(GET_ME_USER);
    const { setAppState } = useStoreActions(action => ({
        setAppState: action.app.setAppState,
    }));
    const [updateAppBoardedMutation] = useMutation(UPDATE_APP_BOAEDED);
    const finishAndGoHome = async () => {
        setLoading(true);
        await updateAppBoardedMutation({
            refetchQueries: [{ query: GET_ME_USER }],
        });
        trackUserEvent(TrackingEventTypes?.onboarding_finish, {
            message: 'User onboarding finish',
        });
        setAppState(APP_STATE.HOME);
        navigation.navigate(Routes.MAINSTACK);
        setLoading(false);
    };


    return (
        <Box style={styles.container}>
            <Image
                style={{ height: '30%' }}
                resizeMode="contain"
                source={require('../../public/basketball_last.gif')}
                alt="Logo"
            />
            <AppText
                text={"Thank you, your app is all set up now."}
                fontSize={metrics.s20}
                style={{ marginTop: metrics.s20 + metrics.s20, textAlign: 'center' }}
            />
            <ButtonX
                title="Finish"
                onPress={finishAndGoHome}
                isLoading={loading}
                isLoadingText={'Finishing'}
                style={{ width: '100%', marginTop: metrics.s20 }}
            />

        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: metrics.s20,
        paddingVertical: metrics.s10,
    }
})
export default OnboardingFinalPage;

