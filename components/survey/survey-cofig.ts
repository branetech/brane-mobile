export type QuestionType =
  | "multiple_choice"
  | "rating"
  | "single_choice"
  | "text"
  | "nps";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  ratingLabels?: string[];
}

export type SurveyStage = "welcome" | "questions" | "loading" | "thankyou";

export const SURVEY_QUESTIONS: Question[] = [
  {
    id: "q1",
    type: "multiple_choice",
    question: "Question type 1\nthat cut accros the next line",
    options: ["Answer 1", "Answer 2", "Answer 3"],
  },
  {
    id: "q2",
    type: "rating",
    question: "Question type 2\nthat cut accros the next line",
    ratingLabels: ["Very Good", "Good", "Not Good", "Bad", "Worse"],
  },
  {
    id: "q3",
    type: "single_choice",
    question: "Question type 1\nthat cut accros the next line",
    options: ["Answer 1", "Answer 2", "Answer 3"],
  },
  {
    id: "q4",
    type: "text",
    question: "Question type 1\nthat cut accros the next line",
  },
  {
    id: "q5",
    type: "nps",
    question: "Question type 1\nthat cut accros the next line",
  },
];