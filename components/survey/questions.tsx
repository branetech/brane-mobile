import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Question } from "./survey-cofig";
// import { Colors } from "../constants/colors";
import ProgressDots from "./progress";
import MultipleChoice from "./multiplechoice";
import RatingScale from "./rating-scale";
import SingleChoice from "./single-choice";
import TextAnswer from "./answer";
import NpsScale from "./scale";
import { BraneButton } from "../brane-button";
import ProgressCircle from "./progress";

interface QuestionStageProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  answer: any;
  onAnswer: (value: any) => void;
  onNext: () => void;
  onClose: () => void;
  isLastQuestion: boolean;
}

function isAnswered(question: Question, answer: any): boolean {
  if (question.type === "multiple_choice") return Array.isArray(answer) && answer.length > 0;
  if (question.type === "text") return typeof answer === "string" && answer.trim().length > 0;
  return answer !== undefined && answer !== null;
}

export default function QuestionStage({
  question,
  questionIndex,
  totalQuestions,
  answer,
  onAnswer,
  onNext,
  onClose,
  isLastQuestion,
}: QuestionStageProps) {
  const answered = isAnswered(question, answer);

  const handleMultipleChoiceToggle = (opt: string) => {
    const prev: string[] = answer ?? [];
    const next = prev.includes(opt)
      ? prev.filter((x: string) => x !== opt)
      : [...prev, opt];
    onAnswer(next);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
    <ProgressCircle
      total={totalQuestions}
      current={questionIndex}
    />       
   <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <Text style={styles.closeBtnIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.questionText}>{question.question}</Text>

      {/* Answer area */}
      <View style={styles.answerArea}>
        {question.type === "multiple_choice" && (
          <MultipleChoice
            options={question.options!}
            selected={answer ?? []}
            onToggle={handleMultipleChoiceToggle}
          />
        )}
        {question.type === "rating" && (
          <RatingScale
            labels={question.ratingLabels!}
            selected={answer ?? null}
            onSelect={onAnswer}
          />
        )}
        {question.type === "single_choice" && (
          <SingleChoice
            options={question.options!}
            selected={answer ?? null}
            onSelect={onAnswer}
          />
        )}
        {question.type === "text" && (
          <TextAnswer value={answer ?? ""} onChange={onAnswer} />
        )}
        {question.type === "nps" && (
          <NpsScale selected={answer ?? null} onSelect={onAnswer} />
        )}
      </View>

      {/* Next / Submit */}
      <View style={{ alignItems: "flex-end" }}>
        <BraneButton text={isLastQuestion ? "Submit" : "Next"} onPress={onNext} textColor="#013D25" backgroundColor="#D2F1E4" width={84} style={[styles.btn, !answered && styles.btnDisabled]}/>
      </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  index: {
    fontSize: 13,
    fontWeight: "700",
    // color: Colors.greenBtn,
  },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnIcon: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
  questionText: {
    fontSize: 21,
    fontWeight: "500",
    color: '#85808A',
    lineHeight: 28,
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  answerArea: {
    marginBottom: 24,
  },
  btn: {
    // backgroundColor: Colors.greenBtn,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnText: {
    // color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.2,
  },
});