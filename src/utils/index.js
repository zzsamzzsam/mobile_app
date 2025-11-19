/* eslint-disable prettier/prettier */
import DeviceInfo from "react-native-device-info";
import colors from "../themes/Colors";
import { CustomerIO } from "customerio-reactnative";

export const ItemColor = (item) => {
    let color = colors.purple;
    switch (item[0]?.audiences?.toString()) {
        case 'City of Toronto':
            color = colors.light;
            break;
        case 'Toronto Pan Am Sports Centre Member':
            color = colors.secondary;
            break;
        case 'U of T Scarborough':
            color = colors.forth;
            break;
        default:
            color = colors.purple;
    }
    return color;
};


export const AudienceToColor = (_audience = '') => {
    let color = colors.purple;
    const audience = `${_audience}`.trim();
    switch (audience) {
        case 'City of Toronto':
            color = colors.light;
            break;
        case 'Toronto Pan Am Sports Centre Member':
            color = colors.secondary;
            break;
        case 'U of T Scarborough':
            color = colors.forth;
            break;
        default:
            color = colors.purple;
    }
    return color;
};

export const AudienceToTag = (_audience = '') => {
    const audience = `${_audience}`.trim();
    // switch (audience) {
    //     case 'City of Toronto':
    //     case 'Toronto Pan Am Sports Centre Member':
    //     case 'U of T Scarborough':
    //         return audience[0];
    //     default:
    //         return 'A';
    // }
    switch (audience) {
        case 'City of Toronto':
            return 'City';
        case 'Toronto Pan Am Sports Centre Member':
            return 'TPASC';
        case 'U of T Scarborough':
            return 'UTSC';
        default:
            return 'All Access'
    }
};


export const allowedAudienceByMyBarcodes = (types) => {
    const audience = [];
    for (const type of types) {
        if (type === 'Valid Staff ') {
            audience.push('Toronto Pan Am Sports Centre Member');
        }
        if (type === 'Valid City Participant ') {
            audience.push('City of Toronto');
        }
        // additional
    }
    return audience;
};
export const showCardType = (type) => {
    switch (type) {
        case 'Valid Staff':
            return 'TPASC Membership Card';
        case 'Valid UofT Student':
            return 'U of T Student Card';
        case 'Valid Track Walker':
            return 'Track Walker Card';
        case 'Valid City Participant':
            return 'City Card';
        case 'Valid Leagues/Events':
            return 'Leagues/Events Card';
        default:
            return;
    }
};


export const customerIoUserIdetify = async (user) => {
    const appInfo = {
        version: DeviceInfo.getReadableVersion(),
        deviceBrand: DeviceInfo.getBrand().toString(),
        deviceName: (await DeviceInfo.getDeviceName()).toString(),
        deviceModel: DeviceInfo.getModel().toString(),
        deviceBaseOS: (await DeviceInfo.getBaseOs()).toString(),
        deviceSystemName: DeviceInfo.getSystemName().toString(),
        deviceSystemVersion: DeviceInfo.getSystemVersion().toString(),
        // pushPermissions: await AsyncStorage.getItem('pushAuthorizationStatus'),
    };
    user && user._id && user.email && CustomerIO.identify(user?._id, {
        email: Array.isArray(user?.email) ? user?.email[0] : user?.email,
        username: user?.username,
        firstName: user?.firstName,
        lastName: user?.lastName,
        ezClientId: user?.clientId,
        isAppBoarded: user?.isAppBoarded,
        membershipNumber: user?.membershipNumber,
        membershipType: user?.membershipType,
        membershipSince: user?.membershipSince,
        dateOfBirth: user?.dateOfBirth,
        membershipContractStatus: user?.membershipContractStatus,
        lastCheckIn: user?.lastCheckIn,
        gender: user?.gender,
        phoneHome: user?.phoneHome,
        emergencyContact: user?.emergencyContact,
        ...appInfo,
    });
};

export const trackUserEvent = (eventName, data) => {
    CustomerIO.track(eventName, data);
};

export const checkCreditCardType = (cardNumber) => {
    if (/^4/.test(cardNumber)) {
        return 'VISA';
    } else if (/^5[1-5]/.test(cardNumber)) {
        return 'MC';
    } else if (/^3[47]/.test(cardNumber)) {
        return 'AMEX';
    } else if (/^6(?:011|5)/.test(cardNumber)) {
        return 'DISCOVER';
    } else if (/^3(?:0[0-5]|[68])/.test(cardNumber)) {
        return 'DINERS_CLUB';
    } else if (/^35(?:2[89]|[3-8])/.test(cardNumber)) {
        return 'JCB';
    } else {
        return 'Unknown';
    }
};



const viewFormatter = (num, digits) => {
    var si = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
}
export default viewFormatter;


