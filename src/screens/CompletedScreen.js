import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
// NativeStackScreenProps ve tip importları kaldırıldı.
import { getCompletedChallenges } from '../storage/storage';

// React.FC<CompletedProps> ve tip tanımlamaları kaldırıldı.
const CompletedScreen = () => {
  // <CompletedItem[]> tip zorlaması kaldırıldı.
  const [completedList, setCompletedList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verileri yükle
  useEffect(() => {
    const loadCompleted = async () => {
      const data = await getCompletedChallenges();
      setCompletedList(data);
      setLoading(false);
    };

    loadCompleted();
  }, []);

  // Liste Öğesi Bileşeni (Tip zorlaması kaldırıldı)
  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemDate}>{item.completedDate}</Text>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemFocus}>Odak: {item.focus.charAt(0).toUpperCase() + item.focus.slice(1)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tamamlanan Görev Geçmişi</Text>
      
      {completedList.length === 0 ? (
        <Text style={styles.emptyText}>Henüz tamamlanmış bir göreviniz yok. Hadi bir tane bitirin!</Text>
      ) : (
        <FlatList
          data={completedList}
          keyExtractor={(item, index) => `${item.completedDate}-${item.id}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 15,
  },
  listContainer: {
    paddingBottom: 40,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemDate: {
    fontSize: 12,
    color: '#aaa',
    width: 90,
    marginRight: 10,
    textAlign: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  itemFocus: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 50,
    textAlign: 'center',
  }
});

export default CompletedScreen;