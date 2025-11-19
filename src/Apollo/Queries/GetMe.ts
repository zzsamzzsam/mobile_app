/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_MY_PACKAGES = gql`
  query myEzPackages {
  myEzPackages 
}
`;

export const GET_ME_USER = gql`
      query meAppUser{
        meAppUser{
        clientId
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
        customerId
        orders
        updatedAt
        createdAt
        }
    }
`;
export const GET_USERS = gql`
      query ezUsers($search: String){
        ezUsers(search: $search){
        clientId
        _id
        username  
        lastName
        firstName
        memberPhotoUrl
        createdAt
        membershipType
        }
    }
`;