import {gql} from '@apollo/client';

export const CHANNEL_FRAGMENT = gql`
  fragment ChannelFragment on ChannelX {
    _id
    extras
    memberIds
    agentChat
    members {
      _id
      firstName
      lastName
      username
      memberPhotoUrl
    }
    createdAt
    updatedAt
    leftMemberIds
    unreadCount
    latestMessage {
      _id
      read
      message
      type
      sender {
        _id
        firstName
        lastName
        username
        memberPhotoUrl
      }
      extras
      senderId
      createdAt
      updatedAt
    }
  }
`;
