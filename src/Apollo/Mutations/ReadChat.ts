/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const READ_CHATS = gql`
    mutation readChats($channelId: ID!){
        readChats(channelId: $channelId)
    }
  `;
