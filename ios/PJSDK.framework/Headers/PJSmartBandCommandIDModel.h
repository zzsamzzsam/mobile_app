//
//  PJSmartBandCommandIDModel.h
//  PJSDK
//
//  Created by GangLing Wei on 2019/5/24.
//  Copyright © 2019 GangLing Wei. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN


// 设备控制app
typedef enum PJSmartBandCommandIdDeviceControlAppKey
{
    PJSmartBandCommandIdDeviceControlAppKeyFindPhone = 0x01, // 手环找app
    PJSmartBandCommandIdDeviceControlAppKeyTakePhoto = 0x02, // 拍照
    PJSmartBandCommandIdDeviceControllAppKeyToTakePhoto = 0x03, // 打开手机拍照
    PJSmartBandCommandIdDeviceControlAppKeyCancelTakePhoto = 0x04, // 退出拍照
    PJSmartBandCommandIdDeviceControlAppKeyCancelMeasureHeartRate = 0x05, // 退出测量心率
    PJSmartBandCommandIdDeviceControlAppKeyCancelMeasureBloodPressure = 0x06, // 退出测量血压
    PJSmartBandCommandIdDeviceControlAppKeyCancelAll = 0x08 // 退出测量
}PJSmartBandCommandIdDeviceControlAppKey;



@interface PJSmartBandCommandIDModel : NSObject


@property(nonatomic) PJSmartBandCommandIdDeviceControlAppKey commandId;


@end

NS_ASSUME_NONNULL_END
