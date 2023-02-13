//
//  Auth.h
//  MetaApp
//
//

#import <React/RCTBridgeModule.h>
#import <LocalAuthentication/LocalAuthentication.h>

@interface Auth : NSObject <RCTBridgeModule>
  - (NSString *_Nonnull)getBiometryType:(LAContext *_Nonnull)context;
@end
