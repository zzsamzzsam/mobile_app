/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const APP_LOGIN = gql`
  mutation ezClientApplogin($username: String!, $password: String!) {
    ezClientApplogin(username: $username, password: $password) {
        clientId
        jwt
        _id
        username  
        lastName
        firstName
        email
        membershipType
        memberPhotoUrl
        membershipNumber
        dateOfBirth
        phoneHome
        myFavourites
        vgEmail
        barcodes
        isAppBoarded
        isEZAppUser
        membershipSince
        myFavourites
        refreshToken
        accessToken
        membershipContractStatus
        emergencyContact
        emergencyContactName
        gender
        lastCheckIn
        deviceId
        notificationTypes
        notificationCategories
        activities
        phoneHome
        accessTokenUpdatedAt
        updatedAt
        createdAt
    }
  }
`;
