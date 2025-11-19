//
//  PJSmartBandModel.h
//  XFSmartBand
//
//  Created by GuiXian Feng on 2018/4/22.
//  Copyright © 2018年 Fengguixian. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>

typedef enum {
    DeviceStateNotConnected = 1,
    DeviceStateConnecting = 2,
    DeviceStateConnected = 3,
    DeviceStateRemove = 4,
    DeviceStateConnectFaild = 5
}DeviceState;

@interface PJSmartBandModel : NSObject

@property(nonatomic, strong) CBPeripheral *peripheral;

@property(nonatomic, copy) NSString *name;

@property(nonatomic, copy) NSString *peripheralUUID;

@property(nonatomic, assign) long rssi;

@property(nonatomic, copy) NSString *mac;

@property(nonatomic, copy) NSString *programVersion;

@property(nonatomic, assign) NSInteger batteryLevel;

@property(nonatomic, strong) CBCharacteristic *readCharacteristic;

@property(nonatomic, strong) CBCharacteristic *writeCharacteristic;

@property(nonatomic, strong) CBCharacteristic *notifyCharacteristic;

@property(nonatomic, strong) CBCharacteristic *findMeCharacteristic;

@property(nonatomic, strong) CBCharacteristic *batteryCharacteristic;

@property(nonatomic, strong) CBCharacteristic *programVersionCharacteristic;

@property(nonatomic, strong) CBCharacteristic *otherFunctionCharacteristic;

@property(nonatomic, assign) DeviceState state;

@property(nonatomic, copy) NSString *verifyWorld;

// 功能控制
@property(nonatomic, copy) NSString *functionFlag;

@property(nonatomic, strong) CBService *deviceInfoService;

@property(nonatomic, strong) CBService *batteryService;

@end
