import { BraneButton } from '@/components/brane-button';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import expoSecureStorage from '@/utils/secureStore';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const SLIDES = [
  {
    image: require('@/assets/images/onboard/container.png'),
    title: 'Get rewarded on every top-up',
    body: "With every data and airtime recharge, you're not just topping up your phone you're building your investment portfolio.",
  },
  {
    image: require('@/assets/images/onboard/container_1.png'),
    title: 'Grow your wealth',
    body: 'Just pay bills as usual—Brane handles the rest.',
  },
  {
    image: require('@/assets/images/onboard/container_2.png'),
    title: 'Your Path to Ownership',
    body: 'Every purchase moves you closer to financial growth and ownership.',
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const timer = setTimeout(goToNextSlide, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, goToNextSlide]);

  const completeOnboarding = async () => {
    await expoSecureStorage.setItem("hasCompletedOnboarding", "true");
  };

  const handleCreateAccount = async () => {
    await completeOnboarding();
    router.replace('/(auth)/signup');
  };

  const handleLogin = async () => {
    await completeOnboarding();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Animated.View
          key={currentIndex}
          entering={FadeInRight.duration(300)}
          exiting={FadeOutLeft.duration(300)}
          style={styles.imageWrapper}
        >
          <Image
            source={SLIDES[currentIndex].image}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View style={[styles.contentContainer, { backgroundColor: C.background }]}>
        <View style={styles.textContainer}>
          <ThemedText style={[styles.title, { color: C.text }]}>{SLIDES[currentIndex].title}</ThemedText>
          <ThemedText style={[styles.body, { color: C.muted }]}>{SLIDES[currentIndex].body}</ThemedText>
        </View>

        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? [styles.activeDot, { backgroundColor: C.primary }] : [styles.inactiveDot, { backgroundColor: C.border }],
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <BraneButton
            onPress={handleCreateAccount}
            text="Create Account"
            style={styles.createAccountButton}
            backgroundColor={C.primary}
            textColor={C.background}
            fontSize={16}
          />
          <BraneButton
            onPress={handleLogin}
            text="Login"
            style={styles.loginButton}
            textColor={C.primary}
            backgroundColor={C.googleBg}
            fontSize={16}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  imageContainer: {
    height: height * 0.55,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: '6%',
    paddingVertical: '10%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
    height: height * 0.1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
  },
  body: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
  },
  dot: {
    borderRadius: 2,
  },
  activeDot: {
    width: 24,
    height: 4,
  },
  inactiveDot: {
    width: 8,
    height: 4,
  },
  buttonContainer: {
    gap: 15,
    marginTop: 20,
  },
  createAccountButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});