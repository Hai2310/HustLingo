const HUST_RED = '#C8102E';

module.exports = {
  expo: {
    name: 'HustLingo',
    slug: 'hustlingo',
    version: '1.1.0',
    orientation: 'portrait',
    scheme: 'hustlingo',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#FFFFFF'
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.mhai.hustlingo',
      buildNumber: '1',
      infoPlist: {
        NSMicrophoneUsageDescription: 'HustLingo dùng micro để bạn tự ghi âm và luyện nói tiếng Anh.'
      }
    },
    android: {
      package: 'com.mhai.hustlingo',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: HUST_RED
      },
      permissions: ['RECORD_AUDIO']
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/favicon.png',
      name: 'HustLingo'
    },
    plugins: [
      'expo-router',
      ['expo-secure-store', { configureAndroidBackup: true }],
      ['expo-audio', { microphonePermission: 'HustLingo dùng micro để bạn tự ghi âm và luyện nói tiếng Anh.', recordAudioAndroid: true }],
      ['expo-web-browser', { experimentalLauncherActivity: false }]
    ],
    extra: {
      brand: 'HustLingo',
      learningLanguage: 'en'
    }
  }
};
