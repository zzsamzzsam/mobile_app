/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_CHATS = gql`
      query chats($channelId:ID!){
        chats(channelId:$channelId){
         _id
         channelId
         type
         message
         read
         system
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
    
export const NEW_MESSAGE_SUBS = gql`
    subscription newMessage {
      newMessage{
        _id
        message
        channelId
        createdAt
        updatedAt
        senderId
        sender{
            _id
            firstName
            lastName
            username
        }
      }
    }
    `;

