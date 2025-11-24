//
//  RNFitPro.m
//  RNFitPro
//
//  Created by Nirmal Khanal on 13/12/2023.
//

#import "RNFitPro.h"
#import <React/RCTEventEmitter.h>
#import <React/RCTLog.h>
#import <PJSDK/PJSDK.h>


static NSMutableDictionary<NSString *, PJSmartBandModel *> *smartBandModels = nil;
@implementation RNFitPro
// To export a module named RNFitPro
RCT_EXPORT_MODULE(RNFitPro);
RCT_EXPORT_METHOD(logFromObjectC:(NSString *)name location:(NSString *)location)
{
 RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"BluetoothDeviceFound", @"ConnectionEvent", @"DData", @"Log"]; // Define event names here
}

RCT_EXPORT_METHOD(startBluetoothScan) {
    smartBandModels = [NSMutableDictionary dictionary];
    [[PJManager sharedManager] setDelegate:self];
    [[PJManager sharedManager] startScan];
}
//
RCT_EXPORT_METHOD(stopBluetoothScan) {
    [[PJManager sharedManager] stopScan];
}

RCT_EXPORT_METHOD(findMe) {
  [[PJManager sharedManager] findMe:YES];
}

RCT_EXPORT_METHOD(checkIfExistDevice:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[PJManager sharedManager] setDelegate:self];
    BOOL exists = [[PJManager sharedManager] checkIfExistDevice];
    if (exists) {
        NSLog(@"Device exists");
    } else {
        NSLog(@"Device does not exist");
    }
    resolve(@(exists));
}
RCT_EXPORT_METHOD(checkAndReConnect) {
  [[PJManager sharedManager] checkAndReConnect];
}
RCT_EXPORT_METHOD(removeDevice) {
  [[PJManager sharedManager] removeDevice];
}
RCT_EXPORT_METHOD(resetDevice) {
  [[PJManager sharedManager] resetDevice];
}

RCT_EXPORT_METHOD(measureAll) {
  [[PJManager sharedManager] measureAll:YES];
}
RCT_EXPORT_METHOD(takePhoto) {
  [[PJManager sharedManager] takePhoto:YES];
}

RCT_EXPORT_METHOD(turnonRealTimeStepNotification) {
  [[PJManager sharedManager] turnonRealTimeStepNotification];
}

RCT_EXPORT_METHOD(getDayData) {
  [[PJManager sharedManager] getDayData];
}



RCT_EXPORT_METHOD(connectToDevice:(NSString *)peripheralUUID
                              rssi:(nonnull NSNumber *)rssi
                               mac:(NSString *)mac
                        verifyWorld:(NSString *)verifyWorld) {
  PJSmartBandModel *smartBandModel = smartBandModels[peripheralUUID];
  if (smartBandModel) {
    [[PJManager sharedManager] connectToDevice:smartBandModel];
      } else {
          NSLog(@"smartband not found  UUID: %@", peripheralUUID);
          // Handle case when peripheral is not found for the given UUID
      }
}

// Implement the method to receive heart rate data from PJManager
- (void)PJManagerHeartRateDataWithArray:(NSArray *)array {
    NSLog(@"Received heart rate data from PJManager: %@", array);
    
    // Emit an event to React Native with the received heart rate data
  [self emitEventWithName:@"DData" body:@{@"type": @"heart", @"data": array}];
}

// Implement the method to receive steps data from PJManager
-(void)PJManageMeasureAllWitdArray:(NSArray *)array {
    NSLog(@"Received allData from PJManager: %@", array);
    
    // Emit an event to React Native with the received heart rate data
  [self emitEventWithName:@"DData" body:@{@"type": @"all", @"data": array}];
}

