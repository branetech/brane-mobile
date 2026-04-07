import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  setOnboardingStepsCompleted,
  setShowNewUserModal,
} from "@/redux/slice/auth-slice";
import { useAppState } from "@/redux/store";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import {
  Check,
  CloseCircle,
  ShoppingCart,
  TrendUp,
  Wallet,
} from "iconsax-react-native";
import React from "react";
import { Modal, ScrollView, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

type Scheme = "light" | "dark";

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
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const dispatch = useDispatch();
  const router = useRouter();
  const { user, onboardingStepsCompleted = [] } = useAppState();

  const tasks: OnboardingTask[] = [
    {
      id: "fund-wallet",
      title: "Fund Your Wallet",
      description: "Touch the fingerprint sensor to verify",
      icon: <Wallet size={24} color={C.primary} />,
      route: "/wallet",
      completed: onboardingStepsCompleted.includes("fund-wallet"),
    },
    {
      id: "buy-airtime",
      title: "Buy Airtime or Data",
      description: "Buy airtime or data to earn (10% bracs)",
      icon: <ShoppingCart size={24} color={C.primary} />,
      route: "/buy-airtime",
      completed: onboardingStepsCompleted.includes("buy-airtime"),
    },
    {
      id: "explore-investment",
      title: "Explore Investments",
      description: "Invest in different stock asset to start growing wealth",
      icon: <TrendUp size={24} color={C.primary} />,
      route: "/(tabs)/stocks",
      completed: onboardingStepsCompleted.includes("explore-investment"),
    },
  ];

  const handleTaskPress = (route: string, taskId: string) => {
    if (!onboardingStepsCompleted.includes(taskId)) {
      const updated = [...onboardingStepsCompleted, taskId];
      dispatch(setOnboardingStepsCompleted(updated));
    }
    router.push(route as any);
    // Do NOT close modal here; modal stays until all steps are done
  };

  const allTasksCompleted = onboardingStepsCompleted.length === tasks.length;

  const handleClose = () => {
    dispatch(setShowNewUserModal(false));
    onClose();
  };

  const firstName = user?.firstName || "Welcome";

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(1, 61, 37, 0.3)",
          justifyContent: "flex-end",
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
            // maxHeight: '85%',
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Close Button (always enabled) */}
            <TouchableOpacity
              onPress={handleClose}
              style={{ alignSelf: "flex-end", marginBottom: 16 }}
            >
              <CloseCircle size={24} color={C.text} />
            </TouchableOpacity>

            {/* Header */}
            <View style={{ marginBottom: 28 }}>
              <ThemedText
                type='title'
                style={{
                  fontSize: 24,
                  fontWeight: "600",
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
                      ? C.primary + "10"
                      : C.inputBg,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        backgroundColor: C.primary + "15",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {task.icon}
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
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
                  {task.completed && <Check size={24} color={C.primary} />}
                </TouchableOpacity>
              ))}
            </View>

            {/* Progress Text */}
            <ThemedText
              style={{
                fontSize: 13,
                color: C.muted,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              {onboardingStepsCompleted.length} of {tasks.length} completed
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
                textAlign: "center",
                lineHeight: 16,
              }}
            >
              You can access these features anytime from the home screen or
              navigation menu.
            </ThemedText>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
