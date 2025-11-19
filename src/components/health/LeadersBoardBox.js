import React, {useEffect, useState} from 'react';
import {AnimatedFAB, Button, Snackbar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import {Platform, StyleSheet} from 'react-native';
import AnimatedView from '../common/AnimatedView';
import PadWrapper from '../common/PadWrapper';
import {useWatchContext} from '../../Services/Watch/WatchContext';
import colors from '../../themes/Colors';
import ViewX from '../common/ViewX';
import Text from '../common/Text';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {usePlatformHealthContext} from '../../Services/PlatformHealth/PlatformHealthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {HEALTH_SOURCES} from '../../utils/constants';
import Fonts from '../../themes/Fonts';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Connection from './Connection';
import LeadersBoardModal from './LeadersBoardModal';

const LeadersBoardBox = ({setDrawerOpen, drawerOpen}) => {
  const {isWatchConnected, isScanning, isLoading} = useWatchContext();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isExtended, setIsExtended] = useState(true);
  const [leadersBoardModalOpen, setLeadersBoardModalOpen] = useState(false);
  const {
    platformHealthTurnedOn,
    activeSource,
    leaderBoardOptedIn,
    leaderBoardAsked,
    leaderBoardSetting,
  } = useStoreState(state => state.health);
  return (
    <>
      <ViewX
      >
        <TouchableOpacity
          onPress={() => {
            setLeadersBoardModalOpen(true);
          }}>
          {!leaderBoardSetting?.leaderBoardOptedIn  && (
            <ViewX
              flexRow
              style={{padding: 15, backgroundColor: colors.homeBg}}>
              <MaterialIcons
                name="leaderboard"
                size={15}
                color={colors.primary}
              />
              <ViewX style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 15,
                    lineHeight: 16,
                    color: colors.secondary,
                    fontFamily: Fonts.book,
                    paddingHorizontal: 10,
                  }}>
                  Would you like to participate in leaderboards?
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 14,
                    color: colors.secondary,
                    fontFamily: Fonts.bold,
                    fontWeight: '700',
                    paddingHorizontal: 10,
                  }}>
                  It allows you to access challenges and see yourself on interactive screens in the facility and in the app
                </Text>
              </ViewX>
              <MaterialIcons
                name="chevron-right"
                size={25}
                color={colors.primary}
              />
            </ViewX>
          )}
          {!!leaderBoardSetting?.leaderBoardOptedIn && <ViewX style={styles.watchStatusCont}>
            {(
              <AnimatedView
                horizontal
                delayLevel={0}
                style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons
                  name="watch-variant"
                  color={colors.secondary}
                  size={25}
                />
                <ViewX
                  justifyContent={'space-between'}
                  flexRow
                  style={{flex: 1}}>
                  <Text bold>Leaderboards & Challenges</Text>
                  <Text bold>
                    {leaderBoardSetting?.leaderBoardOptedIn ? 'Participating' : '--'}
                  </Text>
                </ViewX>
              </AnimatedView>
            )}
          </ViewX>}
        </TouchableOpacity>
        <LeadersBoardModal
          isOpen={leadersBoardModalOpen}
          onDismiss={() => setLeadersBoardModalOpen(false)}
        />
      </ViewX>
    </>
  );
};

export default LeadersBoardBox;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fabStyle: {
    right: 0,
    backgroundColor: '#fff',
    borderColor: 'transparent',
    // padding: 0,
    // bottom: 0,
    position: 'absolute',
  },
});
