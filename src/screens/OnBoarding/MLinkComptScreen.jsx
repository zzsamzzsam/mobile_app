/* eslint-disable prettier/prettier */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import Routes from '../../navigation/Routes';
import metrics from '../../themes/Metrics';
import ButtonX from '../../components/common/BottonX';
import AppText from '../../components/common/Text';
import ContainerBox from '../../components/common/CenterX';
import AccrodianList from '../../components/common/AccrodianList';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Fonts from '../../themes/Fonts';
import colors from '../../themes/Colors';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Box } from 'native-base';


const CheckBoxMarkedIcon = ({ size = 14 }) => {
    return <Icons name="checkbox-marked-outline" color={colors.primary} size={size} />
}
const CheckBoxUnmarkedIcon = ({ size = 14 }) => {
    return (
        <Icons name="checkbox-blank-outline" color={colors.primary} size={size} />
    );
};

const MLinkComptScreen = () => {
    const navigation = useNavigation();
    const { showAllowedScheduleByBarcode } = useStoreState(state => ({
        showAllowedScheduleByBarcode: state.schedule.showAllowedScheduleByBarcode,
    }));
    const { setShowAllowedScheduleByBarcode } = useStoreActions(action => ({
        setShowAllowedScheduleByBarcode: action.schedule.setShowAllowedScheduleByBarcode,
    }))
    return (
        <ContainerBox>
            <AppText
                text={"Your barcode has been added and your physical membership card has been deactivated."}
                style={styles.heading}
            />
            <Box style={{ marginTop: 20 }}>
                <AccrodianList
                    id="5"
                    zeroMt
                    titleStyle={{ color: colors.primary, fontFamily: Fonts.book }}
                    onPress={() => {
                        setShowAllowedScheduleByBarcode(!showAllowedScheduleByBarcode)
                    }}
                    titleNumberOfLines={5}
                    // rippleColor={colors.secondary}
                    style={{ backgroundColor: colors.homeBg, paddingVertical: metrics.s5, }}
                    title="Only show schedule that is allowed by my membership"
                    left={props => <Icons {...props} name="filter" color={colors.primary} size={20} />}
                    // right={(props) => <FontAwesome {...props} name="chevron-right" color={colors.primary} size={14} />}
                    right={() => showAllowedScheduleByBarcode ? <CheckBoxMarkedIcon size={20} /> : <CheckBoxUnmarkedIcon size={20} />}
                />
            </Box>
            <ButtonX
                title="Next"
                onPress={() => navigation.navigate(Routes.ASKUTSCSTUDENTORSTAFF)}
                style={{ width: '100%', marginTop: metrics.s20 + metrics.s20 }}
            />

        </ContainerBox >
    );
};

export default MLinkComptScreen;

const styles = StyleSheet.create({
    heading: {
        textAlign: 'center',
        fontSize: metrics.s20,
    },
});
