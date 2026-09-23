import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import PJSDK

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "tpasc"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    self.automaticallyLoadReactNativeWindow = false

    let manager = PJManager.shared()
    manager?.initBlueTooth()
    
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  func createRNRootViewController() -> UIViewController {
      let rootViewController = UIViewController()
      rootViewController.view.backgroundColor = .systemBackground // Prevents flashes of black/white during load
      
    guard let moduleName = self.moduleName else {
            print("Error: moduleName is nil")
            return rootViewController
        }
    
    let rnView = self.rootViewFactory().view(withModuleName: moduleName, initialProperties: self.initialProps)
    
    rnView.translatesAutoresizingMaskIntoConstraints = false
    rootViewController.view.addSubview(rnView)
    
    rootViewController.view.addSubview(rnView)
        rnView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
          rnView.topAnchor.constraint(equalTo: rootViewController.view.topAnchor),
          rnView.bottomAnchor.constraint(equalTo: rootViewController.view.bottomAnchor),
          rnView.leadingAnchor.constraint(equalTo: rootViewController.view.leadingAnchor),
          rnView.trailingAnchor.constraint(equalTo: rootViewController.view.trailingAnchor)
        ])
      
      return rootViewController
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
