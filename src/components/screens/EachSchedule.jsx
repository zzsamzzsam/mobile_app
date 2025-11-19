/* eslint-disable prettier/prettier */
import { Box } from 'native-base';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import moment from 'moment';
import metrics from '../../themes/Metrics';
import ScheduleItem from './ScheduleItem';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';

const EachSchedule = ({ data, index, upNextItemIndex, myschedule, leftBg }) => {

  const isActiveSchedule = useMemo(() => {
    return upNextItemIndex === index && moment(data[0].start_time).isSame(moment(), 'day') && moment() <= moment(data[0].start_time);
  }, [data, upNextItemIndex, index]);

  const _renderScheduleItem = ({ item, index: _innerIndex }) => {
    return (
      <ScheduleItem
        item={item}
        index={_innerIndex}
        isUpNext={isActiveSchedule}
        deleteIcon={!!myschedule}
        myschedule
      />
    );
  };
  return (
    <Box
      style={[styles.newsFeedContainer, { borderWidth: (isActiveSchedule) ? 2 : 0, borderColor: colors.green, shadowColor: (isActiveSchedule) ? colors.green : 'tansparent' }]}
      shadow="9"
    >
      <Box style={{ flex: 3 }}>
        <FlatList
          data={data}
          style={{ flex: 3 }}
          keyExtractor={(item, idx) => `${item?._id}-${idx}`}
          renderItem={_renderScheduleItem}
        />
      </Box>
    </Box >
  );
};

export default React.memo(EachSchedule);

const styles = StyleSheet.create({
  newsFeedContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    borderWidth: 10,
    borderColor: 'red',
  },
  feedTitle: {
    color: colors.primary,
    fontFamily: Fonts.bold,
    fontWeight: 700,
  },
  dateBox: {
    flex: 1,
    paddingTop: metrics.s20,
    paddingHorizontal: metrics.s5,
    alignItems: 'center',
  },
});
