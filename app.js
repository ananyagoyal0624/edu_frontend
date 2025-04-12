import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

const syncOfflineAssignments = async () => {
  const encryptedData = await AsyncStorage.getItem('offlineAssignments');
  if (!encryptedData) return;

  const decrypted = CryptoJS.AES.decrypt(encryptedData, 'your-secret-key').toString(CryptoJS.enc.Utf8);
  const assignments = JSON.parse(decrypted);
  const token = await AsyncStorage.getItem('jwtToken');

  try {
    await axios.post('http://<your-backend>/api/assignments/sync', { assignments }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await AsyncStorage.removeItem('offlineAssignments');
  } catch (e) {
    console.error('Sync failed:', e);
  }
};

NetInfo.addEventListener((state) => {
  if (state.isConnected) syncOfflineAssignments();
});
