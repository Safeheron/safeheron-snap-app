#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <Sentry/Sentry.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"MetaApp";
  self.initialProps = @{};
  
#ifndef DEBUG
  NSString *sentryDsn = [[NSBundle mainBundle] infoDictionary][@"SentryDSN"];
  [SentrySDK startWithConfigureOptions:^(SentryOptions * _Nonnull options) {
    options.dsn = sentryDsn;
  }];
#endif
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
