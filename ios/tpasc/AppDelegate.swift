import UIKit
import Expo
import React
import ReactAppDependencyProvider
import PJSDK

@main
class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?
  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()
    reactNativeDelegate = delegate
    reactNativeFactory = factory
    bindReactNativeFactory(factory)

    let manager = PJManager.shared()
    manager?.initBlueTooth()

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  func createRNRootViewController() -> UIViewController {
    let rootViewController = UIViewController()
    rootViewController.view.backgroundColor = .systemBackground

    guard let factory = reactNativeFactory else {
      fatalError("React Native factory has not been initialized")
    }

    let rnView = factory.rootViewFactory.view(
      withModuleName: "tpasc",
      initialProperties: [:]
    )
    rnView.translatesAutoresizingMaskIntoConstraints = false
    rootViewController.view.addSubview(rnView)
    NSLayoutConstraint.activate([
      rnView.topAnchor.constraint(equalTo: rootViewController.view.topAnchor),
      rnView.bottomAnchor.constraint(equalTo: rootViewController.view.bottomAnchor),
      rnView.leadingAnchor.constraint(equalTo: rootViewController.view.leadingAnchor),
      rnView.trailingAnchor.constraint(equalTo: rootViewController.view.trailingAnchor)
    ])

    return rootViewController
  }
}

class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
