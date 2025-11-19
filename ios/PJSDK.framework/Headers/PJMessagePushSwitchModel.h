//
//  PJMessagePushSwitchModel.h
//  PJSDK
//
//  Created by GangLing Wei on 2019/5/24.
//  Copyright © 2019 GangLing Wei. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PJMessagePushSwitchModel : NSObject


//消息开关
@property(nonatomic) BOOL callPush;
@property(nonatomic) BOOL smsPush;
@property(nonatomic) BOOL wechatPush;
@property(nonatomic) BOOL QQPush;
@property(nonatomic) BOOL facebook;
@property(nonatomic) BOOL twitter;
@property(nonatomic) BOOL skype;
@property(nonatomic) BOOL line;
@property(nonatomic) BOOL whatsapp;
@property(nonatomic) BOOL kakaotalk;
@property(nonatomic) BOOL instagram;


@end

NS_ASSUME_NONNULL_END
