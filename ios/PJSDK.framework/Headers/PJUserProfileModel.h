//
//  PJUserProfileModel.h
//  PJSDK
//
//  Created by GangLing Wei on 2019/5/23.
//  Copyright © 2019 GangLing Wei. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface PJUserProfileModel : NSObject


@property (assign, nonatomic) NSInteger sex;
@property (assign, nonatomic) NSInteger age;
@property (assign, nonatomic) CGFloat height;
@property (assign, nonatomic) CGFloat weight;

@property (assign, nonatomic) NSInteger distanceUnit;

@end

NS_ASSUME_NONNULL_END
