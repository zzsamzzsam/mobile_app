/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_LEADERBOARDS = gql`
      query GetLeaderboards {
        leaderboards {
          name
          link
          bg
          active
        }
      }
    `;
