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

@interface RNFitPro : RCTEventEmitter <RCTBridgeModule, PJManagerDelegate>
@end


