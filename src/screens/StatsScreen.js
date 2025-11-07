import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
// YENİ: getUserGoals eklendi
import { getCompletedChallenges, getUserGoals } from '../storage/storage';

const StatsScreen = () => {
  const [loading, setLoading] = useState(true);
  
  // İstatistik state'i genişletildi
  const [stats, setStats] = useState({ 
    totalDaily: 0, 
    health: 0, 
    english: 0, 
    mix: 0,
    totalPersonal: 0, // Toplam kişisel hedef sayısı
    completedPersonal: 0 // Tamamlanan kişisel hedef sayısı
  });
  
  const [recentCompleted, setRecentCompleted] = useState([]);

  // Veri yükleme ve istatistik hesaplama fonksiyonu
  const loadStats = async () => {
    setLoading(true);
    
    // 1. Günlük tamamlananları hesapla
    const completedItems = await getCompletedChallenges();
    let totalDaily = completedItems.length;
    let health = 0;
    let english = 0;
    let mix = 0;

    completedItems.forEach(item => {
      if (item.focus === 'health') health++;
      else if (item.focus === 'english') english++;
      else if (item.focus === 'mix') mix++;
    });

    // 2. YENİ: Kişisel hedefleri hesapla
    const userGoals = await getUserGoals();
    const totalPersonal = userGoals.length;
    const completedPersonal = userGoals.filter(goal => goal.isCompleted).length;

    // State'i güncelle
    setStats({ 
      totalDaily, 
      health, 
      english, 
      mix, 
      totalPersonal, 
      completedPersonal 
    });
    
    setRecentCompleted(completedItems.slice(0, 10));
    setLoading(false);
  };

  // Ekran her odaklandığında verileri yeniden yükle
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // İstatistik Kartı bileşeni
  const StatCard = ({ title, value }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  // Liste elemanını render eden fonksiyon
  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyTitle}>{item.title}</Text>
      <Text style={styles.historyDate}>{item.completedDate}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Kişisel Hedef İlerlemesi</Text>
      <View style={styles.statsRow}>
        <StatCard title="Tamamlanan Hedef" value={stats.completedPersonal} />
        <StatCard title="Toplam Hedef" value={stats.totalPersonal} />
      </View>
      
      <Text style={styles.mainTitle}>Günlük Görev İlerlemesi</Text>
      <View style={styles.statsRow}>
        <StatCard title="Toplam Görev" value={stats.totalDaily} />
      </View>
      <View style={styles.statsRow}>
        <StatCard title="Sağlık" value={stats.health} />
        <StatCard title="İngilizce" value={stats.english} />
        <StatCard title="Genel" value={stats.mix} />
      </View>

      {/* Son Tamamlanan Günlük Görevler Listesi */}
      <Text style={styles.recentTitle}>Son Tamamlanan Günlük Görevler</Text>
      {recentCompleted.length > 0 ? (
        <FlatList
          data={recentCompleted}
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          scrollEnabled={false} 
        />
      ) : (
        <Text style={styles.noDataText}>Henüz hiç günlük görev tamamlanmamış.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 10, // İkinci başlık için
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    minHeight: 100, // Kartların eşit yükseklikte olmasını sağlar
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statTitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
    textAlign: 'center', // Başlıklar için
  },
  recentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
    marginBottom: 15,
  },
  historyItem: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: 16,
    color: '#fff',
    flex: 1, // Uzun başlıkların sığması için
  },
  historyDate: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
  noDataText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default StatsScreen;