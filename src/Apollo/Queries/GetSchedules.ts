/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const GET_SCHEDULES = gql`
      query appSchedules ($startDate:ISODate, $endDate:ISODate, $limit: Int!, $page: Int!,$filtersInput:FiltersInput){
        appSchedules(startDate:$startDate, endDate: $endDate, filtersInput:$filtersInput paginationInput:{limit:$limit, page:$page}) {
          items {
            _id
            ez_id
            start_time
            title
            slots_total
            resources
            slots_total
            slots_available
            bookable
            cancellable
            allow_wait_listing
            reservation_category_id
            end_time
            reservation_sub_category_id
            description
            activities
            program
            person_rec_name
            facility_rec_name
            rec_item_image
            registered_user_ids
            facility_rec_name
            audiences
            person_rec_name
            rec_description
            booking_information
          }
        }
      }
    `;

export const GET_SCHEDULE = gql`
      query getSchedule ($ez_id:Int!){
        getSchedule (ez_id : $ez_id){
            _id
            ez_id
            start_time
            title
            slots_total
            resources
            slots_total
            slots_available
            bookable
            cancellable
            allow_wait_listing
            reservation_category_id
            end_time
            reservation_sub_category_id
            description
            activities
            program
            person_rec_name
            facility_rec_name
            rec_item_image
            registered_user_ids
            facility_rec_name
            audiences
            person_rec_name
            rec_description
            booking_information
        }
      }
`;

export const GET_MY_SCHEDULES = gql`
      query myAppEzSchedule ($startDate:ISODate!,$endDate:ISODate!, $page: Int!){
        myAppEzSchedule(startDate:$startDate, endDate:$endDate,page:$page)
      }
    `;

export const GET_PROGRAM_SCHEDULES = gql`
      query appEzProgramSchedules{
        appEzProgramSchedules
      }
    `;

export const GET_SCHEDULE_DETAIL_BY_SESSIONID = gql`
      query getScheduleDetailBySessionId($sessionId: Int!, $page: Int!){
        getScheduleDetailBySessionId(sessionId: $sessionId,page:$page)
      }
    `;

export const GET_MY_FAVOURITE_SCHEDULES = gql`
    query myFavouriteSchedules($limit:Int! $page: Int!){
      myFavouriteSchedules(paginationInput:{limit:$limit, page:$page}){
        limit
        page
        total
        items{
            _id
            ez_id
            start_time
            title
            slots_total
            resources
            slots_total
            slots_available
            bookable
            cancellable
            allow_wait_listing
            reservation_category_id
            end_time
            reservation_sub_category_id
            description
            activities
            program
            person_rec_name
            facility_rec_name
            rec_item_image
            registered_user_ids
            facility_rec_name
            person_rec_name
            audiences
            rec_description
            booking_information
        }
      }
    }
  `;
// export const GET_MY_FAVOURITE_SCHEDULES = gql`
//     query favouriteSchedule($limit:Int! $page: Int!){
//       favouriteSchedule(paginationInput:{limit:$limit, page:$page}){
//         limit
//         page
//         total
//         items{
//             _id
//             ez_id
//             start_time
//             title
//             slots_total
//             resources
//             slots_total
//             slots_available
//             bookable
//             cancellable
//             allow_wait_listing
//             reservation_category_id
//             end_time
//             reservation_sub_category_id
//             description
//             activities
//             program
//             person_rec_name
//             facility_rec_name
//             rec_item_image
//             registered_user_ids
//         }
//       }
//     }
//   `;
// export const GET_MY_FAVOURITE_SCHEDULES = gql`
//       query getFavouriteSchedules($startDate:ISODate!,$endDate:ISODate!,$limit:Int! $page: Int!){
//         getFavouriteSchedules(startDate:$startDate,endDate:$endDate, paginationInput:{limit:$limit, page:$page}){
//           limit
//           page
//           total
//           items{
//               _id
//               ez_id
//               start_time
//               title
//               slots_total
//               resources
//               slots_total
//               slots_available
//               bookable
//               cancellable
//               allow_wait_listing
//               reservation_category_id
//               end_time
//               reservation_sub_category_id
//               description
//               activities
//               program
//               person_rec_name
//               facility_rec_name
//               rec_item_image
//               registered_user_ids
//           }
//         }
//       }
//     `;
