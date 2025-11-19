/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
      query events ($upcoming: Boolean, $limit: Int!, $page: Int!){
        events(upcoming: $upcoming, paginationInput: { limit: $limit, page: $page }) {
          page
          limit
          items {
            _id
              event_id
              title
              description
              start_time
              end_time
              ez_facility_resource
          }
        }
      }
    `;
