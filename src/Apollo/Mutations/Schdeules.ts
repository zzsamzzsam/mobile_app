/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

// export const ADD_FAVOURITE = gql`
//   mutation addScheduleToFavourite($scheduleId: Int!) {
//     addScheduleToFavourite(scheduleId: $scheduleId)
//   }
// `;
export const ADD_FAVOURITE = gql`
  mutation addMyFavourites($activities: [String]) {
    addMyFavourites(activities: $activities)
  }
`;
export const REMOVE_FAVOURITE = gql`
  mutation removeMyFavourites($activities: [String]) {
    removeMyFavourites(activities:$activities)
  }
`;

// export const REMOVE_FAVOURITE = gql`
//   mutation removeScheduleToFavourite($scheduleId: Int!) {
//     removeScheduleToFavourite(scheduleId:$scheduleId)
//   }
// `;

export const BOOK_SCHEDULE = gql`
  mutation bookEzSessionfromApp($scheduleId: Int!) {
    bookEzSessionfromApp(scheduleId:$scheduleId)
  }
`;

export const WAIT_LIST_SCHEDULE = gql`
  mutation waitlistEzSessionFromApp($scheduleId: Int!) {
    waitlistEzSessionFromApp(scheduleId:$scheduleId)
  }
`;

export const CANCLE_BOOK_SCHEDULE = gql`
  mutation cancelBookedEzSessionFromApp($scheduleId: Int!,$bookingId: Int!) {
    cancelBookedEzSessionFromApp(scheduleId:$scheduleId,bookingId: $bookingId)
  }
`;

export const CANCLE_WAIT_LIST_SECEDULE = gql`
  mutation cancelWaitlistedEzSessionFromApp($scheduleId:Int!,$bookingId: Int!) {
    cancelWaitlistedEzSessionFromApp(scheduleId:$scheduleId,bookingId: $bookingId)
  }
`;
