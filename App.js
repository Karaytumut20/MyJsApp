import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getProfile } from './src/storage/storage';
// RootStackParamList tip importı kaldırıldı

// Ekranları İçe Aktar (uzantılar .js olarak varsayılır)
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import CompletedScreen from './src/screens/CompletedScreen';

// Tip zorlaması kaldırıldı
const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const isDarkMode = useColorScheme() === 'dark';
  
  // Uygulamanın başlangıç temasını belirle
  const theme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
        ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
        background: '#111',
        card: '#222',
        text: '#fff',
        primary: '#007AFF',
    },
  };
  
  // Başlangıç rotasını belirleyen fonksiyon
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const profile = await getProfile();
        // Profil varsa Home'dan, yoksa Onboarding'den başla
        setInitialRoute(profile ? 'Home' : 'Onboarding');
      } catch (e) {
        console.error("Profil kontrol edilirken hata oluştu:", e);
        setInitialRoute('Onboarding');
      }
    };

    checkProfile();
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerTintColor: theme.colors.text,
          contentStyle: {
            backgroundColor: theme.colors.background,
          }
        }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen} 
          options={{ title: 'Hoş Geldiniz' }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Günlük Görev' }} 
        />
        <Stack.Screen 
          name="Completed" 
          component={CompletedScreen} 
          options={{ title: 'Tamamlananlar' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;