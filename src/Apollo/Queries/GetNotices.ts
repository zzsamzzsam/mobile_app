/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_NOTICES = gql`
      query latestNotices ($upcoming: Boolean, $limit: Int!, $page: Int!){
        latestNotices(upcoming: $upcoming, paginationInput: { limit: $limit, page: $page }) {
          page
          limit
          total
          items{
          _id
          itemId
          ezId
          tags
          title
          updatedAt
          description
          }
        }
      }
    `;
