import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {PermissionsAndroid, StyleSheet} from 'react-native';
import AnimatedView from '../common/AnimatedView';

import colors from '../../themes/Colors';
import ViewX from '../common/ViewX';
import Text from '../common/Text';
import {useStoreState} from 'easy-peasy';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fonts from '../../themes/Fonts';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LeadersBoardModal from './LeadersBoardModal';
import ChallengesModel from './ChallengesModel';

const ChallengeBox = ({setDrawerOpen, drawerOpen}) => {
  
  const [modalOpen, setModalOpen] = useState(false);
  const {
    leaderBoardSetting, optedChallenges
  } = useStoreState(state => state.health);
  return (
    <>
      <ViewX
      >
        <TouchableOpacity
          onPress={() => {
            setModalOpen(true);
          }}>
          {!optedChallenges?.length  && (
            <ViewX
              flexRow
              style={{padding: 15, backgroundColor: colors.homeBg}}>
              <MaterialCommunityIcons
                name="trophy"
                size={20}
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
                  Participate in Challenges?
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
                  It allows you to see yourself on interactive screens in the
                  facility and on the app
                </Text>
              </ViewX>
              <MaterialIcons
                name="chevron-right"
                size={25}
                color={colors.primary}
              />
            </ViewX>
          )}
          {!!optedChallenges?.length && <ViewX style={styles.watchStatusCont}>
            {(
              <AnimatedView
                horizontal
                delayLevel={0}
                style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons
                  name="trophy"
                  color={colors.secondary}
                  size={25}
                />
                <ViewX
                  justifyContent={'space-between'}
                  flexRow
                  style={{flex: 1}}>
                  <Text bold>Challenges</Text>
                  <Text bold>
                    {optedChallenges ? optedChallenges[0] : '--'}
                  </Text>
                </ViewX>
              </AnimatedView>
            )}
          </ViewX>}
        </TouchableOpacity>
        <ChallengesModel
          isOpen={modalOpen}
          onDismiss={() => setModalOpen(false)}
        />
      </ViewX>
    </>
  );
};

export default ChallengeBox;
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
