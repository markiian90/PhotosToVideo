import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Для Android емулятора використовуємо 10.0.2.2 (спеціальна IP для доступу до localhost хоста)
// Для iOS симулятора використовуємо localhost
// Для реальних пристроїв (Expo Go) використовуємо IP адресу з expo-constants або змінну середовища
const getServerUrl = () => {
  // Перевіряємо чи є змінна середовища (для налаштування вручну) - найвищий пріоритет
  if (process.env.EXPO_PUBLIC_SERVER_URL) {
    return process.env.EXPO_PUBLIC_SERVER_URL;
  }

  // Визначаємо чи це реальний пристрій
  // Constants.isDevice може бути undefined в Expo Go, тому перевіряємо явно
  const isRealDevice = Constants.isDevice === true || Constants.isDevice === undefined;
  const isSimulator = Constants.isDevice === false;

  // Для Android
  if (Platform.OS === 'android') {
    // Якщо точно симулятор - використовуємо спеціальну IP
    if (isSimulator) {
      return 'http://10.0.2.2:3000';
    }
    // Якщо реальний пристрій або undefined (Expo Go на реальному пристрої)
    // localhost не працює, потрібна IP адреса
    if (isRealDevice) {
      // ТИМЧАСОВО: Використовуємо IP адресу комп'ютера
      // ЗАМІНІТЬ на вашу IP адресу або встановіть EXPO_PUBLIC_SERVER_URL в .env
      // Знайдіть IP через: ifconfig | grep "inet " (macOS) або ipconfig (Windows)
      // Або подивіться IP в логах Metro bundler
      return 'http://172.20.10.5:3000'; // ЗАМІНІТЬ на вашу IP!
    }
    return 'http://10.0.2.2:3000';
  }

  // Для iOS
  if (Platform.OS === 'ios') {
    // Якщо точно симулятор - localhost працює
    if (isSimulator) {
      return 'http://localhost:3000';
    }
    // Якщо реальний пристрій або undefined (Expo Go на реальному пристрої)
    // localhost не працює, потрібна IP адреса
    if (isRealDevice) {
      // ТИМЧАСОВО: Використовуємо IP адресу комп'ютера
      // ЗАМІНІТЬ на вашу IP адресу або встановіть EXPO_PUBLIC_SERVER_URL в .env
      // Знайдіть IP через: ifconfig | grep "inet " (macOS) або ipconfig (Windows)
      // Або подивіться IP в логах Metro bundler
      return 'http://172.20.10.5:3000'; // ЗАМІНІТЬ на вашу IP!
    }
    return 'http://localhost:3000';
  }

  // За замовчуванням
  return 'http://localhost:3000';
};

export const SERVER_URL = getServerUrl();

if (__DEV__) {  
  console.log('🌐 Server URL:', SERVER_URL);
  console.log('🔗 Full server endpoint:', `${SERVER_URL}/create-video`)
}

