/* eslint-disable prettier/prettier */
import { Box, Divider } from 'native-base';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import SmallFeedBox from '../SmallFeedBox';
import SmallFeedBoxSkeleton from '../SmallFeedBoxSkeleton';
import colors from '../../themes/Colors';
import AppText from '../common/Text';
import metrics from '../../themes/Metrics';
import EmptyBox from '../common/EmptyBox';
import { useQuery } from '@apollo/client';
import { GET_EVENTS } from '../../Apollo/Queries';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import Fonts from '../../themes/Fonts';


const Events = ({setHasEvent}) => {
  const navigation = useNavigation();

  const { data, loading, error } = useQuery(GET_EVENTS, {
    variables: {
      upcoming: true,
      limit: 10,
      page: 1,
    },
  });

  const upcomingEvents = useMemo(() => {
    return data?.events?.items?.filter(item => new Date(item?.end_time) > new Date());
  }, [data?.events?.items]);

  useEffect(() => {
    const _hasEvent = data?.events?.items?.find(
      item =>
        new Date(item?.start_time) <= new Date() &&
        new Date(item?.end_time) >= new Date(),
    );
    setHasEvent(_hasEvent);
  }, [upcomingEvents])
  const _renderEventSkeleton = useCallback(({ item }) => {
    return <SmallFeedBoxSkeleton />;
  }, []);

  const ItemSeparator = useCallback(({ orientation }) => {
    return (
      <Divider
        orientation={orientation}
        style={{
          width: metrics.s10,
          backgroundColor: 'transparent'
        }}
      />
    );
  }, []);

  const _renderItem = useCallback(({ item }) => {
    return (
      <SmallFeedBox
        item={item}
        leftBg={colors.third}
        rightBg={colors.white}
        onPress={() => navigation.navigate(Routes.EVENTS)}
      />
    )
  }, [])

  return (
    <Box style={[styles.boxStyle, {marginHorizontal: metrics.s20}]}>
      <AppText text="Events" style={[styles.bold, {color: colors.primary}]} />
      <Box>
        {loading ? (
          <Box>
            <FlatList
              data={[1, 2, 3]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, idx) => `${item?._id}-${idx}`}
              ItemSeparatorComponent={ItemSeparator}
              renderItem={_renderEventSkeleton}
            />
          </Box>
        ) : upcomingEvents && upcomingEvents?.length > 0 ? (
          <FlatList
            data={upcomingEvents}
            horizontal
            contentContainerStyle={{alignItems: 'stretch'}}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, idx) => `${item?._id}-${idx}`}
            ItemSeparatorComponent={ItemSeparator}
            renderItem={_renderItem}
          />
        ) : (
          <EmptyBox
            bg={colors.white}
            description="There are no upcoming events."
          />
        )}
      </Box>
    </Box>
  );
};

export default Events;


const styles = StyleSheet.create({
  boxStyle: {
    marginTop: metrics.s10,
  },
  bold: {
    paddingBottom: metrics.s10,
    fontSize: 14,
    fontFamily: Fonts.bold,
    fontWeight: 700,
  },
});
