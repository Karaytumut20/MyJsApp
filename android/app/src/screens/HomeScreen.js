import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable, Alert } from 'react-native';
// NativeStackScreenProps ve tip importları kaldırıldı.
import { getProfile, getTodayChallenge, saveTodayChallenge, addCompletedChallenge, clearAllData } from '../storage/storage';
import { CHALLENGES, filterChallenges } from '../data/challenges';

// React.FC<HomeProps> ve tip tanımlamaları kaldırıldı.
const HomeScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  // Görevleri Yükleme ve Atama Mantığı
  const loadChallenge = useCallback(async () => {
    setLoading(true);
    const userProfile = await getProfile();

    if (!userProfile) {
      navigation.replace('Onboarding');
      return;
    }
    setProfile(userProfile);

    // 1. AsyncStorage'dan bugünün görevini al
    let challenge = await getTodayChallenge();

    // 2. Eğer görev yoksa (ya da eski bir görevse), yeni bir görev ata
    if (!challenge) {
      // Tip zorlamaları kaldırıldı.
      const availableChallenges = filterChallenges(userProfile.level, userProfile.focus);
      if (availableChallenges.length > 0) {
        // Rastgele bir görev seç
        const randomIndex = Math.floor(Math.random() * availableChallenges.length);
        challenge = availableChallenges[randomIndex];
        await saveTodayChallenge(challenge);
      } else {
        // Uygun görev yoksa varsayılan bir görev göster
        challenge = CHALLENGES[0];
      }
    }

    setCurrentChallenge(challenge);
    setLoading(false);
  }, [navigation]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  // Görevi Tamamla Butonu İşlemi
  const handleCompleteChallenge = async () => {
    if (currentChallenge) {
      await addCompletedChallenge(currentChallenge);
      Alert.alert('Tebrikler!', `${currentChallenge.title} görevini tamamladın. Kaydedildi.`);
      
      navigation.navigate('Completed'); 
    }
  };
  
  // Geliştirme İçin: Tüm veriyi temizle
  const handleClearData = async () => {
    Alert.alert(
      "Veri Temizliği",
      "Tüm kullanıcı verileri (profil ve görevler) silinecektir. Emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { text: "Sil", style: "destructive", onPress: async () => {
          await clearAllData();
          navigation.replace('Onboarding');
        } }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Görev Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Günün Görevi</Text>
      
      {profile && (
        <View style={styles.profileInfo}>
            <Text style={styles.profileText}>Seviye: {profile.level}</Text>
            <Text style={styles.profileText}>Odak: {profile.focus.charAt(0).toUpperCase() + profile.focus.slice(1)}</Text>
        </View>
      )}

      {currentChallenge ? (
        <View style={styles.challengeCard}>
          <Text style={styles.challengeTitle}>{currentChallenge.title}</Text>
          <Text style={styles.challengeDescription}>{currentChallenge.description}</Text>
        
          <Pressable style={styles.completeButton} onPress={handleCompleteChallenge}>
            <Text style={styles.completeButtonText}>Görevi Tamamla 🎉</Text>
          </Pressable>

          <Pressable style={styles.historyButton} onPress={() => navigation.navigate('Completed')}>
            <Text style={styles.historyButtonText}>Tamamlananları Gör</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.errorText}>Üzgünüz, seviyenize uygun görev bulunamadı.</Text>
      )}

      {/* Geliştirme Butonu */}
      <Pressable style={styles.clearDataButton} onPress={handleClearData}>
        <Text style={styles.historyButtonText}>Verileri Temizle (DEV)</Text>
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
    minHeight: '100%',
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 15,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  profileText: {
    color: '#ddd',
    fontSize: 14,
  },
  challengeCard: {
    width: '100%',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  challengeDescription: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginBottom: 15,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginTop: 50,
  },
  clearDataButton: {
    marginTop: 50,
  }
});

export default HomeScreen;