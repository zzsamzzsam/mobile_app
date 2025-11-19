//
//  PJSettingInfoModel.h
//  PJSDK
//
//  Created by GangLing Wei on 2019/5/24.
//  Copyright © 2019 GangLing Wei. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PJSettingInfoModel.h"
#import "PJUserProfileModel.h"
#import "PJStepTargetModel.h"
#import "PJNoonModel.h"
#import "PJMessagePushSwitchModel.h"
#import "PJSleepModel.h"
#import "PJOtherModel.h"
#import "PJSLPModel.h"
#import "PJAutoMeasureHRModel.h"
#import "PJDNDModeModel.h"
#import "PJAudioCodeModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface PJSettingInfoModel : NSObject

// 用户信息
@property(nonatomic, strong) PJUserProfileModel *userProfileModel;

//目标步数
@property(nonatomic, strong) PJStepTargetModel *stepTargetModel;
//午休免打搅
@property(nonatomic, strong) PJNoonModel *noonModel;
//消息开关
@property(nonatomic, strong) PJMessagePushSwitchModel *messagePushSwitchModel;
// 睡眠
@property(nonatomic, strong) PJSleepModel *sleepModel;
// 其它设置
@property(nonatomic, strong) PJOtherModel *otherModel;
//抬腕亮屏
@property(nonatomic, strong) PJSLPModel *slpModel;
//自动监测心率
@property(nonatomic, strong) PJAutoMeasureHRModel *autoMeasureHRModel;
//勿扰模式
@property(nonatomic, strong) PJDNDModeModel *dndModeModel;
// 音频蓝牙名称代码 0:LH728-Audio  1:WellAudio
@property(nonatomic, strong) PJAudioCodeModel *audioCodeModel;
@end

NS_ASSUME_NONNULL_END
