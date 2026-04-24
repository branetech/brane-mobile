import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { showSuccess } from "@/utils/helpers";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import QuestionStage from "./questions";
import { Question, SURVEY_QUESTIONS, SurveyStage } from "./survey-cofig";
import ThankYouStage from "./thank-you";
import WelcomeStage from "./welcome";

const { width, height } = Dimensions.get("window");

interface SurveyModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const transformApiQuestion = (apiQuestion: any): Question => {
  const typeMap: Record<string, any> = {
    RATING_SCALE: "rating",
    TEXT: "text",
    SINGLE_CHOICE: "single_choice",
    MULTIPLE_CHOICE: "multiple_choice",
  };

  const transformedQuestion: Question = {
    id: apiQuestion.id,
    type: typeMap[apiQuestion.type] || "text",
    question: apiQuestion.questionText,
  };

  if (apiQuestion.type === "RATING_SCALE") {
    const range =
      (apiQuestion.maxRating || 5) - (apiQuestion.minRating || 1) + 1;
    transformedQuestion.ratingLabels = Array.from({ length: range }, (_, i) =>
      String((apiQuestion.minRating || 1) + i),
    );
  } else if (apiQuestion.options) {
    transformedQuestion.options = apiQuestion.options;
  }

  return transformedQuestion;
};

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
  const [surveys, setSurveys] = useState<any>(null);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;

    const fetchSurvey = async () => {
      setSurveyLoading(true);
      try {
        const res: any = await BaseRequest.get(
          "/auth-service/surveys?type=FEEDBACK",
        );
        if (res && Array.isArray(res)) {
          const activeSurvey = res.find(
            (s: any) => s.status === "ACTIVE" && !s.hasResponded,
          );
          if (activeSurvey) {
            const sortedQuestions = activeSurvey.questions.sort(
              (a: any, b: any) => a.order - b.order,
            );
            setSurveys({
              ...activeSurvey,
              questions: sortedQuestions.map(transformApiQuestion),
            });
          }
        }
      } catch (error) {
        catchError(error);
        setSurveys(null);
      } finally {
        setSurveyLoading(false);
      }
    };

    fetchSurvey();
  }, [visible]);

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
    const currentQuestions = surveys?.questions || SURVEY_QUESTIONS;
    if (currentQ < currentQuestions.length - 1) {
      fadeTransition(() => setCurrentQ((q) => q + 1));
    } else {
      // ✅ Move to loading first
      fadeTransition(() => setStage("loading"));

      // ✅ Submit survey if API data exists
      if (surveys?.id) {
        submitSurvey();
      } else {
        // Then show thank you AFTER delay
        setTimeout(() => {
          fadeTransition(() => setStage("thankyou"));
        }, 2000);
      }
    }
  };

  const submitSurvey = async () => {
    try {
      const responses = Object.entries(answers)
        .map(([questionId, answer]) => {
          const apiQuestion = surveys?.questions?.find(
            (q: any) => q.id === questionId,
          );

          if (!apiQuestion) return null;

          const typeMap: Record<string, any> = {
            rating: "RATING_SCALE",
            text: "TEXT",
            single_choice: "SINGLE_CHOICE",
            multiple_choice: "MULTIPLE_CHOICE",
          };

          const apiType = typeMap[apiQuestion.type] || "TEXT";

          switch (apiType) {
            case "RATING_SCALE":
              return {
                questionId,
                responseValue: Number(answer),
              };

            case "TEXT":
              return {
                questionId,
                responseText: String(answer),
              };

            case "SINGLE_CHOICE":
              return {
                questionId,
                selectedOptions: [String(answer)],
              };

            case "MULTIPLE_CHOICE":
              return {
                questionId,
                selectedOptions: Array.isArray(answer) ? answer : [answer],
              };

            default:
              return null;
          }
        })
        .filter(Boolean);

      await BaseRequest.post(`/auth-service/surveys/${surveys.id}/responses`, {
        responses,
      });

      showSuccess("Survey submitted successfully");

      setTimeout(() => {
        fadeTransition(() => setStage("thankyou"));
      }, 500);
    } catch (error) {
      catchError(error);
      setTimeout(() => {
        fadeTransition(() => setStage("thankyou"));
      }, 500);
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

  const currentQuestions = surveys?.questions || SURVEY_QUESTIONS;
  const question = currentQuestions[currentQ];
  const isWelcome = stage === "welcome";

  // Show loading while fetching survey
  if (surveyLoading) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <View style={[styles.overlay, { justifyContent: "center" }]}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      </Modal>
    );
  }

  // Don't show survey modal if no survey found
  if (visible && !surveys && !surveyLoading) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
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
                  totalQuestions={currentQuestions.length}
                  answer={answers[question.id]}
                  onAnswer={(value) => setAnswer(question.id, value)}
                  onNext={handleNext}
                  onClose={handleClose}
                  isLastQuestion={currentQ === currentQuestions.length - 1}
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
