/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_CANCELLATIONS = gql`
      query cancellations ($upcoming: Boolean, $limit: Int!, $page: Int!){
        cancellations(upcoming: $upcoming, paginationInput: { limit: $limit, page: $page }) {
          items {
            _id
            #cancellation_id
            start_time
            end_time
            title
            #rec_item_id
            description
          }
        }
      }
    `;
