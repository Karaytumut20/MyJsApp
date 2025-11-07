import AsyncStorage from '@react-native-async-storage/async-storage';
// Tip importları kaldırıldı

// AsyncStorage Anahtarları
export const USER_PROFILE_KEY = 'user_profile';
export const TODAY_CHALLENGE_KEY = 'today_challenge';
export const COMPLETED_CHALLENGES_KEY = 'completed_challenges';
// YENİ EKLENDİ: Kullanıcının kendi hedefleri için anahtar
export const USER_GOALS_KEY = 'user_goals';

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

// --- TAMAMLANAN GÖREV İŞLEMLERİ (GÜNLÜK) ---

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


// --- YENİ BÖLÜM: KULLANICI KİŞİSEL HEDEFLERİ (USER GOALS) ---

/**
 * Kullanıcının tüm kişisel hedeflerini getirir.
 */
export const getUserGoals = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_GOALS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('AsyncStorage: Kişisel hedefleri okuma hatası', e);
    return [];
  }
};

/**
 * Yeni bir kişisel hedef ekler.
 * Goal objesi: { title: string, description: string }
 */
export const saveNewGoal = async (goal) => {
  try {
    const goals = await getUserGoals();
    const newGoal = {
      id: Date.now().toString(), // Basit bir benzersiz ID
      title: goal.title,
      description: goal.description || '',
      isCompleted: false, // Başlangıçta tamamlanmadı
      createdAt: getTodayDate(),
    };
    const updatedGoals = [...goals, newGoal];
    const jsonValue = JSON.stringify(updatedGoals);
    await AsyncStorage.setItem(USER_GOALS_KEY, jsonValue);
  } catch (e) {
    console.error('AsyncStorage: Kişisel hedef kaydetme hatası', e);
  }
};

/**
 * Bir kişisel hedefi siler.
 */
export const deleteUserGoal = async (goalId) => {
  try {
    const goals = await getUserGoals();
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    const jsonValue = JSON.stringify(updatedGoals);
    await AsyncStorage.setItem(USER_GOALS_KEY, jsonValue);
  } catch (e) {
    console.error('AsyncStorage: Kişisel hedef silme hatası', e);
  }
};

/**
 * Bir kişisel hedefin tamamlanma durumunu değiştirir (işaretle/işareti kaldır).
 */
export const toggleGoalCompleted = async (goalId) => {
  try {
    const goals = await getUserGoals();
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, isCompleted: !goal.isCompleted } : goal
    );
    const jsonValue = JSON.stringify(updatedGoals);
    await AsyncStorage.setItem(USER_GOALS_KEY, jsonValue);
  } catch (e) {
    console.error('AsyncStorage: Kişisel hedef güncelleme hatası', e);
  }
};


// --- GELİŞTİRME AMAÇLI SIFIRLAMA ---
export const clearAllData = async () => {
  try {
    // Tüm anahtarları temizler (USER_GOALS_KEY dahil)
    await AsyncStorage.clear();
    console.log('AsyncStorage başarıyla temizlendi.');
  } catch (e) {
    console.error('AsyncStorage: Tüm verileri temizleme hatası', e);
  }
};