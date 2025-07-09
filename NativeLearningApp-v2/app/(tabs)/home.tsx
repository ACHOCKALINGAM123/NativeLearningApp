import React from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'
import { useAuth } from '../../hooks/useAuth'
import { Ionicons } from '@expo/vector-icons'

export default function HomeScreen() {
  const { appUser, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/')
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>
              Welcome back, {appUser?.name || 'Learner'}!
            </Text>
            <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 4 }}>
              Ready to continue your learning journey?
            </Text>
          </View>
          <Pressable onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#6b7280" />
          </Pressable>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
          Quick Actions
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <QuickActionCard
            icon="search"
            title="Find Teachers"
            subtitle="Browse available teachers"
            onPress={() => router.push('/(tabs)/explore')}
          />
          <QuickActionCard
            icon="chatbubble"
            title="Ask AI"
            subtitle="Get learning guidance"
            onPress={() => router.push('/(tabs)/chat')}
          />
        </View>
      </View>

      {/* Continue Learning Section */}
      <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
          Continue Learning
        </Text>
        <View style={{ backgroundColor: '#f9fafb', borderRadius: 16, padding: 20 }}>
          <Text style={{ color: '#6b7280', textAlign: 'center' }}>
            No active courses yet. Start learning by exploring available courses!
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)/explore')}
            style={{ backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 8, marginTop: 16 }}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
              Explore Courses
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Featured Categories */}
      <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
          Popular Categories
        </Text>
        <View style={{ gap: 12 }}>
          <CategoryCard
            icon="💻"
            title="Programming & Tech"
            description="Learn coding, web development, and more"
            onPress={() => router.push('/(tabs)/explore')}
          />
          <CategoryCard
            icon="💼"
            title="Business & Finance"
            description="Excel, project management, and business skills"
            onPress={() => router.push('/(tabs)/explore')}
          />
          <CategoryCard
            icon="🎨"
            title="Design & Creative"
            description="Graphic design, UI/UX, and creative skills"
            onPress={() => router.push('/(tabs)/explore')}
          />
        </View>
      </View>

      {/* Become a Teacher CTA */}
      {appUser?.role === 'student' && (
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <View style={{ backgroundColor: '#ecfdf5', borderRadius: 16, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#059669', marginBottom: 8 }}>
              Become a Teacher
            </Text>
            <Text style={{ color: '#047857', marginBottom: 16 }}>
              Share your skills and earn money by teaching others in your native language.
            </Text>
            <Pressable
              onPress={() => router.push('/(auth)/teacher-signup')}
              style={{ backgroundColor: '#059669', paddingVertical: 12, borderRadius: 8 }}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
                Start Teaching
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

function QuickActionCard({ icon, title, subtitle, onPress }: {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle: string
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
      }}
    >
      <Ionicons name={icon} size={24} color="#2563eb" />
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginTop: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
        {subtitle}
      </Text>
    </Pressable>
  )
}

function CategoryCard({ icon, title, description, onPress }: {
  icon: string
  title: string
  description: string
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
          {title}
        </Text>
        <Text style={{ fontSize: 14, color: '#6b7280' }}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </Pressable>
  )
}