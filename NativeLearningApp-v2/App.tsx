import 'react-native-url-polyfill/auto'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StripeProvider } from '@stripe/stripe-react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthProvider } from './hooks/useAuth'
import './global.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
            <AuthProvider>
              <StatusBar style="auto" />
              <Stack>
                <Stack.Screen 
                  name="index" 
                  options={{ 
                    title: 'Welcome',
                    headerShown: false 
                  }} 
                />
                <Stack.Screen 
                  name="(auth)" 
                  options={{ 
                    headerShown: false,
                    presentation: 'modal'
                  }} 
                />
                <Stack.Screen 
                  name="(tabs)" 
                  options={{ 
                    headerShown: false 
                  }} 
                />
                <Stack.Screen 
                  name="(admin)" 
                  options={{ 
                    headerShown: false,
                    presentation: 'modal'
                  }} 
                />
              </Stack>
            </AuthProvider>
          </StripeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
