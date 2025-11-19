/* eslint-disable prettier/prettier */
import { Platform } from "react-native";

const Fonts = {
    book: Platform.OS === 'ios' ? 'Gotham-Book' : 'GothamBook',
    light: Platform.OS === 'ios' ? 'Gotham-Light' : 'GothamLight',
    medium: Platform.OS === 'ios' ? 'Gotham-Medium' : 'GothamMedium',
    bold: Platform.OS === 'ios' ? 'Gotham-Bold' : 'GothamBold',
};

export default Fonts;
