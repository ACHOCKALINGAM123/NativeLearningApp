import React from 'react'
import { View, Text, ScrollView, Pressable, Image } from 'react-native'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAuth } from '../hooks/useAuth'

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
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 pt-12 pb-6 bg-gradient-to-br from-blue-50 to-green-50">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900">NativeLearn</Text>
          <View className="flex-row space-x-4">
            <Pressable 
              onPress={() => router.push('/(auth)/sign-in')}
              className="px-4 py-2 rounded-lg border border-gray-300"
            >
              <Text className="text-gray-700 font-medium">Sign In</Text>
            </Pressable>
            <Pressable 
              onPress={() => router.push('/(auth)/sign-up')}
              className="px-4 py-2 bg-blue-600 rounded-lg"
            >
              <Text className="text-white font-medium">Sign Up</Text>
            </Pressable>
          </View>
        </View>

        {/* Hero Section */}
        <View className="items-center text-center py-12">
          <Text className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Learn Any Skill.{'\n'}In Your Language.
          </Text>
          <Text className="text-xl text-gray-600 mb-8 text-center max-w-md">
            Connect with native-speaking teachers worldwide for personalized learning in your mother tongue.
          </Text>
          
          <View className="flex-row space-x-4">
            <Pressable 
              onPress={() => router.push('/(tabs)/explore')}
              className="px-8 py-4 bg-blue-600 rounded-xl"
            >
              <Text className="text-white text-lg font-semibold">Explore Courses</Text>
            </Pressable>
            <Pressable 
              onPress={() => router.push('/(auth)/teacher-signup')}
              className="px-8 py-4 border-2 border-blue-600 rounded-xl"
            >
              <Text className="text-blue-600 text-lg font-semibold">Become a Teacher</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View className="px-6 py-12">
        <Text className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose NativeLearn?
        </Text>
        
        <View className="space-y-8">
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
        </View>
      </View>

      {/* CTA Section */}
      <View className="px-6 py-12 bg-gray-50">
        <View className="text-center">
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Learning?
          </Text>
          <Text className="text-lg text-gray-600 mb-8">
            Join thousands of learners connecting with expert teachers worldwide.
          </Text>
          <Pressable 
            onPress={() => router.push('/(auth)/sign-up')}
            className="px-8 py-4 bg-green-600 rounded-xl mx-auto"
          >
            <Text className="text-white text-lg font-semibold">Get Started Free</Text>
          </Pressable>
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 py-8 bg-gray-900">
        <View className="flex-row justify-center space-x-6 mb-4">
          <Pressable>
            <Text className="text-gray-400">Privacy Policy</Text>
          </Pressable>
          <Pressable>
            <Text className="text-gray-400">Terms of Service</Text>
          </Pressable>
          <Pressable>
            <Text className="text-gray-400">Contact</Text>
          </Pressable>
        </View>
        <Text className="text-center text-gray-500 text-sm">
          © 2024 NativeLearn. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View className="flex-row items-start space-x-4">
      <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center">
        <Text className="text-2xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-xl font-semibold text-gray-900 mb-2">{title}</Text>
        <Text className="text-gray-600 leading-relaxed">{description}</Text>
      </View>
    </View>
  )
}