//
//  PJSLPModel.h
//  PJSDK
//
//  Created by GangLing Wei on 2019/5/24.
//  Copyright © 2019 GangLing Wei. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PJSLPModel : NSObject


//抬腕亮屏

@property(nonatomic) BOOL isActivity;

@property(nonatomic, assign) NSInteger startTime;

@property(nonatomic, assign) NSInteger endTime;


@end

NS_ASSUME_NONNULL_END
