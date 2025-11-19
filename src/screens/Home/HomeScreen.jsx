/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import HomeGreetings from '../../components/screens/HomeGreetings';
import HomeNewsFeed from '../../components/screens/HomeNewsFeed';
import { RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import Events from '../../components/screens/Events';
import { ScrollView } from 'react-native';
import MyFavouriteUpcomingFeed from '../../components/screens/MyFavouriteUpcomingFeed';
import { useQuery } from '@apollo/client';
import { GET_ME_USER, GET_NEWS } from '../../Apollo/Queries';
import InterruptionsFeed from '../../components/screens/InterruptionsFeed';
import colors from '../../themes/Colors';
import CircularProgress from '../../components/screens/CircularProgress';
import HomeVideoFeed from './HomeVideoFeed';
import MyScheduleFeed from '../../components/screens/MyScheduleFeed';
import Fonts from '../../themes/Fonts';
import HomeNotice from '../../components/screens/HomeNotice';
// import RestaurantsList from '../Food/RestaurantsList';

const LIMIT = 20;
const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasEvent, setHasEvent] = useState(false);
  const [hasLotJ, setHasLotJ] = useState(false);
  const [showNewsCount, setShowNewsCount] = useState(3);
  const { data: userData } = useQuery(GET_ME_USER);
  const { data } = useQuery(GET_NEWS, {
    variables: {
      upcoming: false,
      limit: LIMIT,
      page: page,
    },
  });
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setShowNewsCount(3);
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  const onScroll = ({ nativeEvent }) => {
    if ((nativeEvent?.contentOffset?.y + nativeEvent?.layoutMeasurement?.height > nativeEvent?.contentSize?.height - 50)) {
      if (data?.news?.items.length > showNewsCount) {
        if (loading) return;
        setLoading(true);
        setTimeout(() => {
          setShowNewsCount(prev => prev + 3);
          setLoading(false);
        }, 2000);
      }
    }
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
      onScroll={onScroll}
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <HomeGreetings
        name={userData?.meAppUser?.firstName}
        membershipSince={
          userData?.meAppUser?.membershipSince || data?.meAppUser?.createdAt
        }
        lastCheckIn={userData?.meAppUser?.lastCheckIn}
        membershipStatus={userData?.meAppUser?.membershipContractStatus}
      />
      {/* <RestaurantsList horizontal /> */}
      <MyScheduleFeed />
      <MyFavouriteUpcomingFeed />
      <Events setHasEvent={setHasEvent} hasEvent={hasEvent} />
      <CircularProgress setHasLotJ={setHasLotJ} hasLotJ={hasLotJ} />
      <HomeNotice onlyParking setHasLotJ={setHasLotJ} hasLotJ={hasLotJ} />
      <InterruptionsFeed />
      <HomeVideoFeed />
      <HomeNewsFeed showNewsCount={showNewsCount} loading={loading} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.homeBg,
  },
  viewAccountBox: {
    // paddingHorizontal: metrics.s8,
    // backgroundColor: colors.secondary,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  text: {
    color: colors.white,
    fontFamily: Fonts.book,
  },
});

export default HomeScreen;

