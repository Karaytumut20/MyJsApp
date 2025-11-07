import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  FlatList, 
  Alert, 
  ScrollView 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserGoals, saveNewGoal, deleteUserGoal } from '../storage/storage';

const ManageGoalsScreen = () => {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Ekran her açıldığında hedefleri yükle
  const loadGoals = useCallback(async () => {
    const userGoals = await getUserGoals();
    // En yeni hedefler üstte olacak şekilde sırala
    setGoals(userGoals.reverse());
  }, []);

  useFocusEffect(loadGoals);

  // Yeni hedef ekleme fonksiyonu
  const handleAddGoal = async () => {
    if (title.trim() === '') {
      Alert.alert('Hata', 'Hedef başlığı boş olamaz.');
      return;
    }
    
    await saveNewGoal({ title, description });
    setTitle('');
    setDescription('');
    loadGoals(); // Listeyi yenile
  };

  // Hedef silme fonksiyonu
  const handleDeleteGoal = (goalId) => {
    Alert.alert(
      "Hedefi Sil",
      "Bu hedefi kalıcı olarak silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Sil", 
          style: "destructive", 
          onPress: async () => {
            await deleteUserGoal(goalId);
            loadGoals(); // Listeyi yenile
          }
        }
      ]
    );
  };

  // Liste elemanını render et
  const renderGoalItem = ({ item }) => (
    <View style={styles.goalItem}>
      <View style={styles.goalTextContainer}>
        <Text style={styles.goalTitle}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.goalDescription}>{item.description}</Text>
        ) : null}
      </View>
      <Pressable onPress={() => handleDeleteGoal(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Sil</Text>
      </Pressable>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Yeni Hedef Ekleme Formu */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Yeni Hedef Oluştur</Text>
        <TextInput
          style={styles.input}
          placeholder="Hedef Başlığı (örn: 10 kitap oku)"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.inputDescription]}
          placeholder="Açıklama (İsteğe bağlı)"
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Pressable style={styles.saveButton} onPress={handleAddGoal}>
          <Text style={styles.saveButtonText}>Hedefi Kaydet</Text>
        </Pressable>
      </View>

      {/* Mevcut Hedefler Listesi */}
      <Text style={styles.listTitle}>Mevcut Hedeflerin</Text>
      {goals.length > 0 ? (
        <FlatList
          data={goals}
          renderItem={renderGoalItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false} // Ana ScrollView içinde
        />
      ) : (
        <Text style={styles.noGoalsText}>Henüz hiç kişisel hedef oluşturmadın.</Text>
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
  formContainer: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  inputDescription: {
    height: 100,
    textAlignVertical: 'top', // Android için
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  goalItem: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  goalTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  goalDescription: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noGoalsText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ManageGoalsScreen;