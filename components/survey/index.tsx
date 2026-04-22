import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import WelcomeStage from "./welcome";
import { SURVEY_QUESTIONS, SurveyStage } from "./survey-cofig";
import QuestionStage from "./questions";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/colors";
import ThankYouStage from "./thank-you";

const { width, height } = Dimensions.get("window");

interface SurveyModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function SurveyModal({
  visible,
  onClose,
  onComplete,
}: SurveyModalProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [stage, setStage] = useState<SurveyStage>("welcome");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeTransition = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleStart = () => {
    fadeTransition(() => {
      setCurrentQ(0);
      setStage("questions");
    });
  };

  const handleNext = () => {
    if (currentQ < SURVEY_QUESTIONS.length - 1) {
      fadeTransition(() => setCurrentQ((q) => q + 1));
    } else {
      // ✅ Move to loading first
      fadeTransition(() => setStage("loading"));

      // ✅ Then show thank you AFTER delay
      setTimeout(() => {
        fadeTransition(() => setStage("thankyou"));
      }, 2000);
    }
  };

  const handleClose = () => {
    // reset everything
    setStage("welcome");
    setCurrentQ(0);
    setAnswers({});
    onClose();
  };

  const handleThankYouClose = () => {
    // ✅ Now mark as completed AFTER user sees thank you
    onComplete?.();
    handleClose();
  };

  const setAnswer = (id: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const question = SURVEY_QUESTIONS[currentQ];
  const isWelcome = stage === "welcome";

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <View style={styles.overlay}>
        
        {/* Welcome */}
        {isWelcome && (
          <Animated.View style={[styles.welcomeSheet, { opacity: fadeAnim }]}>
            <WelcomeStage onStart={handleStart} onClose={handleClose} />
          </Animated.View>
        )}

        {/* Other stages */}
        {!isWelcome && (
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              {stage === "questions" && question && (
                <QuestionStage
                  question={question}
                  questionIndex={currentQ}
                  totalQuestions={SURVEY_QUESTIONS.length}
                  answer={answers[question.id]}
                  onAnswer={(value) => setAnswer(question.id, value)}
                  onNext={handleNext}
                  onClose={handleClose}
                  isLastQuestion={currentQ === SURVEY_QUESTIONS.length - 1}
                />
              )}

              {stage === "loading" && (
                <ActivityIndicator
                  size="small"
                  color={C.primary}
                  style={{ marginTop: 40 }}
                />
              )}

              {stage === "thankyou" && (
                <ThankYouStage onClose={handleThankYouClose} />
              )}
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  welcomeSheet: {
    width: width,
    height: 550,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 60,
    maxHeight: height * 0.78,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
});