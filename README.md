## Run project
* yarn
* npx react-native setup-ios-permissions
* cd ios --> pod install

If there are issues with building the app update the file in expo-modules-core --> go to expo-modules-core/ios/Swift/Logging/LogHandlers.swift and comment the lines that declare and invoke osLogger:
* private let osLogger: os.Logger
* osLogger = os.Logger(subsystem: "dev.expo.modules", category: category)
* osLogger.log(level: type.toOSLogType(), "\(message)")
