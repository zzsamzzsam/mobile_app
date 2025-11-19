//
//  PJOtherModel.h
//  PJSDK
//
//  Created by GangLing Wei on 2019/5/24.
//  Copyright © 2019 GangLing Wei. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef enum {
    PJDeviceLanguage_zh = 0x00,
    PJDeviceLanguage_en = 0x01
}PJDeviceLanguage;

@interface PJOtherModel : NSObject


// 其它设置
@property(nonatomic) BOOL shakeSW;

@property(nonatomic, assign) NSInteger hand;

@property(nonatomic) NSInteger ancsState;

@property(nonatomic, assign) PJDeviceLanguage language;

@end

NS_ASSUME_NONNULL_END
