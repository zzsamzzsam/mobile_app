/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Avatar, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat'
import { HeaderTextTitle } from '../../components/common/Header/TopLogo';
import { GET_CHANNELS, GET_CHATS, GET_ME_USER } from '../../Apollo/Queries';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import LoadingCircle from '../../components/LoadingCircle';
import colors from '../../themes/Colors';
import { LEAVE_CHANNEL, READ_CHATS } from '../../Apollo/Mutations';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { Box, Modal } from 'native-base';
import ButtonX from '../../components/common/BottonX';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GET_CHANNEL, GET_CHANNELS_UNREAD, GET_CHANNEL_MESSAGES } from '../../Apollo/Queries/Channel';
import { NEW_MESSAGE_SUBS } from '../../Apollo/Queries/Chat';
import EmptyBox from '../../components/common/EmptyBox';
import AppText from '../../components/common/Text';
import { useSubscriptionData } from '../../Services/Chat/ChatProvider';
import { REJOIN_CHANNEL } from '../../Apollo/Mutations/Channel';

const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
       _id
         channelId
         type
         message
         read
         channel{
         _id
         extras
         memberIds
         }
        sender{
            _id
            firstName
            lastName
            username
        }
        createdAt
        updatedAt
    }
  }
`;

const SingleChatScreen = ({ navigation, route }) => {
    const [messages, setMessages] = useState([]);
    const insets = useSafeAreaInsets();
    const [refetching, setRefetching] = useState(false);
    const [refetchMessage, setRefetchMessage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const { channelId, username } = route.params;
    const {data: channelData, loading: channelLoading} = useQuery(GET_CHANNEL, {
      fetchPolicy: 'cache-and-network',
      variables: {
        channelId
      }
    });
    const {data: channelMessages, loading: messagesLoading} = useQuery(GET_CHANNEL_MESSAGES, {
      fetchPolicy: 'cache-and-network',
      variables: {
        channelId
      }
    });
    const hasAgentChat = channelData?.channel?.agentChat;
    const fetchPastMessages = async () => {

    }
    // const {data: subscriptionData} = useSubscription(NEW_MESSAGE_SUBS, {
    //   variables: {channelId: channelId},
    // });
    const {data: subscriptionData} = useSubscriptionData();
    // const {data: subscriptionData} = useChatSubscription()
    useEffect(() => {
      console.log('change bhayo muji', channelMessages);
      if(channelMessages?.channelMessages?.messages?.messages) {
        const filteredMessages =
          channelMessages.channelMessages.messages.messages.filter(
            s => {
              console.log('turi======= sir=====', channelData.channel?.members?.find(s =>true))
              return s.messageType === 'TYPE_CUSTOM_PROVIDER_EMAIL'});
        console.log('filtered===', filteredMessages);
      }
    }, [channelMessages]);
     useEffect(() => {
      console.log(
        'new message on single Chat',
        subscriptionData, subscriptionData?.newMessage?.channelId,
        subscriptionData?.newMessage?.message,
      );
       if (subscriptionData?.newMessage?.channelId === channelId) {
        //  console.log('new subscription message', subscriptionData);
         if (
           userData?.meAppUser?._id !== subscriptionData?.newMessage?.senderId || subscriptionData?.newMessage?.system
         ) {
           const tempMsg: any = mapMessage(subscriptionData.newMessage);
           setMessages(previousMessages => {
             return GiftedChat.append(previousMessages, tempMsg);
           });
         }
       } else {
        console.log('different channel', subscriptionData?.newMessage?.channelId, channelId);
       }
     }, [subscriptionData, channelId]);
    const { data: chatData, loading: chatLoading, refetch } = useQuery(GET_CHATS, {
        variables: {
            channelId,
        },
        fetchPolicy: 'cache-and-network',
    });
    const [leaveChannelMutation] = useMutation(LEAVE_CHANNEL, {
      refetchQueries: [{query: GET_CHANNELS}, {query: GET_CHANNELS_UNREAD}],
    });
    const [rejoinChannelMutation] = useMutation(REJOIN_CHANNEL, {
      refetchQueries: [{query: GET_CHANNELS}, {query: GET_CHANNELS_UNREAD}],
    });

    const { data: userData, loading: userLoading } = useQuery(GET_ME_USER);
    const hasLeft = channelData?.channel?.leftMemberIds?.includes(
      userData?.meAppUser?._id,
    );
    // console.log('te=--', userData);

    const [readChatsMutation] = useMutation(READ_CHATS, {
        refetchQueries: [{
            query: GET_CHATS, variables: {
                channelId,
            },
        },
        {
            query: GET_CHANNELS,
        }],
    });
    useEffect(() => {
        readChatsMutation({
            variables: {
                channelId
            },
        }).then(d => console.log("message read"))
            .catch(e => console.log('Error', e.toString()))
    }, [channelId])

    useEffect(() => {
        if (refetchMessage > 1) {
            setRefetching(true);
            refetch();
            setTimeout(() => {
                setRefetching(false)
            }, 1000)

        }
    }, [refetch, refetchMessage]);


    const leaveChannel = async () => {
        try {
            await leaveChannelMutation({
                variables: {
                    channelId,
                },
            });
            setShowModal(false);
            // navigation.goBack();
        } catch (err) {
            console.log("Error to join.", e.toString())
        }
    };
    const rejoinChannel = async () => {
      try {
        await rejoinChannelMutation({
          variables: {
            channelId,
          },
        });
        // setShowModal(false);
        // navigation.goBack();
      } catch (err) {
        console.log('Error to join.', e.toString());
      }
    };
    const mapUser = (user) => {
        return {
            _id: user._id,
            name: `${user?.firstName} ${user?.lastName}`,
            avatar: user?.memberPhotoUrl,
        };
    };
    const getUser = useCallback((sender) => {
        if(channelData?.channel) {
            const member = channelData.channel?.members?.find(s => s._id === sender._id);
            return mapUser(member)
        }
        return mapUser(sender)
    }, [channelData]);  
    const mapMessage = (message) => {
        return {
            _id: message._id,
            text: message.message,
            system: message.system,
            createdAt: new Date(message.createdAt),
            user: getUser(message.sender),
        };
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <HeaderTextTitle text={username} />,
            headerRight: () => hasAgentChat ? null : <FeatherIcon
                name='more-vertical'
                size={24}
                color={colors.dark}
                onPress={() => setShowModal(true)}
            />,
            headerRightContainerStyle: { marginRight: 20 },
        });
    }, [username, navigation, hasAgentChat]);

    // useEffect(() => {

    //     let newMessages = chatData?.chats.map(x => {
    //         console.log('the--', x)
    //         mapMessage(x);
    //     });
    //     setMessages(newMessages);
    // }, [chatData, mapMessage]);

    const [sendMessageMutation] = useMutation(SEND_MESSAGE);
    const onSend = React.useCallback((messages = []) => {
        console.log('sending======', messages[0])
      const message: any = messages[0];
      const input = {
        message: message.text,
        channelId: channelId,
      };

      sendMessageMutation({
        variables: {input},
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   sendMessage: {
        //     __typename: 'Chat',
        //     _id: Math.random().toString(36).substring(7),
        //     message: message.text,
        //     channelId,
        //     senderId: message.user._id,
        //     read: false,
        //     createdAt: new Date().toISOString(),
        //     updatedAt: new Date().toISOString(),
        //     sender: {
        //       __typename: 'EZChatUser',
        //       _id: message.user._id,
        //       name: message.user.name,
        //     },
        //   },
        // },
        update: (cache, {data}) => {
          setMessages(previousMessages =>
            {
                const tempMsg: any = mapMessage(data.sendMessage);
                return GiftedChat.append(previousMessages, tempMsg)},
          );
        }
      });
    }, []);
    const renderInputToolbar = useCallback((props) => {
      if(hasLeft) {
        return (
          <>
            <AppText style={{textAlign: 'center'}}>
              You have left the Group.
            </AppText>
            <ButtonX
              bg={colors.secondary}
              textColor={colors.white}
              title="Join Again"
              onPress={rejoinChannel}
            />
          </>
        );
      }
        return (
            <InputToolbar
                {...props}
                containerStyle={styles.inputToolbar}
            />
        );
    }, [hasLeft]);
    const renderSendButton = useCallback(props => {
      return <Send {...props} containerStyle={styles.sendButton}>
        <IonIcons name="send" size={20} color={colors.secondary}/>
      </Send>
    }, []);
    const renderEmptyChat = useCallback(() => {
      return <AppText style={{textAlign: "center", transform: [{scaleY: -1}]}}>No messages yet</AppText>;
    }, [])
    useEffect(() => {
      if (chatData && chatData.chats) {
        const formattedMessages = chatData.chats.map(msg => mapMessage(msg));
        setMessages(formattedMessages);
      }
    }, [chatData]);
    if (!refetching) {
        if (userLoading || chatLoading) {
            return <LoadingCircle color={colors.primary} />
        }
    }

    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: 'white', height: 5}}
        mode="padding"
        edges={['bottom']}>
        <View style={{flex: 1, backgroundColor: colors.white}}>
          {
            <GiftedChat
              messages={messages}
              onSend={msg => onSend(msg)}
              user={mapUser(userData?.meAppUser)}
              isTyping={true}
              alwaysShowSend={true}
              renderInputToolbar={renderInputToolbar}
              renderSend={renderSendButton}
              bottomOffset={insets.bottom + 2}
              renderChatEmpty={renderEmptyChat}
            />
          }
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Leave Channel</Modal.Header>
              <Modal.Body>
                <ButtonX
                  bg={colors.danger}
                  textColor={colors.white}
                  title="Leave"
                  onPress={leaveChannel}
                  disabled
                />
              </Modal.Body>
              {/* <Modal.Footer>
                        <Text>hello</Text>
                    </Modal.Footer> */}
            </Modal.Content>
          </Modal>
        </View>
      </SafeAreaView>
    );
};

export default SingleChatScreen;

const styles = StyleSheet.create({
    inputToolbar: {
        // flex: 1,
        // height: 100,
        // backgroundColor: colors.dark,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 5
    }
});
