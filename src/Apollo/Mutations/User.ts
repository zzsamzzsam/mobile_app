/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const UPDATE_NOTIFICATION = gql`
mutation updateAppNotificationSetting($input: UpdateUserNotificationInput) {
    updateAppNotificationSetting(input:$input) {
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
        updatedAt
        createdAt
    }
  }
`;
export const UPDATE_ACTIVITIES = gql`
mutation updateEZAppUserInfo($input:UpdateEZAppUserInput) {
  updateEZAppUserInfo(input: $input) {
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
        updatedAt
        createdAt
  }
}
`;

export const UPDATE_APP_BOAEDED = gql`
  mutation updateIsAppBoarded {
    updateIsAppBoarded{
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
        updatedAt
        createdAt
    }
  }
`;

export const DELETE_USER = gql`
mutation clearMyData($_id:String!){
  clearMyData(_id:$_id)
}
`

export const RESTART_UNBOARDING = gql`
mutation restartAppUnBoarding($_id: ID!){
  restartAppUnBoarding(_id: $_id)
}
`

export const UPDATE_EZ_USER = gql`
mutation updateEzUser($input:UpdateEZAppUserInput!){
  updateEzUser(input: $input)
}
`

