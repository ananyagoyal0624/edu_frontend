import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

const saveOffline = async (assignment) => {
  try {
    const existing = await AsyncStorage.getItem('offlineAssignments');
    let assignments = [];

    if (existing) {
      const decrypted = CryptoJS.AES.decrypt(existing, 'your-secret-key').toString(CryptoJS.enc.Utf8);
      assignments = JSON.parse(decrypted);
    }

    assignments.push(assignment);

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(assignments), 'your-secret-key').toString();
    await AsyncStorage.setItem('offlineAssignments', encrypted);

    console.log('Assignment saved offline ✅');
  } catch (err) {
    console.error('Offline save failed:', err);
  }
};
