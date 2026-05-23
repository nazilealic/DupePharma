import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { COLORS } from '../components/theme';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SkinProfileScreen from '../screens/SkinProfileScreen';
import PharmacyScreen from '../screens/PharmacyScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminScreen from '../screens/AdminScreen';
import SearchHistoryScreen from '../screens/SearchHistoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

function MainTabs() {
  const { isAdmin } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text3,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          title: 'Urunler',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💊" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favoriler',
          tabBarIcon: ({ focused }) => <TabIcon emoji="♥" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="SearchHistory"
        component={SearchHistoryScreen}
        options={{
          title: 'Gecmis',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🕐" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="SkinProfile"
        component={SkinProfileScreen}
        options={{
          title: 'Cilt Profili',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🧴" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Pharmacy"
        component={PharmacyScreen}
        options={{
          title: 'Eczane',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏥" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  const { isAdmin } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.white },
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontWeight: '700', color: COLORS.text },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({
          title: route.params?.name || 'Urun Detayi',
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={({ route }) => ({
          title: route.params?.productName ? `${route.params.productName} - Yorumlar` : 'Yorumlar',
          headerShown: true,
        })}
      />
      {isAdmin && (
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: 'Admin Paneli', headerShown: true }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white }}>
        <Text style={{ fontSize: 48 }}>💊</Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.primary, marginTop: 12 }}>DupePharma</Text>
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}