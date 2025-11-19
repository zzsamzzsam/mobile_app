import { PermissionsAndroid } from 'react-native';

export const checkAndAskAndroidPermissionsForWatch = async () => {
    try {
        const bluetoothPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: 'Bluetooth Permission',
                message: 'This app needs Bluetooth permission for scanning devices.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        if (bluetoothPermission === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Bluetooth permission granted');
        } else {
            console.log('Bluetooth permission denied');
        }
         const granted = await PermissionsAndroid.requestMultiple(
            [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT],
            {
                title: 'Cool Photo App Camera Permission',
                message:
                'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
            );
        console.log('granted is', granted);
    } catch (error) {
        console.error('Error checking permissions:', error);
    }
};