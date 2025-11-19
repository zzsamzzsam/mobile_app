//
//  PJNoonModel.h
//  PJSDK
//
//  Created by GangLing Wei on 2019/5/24.
//  Copyright © 2019 GangLing Wei. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PJNoonModel : NSObject


// isActivity :         久坐提醒是否开启
// sitTimeLenth :    分钟为单位，久坐超过这个时间，提醒
// startTime :  开始时间：以小时为单位，范围0~23
// endTime :    结束时间：以小时为单位，范围0~23
// noon : 中午免打搅

//午休免打搅
@property(nonatomic, assign) BOOL noon;
@property(nonatomic, assign) BOOL  isActivity;
@property(nonatomic, assign) NSInteger  startTime;
@property(nonatomic, assign) NSInteger  endTime;
@property(nonatomic, assign) NSInteger  sitTimeLenth; //分钟为单位，久坐超过这个时间，提醒


@end

NS_ASSUME_NONNULL_END
