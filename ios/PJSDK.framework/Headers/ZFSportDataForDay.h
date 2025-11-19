//
//  ZFSportDataForDay.h
//  ZFSmartWatch
//
//  Created by GuiXian Feng on 15-5-7.
//  Copyright (c) 2015年 Infoengine. All rights reserved.
//

#import "ZFSportDataForEachType.h"

@interface ZFSportDataForDay : ZFSportDataForEachType

@property(nonatomic, strong) NSDate *date;

@property(nonatomic) NSInteger year;
@property(nonatomic) NSInteger month;
@property(nonatomic) NSInteger day;

@property(nonatomic, strong) NSMutableArray *items;

@end
