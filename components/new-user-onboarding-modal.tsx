import React, { useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from '@idimma/rn-widget';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { CloseCircle, Wallet, ShoppingCart, TrendUp, Check } from 'iconsax-react-native';
import { useRouter } from 'expo-router';
import { setShowNewUserModal } from '@/redux/slice/auth-slice';

type Scheme = 'light' | 'dark';

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  completed: boolean;
}

interface NewUserOnboardingModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NewUserOnboardingModal: React.FC<NewUserOnboardingModalProps> = ({
  visible,
  onClose,
}) => {
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === 'dark' ? 'dark' : 'light';
  const C = Colors[scheme];

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const tasks: OnboardingTask[] = [
    {
      id: 'fund-wallet',
      title: 'Fund Your Wallet',
      description: 'Touch the fingerprint sensor to verify',
      icon: <Wallet size={24} color={C.primary} />,
      route: '/wallet',
      completed: completedTasks.has('fund-wallet'),
    },
    {
      id: 'buy-airtime',
      title: 'Buy Airtime or Data',
      description: 'Buy airtime or data to earn (10% bracs)',
      icon: <ShoppingCart size={24} color={C.primary} />,
      route: '/buy-airtime',
      completed: completedTasks.has('buy-airtime'),
    },
    {
      id: 'explore-investment',
      title: 'Explore Investments',
      description: 'Invest in different stock asset to start growing wealth',
      icon: <TrendUp size={24} color={C.primary} />,
      route: '/(tabs)/stocks',
      completed: completedTasks.has('explore-investment'),
    },
  ];

  const handleTaskPress = (route: string, taskId: string) => {
    setCompletedTasks((prev) => {
      const updated = new Set(prev);
      updated.add(taskId);
      return updated;
    });
    router.push(route as any);
    onClose();
  };

  const allTasksCompleted = completedTasks.size === tasks.length;

  const handleClose = () => {
    dispatch(setShowNewUserModal(false));
    onClose();
  };

  const firstName = user?.firstName || 'Welcome';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: C.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 32,
            maxHeight: '85%',
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={handleClose}
              style={{ alignSelf: 'flex-end', marginBottom: 16 }}
            >
              <CloseCircle size={24} color={C.text} />
            </TouchableOpacity>

            {/* Header */}
            <View style={{ marginBottom: 28 }}>
              <ThemedText
                type="title"
                style={{
                  fontSize: 24,
                  fontWeight: '600',
                  color: C.text,
                  marginBottom: 8,
                }}
              >
                Welcome, {firstName}!
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 14,
                  color: C.muted,
                  lineHeight: 20,
                }}
              >
                How would you like to start with your app?             
              </ThemedText>
            </View>

            {/* Tasks List */}
            <View style={{ marginBottom: 24, gap: 12 }}>
              {tasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => handleTaskPress(task.route, task.id)}
                  style={{
                    borderWidth: 1.5,
                    borderColor: task.completed ? C.primary : C.border,
                    borderRadius: 12,
                    padding: 14,
                    backgroundColor: task.completed
                      ? C.primary + '10'
                      : C.inputBg,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        backgroundColor: C.primary + '15',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {task.icon}
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: C.text,
                          marginBottom: 2,
                        }}
                      >
                        {task.title}
                      </ThemedText>
                      <ThemedText
                        style={{
                          fontSize: 12,
                          color: C.muted,
                        }}
                      >
                        {task.description}
                      </ThemedText>
                    </View>
                  </View>
                  {task.completed && (
                    <Check size={24} color={C.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Progress Text */}
            <ThemedText
              style={{
                fontSize: 13,
                color: C.muted,
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              {completedTasks.size} of {tasks.length} completed
            </ThemedText>

            {/* Action Button */}
            {/* <BraneButton
              text={allTasksCompleted ? 'All Set!' : 'Get Started'}
              onPress={handleClose}
              backgroundColor={C.primary}
              textColor="#D2F1E4"
              height={52}
              radius={12}
            /> */}

            {/* Info Text */}
            <ThemedText
              style={{
                fontSize: 11,
                color: C.muted,
                marginTop: 16,
                textAlign: 'center',
                lineHeight: 16,
              }}
            >
              You can access these features anytime from the home screen or navigation menu.
            </ThemedText>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
