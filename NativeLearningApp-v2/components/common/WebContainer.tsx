import React from 'react'
import { View, ViewProps } from 'react-native'
import { Platform } from 'react-native'

interface WebContainerProps extends ViewProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  center?: boolean
}

export function WebContainer({ 
  children, 
  maxWidth = 'lg', 
  padding = 'md', 
  center = true,
  style,
  ...props 
}: WebContainerProps) {
  const maxWidthStyles = {
    sm: { maxWidth: 640 },
    md: { maxWidth: 768 },
    lg: { maxWidth: 1024 },
    xl: { maxWidth: 1280 },
    full: { maxWidth: '100%' }
  }

  const paddingStyles = {
    none: { paddingHorizontal: 0 },
    sm: { paddingHorizontal: 16 },
    md: { paddingHorizontal: 24 },
    lg: { paddingHorizontal: 32 }
  }

  const webStyles = Platform.OS === 'web' ? {
    ...maxWidthStyles[maxWidth],
    ...(center && { marginHorizontal: 'auto' }),
    width: '100%',
  } : {}

  return (
    <View 
      style={[
        webStyles,
        paddingStyles[padding],
        style
      ]}
      {...props}
    >
      {children}
    </View>
  )
}

export function WebGrid({ 
  children, 
  columns = 1, 
  gap = 16,
  style,
  ...props 
}: {
  children: React.ReactNode
  columns?: number
  gap?: number
} & ViewProps) {
  const webStyles = Platform.OS === 'web' ? {
    display: 'grid' as any,
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gap,
  } : {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  }

  return (
    <View style={[webStyles, style]} {...props}>
      {children}
    </View>
  )
}

export function ResponsiveView({ 
  children,
  web,
  mobile,
  style,
  ...props
}: {
  children?: React.ReactNode
  web?: React.ReactNode
  mobile?: React.ReactNode
} & ViewProps) {
  if (Platform.OS === 'web' && web) {
    return <View style={style} {...props}>{web}</View>
  }
  
  if (Platform.OS !== 'web' && mobile) {
    return <View style={style} {...props}>{mobile}</View>
  }
  
  return <View style={style} {...props}>{children}</View>
}