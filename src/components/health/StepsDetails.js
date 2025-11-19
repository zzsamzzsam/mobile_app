import React, { useEffect, useState } from 'react';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import AppleHealthKit from 'react-native-health';
import { Platform, Dimensions, View } from 'react-native';
// import {
//   initialize as initializeAndroidHealth,
//   requestPermission as requestPermissionAndroid,
//   readRecords,
//   getSdkStatus,
//   openHealthConnectSettings,
//   openHealthConnectDataManagement,
//   aggregateRecord,
// } from 'react-native-health-connect';
import { SegmentedButtons } from 'react-native-paper';
import colors from '../../themes/Colors';
import ModalX from '../common/Modal';
import AppText from '../common/Text';
import { format, startOfDay, subMonths, subWeeks, subYears } from 'date-fns';
import { formatNumberK } from '../../utils/utils';

const windowWidth = Dimensions.get('window').width;
const modalWidth = windowWidth - 20;
function calculateMonthlyAverages(data) {
  try {
    const monthlyAverages = {};

    // Group data by month
    data.forEach(({ startDate, value }) => {
      const monthKey = new Date(startDate).toISOString().slice(0, 7); // Extract year-month key
      if (!monthlyAverages[monthKey]) {
        monthlyAverages[monthKey] = { total: 0, count: 0, label: format(new Date(startDate), 'MMM') };
      }
      monthlyAverages[monthKey].total += value;
      monthlyAverages[monthKey].count++;
    });

    // Calculate averages
    const averages = [];
    for (const monthKey in monthlyAverages) {
      const { total, count, label } = monthlyAverages[monthKey];
      const value = total / count;
      averages.push({ month: monthKey, value, label, pointerLabel: `${monthKey.split('-')[0]} ${label}` });
    }

    return averages;
  } catch (e) {
    console.log('error month average');
    return data;
  }
}
const fillMissingSequenceValues = (data) => {
  try {
    const result = [];
    let prevSeq = null;

    for (const item of data) {
      if (prevSeq !== null && parseInt(item.seq) - parseInt(prevSeq) > 1) {
        const missingSeqCount = parseInt(item.seq) - parseInt(prevSeq) - 1;
        for (let i = 1; i <= missingSeqCount; i++) {
          result.push({
            endDate: null,
            label: (parseInt(prevSeq) + i).toString().padStart(2, '0'),
            seq: (parseInt(prevSeq) + i).toString().padStart(2, '0'),
            startDate: null,
            value: 0
          });
        }
      }
      result.push(item);
      prevSeq = item.seq;
    }
    return result;
  } catch (e) {
    console.log('error filling===', e);
    return data;
  }
}
function StepDetails({ showStepDetails, setShowSetStepDetails }) {
  if(Platform.OS === 'android') {
    return null;
  }
  // Extracting data points from the input data
  const [stepsData, setStepsData] = useState([]);
  const [showChart, setShowChart] = useState(true);
  const [period, setPeriod] = useState("day");
  const [barMetrics, setBarMetrics] = useState({
    barWidth: 10,
    spacing: 2,
    for: 'day',
  })
  useEffect(() => {
    if (!showChart) {
      setShowChart(true);
    }
  }, [showChart])
  useEffect(() => {
    setShowChart(false);
  }, [stepsData]);
  useEffect(() => {
    fetchSteps(period);
  }, [])
  const fetchSteps = async (_for = "day") => {
    const currentDate = new Date();

    const _startOfDay = startOfDay(currentDate);
    const periodMap = {
      "day": { start: _startOfDay, period: 60, bars: 24, spacing: 10, format: 'h a', maxValue: 1000 },
      "week": { start: subWeeks(_startOfDay, 1), period: 1440, bars: 10, spacing: 5, format: 'EEE', internalFormat: "d", maxValue: 10000 },
      "month": { start: subMonths(_startOfDay, 1), period: 1440, bars: 40, spacing: 2, format: 'dd', maxValue: 10000 },
      "year": { start: subYears(_startOfDay, 1), period: 1000, bars: 16, spacing: 2, format: 'MMM', internalFormat: "MM", maxValue: 10000 },
    }
    const periodEl = periodMap[_for];
    if (!periodEl) {
      console.log('invalid periodmap');
      return;
    }
    setBarMetrics({
      ...barMetrics,
      show: false,
    })
    const barWidth = (modalWidth - (periodEl.bars - 1) * periodEl.spacing) / periodEl.bars;
    let maxValueFromItems = 0;
    try {
      if (Platform.OS === 'ios') {
        AppleHealthKit.getDailyStepCountSamples(
          {
            startDate: periodMap[_for].start.toISOString(),
            endDate: new Date().toISOString(),
            period: periodMap[_for].period,
          }, (error, results) => {
            // console.log('error is', error);
            // console.log('results are', results);
            if (!error && results) {
              let finalData = [];
              if (_for === 'year') {
                const averages = calculateMonthlyAverages(results.reverse());
                // console.log('average====', averages);
                finalData = averages;
              } else {
                const parsed = results.reverse().map(s => {
                  let fDate = format(new Date(s.startDate), periodEl.format);
                  // let seq = format(new Date(s.startDate), periodEl.internalFormat || periodEl.format);
                  if (_for === 'year') {
                    fDate = `${fDate}`.charAt(0);
                  }
                  s.seq = fDate;
                  s.label = fDate;
                  return s;
                });
                const filled = fillMissingSequenceValues(parsed, _for);
                finalData = filled;
              }
              let labelC = 0;
              finalData = finalData.map(s => {
                if (s.value) {
                  s.pointerClickable = true;
                }
                if (labelC === 0 && !!s.value) {
                  labelC++;
                } else if (!s.value) {
                  s.label = '';
                  labelC++;
                } else {
                  s.label = '';
                  labelC++;
                }
                if (labelC >= 4) {
                  labelC = 0;
                }
                // console.log('comparing', s?.value, maxValueFromItems);
                if (s.value && s.value > maxValueFromItems) {
                  maxValueFromItems = s.value;
                }
                return s;
              })
              // console.log('setting', parsed);
              // console.log('final', finalData);
              setStepsData(finalData);
              setBarMetrics({
                ...barMetrics,
                barWidth,
                for: _for,
                start: periodEl.start.toISOString(),
                end: new Date().toISOString(),
                spacing: periodEl?.spacing || 0,
                maxValue: Math.ceil((maxValueFromItems || periodEl.maxValue || 0) / 1000) * 1000,
                show: true,
              })
            }
            // console.log('ako max=======', maxValueFromItems);
          });
      } else {
        // let results = await readRecords('Steps', {
        //   ascendingOrder: true,
        //   timeRangeFilter: {
        //     operator: 'between',
        //     startTime: _startOfDay.toISOString(),
        //     endTime: currentDate.toISOString(),
        //   },
        // });
        // // console.log('results===', results.length)
        // if (results && results.length) {
        //   results = results.map(s => {
        //     return {
        //       startDate: s.startTime,
        //       endDate: s.endTime,
        //       value: s.count,
        //     }
        //   })
        //   let finalData = [];
        //   if (_for === 'year') {

        //     const averages = calculateMonthlyAverages(results);
        //     // console.log('average====', averages);
        //     finalData = averages;
        //   } else {
        //     const parsed = results.map(s => {
        //       let fDate = format(new Date(s.startDate), periodEl.format);
        //       // let seq = format(new Date(s.startDate), periodEl.internalFormat || periodEl.format);
        //       if (_for === 'year') {
        //         fDate = `${fDate}`.charAt(0);
        //       }
        //       s.seq = fDate;
        //       s.label = fDate;
        //       return s;
        //     });
        //     const filled = fillMissingSequenceValues(parsed, _for);
        //     finalData = filled;
        //   }
        //   let labelC = 0;
        //   finalData = finalData.map(s => {
        //     if (s.value) {
        //       s.pointerClickable = true;
        //     }
        //     if (labelC === 0 && !!s.value) {
        //       labelC++;
        //     } else if (!s.value) {
        //       s.label = '';
        //       labelC++;
        //     } else {
        //       s.label = '';
        //       labelC++;
        //     }
        //     if (labelC >= 4) {
        //       labelC = 0;
        //     }
        //     if (s.value && s.value > maxValueFromItems) {
        //       maxValueFromItems = s.value;
        //     }
        //     if(_for === 'month') {
        //       s.label = '';
        //     }
        //     return s;
        //   })
        //   // console.log('setting', parsed);
        //   // console.log('final', finalData);
        //   setBarMetrics({
        //     ...barMetrics,
        //     barWidth,
        //     for: _for,
        //     start: periodEl.start.toISOString(),
        //     end: new Date().toISOString(),
        //     spacing: periodEl?.spacing || 0,
        //     maxValue: Math.ceil((maxValueFromItems || periodEl.maxValue || 0) / 1000) * 1000,
        //     show: true,
        //   })
        //   setStepsData(finalData);
        // }
        // console.log('ako max=======', maxValueFromItems);
        // setBarMetrics({
        //   ...barMetrics,
        //   barWidth,
        //   for: _for,
        //   spacing: periodEl?.spacing || 0,
        //   maxValue: Math.ceil((maxValueFromItems || periodEl.maxValue || 0) / 1000) * 1000,
        // })
      }
    } catch (e) {
      console.log('error===', e);
    }
  }
  return (
    <ModalX
      visible={showStepDetails}
      hideCross
      onDismiss={() => { setShowSetStepDetails(false) }}
      // height="auto"
      width={modalWidth}
      title={''}>
      {Platform.OS === 'ios' && <SegmentedButtons
        style={{ marginBottom: 30 }}
        density="high"
        value={period}
        theme={{
          colors: {
            primary: 'green',
            secondaryContainer: colors.primary,
            onSecondaryContainer: colors.white,
          },
        }}
        onValueChange={(v) => {
          setPeriod(v)
          fetchSteps(v);
        }}
        buttons={[
          {
            value: "day",
            labelStyle: { fontSize: 14 },
            label: "D",
          },
          {
            value: "week",
            labelStyle: { fontSize: 14 },
            label: "W",
          },
          {
            value: "month",
            labelStyle: { fontSize: 14 },
            label: "M",
          },
          {
            value: "year",
            labelStyle: { fontSize: 14 },
            label: "Y",
          },
        ]}
      />}
       <AppText
          text={period === 'year' ? 'Average Monthly steps' : `Steps`}
          bold
          style={{textAlign: 'center'}}
        />
        {!!barMetrics?.start &&<AppText
          bold
          style={{textAlign: 'center'}}
        >{format(barMetrics.start, barMetrics?.for === 'day' ? 'hh:mm a' : 'yyyy MMM dd')} to {format(barMetrics.end, barMetrics?.for === 'day' ? 'hh:mm a' : 'yyyy MMM dd')}</AppText>}
      {showChart && period !== 'month' && <BarChart
        // referenceLinesOverChartContent={false}
        barWidth={barMetrics?.barWidth}
        noOfSections={4}
        formatYLabel={(x) => {
          // console.log('tur');
          return formatNumberK(x)
        }}
        // showVerticalLines
        // noOfVerticalLines={10}
        // verticalLinesSpacing={50}
        // showFractionalValue
        // showReferenceLine1
        width={modalWidth}
        verticalLinesThickness={3}
        verticalLinesStrokeDashArray={[6, 8]}
        // verticalLinesColor={'gray'}
        frontColor={colors.secondary}
        maxValue={barMetrics?.maxValue || 10000}
        height={250}
        // stepHeight
        // isAnimated
        // autoShiftLabels
        // rotateLabel={true}
        // xAxisTextNumberOfLines={2}
        labelWidth={40}
        scrollToEnd
        // isAnimated
        // isThreeD
        // showYAxisIndices
        // barBorderRadius={4}
        spacing={barMetrics?.spacing}
        data={stepsData || []}
        yAxisThickness={0}
        xAxisThickness={0}
        // getPointerProps={(s) => {
        //   console.log('ayo hai',s)
        // }}
        // onPress={(a,b) => {
        //   console.log('pressed', a, b);
        // }}
        pointerConfig={{
          resetPointerOnDataChange: true,
          persistPointer: true,
          autoAdjustPointerLabelPosition: true,
          // initialPointerIndex: 0,
          // stripBehindBars: true,
          showPointerStrip: false,
          pointerLabelWidth: 100,
          pointerLabelHeight: 100,
          pointerColor: colors.primary,
          // pointerEvents: 'auto',
          // pointerStripUptoDataPoint: true,
          pointerLabelComponent: (item, a, b) => {
            // console.log('===', item, a, b)
            if (item?.[0]?.value) {
              return (
                <View
                  style={{
                    zIndex: 10000,
                    height: 100,
                    width: 100,
                    // top: 200,
                    backgroundColor: colors.gray,
                    borderRadius: 4,
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // flex: 1,
                    // paddingLeft:16,
                    padding: 5
                  }}>
                  <AppText fontSize={12} bold>{Number(item[0].value).toFixed(0)} Steps</AppText>
                  {!!item[0].startDate && <AppText fontSize={12}>{format(new Date(item[0].startDate), 'yyyy MMM dd')}</AppText>}
                  {!!item?.[0]?.pointerLabel && <AppText fontSize={12}>{item[0].pointerLabel}</AppText>}
                  {barMetrics?.for === 'day' && item[0].startDate && <AppText fontSize={10}>{format(new Date(item[0].startDate), 'h a')} - {format(new Date(item[0].endDate), 'h a')}</AppText>}
                </View>
              );
            }
            return null;

          },
        }}
        // adjustToWidth
        endSpacing={90}
      />}
       {showChart && period === 'month' && <LineChart
        areaChart
        noOfSections={4}
        formatYLabel={(x) => {
          // console.log('tur');
          return formatNumberK(x)
        }}
        width={modalWidth - 50}
        verticalLinesThickness={3}
        verticalLinesStrokeDashArray={[6, 8]}
        // verticalLinesColor={'gray'}
        frontColor={colors.secondary}
        maxValue={barMetrics?.maxValue || 10000}
        height={250}
        startFillColor={colors.primary}
        startOpacity={0.8}
        endFillColor={colors.secondary}
        curved
        dataPointsColor={colors.primary}
        color={colors.secondary}
        xAxisTextNumberOfLines={2}
        // stepHeight
        // isAnimated
        // autoShiftLabels
        // rotateLabel={true}
        // xAxisTextNumberOfLines={2}
        // labelWidth={1}
        // scrollToEnd
        adjustToWidth
        disableScroll={false}
        // isAnimated
        // isThreeD
        // showYAxisIndices
        // barBorderRadius={4}
        // spacing={barMetrics?.spacing}
        data={stepsData || []}
        yAxisThickness={0}
        xAxisThickness={0}
        // getPointerProps={(s) => {
        //   console.log('ayo hai',s)
        // }}
        // onPress={(a,b) => {
        //   console.log('pressed', a, b);
        // }}
        spacing={10}
        pointerConfig={{
          resetPointerOnDataChange: true,
          persistPointer: true,
          autoAdjustPointerLabelPosition: true,
          // initialPointerIndex: 0,
          // stripBehindBars: true,
          showPointerStrip: false,
          pointerLabelWidth: 100,
          pointerLabelHeight: 100,
          pointerColor: colors.primary,
          // pointerEvents: 'auto',
          // pointerStripUptoDataPoint: true,
          pointerLabelComponent: (item, a, b) => {
            // console.log('===', item, a, b)
            if (item?.[0]?.value) {
              return (
                <View
                  style={{
                    zIndex: 10000,
                    height: 100,
                    width: 100,
                    // top: 200,
                    backgroundColor: colors.gray,
                    borderRadius: 4,
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // flex: 1,
                    // paddingLeft:16,
                    padding: 5
                  }}>
                  <AppText fontSize={12} bold>{Number(item[0].value).toFixed(0)} Steps</AppText>
                  {!!item[0].startDate && <AppText fontSize={12}>{format(new Date(item[0].startDate), 'yyyy MMM dd')}</AppText>}
                  {!!item?.[0]?.pointerLabel && <AppText fontSize={12}>{item[0].pointerLabel}</AppText>}
                  {barMetrics?.for === 'day' && item[0].startDate && <AppText fontSize={10}>{format(new Date(item[0].startDate), 'h a')} - {format(new Date(item[0].endDate), 'h a')}</AppText>}
                </View>
              );
            }
            return null;

          },
        }}
        // adjustToWidth={false}
        // endSpacing={100}
        // spacing={10}
      />}
    </ModalX>
  );
}

export default StepDetails;