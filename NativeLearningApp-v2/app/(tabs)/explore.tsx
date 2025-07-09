import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, TextInput, Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { WebContainer, WebGrid, ResponsiveView } from '../../components/common/WebContainer'
import { Ionicons } from '@expo/vector-icons'
import { SKILL_CATEGORIES } from '../../constants/categories'
import { LANGUAGES } from '../../constants/languages'

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ backgroundColor: '#f8fafc', paddingVertical: Platform.OS === 'web' ? 40 : 20 }}>
        <WebContainer maxWidth="xl">
          <Text style={{ 
            fontSize: Platform.OS === 'web' ? 36 : 28, 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: 8,
            textAlign: Platform.OS === 'web' ? 'left' : 'center'
          }}>
            Explore Courses
          </Text>
          <Text style={{ 
            fontSize: Platform.OS === 'web' ? 18 : 16, 
            color: '#6b7280',
            textAlign: Platform.OS === 'web' ? 'left' : 'center'
          }}>
            Find the perfect teacher and course for your learning journey
          </Text>
        </WebContainer>
      </View>

      {/* Search and Filters */}
      <View style={{ paddingVertical: Platform.OS === 'web' ? 40 : 24 }}>
        <WebContainer maxWidth="xl">
          <ResponsiveView
            web={
              // Web Layout - Horizontal filters
              <View>
                {/* Search Bar */}
                <View style={{ marginBottom: 32 }}>
                  <View style={{ 
                    flexDirection: 'row', 
                    backgroundColor: 'white',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    alignItems: 'center',
                    maxWidth: 600
                  }}>
                    <Ionicons name="search" size={20} color="#9ca3af" />
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search courses, teachers, or skills..."
                      style={{ flex: 1, marginLeft: 12, fontSize: 16 }}
                    />
                  </View>
                </View>

                {/* Filters Row */}
                <View style={{ flexDirection: 'row', gap: 24, marginBottom: 48 }}>
                  {/* Categories */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                      Category
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={{ flexDirection: 'row', gap: 12 }}>
                        {SKILL_CATEGORIES.map((category) => (
                          <FilterChip
                            key={category.id}
                            label={category.name}
                            icon={category.icon}
                            selected={selectedCategory === category.id}
                            onPress={() => setSelectedCategory(
                              selectedCategory === category.id ? null : category.id
                            )}
                          />
                        ))}
                      </View>
                    </ScrollView>
                  </View>

                  {/* Languages */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                      Language
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={{ flexDirection: 'row', gap: 12 }}>
                        {LANGUAGES.slice(0, 8).map((language) => (
                          <FilterChip
                            key={language.code}
                            label={language.name}
                            icon={language.flag}
                            selected={selectedLanguage === language.code}
                            onPress={() => setSelectedLanguage(
                              selectedLanguage === language.code ? null : language.code
                            )}
                          />
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                </View>
              </View>
            }
            mobile={
              // Mobile Layout - Stacked filters
              <View style={{ paddingHorizontal: 24 }}>
                {/* Search Bar */}
                <View style={{ marginBottom: 24 }}>
                  <View style={{ 
                    flexDirection: 'row', 
                    backgroundColor: 'white',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    alignItems: 'center'
                  }}>
                    <Ionicons name="search" size={20} color="#9ca3af" />
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search courses..."
                      style={{ flex: 1, marginLeft: 12, fontSize: 16 }}
                    />
                  </View>
                </View>

                {/* Categories */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                    Categories
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', gap: 12, paddingRight: 24 }}>
                      {SKILL_CATEGORIES.map((category) => (
                        <FilterChip
                          key={category.id}
                          label={category.name}
                          icon={category.icon}
                          selected={selectedCategory === category.id}
                          onPress={() => setSelectedCategory(
                            selectedCategory === category.id ? null : category.id
                          )}
                        />
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* Languages */}
                <View style={{ marginBottom: 32 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                    Languages
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', gap: 12, paddingRight: 24 }}>
                      {LANGUAGES.slice(0, 8).map((language) => (
                        <FilterChip
                          key={language.code}
                          label={language.name}
                          icon={language.flag}
                          selected={selectedLanguage === language.code}
                          onPress={() => setSelectedLanguage(
                            selectedLanguage === language.code ? null : language.code
                          )}
                        />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            }
          />
        </WebContainer>
      </View>

      {/* Course Grid */}
      <View style={{ paddingBottom: Platform.OS === 'web' ? 80 : 40 }}>
        <WebContainer maxWidth="xl">
          <Text style={{ 
            fontSize: Platform.OS === 'web' ? 28 : 24, 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: Platform.OS === 'web' ? 32 : 24,
            paddingHorizontal: Platform.OS === 'web' ? 0 : 24
          }}>
            Featured Courses
          </Text>
          
          <WebGrid 
            columns={Platform.OS === 'web' ? 3 : 1} 
            gap={Platform.OS === 'web' ? 24 : 16}
            style={{ paddingHorizontal: Platform.OS === 'web' ? 0 : 24 }}
          >
            <CourseCard
              title="Complete Python Bootcamp"
              teacher="Maria García"
              language="Spanish"
              price="£45/hour"
              rating={4.9}
              students={234}
              image="🐍"
            />
            <CourseCard
              title="React Native Development"
              teacher="Ahmed Hassan"
              language="Arabic"
              price="£55/hour"
              rating={4.8}
              students={189}
              image="⚛️"
            />
            <CourseCard
              title="Data Science with R"
              teacher="Priya Sharma"
              language="Hindi"
              price="£40/hour"
              rating={4.9}
              students={156}
              image="📊"
            />
                         <CourseCard
               title="UI/UX Design Fundamentals"
               teacher="Jean Dubois"
               language="French"
               price="£50/hour"
               rating={4.7}
               students={298}
               image="🎨"
             />
            <CourseCard
              title="Japanese for Beginners"
              teacher="Hiroshi Tanaka"
              language="Japanese"
              price="£35/hour"
              rating={4.9}
              students={445}
              image="🗾"
            />
            <CourseCard
              title="Digital Marketing"
              teacher="Sofia Romano"
              language="Italian"
              price="£42/hour"
              rating={4.6}
              students={167}
              image="📱"
            />
          </WebGrid>
        </WebContainer>
      </View>
    </ScrollView>
  )
}

function FilterChip({ label, icon, selected, onPress }: {
  label: string
  icon: string
  selected: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: selected ? '#2563eb' : '#f3f4f6',
        borderWidth: 1,
        borderColor: selected ? '#2563eb' : '#d1d5db',
        minWidth: Platform.OS === 'web' ? 120 : 100,
      }}
    >
      <Text style={{ fontSize: 14, marginRight: 6 }}>{icon}</Text>
      <Text style={{
        fontSize: 14,
        fontWeight: '500',
        color: selected ? 'white' : '#374151',
      }}>
        {label}
      </Text>
    </Pressable>
  )
}

function CourseCard({ title, teacher, language, price, rating, students, image }: {
  title: string
  teacher: string
  language: string
  price: string
  rating: number
  students: number
  image: string
}) {
  return (
    <Pressable style={{
      backgroundColor: 'white',
      borderRadius: 16,
      padding: Platform.OS === 'web' ? 24 : 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      marginBottom: Platform.OS === 'web' ? 0 : 16,
    }}>
      {/* Course Image/Icon */}
      <View style={{ 
        backgroundColor: '#f3f4f6', 
        borderRadius: 12, 
        padding: Platform.OS === 'web' ? 20 : 16,
        alignItems: 'center',
        marginBottom: 16
      }}>
        <Text style={{ fontSize: Platform.OS === 'web' ? 48 : 36 }}>{image}</Text>
      </View>

      {/* Course Info */}
      <Text style={{ 
        fontSize: Platform.OS === 'web' ? 20 : 18, 
        fontWeight: 'bold', 
        color: '#111827', 
        marginBottom: 8 
      }}>
        {title}
      </Text>
      
      <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
        by {teacher}
      </Text>
      
      <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>
        🌐 {language}
      </Text>

      {/* Stats */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text style={{ fontSize: 14, color: '#374151', marginLeft: 4 }}>
            {rating}
          </Text>
        </View>
        <Text style={{ fontSize: 14, color: '#6b7280' }}>
          {students} students
        </Text>
      </View>

      {/* Price */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#059669' }}>
          {price}
        </Text>
        <Pressable style={{
          backgroundColor: '#2563eb',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
        }}>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
            Book Now
          </Text>
        </Pressable>
      </View>
    </Pressable>
  )
}