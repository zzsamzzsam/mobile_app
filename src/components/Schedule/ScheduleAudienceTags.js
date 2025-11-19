import {Box} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import Fonts from '../../themes/Fonts';
import {AudienceToColor, AudienceToTag} from '../../utils';
import AppText from '../common/Text';

export const ScheduleAudienceTag = ({audience}) => {
  return (
    <Box
      key={audience}
      style={[
        styles.audienceTag,
        {
          backgroundColor: AudienceToColor(audience),
        },
      ]}>
      <AppText bold fontSize={12} style={styles.audienceTagText}>
        {AudienceToTag(audience)}
      </AppText>
    </Box>
  );
};
const ScheduleAudienceTags = ({schedule = {}}) => {
  return (
    <Box style={{flexDirection: 'row'}}>
      {/* {(!schedule.audiences ||
        schedule.audiences.length === 3 ||
        schedule.audiences.length === 0) && (
        <ScheduleAudienceTag audience="All" />
      )} */}
      {schedule.audiences &&
        schedule.audiences.map(audience => (
          <ScheduleAudienceTag key={audience} audience={audience} />
        ))}
    </Box>
  );
};

const styles = StyleSheet.create({
  audienceTag: {
    justifyContent: 'center',
    alignItems: 'center',
    // width: 20,
    // height: 20,
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  audienceTagText: {
    color: 'white',
    fontFamily: Fonts.bold,
    fontWeight: 700,
    lineHeight: 13,
    // backgroundColor: 'red',
  },
});

export default ScheduleAudienceTags;
