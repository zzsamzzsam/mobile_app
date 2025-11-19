//
//  RNFitPro.h
//  tpasc
//
//  Created by Nirmal Khanal on 18/12/2023.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@class CBPeripheral; // Forward declaration of CBPeripheral
@class PBSmartBandSportItemData; // Forward declaration of CBPeripheral

@protocol PJManagerDelegate; // Forward declaration of PJManagerDelegate

@protocol PJManagerDelegate <NSObject>
- (void)PJManagerDidFindDevice:(CBPeripheral *)peripheral Rssi:(long)rssi Mac:(NSString *)mac VerifyWorld:(NSString *)verifyWorld Info:(NSDictionary *)info;
- (void)PJManagerDidConnectSuccess:(CBPeripheral *)peripheral;
- (void)PJManagerDidConnectFail:(CBPeripheral *)peripheral;
- (void)PJManagerDidFindWriteCharacteristic;
- (void)PJManagerHeartRateDataWithArray:(NSArray *)array;
- (void)PJManageMeasureAllWitdArray:(NSArray *)array;
//- (void)PJManagerSportKeyRealTimeWithSteps:(NSInteger)steps Distance:(NSInteger)distance Calory:(NSInteger)calory;
//- (void)PJManagerSportKeyRealTimeWithArray:(NSArray <PBSmartBandSportItemData *>*)array;
@end

@interface RNFitPro : RCTEventEmitter <RCTBridgeModule, PJManagerDelegate>
@end


