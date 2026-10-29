import { gql } from '@apollo/client';

export const GET_CURRENT_APP_VERSION = gql`
  query GetCurrentAppVersion {
    getCurrentAppVersion {
      version
    }
  }
`;
