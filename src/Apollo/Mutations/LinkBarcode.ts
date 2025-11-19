/* eslint-disable prettier/prettier */
import { gql } from '@apollo/client';

export const LINK_BARCODE = gql`
  mutation linkAppBarcode($type: BarcodeTypes!, $id1: String!, $id2: String! ) {
  linkAppBarcode(type: $type, input: { id1: $id1, id2: $id2 })
  }
`;
export const UNLINK_BARCODE = gql`
  mutation unlinkAppBarcode($barcode: String!) {
    unlinkAppBarcode(barcode: $barcode)
  }
`;
export const VERIFY_STUDENT = gql`
  mutation verifyStudent($clientId:Int, $type:BarcodeTypes!,$id1: String!, $id2: String!){
    verifyStudent(clientId:$clientId, type:$type,input:{id1: $id1, id2: $id2})
  }
`;

