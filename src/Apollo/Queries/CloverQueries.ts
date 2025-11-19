/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_ALL_INVENTORIES_BY_MID = gql`
      query getAllInventoryItems ($code:String!){
        getAllInventoryItems(code:$code)
      }
    `;

export const GET_ALL_ORDER_TYPES_BY_MID = gql`
query getOrderTypes ($code:String!){
  getOrderTypes(code:$code)
}
`;

export const GET_ORDERS = gql`
query getOrders ($code:String!){
  getOrders(code:$code)
}
`;
export const GET_MY_ORDERS = gql`
    query getMyOrders{
    getMyOrders{
    userId
    orderId
    details
    orderedFrom
    restaurantName
    }
    }
`;

export const GET_SAVED_CARDS = gql`
query getSavedCards ($code:String!){
  getSavedCards(code:$code)
}
`;
