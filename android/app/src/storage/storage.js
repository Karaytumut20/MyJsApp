import AsyncStorage from '@react-native-async-storage/async-storage';
// Tip importları kaldırıldı: UserProfile, Challenge, CompletedItem

// AsyncStorage Anahtarları
export const USER_PROFILE_KEY = 'user_profile';
export const TODAY_CHALLENGE_KEY = 'today_challenge';
export const COMPLETED_CHALLENGES_KEY = 'completed_challenges';

// Tarih kontrolü için yardımcı fonksiyon
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// --- KULLANICI PROFİL İŞLEMLERİ ---

export const saveProfile = async (profile) => {
  try {
    const jsonValue = JSON.stringify(profile);
    await AsyncStorage.setItem(USER_PROFILE_KEY, jsonValue);
  } catch (e) {
    console.error('AsyncStorage: Profil kaydetme hatası', e);
  }
};

export const getProfile = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('AsyncStorage: Profil okuma hatası', e);
    return null;
  }
};

// --- GÜNLÜK GÖREV İŞLEMLERİ ---

// Bugünün görevini ve atanma tarihini tutan yapı
// interface TodayChallengeStore kaldırıldı, sadece JS objesi kullanılıyor.

export const getTodayChallenge = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TODAY_CHALLENGE_KEY);
    if (jsonValue != null) {
      const storedData = JSON.parse(jsonValue);
      // Görev bugün atanmışsa geri döndür
      if (storedData.date === getTodayDate()) {
        return storedData.challenge;
      }
      // Farklı bir günse, eski görevi sil
      await AsyncStorage.removeItem(TODAY_CHALLENGE_KEY);
    }
    return null;
  } catch (e) {
    console.error('AsyncStorage: Günlük görev okuma hatası', e);
    return null;
  }
};

export const saveTodayChallenge = async (challenge) => {
  try {
    const data = {
      date: getTodayDate(),
      challenge: challenge,
    };
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(TODAY_CHALLENGE_KEY, jsonValue);
  } catch (e) {
    console.error('AsyncStorage: Günlük görev kaydetme hatası', e);
  }
};

// --- TAMAMLANAN GÖREV İŞLEMLERİ ---

export const getCompletedChallenges = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(COMPLETED_CHALLENGES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('AsyncStorage: Tamamlanan görev okuma hatası', e);
    return [];
  }
};

export const addCompletedChallenge = async (challenge) => {
  try {
    const completedList = await getCompletedChallenges();
    const newCompletedItem = {
      id: challenge.id,
      title: challenge.title,
      completedDate: getTodayDate(),
      focus: challenge.focus,
    };
    
    // Aynı görevin bugün içinde tekrar tamamlanmasını engelle
    const isAlreadyCompletedToday = completedList.some(item => 
      item.completedDate === getTodayDate() && item.id === challenge.id
    );

    if (!isAlreadyCompletedToday) {
      const updatedList = [newCompletedItem, ...completedList];
      const jsonValue = JSON.stringify(updatedList);
      await AsyncStorage.setItem(COMPLETED_CHALLENGES_KEY, jsonValue);
    }
  } catch (e) {
    console.error('AsyncStorage: Tamamlanan görev ekleme hatası', e);
  }
};

// --- GELİŞTİRME AMAÇLI SIFIRLAMA ---
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage başarıyla temizlendi.');
  } catch (e) {
    console.error('AsyncStorage: Tüm verileri temizleme hatası', e);
  }
};