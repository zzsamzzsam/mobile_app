/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_PARKING = gql`
     query parking{
        parkingTemp
      }
    `;

    export const GET_PARKING_REAL = gql`
     query parkingRealtime {
      parkingRealtime
    }
    `;
