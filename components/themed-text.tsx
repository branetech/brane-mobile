import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'regular';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
    style={[
      { color },
      type === 'default' ? styles.default : undefined,
      type === 'title' ? styles.title : undefined,
      type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
      type === 'subtitle' ? styles.subtitle : undefined,
      type === 'link' ? styles.link : undefined,
      type === 'regular' ? styles.regular : undefined,
      style,
    ]}
    {...rest}
  />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#85808A',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  regular:{
    lineHeight: 43,
    fontSize: 36,
  }
});