//// Implement the method to receive steps data from PJManager
//- (void)PJManagerSportKeyRealTimeWithArray:(NSArray <PBSmartBandSportItemData *>*)array {
//  NSLog(@"Received sportsArray from PJManager:");
//    // Emit an event to React Native with the received heart rate data
//  [self emitEventWithName:@"DData" body:@{@"type": @"stepsArray", @"data": array}];
//  
//}
- (NSArray *)serializeSportDataArray:(NSArray<PBSmartBandSportItemData *> *)sportDataArray {
    NSMutableArray *serializedArray = [NSMutableArray array];

    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"]; // Modify the format as needed

    for (PBSmartBandSportItemData *sportItem in sportDataArray) {
        NSString *formattedDate = sportItem.date ? [dateFormatter stringFromDate:sportItem.date] : @"";

        NSDictionary *serializedItem = @{
            @"steps": @(sportItem.steps),
            @"distance": @(sportItem.distance),
            @"calory": @(sportItem.calory),
            @"activeTime": @(sportItem.activeTime),
            @"offset": @(sportItem.offset),
            @"mode": @(sportItem.mode),
            @"date": formattedDate
        };

        [serializedArray addObject:serializedItem];
    }

    return [serializedArray copy];
}
- (void) PJManagerSportKeyRealTimeWithArray:(NSArray<PBSmartBandSportItemData *> *)array {
  NSLog(@"Received sport realtime array");
//  [self emitEventWithName:@"DData" body:@{
//    @"type": @"steps",
//    @"subtype": @"array",
//      @"data": array
//    }];
  NSArray *serializedData = [self serializeSportDataArray:array];
  [self emitEventWithName:@"DData" body:@{
      @"type": @"steps",
      @"subtype": @"array",
      @"data": serializedData
  }];
}
- (void) PJManagerSportKeyRealTimeWithSteps:(NSInteger)steps Distance:(NSInteger)distance Calory:(NSInteger)calory {
  NSLog(@"Received sport realtime Steps");
    // Emit an event to React Native with the received heart rate data
  [self emitEventWithName:@"DData" body:@{
    @"type": @"steps",
    @"subtype": @"steps",
      @"data": @{
        @"steps": @(steps),
         @"distance": @(distance),
         @"calories": @(calory)
      }
    }];
}

- (void) PJManagerUpdataHistoryDataWithIsStart:(BOOL)isStart {
  NSLog(@"Received isStart data:");
  [self emitEventWithName:@"DData" body:@{
    @"type": @"isHistoryStart",
    @"subtype": @"isStart",
      @"data": @{
        @"isStart": @(isStart),
      }
    }];
}

- (void)PJManagerUpdataHistoryDataWithDate:(NSString *)deteStr Steps:(NSInteger)steps Distance:(NSInteger)distance Calory:(NSInteger)calory {
  NSLog(@"Received historical data:");
    // Emit an event to React Native with the received heart rate data
  [self emitEventWithName:@"DData" body:@{
    @"type": @"steps",
    @"subtype": @"historical",
      @"data": @{
        @"date": deteStr,
        @"steps": @(steps),
         @"distance": @(distance),
         @"calories": @(calory)
      }
    }];
}

// Implement the method to receive steps data
//- (void)PJManagerSportKeyRealTimeWithSteps:(NSInteger)steps Distance:(NSInteger)distance Calory:(NSInteger)calory {
//  NSLog(@"Received steps data real time from PJManager:");
//    // Emit an event to React Native with the received heart rate data
//  [self emitEventWithName:@"DData" body:@{
//    @"type": @"steps",
//      @"data": @{
//        @"steps": @(steps),
//         @"distance": @(distance),
//         @"calories": @(calory)
//      }
//    }];
//}

