//
//  PJAlarmModel.h
//  XFSmartBand
//
//  Created by GuiXian Feng on 2018/5/26.
//  Copyright © 2018年 Fengguixian. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef enum {
    PJWeekDayMonDay = 1 << 0,
    PJWeekDayTuesday = 1 << 1,
    PJWeekDayWednesday = 1 << 2,
    PJWeekDayThursday = 1 << 3,
    PJWeekDayFirday = 1 << 4,
    PJWeekDaySaturday = 1 << 5,
    PJWeekDaySunday = 1 << 6,
    PJWeekDayAllDays = PJWeekDayMonDay | PJWeekDayTuesday | PJWeekDayWednesday | PJWeekDayThursday | PJWeekDayFirday | PJWeekDaySaturday | PJWeekDaySunday,
    PJWeekDayWorkDay = PJWeekDayMonDay | PJWeekDayTuesday | PJWeekDayWednesday | PJWeekDayThursday | PJWeekDayFirday,
    PJWeekDayWeekend = PJWeekDaySaturday | PJWeekDaySunday
}PJWeekDay;

@interface PJAlarmModel : NSObject

@property(nonatomic, strong) NSDate *date;

@property(nonatomic, assign) UInt8 weekDays;

@property(nonatomic) BOOL isAvailable;

- (NSArray *)getWeekArray;

- (NSString *)stringForWeekDay:(NSInteger)weekDay;

@end
