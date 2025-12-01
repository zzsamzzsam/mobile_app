import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import OneSignalFramework
import PJSDK
import CioDataPipelines
import CioMessagingInApp

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "TPASC"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    OneSignal.initialize("10e010ca-398e-43ce-8347-2292a77d9b61", withLaunchOptions: launchOptions)

    // Initialize the Customer.io SDK
    let cdpApiKey = "69bac83ed7a05c91e3fa"
    let siteId = "1bb433fc0bdf40326764"
    let config = SDKConfigBuilder(cdpApiKey: cdpApiKey)
        // If your account is in the EU region, uncomment the next line
        .region(.US)
        .migrationSiteId(siteId)
        .autoTrackUIKitScreenViews() // Set auto tracking of UIKit screen views
        .logLevel(CioLogLevel.debug) // Add this to troubleshoot issues - disable debug in production
    CustomerIO.initialize(withConfig: config.build())
    
    
    
    
    let manager = PJManager.shared()
    manager?.initBlueTooth()
    //PJManager.initBlueTooth(<#T##self: PJManager##PJManager#>)
    //[[PJManager sharedManager] initBlueTooth]
      //[AppCenterReactNative register];
      //[AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
      //[AppCenterReactNativeCrashes registerWithAutomaticProcessing];
    
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
