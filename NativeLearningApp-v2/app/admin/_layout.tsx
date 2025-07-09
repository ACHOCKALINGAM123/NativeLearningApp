import React from 'react'
import { View, Text, Platform, Alert } from 'react-native'
import { Stack, router } from 'expo-router'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLayout() {
  const { appUser, loading } = useAuth()

  React.useEffect(() => {
    // Redirect if not web platform
    if (Platform.OS !== 'web') {
      Alert.alert('Admin Panel', 'Admin panel is only available on web')
      router.back()
      return
    }

    // Check if user is admin
    if (!loading && (!appUser || appUser.role !== 'admin')) {
      Alert.alert('Access Denied', 'You do not have admin privileges')
      router.replace('/')
      return
    }
  }, [appUser, loading])

  if (Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Admin panel is web-only</Text>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading admin panel...</Text>
      </View>
    )
  }

  if (!appUser || appUser.role !== 'admin') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Access denied</Text>
      </View>
    )
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="teachers" />
      <Stack.Screen name="courses" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="settings" />
    </Stack>
  )
}