/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query myNotifications($limit: Int!, $page: Int!) {
    myNotifications(paginationInput: { limit: $limit, page: $page }) {
      total
      limit
      page
      items {
        _id
        resource
        resource_id
        isRead
        title
        description
        date
        createdAt
      }
    }
  }
`;
export const GET_NOTIFICATION = gql`
    query notification($_id: ID!){
      notification(_id: $_id) {
          _id
          resource
          resource_id
          isRead
          title
          description
          date
      }
    }
  `;
