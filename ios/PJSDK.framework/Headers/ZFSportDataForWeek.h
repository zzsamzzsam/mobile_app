//
//  ZFSportDataForWeek.h
//  ZFSmartWatch
//
//  Created by GuiXian Feng on 15-5-7.
//  Copyright (c) 2015年 Infoengine. All rights reserved.
//

#import "ZFSportDataForEachType.h"

@interface ZFSportDataForWeek : ZFSportDataForEachType

@property(nonatomic, strong) NSDate *weekStartDate;
@property(nonatomic, strong) NSDate *weekEndDate;
@property(nonatomic) NSInteger weekIndex;

@end
