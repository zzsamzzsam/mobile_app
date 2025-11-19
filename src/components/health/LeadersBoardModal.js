import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Platform, StyleSheet, Image, Dimensions, Pressable} from 'react-native';
import {useWatchContext} from '../../Services/Watch/WatchContext';
import colors from '../../themes/Colors';
import ViewX from '../common/ViewX';
import Text from '../common/Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {usePlatformHealthContext} from '../../Services/PlatformHealth/PlatformHealthContext';
import {globalStyles} from '../../utils/constants';
import Fonts from '../../themes/Fonts';
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
import WebviewComponent from '../../screens/Misc/WebviewComponent';
const { width } = Dimensions.get('window');
// const challenges = [{
//   name: "Olympic Cycling Challenge",
//   description: "Attend as many cycling classes as you can and cycle the farthest distance",
//   link: "https://kitchen.screenfeed.com/app/3sahb5282bgehmf1rt42azzr0c.html",
//   date: "July 26 - Aug 11"
// }]
const challenges = [];
const leaderboards = [
  // {
  //   name: "Tour de TPASC - Nov 17-30",
  //   link: "https://kitchen.screenfeed.com/app/5c28fvmnd5ga14ajajpwa7w9er.html",
  //   bg: colors.secondary,
  // },
  {
    name: "20 Days of Fitness",
    link: "https://kitchen.screenfeed.com/app/7j0vmja0j1r2f4kvrjnvezkz93.html",
    bg: colors.secondary,
  },
  {
    name: "Longest Standing Members",
    link: "https://kitchen.screenfeed.com/app/4eebgys16fvpj4v9x79ae3nf5g.html"
  },
  {
    name: "Most Active Users",
    link: "https://kitchen.screenfeed.com/app/5jfx660qsb9pcmxty0cmgtak7a.html",
  },
  {
    name: "Most Consecutive Days",
    link: "https://kitchen.screenfeed.com/app/6qdpseb0vrwt7mmtfe6pd63s7b.html",
  },
  {
    name: "Help",
    link: "https://api.leadconnectorhq.com/widget/form/hx9tE6QdhlQdAayEwPcr",
    bg: colors.black,
  },
]
const LeadersBoardModal = ({isOpen, onDismiss}) => {
  const {isWatchConnected, isScanning} = useWatchContext();
  const {actualUser} = useStoreState(state => ({
    actualUser: state.login.actualUser,
  }));
  const {initialize, isPlatformHealthReady, getDatas} =
    usePlatformHealthContext();
  const [index, setIndex] = useState(0);
  const { optedChallenges, activeSource, leaderBoardSetting} =
    useStoreState(state => state.health);
  const [viewingChallenge, setViewingChallenge] = useState(null);
  const [instructionVisible, setInstructionVisible] = useState(null);
  const { setLeaderBoardSetting, setOptedChallenges } = useStoreActions(actions => actions.health);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  const handleChallengePress = (challenge, x) => {

    let originalChallenges = optedChallenges ? [...optedChallenges] : [];
    console.log('hahaha', x, originalChallenges)
    if (!x) {
      originalChallenges = originalChallenges.filter(s => s !== challenge)
    } else {
      originalChallenges.push(challenge)
    }
    trackCustomer({
      optedChallenges: originalChallenges,
    });
    setOptedChallenges(originalChallenges);
  }
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
      setInstructionVisible(false);
      setViewingChallenge(false);
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
            {viewingChallenge?.name || "Leaderboards & Challenges"}
          </Text>
          <Divider />
          {/* <Text style={styles.headerSubText}>
            It allows you to see yourself on interactive screens in the facility and on the app
          </Text> */}
          {/* <MaterialCommunityIcons name="close-circle" size={25} color={colors.gray} /> */}
        </ViewX>
        {!viewingChallenge && <BottomSheetScrollView style={styles.sheetContainer}>
          <Image
                // width={width}
                style={{  width: width, height: (width * 480 / 760), resizeMode: 'cover'}}
                source={require('../../public/leaderboard.gif')}
                alt="Logo"
                />
          <ViewX>
            {/* <CheckBoxA
            style={{justifyContent: 'space-between'}}
              title="Participate"
              value={true}
              isChecked={true}
              onChange={value => {}}
            /> */}
            {/* <Divider /> */}
            <Checkbox.Item
              mode="android"
              color={colors.secondary}
              label="Access challenges and see yourself on interactive screens in the facility and in the app"
              status={
                leaderBoardSetting?.leaderBoardOptedIn ? 'checked' : 'unchecked'
              }
              labelStyle={{
                fontFamily: Fonts.medium,
                fontWeight: 'bold',
                fontSize: 14,
                lineHeight: 18,
              }}
              onPress={() => {
                trackCustomer({
                  leaderBoardOptedIn: !leaderBoardSetting?.leaderBoardOptedIn,
                });
                setLeaderBoardSetting({
                  leaderBoardOptedIn: !leaderBoardSetting?.leaderBoardOptedIn,
                });
              }}
            />
            <Divider />
            <Divider />
            {!viewingChallenge && leaderBoardSetting?.leaderBoardOptedIn &&<ViewX style={styles.sheetContainer}>
              {/* <Image
                // width={width}
                style={{  width: width, height: (width * 480 / 760), resizeMode: 'cover'}}
                source={require('../../public/leaderboard.gif')}
                alt="Logo"
                /> */}
              <ViewX style={{paddingHorizontal: 5}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: colors.secondary,
                    fontSize: 18,
                    // paddingBottom: 5,
                  }}>
                  Current Leaderboards
                </Text>
                {leaderboards.map(lead => <ButtonX key={lead.name} title={lead.name} style={{ flex: 1, marginVertical: 4}} bg={lead.bg || colors.primary} onPress={() => {
                  setViewingChallenge(lead);
                }} />)}

              </ViewX>
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
                    <ViewX flexRow alignItems="center" style={{ paddingTop: 10 }}>
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
                <ViewX flexRow>
                  <ButtonX title="Standings" style={{ flex: 1, marginHorizontal: 5 }} onPress={() => {
                    setViewingChallenge(challenge);
                  }} />
                  <ButtonX title="Instructions" style={{ flex: 1 }} onPress={() => {
                    if (instructionVisible?.name === challenge.name) {
                      setInstructionVisible(null);
                    } else {
                      setInstructionVisible(challenge);
                    }

                  }} />
                </ViewX>
                <Divider />
                {instructionVisible?.name === challenge.name && <PadWrapper>
                  <AppText bold>Challenge Instructions</AppText>
                  <AppText>
                    1.	Sign up for the challenge. {"\n"}
                    2.	Sign up in the app or in self service for cycling classes {"\n"}
                    3.	Attend classes and complete{"\n"}
                    4.	Keep track of you classes in the leaderboard{"\n"}
                    5.	Win prizes{"\n"}
                    Please note class attendance will be updated within 24 hours of the class including distance of each class
                  </AppText>
                </PadWrapper>}
              </ViewX>)}
              <Divider />
              <Divider />
            </ViewX>}
            {!!leaderBoardSetting?.leaderBoardOptedIn && <ViewX
              flexRow
              style={{
                paddingHorizontal: 15,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontWeight: 'bold',
                  fontSize: 14,
                  lineHeight: 18,
                  flex: 0,
                }}>
                Avatar
              </Text>
              <RadioButton.Group
                color={colors.secondary}
                onValueChange={value => {
                  setLeaderBoardSetting({
                    useCustomAvatar: value === 'custom' ? true : false,
                    ...(value === "default" && { customAvatar: null })
                  });
                  trackCustomer({
                    useCustomAvatar: value === 'custom' ? true : false,
                  });
                }}
                value={
                  leaderBoardSetting?.useCustomAvatar ? 'custom' : 'default'
                }>
                <RadioButton.Item
                  mode="android"
                  label="Account Image"
                  value="default"
                  color={colors.secondary}
                />
                <RadioButton.Item
                  mode="android"
                  label="Avatar"
                  value="custom"
                  color={colors.secondary}
                />
              </RadioButton.Group>
              <AvatarPicker
                value={
                  leaderBoardSetting?.useCustomAvatar
                    ? leaderBoardSetting?.avatar
                    : actualUser?.memberPhotoUrl
                }
                onChange={_val => {
                  setLeaderBoardSetting({
                    avatar: _val,
                  });
                  trackCustomer({
                    avatar: _val,
                  });
                }}
                disabled={!leaderBoardSetting?.useCustomAvatar}
              />
            </ViewX>}
            <Divider />
            {!!leaderBoardSetting?.leaderBoardOptedIn && <ViewX
              flexRow
              style={{
                paddingHorizontal: 15,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 14,
                  lineHeight: 18,
                  flex: 0,
                  minWidth: 100
                }}>
                <AppText bold>Public Name</AppText>
              </Text>
              <RadioButton.Group
                color={colors.secondary}
                onValueChange={value => {
                  setLeaderBoardSetting({
                    publicName: value,
                  });
                  trackCustomer({
                    publicName: value,
                  });
                }}
                value={leaderBoardSetting?.publicName || null}>
                  {namings.map((s, i) =>  <RadioButton.Item
                    mode="android"
                    key={s}
                    label={s}
                    value={s}
                    color={colors.secondary}
                  />)}
              </RadioButton.Group>
            </ViewX>}
            <Divider />
          </ViewX>
        </BottomSheetScrollView>}
        {!!viewingChallenge && <WebviewComponent title={viewingChallenge.name} origin={viewingChallenge.link} />}
        {!!viewingChallenge && <Pressable style={{ position: 'absolute', left: 10, top: 0, backgroundColor: colors.secondary }} onPress={() => setViewingChallenge(null)}>
          <MaterialCommunityIcons name="chevron-left" size={25} color={colors.primary} />
        </Pressable>}
      </BottomSheetModal>
    </ViewX>
  );
};

export default LeadersBoardModal;
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
  segmented: {
    marginBottom: 10,
  },
  headerSubText: {
    // color: colors.gray,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: Fonts.medium,
  },
  watchSwitchWrap: {
    paddingVertical: 5,
    alignItems: 'center',
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
