import React from 'react'
import { View, Text, ScrollView, Pressable, Platform } from 'react-native'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAuth } from '../hooks/useAuth'
import { WebContainer, WebGrid, ResponsiveView } from '../components/common/WebContainer'

export default function LandingPage() {
  const { user, loading } = useAuth()

  // Redirect if user is already authenticated
  React.useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/home')
    }
  }, [user, loading])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text style={{ fontSize: 18, color: '#6b7280' }}>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ backgroundColor: '#f8fafc', paddingVertical: 20 }}>
        <WebContainer maxWidth="xl">
          <ResponsiveView
            web={
              // Web Header - Horizontal layout
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 }}>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>
                  NativeLearn
                </Text>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <Pressable 
                    onPress={() => router.push('/(auth)/sign-in')}
                    style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db' }}
                  >
                    <Text style={{ color: '#374151', fontWeight: '500' }}>Sign In</Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => router.push('/(auth)/sign-up')}
                    style={{ paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#2563eb', borderRadius: 8 }}
                  >
                    <Text style={{ color: 'white', fontWeight: '500' }}>Sign Up</Text>
                  </Pressable>
                </View>
              </View>
            }
            mobile={
              // Mobile Header - Vertical layout
              <View style={{ paddingTop: 40 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>NativeLearn</Text>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Pressable 
                      onPress={() => router.push('/(auth)/sign-in')}
                      style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#d1d5db' }}
                    >
                      <Text style={{ color: '#374151', fontSize: 14 }}>Sign In</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => router.push('/(auth)/sign-up')}
                      style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#2563eb', borderRadius: 6 }}
                    >
                      <Text style={{ color: 'white', fontSize: 14 }}>Sign Up</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            }
          />
        </WebContainer>
      </View>

      {/* Hero Section */}
      <View style={{ backgroundColor: '#f8fafc', paddingVertical: Platform.OS === 'web' ? 80 : 40 }}>
        <WebContainer maxWidth="xl">
          <View style={{ alignItems: 'center' }}>
            <Text style={{ 
              fontSize: Platform.OS === 'web' ? 56 : 36, 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: 24,
              textAlign: 'center',
              lineHeight: Platform.OS === 'web' ? 64 : 44
            }}>
              Learn Any Skill.{'\n'}In Your Language.
            </Text>
            <Text style={{ 
              fontSize: Platform.OS === 'web' ? 24 : 18, 
              color: '#6b7280', 
              marginBottom: 40, 
              textAlign: 'center',
              maxWidth: Platform.OS === 'web' ? 600 : 320,
              lineHeight: Platform.OS === 'web' ? 32 : 26
            }}>
              Connect with native-speaking teachers worldwide for personalized learning in your mother tongue.
            </Text>
            
            <ResponsiveView
              web={
                <View style={{ flexDirection: 'row', gap: 24 }}>
                  <Pressable 
                    onPress={() => router.push('/(tabs)/explore')}
                    style={{ paddingHorizontal: 32, paddingVertical: 16, backgroundColor: '#2563eb', borderRadius: 12 }}
                  >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Explore Courses</Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => router.push('/(auth)/teacher-signup')}
                    style={{ paddingHorizontal: 32, paddingVertical: 16, borderWidth: 2, borderColor: '#2563eb', borderRadius: 12 }}
                  >
                    <Text style={{ color: '#2563eb', fontSize: 18, fontWeight: '600' }}>Become a Teacher</Text>
                  </Pressable>
                </View>
              }
              mobile={
                <View style={{ gap: 16, width: '100%' }}>
                  <Pressable 
                    onPress={() => router.push('/(tabs)/explore')}
                    style={{ paddingVertical: 16, backgroundColor: '#2563eb', borderRadius: 12 }}
                  >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>Explore Courses</Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => router.push('/(auth)/teacher-signup')}
                    style={{ paddingVertical: 16, borderWidth: 2, borderColor: '#2563eb', borderRadius: 12 }}
                  >
                    <Text style={{ color: '#2563eb', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>Become a Teacher</Text>
                  </Pressable>
                </View>
              }
            />
          </View>
        </WebContainer>
      </View>

      {/* Features Section */}
      <View style={{ paddingVertical: Platform.OS === 'web' ? 80 : 60 }}>
        <WebContainer maxWidth="xl">
          <Text style={{ 
            fontSize: Platform.OS === 'web' ? 42 : 32, 
            fontWeight: 'bold', 
            textAlign: 'center', 
            color: '#111827', 
            marginBottom: Platform.OS === 'web' ? 64 : 48 
          }}>
            Why Choose NativeLearn?
          </Text>
          
          <WebGrid columns={Platform.OS === 'web' ? 3 : 1} gap={Platform.OS === 'web' ? 32 : 24}>
            <FeatureCard
              icon="🗣️"
              title="Native Language Learning"
              description="Learn from teachers who speak your native language, making complex concepts easier to understand."
            />
            <FeatureCard
              icon="💰"
              title="Teacher-Set Pricing"
              description="Teachers set their own rates, ensuring fair compensation and competitive prices for students."
            />
            <FeatureCard
              icon="📚"
              title="Flexible Learning Options"
              description="Choose from live sessions, self-paced courses, or structured career learning paths."
            />
            <FeatureCard
              icon="🤖"
              title="AI Learning Assistant"
              description="Get personalized recommendations and guidance from our intelligent chatbot."
            />
            <FeatureCard
              icon="🎯"
              title="Career-Focused Paths"
              description="Follow curated learning journeys designed to help you achieve specific career goals."
            />
            <FeatureCard
              icon="⭐"
              title="Quality Assurance"
              description="All teachers are verified, and courses are reviewed to ensure high-quality learning experiences."
            />
          </WebGrid>
        </WebContainer>
      </View>

      {/* CTA Section */}
      <View style={{ backgroundColor: '#f9fafb', paddingVertical: Platform.OS === 'web' ? 80 : 60 }}>
        <WebContainer maxWidth="lg">
          <View style={{ alignItems: 'center' }}>
            <Text style={{ 
              fontSize: Platform.OS === 'web' ? 42 : 32, 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: 16,
              textAlign: 'center'
            }}>
              Ready to Start Learning?
            </Text>
            <Text style={{ 
              fontSize: Platform.OS === 'web' ? 20 : 18, 
              color: '#6b7280', 
              marginBottom: 32,
              textAlign: 'center'
            }}>
              Join thousands of learners connecting with expert teachers worldwide.
            </Text>
            <Pressable 
              onPress={() => router.push('/(auth)/sign-up')}
              style={{ 
                paddingHorizontal: Platform.OS === 'web' ? 40 : 32, 
                paddingVertical: Platform.OS === 'web' ? 20 : 16, 
                backgroundColor: '#059669', 
                borderRadius: 12 
              }}
            >
              <Text style={{ 
                color: 'white', 
                fontSize: Platform.OS === 'web' ? 20 : 18, 
                fontWeight: '600' 
              }}>
                Get Started Free
              </Text>
            </Pressable>
          </View>
        </WebContainer>
      </View>

      {/* Footer */}
      <View style={{ backgroundColor: '#111827', paddingVertical: Platform.OS === 'web' ? 60 : 40 }}>
        <WebContainer maxWidth="xl">
          <ResponsiveView
            web={
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 48, marginBottom: 32 }}>
                  <Pressable><Text style={{ color: '#9ca3af', fontSize: 16 }}>Privacy Policy</Text></Pressable>
                  <Pressable><Text style={{ color: '#9ca3af', fontSize: 16 }}>Terms of Service</Text></Pressable>
                  <Pressable><Text style={{ color: '#9ca3af', fontSize: 16 }}>Contact</Text></Pressable>
                  <Pressable onPress={() => router.push('/admin')}><Text style={{ color: '#9ca3af', fontSize: 16 }}>Admin</Text></Pressable>
                </View>
                <Text style={{ textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
                  © 2024 NativeLearn. All rights reserved.
                </Text>
              </View>
            }
            mobile={
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 24, marginBottom: 16 }}>
                  <Pressable><Text style={{ color: '#9ca3af', fontSize: 14 }}>Privacy Policy</Text></Pressable>
                  <Pressable><Text style={{ color: '#9ca3af', fontSize: 14 }}>Terms of Service</Text></Pressable>
                  <Pressable><Text style={{ color: '#9ca3af', fontSize: 14 }}>Contact</Text></Pressable>
                </View>
                <Text style={{ textAlign: 'center', color: '#6b7280', fontSize: 12 }}>
                  © 2024 NativeLearn. All rights reserved.
                </Text>
              </View>
            }
          />
        </WebContainer>
      </View>
    </ScrollView>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View style={{ 
      padding: Platform.OS === 'web' ? 32 : 24,
      backgroundColor: 'white',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }}>
      <View style={{ 
        width: Platform.OS === 'web' ? 64 : 48, 
        height: Platform.OS === 'web' ? 64 : 48, 
        backgroundColor: '#dbeafe', 
        borderRadius: Platform.OS === 'web' ? 16 : 12, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: 24 
      }}>
        <Text style={{ fontSize: Platform.OS === 'web' ? 32 : 24 }}>{icon}</Text>
      </View>
      <Text style={{ 
        fontSize: Platform.OS === 'web' ? 24 : 20, 
        fontWeight: '600', 
        color: '#111827', 
        marginBottom: 12 
      }}>
        {title}
      </Text>
      <Text style={{ 
        color: '#6b7280', 
        fontSize: Platform.OS === 'web' ? 16 : 14,
        lineHeight: Platform.OS === 'web' ? 24 : 20
      }}>
        {description}
      </Text>
    </View>
  )
}