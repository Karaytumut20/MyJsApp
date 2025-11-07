import React, { useCallback, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  Pressable, 
  Alert,
  FlatList // Kişisel hedefler için eklendi
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Yeniden yükleme için eklendi
import { 
  getProfile, 
  getTodayChallenge, 
  saveTodayChallenge, 
  addCompletedChallenge, 
  clearAllData,
  getUserGoals, // YENİ
  toggleGoalCompleted // YENİ
} from '../storage/storage';
import { CHALLENGES, filterChallenges } from '../data/challenges';

const HomeScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userGoals, setUserGoals] = useState([]); // YENİ: Kişisel hedefler state'i
  const [loading, setLoading] = useState(true);

  // Görevleri ve hedefleri Yükleme Mantığı
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    const userProfile = await getProfile();

    if (!userProfile) {
      navigation.replace('Onboarding');
      return;
    }
    setProfile(userProfile);

    // 1. Günlük Görevi Yükle
    let challenge = await getTodayChallenge();
    if (!challenge) {
      const availableChallenges = filterChallenges(userProfile.level, userProfile.focus);
      if (availableChallenges.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableChallenges.length);
        challenge = availableChallenges[randomIndex];
        await saveTodayChallenge(challenge);
      } else {
        challenge = CHALLENGES[0]; // Acil durum görevi
      }
    }
    setCurrentChallenge(challenge);

    // 2. YENİ: Kişisel Hedefleri Yükle
    const goals = await getUserGoals();
    setUserGoals(goals);

    setLoading(false);
  }, [navigation]);

  // Ekran her odaklandığında verileri yeniden yükle
  useFocusEffect(loadDashboardData);

  // Günlük Görevi Tamamla İşlemi
  const handleCompleteChallenge = async () => {
    if (currentChallenge) {
      await addCompletedChallenge(currentChallenge);
      Alert.alert('Tebrikler!', `${currentChallenge.title} görevini tamamladın. Kaydedildi.`);
      
      navigation.navigate('Completed'); 
    }
  };
  
  // YENİ: Kişisel Hedefi Tamamla/Geri Al İşlemi
  const handleToggleGoal = async (goalId) => {
    await toggleGoalCompleted(goalId);
    // Veriyi tazelemek için listeyi yeniden yükle
    const goals = await getUserGoals();
    setUserGoals(goals);
  };

  // Veri temizleme (DEV)
  const handleClearData = async () => {
    Alert.alert(
      "Veri Temizliği",
      "Tüm veriler silinecektir. Emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Sil", style: "destructive", onPress: async () => {
          await clearAllData();
          navigation.replace('Onboarding');
        } }
      ]
    );
  };

  // YENİ: Kişisel Hedef Listesi Elemanı
  const renderGoalItem = ({ item }) => (
    <Pressable style={styles.goalItem} onPress={() => handleToggleGoal(item.id)}>
      <View style={styles.goalCheckbox}>
        {/* Tamamlanmışsa check işareti göster */}
        {item.isCompleted && <Text style={styles.goalCheck}>✓</Text>}
      </View>
      <Text 
        style={[
          styles.goalTitle,
          item.isCompleted && styles.goalTitleCompleted // Üstünü çiz
        ]}
      >
        {item.title}
      </Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Veriler Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profil Bilgisi */}
      {profile && (
        <View style={styles.profileInfo}>
            <Text style={styles.profileText}>Seviye: {profile.level}</Text>
            <Text style={styles.profileText}>Odak: {profile.focus.charAt(0).toUpperCase() + profile.focus.slice(1)}</Text>
        </View>
      )}

      {/* Günlük Görev Kartı */}
      <Text style={styles.sectionTitle}>Günün Görevi</Text>
      {currentChallenge ? (
        <View style={styles.challengeCard}>
          <Text style={styles.challengeTitle}>{currentChallenge.title}</Text>
          <Text style={styles.challengeDescription}>{currentChallenge.description}</Text>
        
          <Pressable style={styles.completeButton} onPress={handleCompleteChallenge}>
            <Text style={styles.completeButtonText}>Görevi Tamamla 🎉</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.errorText}>Üzgünüz, seviyenize uygun görev bulunamadı.</Text>
      )}

      {/* YENİ BÖLÜM: Kişisel Hedefler */}
      <View style={styles.goalsSection}>
        <Text style={styles.sectionTitle}>Kişisel Hedeflerin</Text>
        {userGoals.length > 0 ? (
          <FlatList
            data={userGoals}
            renderItem={renderGoalItem}
            keyExtractor={(item) => item.id}
            style={styles.goalList}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noGoalsText}>Henüz kişisel hedef eklemedin.</Text>
        )}
        <Pressable 
          style={styles.manageGoalsButton} 
          onPress={() => navigation.navigate('ManageGoals')}
        >
          <Text style={styles.manageGoalsButtonText}>Kişisel Hedefleri Yönet ✏️</Text>
        </Pressable>
      </View>

      {/* Diğer Butonlar (İstatistik vs.) */}
      <View style={styles.navigationButtons}>
        <Pressable style={styles.navButton} onPress={() => navigation.navigate('Stats')}>
          <Text style={styles.navButtonText}>İstatistikler 📊</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => navigation.navigate('Completed')}>
          <Text style={styles.navButtonText}>Tamamlanan Görevler</Text>
        </Pressable>
      </View>

      {/* Geliştirme Butonu */}
      <Pressable style={styles.clearDataButton} onPress={handleClearData}>
        <Text style={styles.navButtonText}>Verileri Temizle (DEV)</Text>
      </Pressable>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  profileText: {
    color: '#ddd',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  challengeCard: {
    width: '100%',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  challengeDescription: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 25,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  // --- YENİ Kişisel Hedef Stilleri ---
  goalsSection: {
    width: '100%',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  goalList: {
    width: '100%',
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  goalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  goalCheck: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  goalTitle: {
    color: '#fff',
    fontSize: 18,
    flex: 1, // Uzun metinlerin sığması için
  },
  goalTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#777',
  },
  noGoalsText: {
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 16,
    paddingVertical: 10,
  },
  manageGoalsButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20, // Liste varsa altta, yoksa yazının altında
  },
  manageGoalsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  // --- Diğer Butonlar ---
  navigationButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, // Eşit genişlik
    marginHorizontal: 5,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  clearDataButton: {
    marginTop: 20,
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8,
  }
});

export default HomeScreen;