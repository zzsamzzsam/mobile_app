//
//  ZFSportData.h
//  ZFSmartWatch
//
//  Created by GuiXian Feng on 15-5-5.
//  Copyright (c) 2015年 Infoengine. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>

/////////////////////////////////////////////////////////////  运动数据包的头

@interface PBSmartBandSportDataHeader : NSObject

@property(nonatomic) UInt16 date;

@property(nonatomic) UInt8 retainValue;

@property(nonatomic) UInt8 itemCount;

- (NSInteger)year;
- (NSInteger)month;
- (NSInteger)day;
- (NSString *)dateStr;

@end

/////////////////////////////////////////////////////////////  运动数据包的头 End


/////////////////////////////////////////////////////////////  定义运动数据

typedef enum SportMode{
    SportModeSlowWalk = 1,
    SportModeFastWalk,
    SportModeRun,
    SportModeDay
}SportMode;

@interface PBSmartBandSportItemData : NSObject

@property(nonatomic) NSInteger steps;

@property(nonatomic) NSInteger activeTime;

@property(nonatomic) NSInteger distance;

@property(nonatomic) NSInteger offset;

@property(nonatomic) SportMode mode;

@property(nonatomic) NSInteger calory;

@property(nonatomic, strong) NSDate *date;

@end

/////////////////////////////////////////////////////////////  定义运动数据 End

@interface ZFSportData : NSObject

@property(nonatomic, strong) PBSmartBandSportDataHeader *header;
@property(nonatomic, strong) NSArray *items;

- (NSDate *)itemTime:(PBSmartBandSportItemData *)item;

@end
