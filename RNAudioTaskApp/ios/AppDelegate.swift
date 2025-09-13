import UIKit
import AVFoundation
import React

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    NotificationCenter.default.addObserver(self, selector: #selector(handleInterruption(notification:)),
                                           name: AVAudioSession.interruptionNotification, object: AVAudioSession.sharedInstance())

    return true
  }

  @objc func handleInterruption(notification: Notification) {
    guard let userInfo = notification.userInfo,
          let typeValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
          let type = AVAudioSession.InterruptionType(rawValue: typeValue) else { return }

    if type == .began {
      sendEventToJS(name: "AUDIO_INTERRUPTION", body: "PAUSE")
    } else if type == .ended {
      sendEventToJS(name: "AUDIO_INTERRUPTION", body: "RESUME")
    }
  }

  func sendEventToJS(name: String, body: String) {
    // In a full RN project you would access RCTBridge to emit events. This is a placeholder showing intent.
  }
}
