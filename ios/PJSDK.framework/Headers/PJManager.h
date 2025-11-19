//
//  BTManager.h
//  XFSmartBand
//
//  Created by GuiXian Feng on 2018/4/21.
//  Copyright © 2018年 Fengguixian. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "PJSmartBandModel.h"
#import "PJUserProfileModel.h"
#import "PJAlarmModel.h"
#import "PJSmartBandCommandIDModel.h"
#import "PJSettingInfoModel.h"
#import "ZFSleepData.h"
#import "ZFSportData.h"

@protocol PJManagerDelegate <NSObject>

@optional
// 设备已连接 找到可写的特征值
- (void)PJManagerDidFindWriteCharacteristic;
#pragma mark - 设备连接 相关回调
// 连接状态
-(void)PJManagerDidBlueToothStateChange:(CBCentralManagerState)state;
// 找到设备
-(void)PJManagerDidFindDevice:(CBPeripheral *)peripheral Rssi:(long)rssi Mac:(NSString *)mac VerifyWorld:(NSString *)verifyWorld Info:(NSDictionary *)info;
// 设备连接成功
-(void)PJManagerDidConnectSuccess:(CBPeripheral *)peripheral;
// 设备连接失败
-(void)PJManagerDidConnectFail:(CBPeripheral *)peripheral;
// 断开连接
-(void)PJManagerDidDisconnect:(CBPeripheral *)peripheral Error:(NSError *)error;
#pragma mark - 设备数据获取 相关回调

// 收到设备ACK回复
-(void)PJManagerDidReceiveACK:(CBPeripheral *)peripheral CommandID:(UInt8)commandID Data:(NSData *)data Success:(BOOL)success;
// 心率测量停止
-(void)PJManagerDidReceiveHeartRateStop;
// 测量血压停止
-(void)PJManagerDidReceiveBPStop;
// 即时的运动数据
-(void)PJManagerSportKeyRealTimeWithSteps:(NSInteger)steps Distance:(NSInteger)distance Calory:(NSInteger)calory;
// 15分钟的运动数据
-(void)PJManagerSportKeyRealTimeWithArray:(NSArray <PBSmartBandSportItemData *>*)array;
// 睡眠数据
-(void)PJManagerSleepDataWithArray:(NSArray <ZFSleepItem *>*)array;
// 心率数据
-(void)PJManagerHeartRateDataWithArray:(NSArray *)array;
// 血压数据
-(void)PJManagerBloodPressureDataWithArray:(NSArray *)array;
// 历史数据获取 isStart = YES 开始获取，isStart = NO 获取完成
-(void)PJManagerUpdataHistoryDataWithIsStart:(BOOL)isStart;
// 历史数据获取 以天为单位
-(void)PJManagerUpdataHistoryDataWithDate:(NSString *)deteStr Steps:(NSInteger)steps Distance:(NSInteger)distance Calory:(NSInteger)calory;
// 综合测量
-(void)PJManageMeasureAllWitdArray:(NSArray *)array;
// 获取设置信息
-(void)PJManagerSettingInfoWith:(PJSettingInfoModel *)settingModel;
// 获取所有闹钟
-(void)PJManagerGetAlarms:(NSArray <PJAlarmModel *>*)array;

#pragma mark - 设备控制app 相关回调

//设备控制app命令
-(void)PJManageSmartBandCommandIdDeviceControlAppKey:(PJSmartBandCommandIDModel *)model;

@end

@interface PJManager : NSObject<CBCentralManagerDelegate, CBPeripheralDelegate>

@property(nonatomic, weak) id<PJManagerDelegate>delegate;

@property(nonatomic, strong) CBCentralManager *cm;

@property(nonatomic, strong) PJSmartBandModel *currentDevice;

//@property(nonatomic, assign) BOOL log;


#pragma mark - 设备连接
+ (PJManager *)sharedManager;

