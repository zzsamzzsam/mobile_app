//
//  ZFSportDataForEachType.h
//  ZFSmartWatch
//
//  Created by GuiXian Feng on 15-5-8.
//  Copyright (c) 2015年 Infoengine. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ZFSportDataForEachType : NSObject

@property(nonatomic) NSInteger steps;
@property(nonatomic) NSInteger distance;
@property(nonatomic) NSInteger calory;
@property(nonatomic) NSInteger activityTime;
@property(nonatomic) NSInteger mode;

@property(nonatomic) NSInteger walkTime;
@property(nonatomic) NSInteger walkSteps;
@property(nonatomic) NSInteger walkDistance;
@property(nonatomic) NSInteger walkCalory;
@property(nonatomic) NSInteger runTime;
@property(nonatomic) NSInteger runSteps;
@property(nonatomic) NSInteger runDistance;
@property(nonatomic) NSInteger runCalory;

@end
