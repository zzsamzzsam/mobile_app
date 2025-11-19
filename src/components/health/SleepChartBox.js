import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
} from 'react-native';
// import { Text } from 'native-base';
import { BarChart, LineChart } from 'react-native-gifted-charts';
// import Text from '../../components/common/Text';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';
import SurfaceBox from '../common/SurfaceBox';
import ViewX from '../common/ViewX';
const stackData = [
    {
        stacks: [
            { value: 100, color: colors.primary },
            { value: 100, color: colors.secondary, marginBottom: 2 },
            { value: 100, color: colors.primaryVeryLight, marginBottom: 2 },
        ],
    },
];

const { width } = Dimensions.get('window');
const SleepChartBox = ({ s }) => {
    return <SurfaceBox>
        <View style={styles.top}>
            <Text style={{ fontWeight: 'bold', fontFamily: Fonts.bold, fontSize: 16 }}>SleepDate(mocked)</Text>
            {/* <Text style={{fontSize: 16, fontFamily: Fonts.bold, color: colors.gray}}> BPM</Text> */}
        </View>
        <View style={styles.container}>

            <View style={styles.left}>
                <View style={styles.leftInner}>
                    <Text style={{ fontFamily: Fonts.medium, fontSize: 14 }}>Max: 72</Text>
                    <Text style={{ fontSize: 14, fontFamily: Fonts.book, color: colors.gray }}>BPM</Text>
                </View>
                <View style={styles.leftInner}>
                    <Text style={{ fontFamily: Fonts.medium, fontSize: 14 }}>Latest: 72</Text>
                    <Text style={{ fontSize: 14, fontFamily: Fonts.book, color: colors.gray }}>BPM</Text>
                </View>
                <View style={styles.leftInner}>
                    <Text style={{ fontFamily: Fonts.medium, fontSize: 14 }}>Min 83</Text>
                    <Text style={{ fontSize: 14, fontFamily: Fonts.book, color: colors.gray }}>BPM</Text>
                </View>
            </View>
            <View
                style={styles.right}>
                <ViewX flexRow justifyContent="flex-end" alignItems="center" style={{ width: '100%' }}>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                        <View style={[styles.circle, { backgroundColor: colors.primary }]}></View>
                        <Text style={styles.clabel}>
                            Deep
                        </Text>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                        <View style={[styles.circle, { backgroundColor: colors.secondary }]}></View>
                        <Text style={styles.clabel}>
                            Light
                        </Text>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                        <View style={[styles.circle, { backgroundColor: colors.primaryVeryLight }]}></View>
                        <Text style={styles.clabel}>
                            Awake
                        </Text>
                    </View>
                </ViewX>
                <BarChart
                    horizontal
                    hideAxesAndRules
                    hideRules
                    hideYAxisText
                    // width={340}
                    height={100}
                    rotateLabel
                    // width={width * 0.58}
                    // height={1300}
                    // label={null}
                    hideLabel={true}
                    contentInset={{ top: 10, bottom: 10 }}
                    // intactTopLabel={false}
                    // rotateLabel
                    // barWidth={12}
                    // spacing={40}
                    // hideRules
                    labelWidth={0}
                    xAxisLabelsHeight={0}
                    xAxisLabelsWidth={0}
                    yAxisLabelWidth={0}
                    yAxisLabelHeight={0}
                    // xAxisLabelsVerticalShift={0}
                    hideVerticalGridLines={true} // Hide left axis and rules
                    // noOfSections={3}
                    endSpacing={0}
                    spacing={0}
                    barBorderRadius={6}
                    stackData={stackData}
                />
            </View>
        </View>
    </SurfaceBox>
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        // backgroundColor: 'green'
        // justifyContent: 'space-between'
    },
    top: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    left: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        // backgroundColor: 'red',
    },
    leftInner: {
        // flex: 1,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    right: {
        // backgroundColor: 'green',
        width: width * 0.60,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        height: 100,
        // justifyContent: 'flex-end'
    },
    circle: {
        width: 15,
        height: 15,
        borderRadius: 100,
    }
});

export default SleepChartBox;
