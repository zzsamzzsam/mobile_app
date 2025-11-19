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

const UpdateUserScreen = () => {
    const navigation = useNavigation();
    const [value, setValue] = React.useState('male');
    const { data: userData } = useQuery(GET_ME_USER);
    const [updateEzUser, { error: updateUserError }] = useMutation(UPDATE_EZ_USER);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValue(userData?.meAppUser?.gender);
    }, []);

    const navigationToNext = () => {
        const linkMembership = userData?.meAppUser?.membershipContractStatus === 'Active' && !!userData?.meAppUser?.membershipType;
        if (linkMembership) {
            navigation.navigate(Routes.MEMBERSHIPCONTRACT);
        } else {
            navigation.navigate(Routes.ASKUTSCSTUDENTORSTAFF)
        }
    };

    const updateUserAction = async () => {
        try {
            setLoading(true);
            await updateEzUser({
                variables: {
                    input: {
                        gender: value,
                    },
                },
                refetchQueries: [{ query: GET_ME_USER }],
            });
            const linkMembership = userData?.meAppUser?.membershipContractStatus === 'Active' && !!userData?.meAppUser?.membershipType;
            if (linkMembership) {
                navigation.navigate(Routes.MEMBERSHIPCONTRACT);
            } else {
                navigation.navigate(Routes.ASKUTSCSTUDENTORSTAFF)
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            showMessage({
                message: "Error",
                description: updateUserError?.message || "Error On Update User",
                type: 'danger',
                icon: 'danger',
            })
            console.log("Error on update user");
        }
    };

    return (
        <Box style={styles.container}>
             <Image
                style={{height: '30%'}}
                resizeMode="contain"
                source={require('../../public/oldman_treadmill.gif')}
                alt="Logo"
                />
            <AppText
                text={"Select your gender"}
                fontSize={metrics.s20}
            />
            <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={value} onChange={nextValue => {
                setValue(nextValue);
            }}>
                <Radio shadow={2} value="male" my="2" colorScheme='darkBlue' >
                    Male
                </Radio>
                <Radio shadow={2} value="female" my="2" colorScheme='darkBlue' >
                    Female
                </Radio>
                <Radio shadow={2} value="unspecified" my="2" colorScheme='darkBlue' >
                    Prefer not to say
                </Radio>
            </Radio.Group>
            <ButtonX
                title="Update"
                isLoading={loading}
                isLoadingText="Updating"
                onPress={updateUserAction}
                style={{ width: '100%', marginTop: metrics.s20 }}
            />
            {
                userData?.meAppUser?.gender !== 'unspecified' && <ButtonX
                    title="Skip"
                    onPress={() => navigationToNext()}
                    style={{ width: '100%', marginTop: metrics.s20 }}
                />
            }

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
export default UpdateUserScreen;

