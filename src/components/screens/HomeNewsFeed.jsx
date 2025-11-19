/* eslint-disable prettier/prettier */
import { Box, Divider, ScrollView } from 'native-base';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import SingleNewsItem from '../SingleNewsItem';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import { useQuery } from '@apollo/client';
import { GET_NEWS } from '../../Apollo/Queries';
import AppText from '../common/Text';
import Fonts from '../../themes/Fonts';

const HomeNewsFeed = ({ showNewsCount, loading }) => {

  const { data } = useQuery(GET_NEWS, {
    variables: {
      upcoming: false,
      limit: 50,
      page: 1,
    },
  });

  // const upcomingNews = useMemo(() => {
  //   return data?.news?.items?.filter(item => new Date(item?.start_time) > new Date());
  // }, [data?.news?.items]);

  return (
    <Box>
      {
        data?.news?.items?.length > 0 && (
          <AppText
            text="News"
            style={[styles.bold, { color: colors.primary, marginLeft: 20, paddingVertical: 10 }]}
          />
        )
      }
      <Box style={styles.newsFeedContainer}>
        <ScrollView
          nestedScrollEnabled={true}
          scrollEventThrottle={50}
        >
          {data?.news?.items && data?.news?.items?.slice(0, showNewsCount).map((single, idx) => {
            const showMore = idx === data?.news?.items?.slice(0, showNewsCount).length - 1;
            return (
              <Box key={single?.news_id}>
                <SingleNewsItem item={single} />
                {!showMore && <Divider style={styles.separator} />}
              </Box>
            )
          })}
        </ScrollView>
        {
          (loading) && <Box style={styles.footer}>
            <TouchableOpacity >
              <ActivityIndicator color={colors.secondary} size={24} />
            </TouchableOpacity>
          </Box>
        }
      </Box>
    </Box>
  );

};

export default HomeNewsFeed;

const styles = StyleSheet.create({
  newsFeedContainer: {
    marginHorizontal: metrics.s20,
    backgroundColor: colors.white,
    marginBottom: metrics.s10,
  },
  separator: {
    height: 10,
    backgroundColor: colors.homeBg,
  },
  footer: {
    backgroundColor: colors.homeBg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  bold: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    fontWeight: 700,
  },
});
