/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
  mutation createOrder($input: OrderInput) {
    createOrder(input: $input)
  }
`;
export const CREATE_ORDER_SUMMARY = gql`
  mutation createOrderSummary($input: OrderInput) {
    createOrderSummary(input: $input)
  }
`;