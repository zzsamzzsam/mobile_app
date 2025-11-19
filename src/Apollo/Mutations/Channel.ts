/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';
import { CHANNEL_FRAGMENT } from '../fragments/channel';

export const JOIN_CHANNEL = gql`
  mutation joinChannel($userId: ID!) {
    joinChannel(userId: $userId){
        ...ChannelFragment
    }
  }
  ${CHANNEL_FRAGMENT}
`;
export const REQUEST_AGENT_CHAT = gql`
  mutation requestAgentChat($input: CreateAgentChatInput!) {
    requestAgentChat(input: $input){
        ...ChannelFragment
    }
  }
  ${CHANNEL_FRAGMENT}
`;

export const LEAVE_CHANNEL = gql`
  mutation leaveChannel($channelId: ID!) {
    leaveChannel(channelId: $channelId) {
      ...ChannelFragment
    }
  }
  ${CHANNEL_FRAGMENT}
`;

export const REJOIN_CHANNEL = gql`
  mutation rejoinChannel($channelId: ID!) {
    rejoinChannel(channelId: $channelId) {
      ...ChannelFragment
    }
  }
  ${CHANNEL_FRAGMENT}
`;
