import { format } from 'date-fns';
import { useStoreState } from 'easy-peasy';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
} from 'react-native';
// import { Text } from 'native-base';
import { LineChart } from 'react-native-gifted-charts';
// import Text from '../../components/common/Text';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';
import SurfaceBox from '../common/SurfaceBox';
const { width } = Dimensions.get('window');

const HeartChartBox = ({ s }) => {
    const { appleHealth, synced } = useStoreState(state => state.health);
    return <SurfaceBox>
        <View style={styles.top}>
             <Text style={{fontWeight: 'bold', fontFamily: Fonts.bold, fontSize: 16}}>Heart Rate</Text>
                {/* <Text style={{fontSize: 16, fontFamily: Fonts.bold, color: colors.gray}}> BPM</Text> */}
            </View>
        <View style={styles.container}>
               
            <View style={styles.left}>
                <View style={styles.leftInner}>
                    <Text style={{fontFamily: Fonts.medium,fontSize: 14}}>Latest: {synced?.heart?.current || 'N/A'}</Text>
                    <Text style={{fontSize: 14, fontFamily: Fonts.book, color: colors.gray}}>BPM</Text>
                </View>
                <View style={styles.leftInner}>
                    <Text style={{fontFamily: Fonts.medium,fontSize: 14}}>Max: {synced?.heart?.max || 'N/A'}</Text>
                    <Text style={{fontSize: 14, fontFamily: Fonts.book, color: colors.gray}}>BPM</Text>
                </View>
                <View style={styles.leftInner}>
                    <Text style={{fontFamily: Fonts.medium,fontSize: 14}}>Min: {synced?.heart?.min || 'N/A'}</Text>
                    <Text style={{fontSize: 14, fontFamily: Fonts.book, color: colors.gray}}>BPM</Text>
                </View>
            </View>
            <View
                style={styles.right}>
                {!!synced?.heart?.history?.length && <LineChart
                    // areaChart
                    disableScroll
                    data={synced.heart.history}
                    // rotateLabel
                    color={colors.secondary}
                    curved
                    // xAxisLabel={{color: 'red'}}
                    //   xAxisLabelTexts={null}
                    width={width * 0.5}
                    hideYAxisText
                    adjustToWidth
                    // hideDataPoints
                    //   hideRules
                    height={100}
                    hideOrigin
                    // isAnimated
                    //   hideYAxisText
                    //   hideXAxisText
                    //   hideAxesAndRules
                    xAxisColor={false}
                    yAxisColor="transparent"
                    dataPointsRadius={3}
                    dataPointsColor={colors.secondary}
                    //   spacing={10}
                    //   verticalLinesSpacing={1}
                    thickness={2}
                    //   scrollToEnd
                    //   scrollAnimation
                    stepChart
                    // animateOnDataChange
                    // onDataChangeAnimationDuration={2000}
                    //   initialSpacing={40}
                    //   endSpacing={40}
                    maxValue={200}
                    dataPointLabelComponent={() => <Text>sdf</Text>}
                    pointerConfig={{
                        // pointerStripHeight: 160,
                        pointerStripColor: 'lightgray',
                        pointerStripWidth: 2,
                        pointerColor: 'lightgray',
                        radius: 6,
                        showPointerStrip: true,
                        // pointerLabelWidth: 100,
                        // pointerLabelHeight: 90,
                        // activatePointersOnLongPress: true,
                        autoAdjustPointerLabelPosition: true,
                        pointerLabelComponent: items => {
                            // return <Text>sdfsdf</Text>
                            return (
                                <View
                                    style={{
                                        height: 100,
                                        width: 100,
                                        justifyContent: 'center',
                                    }}>
                                    <View
                                        style={{
                                            paddingHorizontal: 14,
                                            paddingVertical: 6,
                                            borderRadius: 16,
                                            backgroundColor: 'white',
                                        }}>
                                        <Text style={{ fontWeight: 'bold', textAlign: 'center', color: colors.primary }}>
                                            {items[0].value}{"\n"}
                                            {format(new Date(items[0].date), 'MMM dd HH:mm')}
                                        </Text>
                                    </View>
                                </View>
                            );
                        },
                    }}
                />}
            </View>
        </View>
    </SurfaceBox>
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between'
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
        alignItems: 'flex-start'
    },
    leftInner: {
        // flex: 1,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    right: {
        width: width * 0.55,
        alignItems: 'flex-end',
        flexDirection: 'column',
        justifyContent: 'flex-end'
    }
});

export default HeartChartBox;