// 初始化SDK
- (void)initBlueTooth;
// SDK版本
-(NSString *)SDKversion;
// 搜索设备
- (BOOL)startScan;

// 停止搜索
- (void)stopScan;

- (BOOL)judgeAuthorization;

// 判断是否已经接连设备
- (BOOL)checkIfExistDevice;

// 连接设备
- (void)connectToDevice:(PJSmartBandModel *)device;

// 保存设备，如果保存 SDK会自动连接设备
- (void)saveDevice;

// 删除设备
- (void)removeDevice;

// 重连
- (void)checkAndReConnect;

// 测试主动收到数据 测试用到。
- (void)manMakeReciveData:(NSData *)data;

#pragma mark - 设备命令

// 寻找设备
- (void)findMe;
- (void)findMe:(BOOL)state;

// 同步时间
- (void)syncSystemTime;

// 设置个人信息
- (void)setUserProfile:(PJUserProfileModel *)userProfileModel;

// 设置目标步数
- (void)setNewStepTarget:(NSInteger)target;

// 打开实时步数上传
- (void)turnonRealTimeStepNotification;

// 关闭实时步数上传
- (void)turnOffRealTimeStepNotification;

// 测量心率 开/关
- (void)startTestHeartRate:(BOOL)on;

// 测量血压 开/关
- (void)startTestBP:(BOOL)on;

// 设置ancs 开/关
- (void)openANCS:(BOOL)on;

// 设置心率 开/关
- (void)heartRateSwitch:(BOOL)on;

// 设置心压 开/关
- (void)bpSwitch:(BOOL)on;

// 增加闹钟  传 PJAlarmModel 数组
- (void)addAlarms:(NSArray <PJAlarmModel *>*)alarms;

// 设置久坐提醒
- (void)setLongSitWith:(PJNoonModel *)noonModel;

// 设置消息开关
- (void)setMessagePushSwith:(PJMessagePushSwitchModel *)messagePushModel;

// 设置其他功能开关
- (void)setOtherSwitch:(BOOL)vibration HandUp:(BOOL)handUp Sleep:(BOOL)sleep HR:(BOOL)hr;

// 设置左右手佩戴 hand = 1 左手，否则是 右手
- (void)setWhichHandToWear:(NSInteger)hand;

// 
- (void)getSleepTestData:(BOOL)on;

// 拍照 开/关
- (void)takePhoto:(BOOL)on;

//设置ancs
- (void)ancs;

// 移除设备
- (void)tellDeviceBeRemove;

// 绑定设备
- (void)bind;

// 获取天数据
- (void)getDayData;

// 获取设置信息
- (void)getSettingInfo;

// 获取闹钟列表
- (void)getAlarms;

// 设备恢复设置
- (void)resetDevice;

// 设置设备语言 language = 0x00 是中文，0x01 是英文
- (void)setDeviceLanguage:(UInt8)language;

// 设置设备语言 根据手机语言设置
- (void)delaySetLanguage;

// 发送命令，支持用户自己生成data。
- (void)sendData:(NSData *)data;

// 设置抬腕亮屏
- (void)tslp:(BOOL)isOn start:(NSInteger)startTime end:(NSInteger)endTime;

// 设置勿扰模式
- (void)dnd:(BOOL)isOn start:(NSInteger)startTime end:(NSInteger)endTime;

// 设置自动测量心率
// isOn             是否开启
// isHelpSleep      睡眠辅助
// frequency        频率
// startTime        开始时间：以小时为单位，范围0~23
// endTime          结束时间：以小时为单位，范围0~23
- (void)autoMeasureHR:(BOOL)isOn isHelpSleep:(BOOL)isHelpSleep frequency:(NSInteger)frequency start:(NSInteger)startTime end:(NSInteger)endTime;

// 获取某段设置信息
- (void)getOneSettingInfoForKey:(UInt8)key;

// 综合测量
- (void)measureAll:(BOOL)on;

@end
