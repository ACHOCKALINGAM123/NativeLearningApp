import React from 'react'
import { View, Text, ScrollView, Pressable, Platform } from 'react-native'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { WebContainer } from '../../components/common/WebContainer'
import { useAuth } from '../../hooks/useAuth'

export default function AdminDashboard() {
  const { appUser, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/')
  }

  if (Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Admin panel is web-only</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb', flexDirection: 'row' }}>
      <StatusBar style="dark" />
      
      {/* Sidebar */}
      <View style={{ 
        width: 280, 
        backgroundColor: '#1f2937', 
        paddingVertical: 32,
        paddingHorizontal: 24,
        minHeight: '100vh' as any
      }}>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold', 
          color: 'white', 
          marginBottom: 48 
        }}>
          NativeLearn Admin
        </Text>

        <View style={{ flex: 1 }}>
          <AdminSidebarItem 
            title="Dashboard" 
            active 
            onPress={() => router.push('/admin')}
          />
          <AdminSidebarItem 
            title="Teachers" 
            onPress={() => router.push('/admin/teachers')}
          />
          <AdminSidebarItem 
            title="Courses" 
            onPress={() => router.push('/admin/courses')}
          />
          <AdminSidebarItem 
            title="Analytics" 
            onPress={() => router.push('/admin/analytics')}
          />
          <AdminSidebarItem 
            title="Settings" 
            onPress={() => router.push('/admin/settings')}
          />
        </View>

        <View style={{ borderTopWidth: 1, borderTopColor: '#374151', paddingTop: 24 }}>
          <Text style={{ color: '#9ca3af', fontSize: 14, marginBottom: 16 }}>
            Logged in as: {appUser?.name}
          </Text>
          <Pressable 
            onPress={handleSignOut}
            style={{ 
              paddingVertical: 12, 
              paddingHorizontal: 16, 
              backgroundColor: '#374151', 
              borderRadius: 8 
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Sign Out</Text>
          </Pressable>
        </View>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 40 }}>
            {/* Header */}
            <View style={{ marginBottom: 48 }}>
              <Text style={{ 
                fontSize: 36, 
                fontWeight: 'bold', 
                color: '#111827', 
                marginBottom: 8 
              }}>
                Dashboard
              </Text>
              <Text style={{ fontSize: 18, color: '#6b7280' }}>
                Welcome to the NativeLearn admin panel
              </Text>
            </View>

            {/* Stats Cards */}
            <View style={{ 
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 24,
              marginBottom: 48,
              ...(Platform.OS === 'web' && {
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
              } as any)
            }}>
              <StatsCard 
                title="Total Users" 
                value="2,847" 
                change="+12%" 
                changeType="positive"
              />
              <StatsCard 
                title="Active Teachers" 
                value="342" 
                change="+8%" 
                changeType="positive"
              />
              <StatsCard 
                title="Total Courses" 
                value="1,256" 
                change="+15%" 
                changeType="positive"
              />
              <StatsCard 
                title="Revenue (30d)" 
                value="$34,250" 
                change="+23%" 
                changeType="positive"
              />
            </View>

            {/* Action Cards */}
            <View style={{ 
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 32,
              marginBottom: 48,
              ...(Platform.OS === 'web' && {
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
              } as any)
            }}>
              <ActionCard
                title="Teacher Verification"
                description="Review and approve new teacher applications"
                buttonText="Review Applications"
                onPress={() => router.push('/admin/teachers')}
                icon="👨‍🏫"
              />
              <ActionCard
                title="Course Moderation"
                description="Review flagged courses and content"
                buttonText="Review Courses"
                onPress={() => router.push('/admin/courses')}
                icon="📚"
              />
            </View>

            {/* Recent Activity */}
            <View>
              <Text style={{ 
                fontSize: 24, 
                fontWeight: 'bold', 
                color: '#111827', 
                marginBottom: 24 
              }}>
                Recent Activity
              </Text>
              <View style={{ 
                backgroundColor: 'white', 
                borderRadius: 12, 
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 1,
              }}>
                <ActivityItem 
                  title="New teacher application" 
                  description="Sarah Johnson applied to teach Python" 
                  time="2 hours ago"
                />
                <ActivityItem 
                  title="Course flagged for review" 
                  description="Advanced React course reported by user" 
                  time="4 hours ago"
                />
                <ActivityItem 
                  title="Payment processed" 
                  description="$150 payment for JavaScript course" 
                  time="6 hours ago"
                />
                <ActivityItem 
                  title="New user registered" 
                  description="Mohamed Ali joined as a student" 
                  time="8 hours ago"
                  isLast
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

function AdminSidebarItem({ title, active = false, onPress }: {
  title: string
  active?: boolean
  onPress: () => void
}) {
  return (
    <Pressable 
      onPress={onPress}
      style={{ 
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: active ? '#374151' : 'transparent',
        marginBottom: 8
      }}
    >
      <Text style={{ 
        color: active ? 'white' : '#d1d5db', 
        fontSize: 16,
        fontWeight: active ? '600' : '400'
      }}>
        {title}
      </Text>
    </Pressable>
  )
}

function StatsCard({ title, value, change, changeType }: {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
}) {
  return (
    <View style={{ 
      backgroundColor: 'white', 
      padding: 24, 
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    }}>
      <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 4 }}>
        {value}
      </Text>
      <Text style={{ 
        fontSize: 14, 
        color: changeType === 'positive' ? '#059669' : '#dc2626' 
      }}>
        {change} from last month
      </Text>
    </View>
  )
}

function ActionCard({ title, description, buttonText, onPress, icon }: {
  title: string
  description: string
  buttonText: string
  onPress: () => void
  icon: string
}) {
  return (
    <View style={{ 
      backgroundColor: 'white', 
      padding: 32, 
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>{icon}</Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 24 }}>
        {description}
      </Text>
      <Pressable 
        onPress={onPress}
        style={{ 
          paddingVertical: 12, 
          paddingHorizontal: 24, 
          backgroundColor: '#2563eb', 
          borderRadius: 8 
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>
          {buttonText}
        </Text>
      </Pressable>
    </View>
  )
}

function ActivityItem({ title, description, time, isLast = false }: {
  title: string
  description: string
  time: string
  isLast?: boolean
}) {
  return (
    <View style={{ 
      paddingBottom: isLast ? 0 : 20, 
      marginBottom: isLast ? 0 : 20,
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: '#e5e7eb'
    }}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
        {description}
      </Text>
      <Text style={{ fontSize: 12, color: '#9ca3af' }}>
        {time}
      </Text>
    </View>
  )
}