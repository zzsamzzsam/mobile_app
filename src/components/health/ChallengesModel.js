import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Platform, StyleSheet, Image, Dimensions, Linking, Pressable} from 'react-native';
import {useWatchContext} from '../../Services/Watch/WatchContext';
import colors from '../../themes/Colors';
import ViewX from '../common/ViewX';
import Text from '../common/Text';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {usePlatformHealthContext} from '../../Services/PlatformHealth/PlatformHealthContext';
import {globalStyles} from '../../utils/constants';
import Fonts from '../../themes/Fonts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {
  Button,
  Checkbox,
  Divider,
  Menu,
  PaperProvider,
  RadioButton,
  Switch,
} from 'react-native-paper';
import { Select} from 'native-base';
import AppText from '../common/Text';
import {CustomerIO} from 'customerio-reactnative';
import AvatarPicker from './AvatarPicker';
import ButtonX from '../common/BottonX';
import PadWrapper from '../common/PadWrapper';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import WebviewComponent from '../../screens/Misc/WebviewComponent';
const { width } = Dimensions.get('window');
const challenges = [{
  name: "Olympic Cycling Challenge",
  description: "Attend as many cycling classes as you can and cycle the farthest distance",
  link: "https://kitchen.screenfeed.com/app/3sahb5282bgehmf1rt42azzr0c.html",
  date: "July 26 - Aug 11"
}]
const ChallengesModel = ({isOpen, onDismiss}) => {
  const navigation = useNavigation();
  const {isWatchConnected, isScanning} = useWatchContext();
  const {actualUser} = useStoreState(state => ({
    actualUser: state.login.actualUser,
  }));
  const [viewingChallenge, setViewingChallenge] = useState(null);
  const [index, setIndex] = useState(0);
  const {optedChallenges } =
    useStoreState(state => state.health);
  const { setLeaderBoardSetting, setOptedChallenges } = useStoreActions(actions => actions.health);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
  const namings = useMemo(() => {
    if(actualUser?.firstName && actualUser?.lastName) {
      const firstName = actualUser?.firstName.split(' ')[0];
      const firstNameInitial = firstName.charAt(0).toUpperCase();
      const lastNameInitial = actualUser?.lastName.charAt(0).toUpperCase();

      // Firstname LastNameInitial
      const format1 = `${firstName} ${lastNameInitial}`;

      // firstnameInitial lastname
      const format2 = `${firstNameInitial} ${actualUser.lastName}`;

      // firstnameinitial lastnameinitial
      const format3 = `${firstNameInitial}${lastNameInitial}`;

      return [
          format1,
          format2,
          format3
      ]
    } else {
      return [];
    }
  },[actualUser]);
  useEffect(() => {
    if (isOpen) {
      setIndex(2);
      // setIndex(0);
      bottomSheetRef.current?.present();
    } else {
      setIndex(0);
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen]);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={false}
        pressBehavior="close"
        disappearsOnIndex={-1}
        // appearsOnIndex={2}
        // opacity={1}
        // disappearsOnIndex={1}
      />
    ),
    [],
  );
  const trackCustomer = useCallback(
    (trackData = {}) => {
      if (actualUser._id) {
        CustomerIO.identify(actualUser._id, {
          ...trackData,
        });
      }
    },
    [actualUser],
  );
  const watchLabel = useMemo(() => {
    return isScanning
      ? 'Scanning'
      : isWatchConnected
      ? 'Connected'
      : 'Disconnected';
  }, [isScanning, isWatchConnected]);
  const handleChallengePress = (challenge, x) => {
   
    let originalChallenges = optedChallenges ? [...optedChallenges] : [];
    console.log('hahaha', x, originalChallenges)
    if(!x) {
      originalChallenges = originalChallenges.filter(s => s !== challenge)
    } else {
      originalChallenges.push(challenge)
    }
     trackCustomer({
       optedChallenges: originalChallenges,
    });
    setOptedChallenges(originalChallenges);
  }
  return (
    <ViewX style={styles.container}>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={index}
        onDismiss={onDismiss}
        style={{padding: 0}}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        // onChange={handleSheetChanges}
      >
        <ViewX style={styles.headerWrap}>
          <Text style={[globalStyles.boldText, styles.headerText]}>
            Challenges
          </Text>
          <Divider />
          <Divider />
          {/* <Text style={styles.headerSubText}>
            It allows you to see yourself on interactive screens in the facility and on the app
          </Text> */}
        </ViewX>
        {!viewingChallenge && <BottomSheetScrollView style={styles.sheetContainer}>
          {/* <Image
                // width={width}
                style={{  width: width, height: (width * 480 / 760), resizeMode: 'cover'}}
                source={require('../../public/leaderboard.gif')}
                alt="Logo"
                /> */}
            {challenges.map(challenge => <ViewX
              key={challenge?.name}
              style={{
                padding: 5,
                // paddingBottom: 10,
              }}>
              <ViewX style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 }}>
                <ViewX style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: colors.secondary,
                      paddingBottom: 5,
                    }}>
                    {challenge.name}
                  </Text>
                  <Text
                    style={{
                      // fontWeight: 'bold',
                      color: colors.primary,
                      // paddingBottom: 5,
                      lineHeight: 16,
                      fontSize: 13
                    }}>
                    {challenge.description}
                  </Text>
                  <ViewX flexRow alignItems="center" style={{paddingTop: 10}}>
                    <MaterialIcons
                      name="access-time"
                      size={15}
                      color={colors.primary}
                    />
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: colors.primary,
                        // paddingBottom: 5,
                        // lineHeight: 15,
                        fontSize: 13,
                      }}>

                      {" "}{challenge.date}
                    </Text>
                  </ViewX>
                </ViewX>
                <Switch
                  style={{ alignItems: 'center', alignSelf: 'center', width: 60 }}
                  value={optedChallenges?.includes(challenge.name)}
                  onValueChange={(v) => {
                    handleChallengePress(challenge.name, v);
                  }}
                />
              </ViewX>
              {!!challenge.link && <ButtonX title="View" onPress={() => {
                setViewingChallenge(challenge);
              }} />}
              <Divider />
            </ViewX>)}
          <PadWrapper>
            <AppText bold>Challenge Instructions</AppText>
            <AppText>
              1.	Sign up for the challenge. {"\n"}
              2.	Sign up in the app or in self service for cycling classes {"\n"}
              3.	Attend classes and complete{"\n"}
              4.	Keep track of you classes in the leaderboard{"\n"}
              5.	Win prizes{"\n"}
              Please note class attendance will be updated within 24 hours of the class including distance of each class
            </AppText>
          </PadWrapper>
          <Divider />
          <Divider />
        </BottomSheetScrollView>}
        {!!viewingChallenge && <WebviewComponent title={viewingChallenge.name} origin={viewingChallenge.link}/>}
        {!!viewingChallenge && <Pressable style={{ position: 'absolute', right: 10, top: 20 }} onPress={() => setViewingChallenge(null)}>
          <MaterialCommunityIcons name="close-circle" size={25} color={colors.primary} />
        </Pressable>}
      </BottomSheetModal>
    </ViewX>
  );
};

export default ChallengesModel;
const styles = StyleSheet.create({
  sheetContainer: {
    padding: 10,
    // flex: 1
  },
  actionsWrap: {
    paddingVertical: 10,
  },
  headerWrap: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // backgroundColor: 'red',
    // flexDirection: 'row'
  },
  headerText: {
    fontSize: 18,
    paddingLeft: 10,
    paddingBottom: 10,
    textAlign: 'center'
  },
  container: {
    flex: 1,
    // padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  watchStatusCont: {
    paddingVertical: 10,
  },
});
