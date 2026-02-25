import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import { Chart1, Receipt, WifiSquare, Home3, Profile } from 'iconsax-react-native';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // #F7F7F8E5
  return (
     <Tabs
    screenOptions={{
        tabBarActiveTintColor: '#013D25',
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIconStyle: { marginHorizontal: 'auto' },
        
        tabBarStyle: Platform.select({
            ios: {
                position: 'absolute',
                height: 80,
                paddingTop: 12,
                backgroundColor: '#F7F7F8E5',
            },
            default: {
                backgroundColor: '#F7F7F8E5',
                height: 80,
                paddingTop: 12,
            },
        }),
    }}>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color, focused }) => <Home3 size={24} color={color} variant={focused ? 'Bold' : 'Outline'}/>,
    }}
  />
  <Tabs.Screen
        name="utilities"
        options={{
          title: 'Utilities',
          tabBarIcon: ({ color, focused }) => <WifiSquare size={24} color={color} variant={focused ? 'Bold' : 'Outline'}/>,        }}
      />
      
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color, focused }) => <Chart1 size={24} color={color} variant={focused ? 'Bold' : 'Outline'}/>,        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, focused }) => <Receipt size={24} color={color} variant={focused ? 'Bold' : 'Outline'}/>,        }}
      />
       <Tabs.Screen
        name="(account)"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => <Profile size={24} color={color} variant={focused ? 'Bold' : 'Outline'}/>,        }}
      />
    </Tabs>
  );
}
