/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_CLOSURES = gql`
      query closures($upcoming: Boolean, $limit: Int!, $page: Int!){
        closures(upcoming: $upcoming, paginationInput: { limit: $limit, page: $page }) {
          page
          limit
          total
          items{
          _id
          closure_id
          facility
          notice_categories
          is_notify
          start_time
          end_time
          title
          reason
          }
        }
      }
    `;
