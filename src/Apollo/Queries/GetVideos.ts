/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_VIDEOS = gql`
      query latestVideos ($organizationId:String){
        latestVideos(organizationId:$organizationId)
      }
    `;
