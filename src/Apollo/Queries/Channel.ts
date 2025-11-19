/* eslint-disable prettier/prettier */
import {gql} from '@apollo/client';
import {CHANNEL_FRAGMENT} from '../fragments/channel';

export const GET_CHANNELS = gql`
  query channels {
    channels {
      ...ChannelFragment
    }
  }
  ${CHANNEL_FRAGMENT}
`;

export const GET_CHANNEL_MESSAGES = gql`
  query channelMessages($channelId: ID!) {
   channelMessages(channelId: $channelId)
  }
`;

export const GET_CHANNELS_UNREAD = gql`
  query channels {
    channels {
      unreadCount
      leftMemberIds
    }
  }
`;

export const GET_CHANNEL = gql`
  query channel($channelId: ID!) {
    channel(channelId: $channelId) {
      ...ChannelFragment
    }
  }
  ${CHANNEL_FRAGMENT}
`;
