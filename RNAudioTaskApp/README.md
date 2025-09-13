RNAudioTaskApp
==============
This is a React Native CLI TypeScript project scaffold (RN 0.78) for the audio recording assignment.
It includes:
- App.tsx (TypeScript) with recording/pause/resume/stop/play using react-native-audio-recorder-player
- Android native module (Kotlin) AudioInterruptionModule to emit AUDIO_INTERRUPTION events
- iOS AppDelegate.swift snippet to emit AUDIO_INTERRUPTION events
- Android & iOS scaffolding (simplified) for sharing

How to run (recommended):
1. npm install
2. For iOS: cd ios && pod install (on macOS)
3. Run on device or build via EAS: eas build -p android / ios

Notes:
- This scaffold is intended for assignment submission and to be opened in VS Code.
- For production builds, ensure you configure keystore / Apple credentials and notification icons.
