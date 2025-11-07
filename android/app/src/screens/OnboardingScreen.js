import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
// NativeStackScreenProps ve tip importları kaldırıldı.
import { saveProfile } from '../storage/storage';

// Sabit Veriler (TypeScript'teki Level ve Focus tiplerine karşılık gelen değerler)
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const FOCUS_AREAS = ['english', 'health', 'mix'];

// React.FC<OnboardingProps> ve diğer tip tanımlamaları kaldırıldı.
const OnboardingScreen = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState('B1');
  const [selectedFocus, setSelectedFocus] = useState('mix');

  // Kullanıcı profili kaydetme ve ana ekrana yönlendirme
  const handleSaveProfile = async () => {
    if (!selectedLevel || !selectedFocus) {
      Alert.alert('Eksik Bilgi', 'Lütfen seviye ve odak alanı seçiminizi yapın.');
      return;
    }

    const newProfile = { // UserProfile tipi kaldırıldı.
      level: selectedLevel,
      focus: selectedFocus,
      habits: [],
    };

    await saveProfile(newProfile);
    navigation.replace('Home');
  };

  // Seçenek Buton Bileşeni (React.FC<{...}> tip tanımı kaldırıldı)
  const OptionButton = ({ label, value, currentValue, onSelect }) => {
    const isSelected = value === currentValue;
    return (
      <Pressable 
        style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
        // as Level | Focus tipi zorlaması kaldırıldı
        onPress={() => onSelect(value)}
      >
        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>İlk Adım: Profil Oluştur</Text>
      <Text style={styles.subtitle}>Günlük görevlerin sana özel olması için seviyeni ve odak noktanı seç.</Text>

      {/* Seviye Seçimi */}
      <Text style={styles.sectionTitle}>1. İngilizce Seviyen:</Text>
      <View style={styles.optionsRow}>
        {LEVELS.map(level => (
          <OptionButton
            key={level}
            label={level}
            value={level}
            currentValue={selectedLevel}
            onSelect={setSelectedLevel}
          />
        ))}
      </View>

      {/* Odak Alanı Seçimi */}
      <Text style={styles.sectionTitle}>2. Odak Alanın:</Text>
      <View style={styles.optionsRow}>
        {FOCUS_AREAS.map(focus => (
          <OptionButton
            key={focus}
            label={focus.charAt(0).toUpperCase() + focus.slice(1)}
            value={focus}
            currentValue={selectedFocus}
            onSelect={setSelectedFocus}
          />
        ))}
      </View>

      {/* Kaydet Butonu */}
      <Pressable style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Profilimi Oluştur ve Başla</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#222',
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#fff',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;