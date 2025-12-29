import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getServerUrl = () => {
  if (process.env.EXPO_PUBLIC_SERVER_URL) {
    return process.env.EXPO_PUBLIC_SERVER_URL;
  }

  const isRealDevice = Constants.isDevice === true || Constants.isDevice === undefined;
  const isSimulator = Constants.isDevice === false;

  if (Platform.OS === 'android') {
    if (isSimulator) {
      return 'http://10.0.2.2:3000';
    }
    if (isRealDevice) {
      return 'http://172.20.10.5:3000'; 
    }
    return 'http://10.0.2.2:3000';
  }

  if (Platform.OS === 'ios') {
    if (isSimulator) {
      return 'http://localhost:3000';
    }

    if (isRealDevice) {
      return 'http://172.20.10.5:3000'; 
    }
    return 'http://localhost:3000';
  }

  return 'http://localhost:3000';
};

export const SERVER_URL = getServerUrl();

if (__DEV__) {  
  console.log('🌐 Server URL:', SERVER_URL);
  console.log('🔗 Full server endpoint:', `${SERVER_URL}/create-video`)
}

