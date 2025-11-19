/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_NEWS = gql`
      query news ($upcoming: Boolean, $limit: Int!, $page: Int!){
        news(upcoming: $upcoming, paginationInput: { limit: $limit, page: $page}) {
          page
          limit
          items {
            _id
            news_id
            title
            sub_title
            image
            description
            thumbnail
            news_path
            date
          }
        }
      }
    `;