// Implementation of PJManagerDelegate method
- (void)PJManagerDidFindDevice:(CBPeripheral *)peripheral Rssi:(long)rssi Mac:(NSString *)mac VerifyWorld:(NSString *)verifyWorld Info:(NSDictionary *)info {
  // Handling discovered devices and emitting events to React Native
  NSDictionary *deviceData = @{
      @"peripheral": peripheral.identifier.UUIDString,
      @"rssi": @(rssi),
      @"mac": mac,
      @"verifyWorld": verifyWorld,
      @"name": peripheral.name,
      @"info": info,
      @"control": @"present"
  };
  PJSmartBandModel *smartBandModel = [[PJSmartBandModel alloc] init];
      smartBandModel.peripheral = peripheral;
      smartBandModel.rssi = rssi;
      smartBandModel.mac = mac;
      smartBandModel.verifyWorld = verifyWorld;
  if (peripheral.identifier.UUIDString && smartBandModel) {
          smartBandModels[peripheral.identifier.UUIDString] = smartBandModel;
  } else {
    NSLog(@"Couldnot save smart=====");
  }
  [self emitEventWithName:@"BluetoothDeviceFound" body:deviceData];
}

- (PJSmartBandModel *)retrieveSmartBandModelByUUID:(NSString *)uuid {
    return smartBandModels[uuid];
}

- (void)PJManagerDidConnectSuccess:(CBPeripheral *)peripheral {
    // Emit an event to React Native on successful device connection
    NSDictionary *connectedDeviceInfo = @{
        @"type": @"Connected",
        @"peripheral": peripheral.identifier.UUIDString,
//        @"rssi": @(peripheral.RSSI),
        @"name": peripheral.name,
        // Add more data if needed
    };

    [self sendEventWithName:@"ConnectionEvent" body:connectedDeviceInfo];
}

- (void)PJManagerDidFindWriteCharacteristic {
  NSLog(@"Connection Completed fully");
  [self sendEventWithName:@"Log" body:@{@"message": @"Connection completed"}];
  [[PJManager sharedManager] turnonRealTimeStepNotification];
  [self sendEventWithName:@"Log" body:@{@"message": @"Real time steps turned on"}];
  [[PJManager sharedManager] syncSystemTime];
  [self sendEventWithName:@"Log" body:@{@"message": @"Sys Time synced"}];
  // [[PJManager sharedManager] setDeviceLanguage:0x00];
  [self sendEventWithName:@"Log" body:@{@"message": @"Language set to english"}];
  [[PJManager sharedManager] saveDevice];
  [self sendEventWithName:@"Log" body:@{@"message": @"Device Saved"}];
}

- (void)PJManagerDidConnectFail:(CBPeripheral *)peripheral {
    // Handle the connection failure event

    // Emit an event to React Native on connection failure
    NSDictionary *errorInfo = @{
        @"type": @"ConnectionFailed",
        @"name": peripheral.name,
        @"peripheral": peripheral.identifier.UUIDString,
        // Add more error details if needed
    };

    [self sendEventWithName:@"ConnectionEvent" body:errorInfo];
}

// - (void)connectToDeviceWithUUID:(NSString *)peripheralUUID
//                             rssi:(long)rssi
//                              mac:(NSString *)mac
//                     verifyWorld:(NSString *)verifyWorld {
//     // Construct PJSmartBandModel instance directly from parameters
//   RCTLogInfo(@"Internally  p=%@, rss=%ld mac=%@, verify=%@", peripheralUUID, rssi, mac, verifyWorld);
//     PJSmartBandModel *device = [[PJSmartBandModel alloc] init];
//     device.peripheralUUID = peripheralUUID;
//     device.rssi = rssi;
//     device.mac = mac;
//     device.verifyWorld = verifyWorld;

//     // Call the connectToDevice method using the created PJSmartBandModel instance
//     [[PJManager sharedManager] connectToDevice:device];
// }

- (void)emitEventWithName:(NSString *)eventName body:(NSDictionary *)body {
    [self sendEventWithName:eventName body:body];
}


#pragma mark - CBCentralManagerDelegate

- (void)centralManager:(CBCentralManager *)central willRestoreState:(NSDictionary<NSString *, id> *)dict {
    // Method implementation for state restoration
}
@end

