//
//  ZFSleepData.h
//  ZFSmartWatch
//
//  Created by GuiXian Feng on 15/9/5.
//  Copyright (c) 2015年 Infoengine. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

typedef NS_ENUM(NSInteger, SleepMode) {
    SleepModeDeep  = 0x01,  // 深度睡眠
    SleepModeLight = 0x02,  // 轻度睡眠
    SleepModeNot   = 0x03   // 未睡眠
};

@interface ZFSleepDataHeader : NSObject

@property(nonatomic) UInt16 date;

@property(nonatomic) UInt8 retainValue;

@property(nonatomic) UInt8 itemCount;

- (NSInteger)year;
- (NSInteger)month;
- (NSInteger)day;
- (NSString *)dateStr;

@end

@interface ZFSleepItem : NSObject

@property(nonatomic) UInt16 mintues;

@property(nonatomic) UInt8 mode;

@property(nonatomic, strong) NSDate *date;

@end

@interface ZFSleepData : NSObject

@property(nonatomic, strong) ZFSleepDataHeader *header;
@property(nonatomic, strong) NSArray *items;

@end
