/* eslint-disable prettier/prettier */
import { Box, Divider, FlatList, Link, Text } from 'native-base'
import React, { useCallback } from 'react';
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import AppText from '../../components/common/Text';
import { ScheduleAudienceTag } from '../../components/Schedule/ScheduleAudienceTags';
import { AudienceToTag } from '../../utils';
import { Linking, StyleSheet } from 'react-native';
import Fonts from '../../themes/Fonts';

// const data = [
//   {
//     id: 1,
//     name: 'Toronto Pan Am Sports Centre Member',
//     color: '#4EC3E0',
//     price: 'Included with TPASC & UTSC Membership or TPASC Day Pass Purchase',
//     schedule: 'TPASC Membership card syncd and active membership',
//   },
//   {
//     id: 5,
//     name: 'City of Toronto',
//     color: '#004b85',
//     price:
//       'Included with Fitness TO, Registered Programs, or Drop-In Memberships. Please check here for specific access -https://www.tpasc.ca/access',
//     schedule: 'City of Toronto Keytag connected',
//   },
//   {
//     id: 2,
//     name: 'U of T Scarborough',
//     color: '#002453',
//     price:
//       'Only available for University of Toronto students. Additional fees may apply',
//     schedule: 'U of T card Connected',
//   },
// ];

const LegendScreen = () => {

  const _itemSeperatorComp = useCallback(() => {
    return <Divider style={{ paddingVertical: 5, backgroundColor: 'transparent' }} />;
  }, []);
  return (
    <Box style={{ flex: 1, padding: 10 }}>
      <Box style={styles.itemWrapper}>
        <Box style={styles.tagWrapper}>
          <ScheduleAudienceTag audience="Toronto Pan Am Sports Centre Member" />
        </Box>
        <Box>
          <AppText color={colors.dark} style={{ lineHeight: 18, fontSize: 15 }}>
            Included with TPASC & UTSC Membership or TPASC Day Pass Purchase
          </AppText>
        </Box>
      </Box>
      <Divider />
      <Box style={styles.itemWrapper}>
        <Box style={styles.tagWrapper}>
          <ScheduleAudienceTag audience="City of Toronto" />
        </Box>
        <Box>
          <AppText color={colors.dark} style={{ lineHeight: 18, fontSize: 15 }}>
            Included with Fitness TO, Registered Programs, or Drop-In
            Memberships. Please check{' '}
            <Link
              href="https://www.tpasc.ca/access"
              style={{ lineHeight: 18, fontSize: 15, }}
              color={colors.dark}
              _text={{ color: 'red' }}
            >
              here
            </Link>{' '}
            for specific access
          </AppText>
        </Box>
      </Box>
      <Divider />
      <Box style={styles.itemWrapper}>
        <Box style={styles.tagWrapper}>
          <ScheduleAudienceTag audience="U of T Scarborough" />
        </Box>
        <Box>
          <AppText color={colors.dark} style={{ lineHeight: 18, fontSize: 15 }}>
            Only available for University of Toronto students. Additional fees
            may apply
          </AppText>
        </Box>
      </Box>
    </Box >
  );
}

export default LegendScreen

const styles = StyleSheet.create({
  itemWrapper: {
    // flex: 1,
    //   flexDirection: 'row',
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  tagWrapper: {
    // flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  linkStyle: {
    fontFamily: Fonts.bold,
    fontWeight: 700,
  },
});