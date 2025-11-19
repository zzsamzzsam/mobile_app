/* eslint-disable prettier/prettier */
import { gql } from "@apollo/client";


export const READ_NOTIFICATION = gql`
  mutation readNotification($_id: ID!) {
    readNotification(_id: $_id)
  }
`;
export const DELETE_NOTIFICATION = gql`
    mutation deleteNotification($_id: ID!){
      deleteNotification(_id: $_id)
    }
  `;
export const CLEAR_NOTIFICATIONS = gql`
    mutation clearNotifications($userId: ID!){
      clearNotifications(_id: $_id)
    }
  `;