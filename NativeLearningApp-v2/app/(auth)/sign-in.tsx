import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAuth } from '../../hooks/useAuth'

export default function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      Alert.alert('Sign In Error', error.message)
    } else {
      router.replace('/(tabs)/home')
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      
      <View style={{ paddingHorizontal: 24, paddingTop: 60 }}>
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Pressable
            onPress={() => router.back()}
            style={{ marginBottom: 16 }}
          >
            <Text style={{ fontSize: 16, color: '#6b7280' }}>← Back</Text>
          </Pressable>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111827' }}>
            Welcome Back
          </Text>
          <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 8 }}>
            Sign in to continue learning
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16 }}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Email Address
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
              }}
            />
          </View>

          <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={{ textAlign: 'right', color: '#2563eb', fontSize: 14 }}>
              Forgot Password?
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSignIn}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              paddingVertical: 16,
              borderRadius: 12,
              marginTop: 8,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '600' }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <Text style={{ color: '#6b7280' }}>
            Don't have an account?{' '}
            <Text
              style={{ color: '#2563eb', fontWeight: '600' }}
              onPress={() => router.push('/(auth)/sign-up')}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}