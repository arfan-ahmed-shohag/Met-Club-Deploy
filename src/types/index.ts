export type QuestionType =
  | "hotspot"
  | "true_false"
  | "fill_in_the_blanks"
  | "image_selection"
  | "match_the_following"
  | "mcq"
  | "arrange_sequence"
  | "puzzle"
  | "drag_drop_categorize";

export interface HotspotItem {
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
}

export interface ImageOption {
  id: string;
  label: string;
  emoji?: string;
  image?: string;
}

export interface SequenceOption {
  id: string;
  text: string;
  emoji?: string;
  image?: string;
}

export interface MatchLeftItem {
  id: string;
  label: string;
  emoji?: string;
}

export interface CategorizeItem {
  id: string;
  text: string;
}

export interface BaseQuestion {
  id: number;
  chapterId: number;
  difficulty: string;
  type: QuestionType;
  title: string;
  description: string;
  image: string | null;
  audio?: string;
}

export interface HotspotQuestionData extends BaseQuestion {
  type: "hotspot";
  question: string;
  hotspots: HotspotItem[];
  correctAnswer: string[];
}

export interface TrueFalseQuestionData extends BaseQuestion {
  type: "true_false";
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface FillBlankQuestionData extends BaseQuestion {
  type: "fill_in_the_blanks";
  statement?: string;
  question?: string;
  options: string[];
  correctAnswer: string;
}

export interface ImageSelectionQuestionData extends BaseQuestion {
  type: "image_selection";
  question: string;
  options: ImageOption[];
  correctAnswer: string;
}

export interface MatchQuestionData extends BaseQuestion {
  type: "match_the_following";
  question: string;
  leftItems: MatchLeftItem[];
  rightItems: string[];
  correctAnswer: Record<string, string>;
}

export interface MCQQuestionData extends BaseQuestion {
  type: "mcq";
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface SequenceQuestionData extends BaseQuestion {
  type: "arrange_sequence";
  question: string;
  options: SequenceOption[];
  correctAnswer: string[];
}

export interface PuzzleQuestionData extends BaseQuestion {
  type: "puzzle";
  question: string;
  options: SequenceOption[];
  correctAnswer: string[];
}

export interface CategorizeQuestionData extends BaseQuestion {
  type: "drag_drop_categorize";
  question: string;
  itemsToCategorize: CategorizeItem[];
  categories: string[];
  correctAnswer: Record<string, string[]>;
}

export type QuizQuestion =
  | HotspotQuestionData
  | TrueFalseQuestionData
  | FillBlankQuestionData
  | ImageSelectionQuestionData
  | MatchQuestionData
  | MCQQuestionData
  | SequenceQuestionData
  | PuzzleQuestionData
  | CategorizeQuestionData;

export type QuizAnswer =
  string | string[] | Record<string, string> | Record<string, string[]> | null;

export type QuizAnswers = Record<number, QuizAnswer>;

// Question header strip
export interface QuestionHeaderProps {
  title: string;
  qNum: number;
  total: number;
  audioUrl?: string;
  text: string;
}

export interface QuestionRendererProps {
  q: QuizQuestion;
  answer: QuizAnswer;
  onChange: (value: QuizAnswer) => void;
}

export interface QuizProps {
  onFinish?: (answers: QuizAnswers) => void;
}

export interface HotspotQuestionProps {
  q: HotspotQuestionData;
  answer: QuizAnswer;
  onChange: (value: QuizAnswer) => void;
}

export interface TrueFalseQuestionProps {
  q: TrueFalseQuestionData;
  answer: QuizAnswer;
  onChange: (value: QuizAnswer) => void;
}

export interface FillBlanksQuestionProps {
  q: FillBlankQuestionData;
  answer: QuizAnswer;
  onChange: (value: QuizAnswer) => void;
}

export interface ImageSelectionQuestionProps {
  q: ImageSelectionQuestionData;
  answer: QuizAnswer;
  onChange: (value: QuizAnswer) => void;
}

export interface MCQQuestionProps {
  q: MCQQuestionData;
  answer: QuizAnswer;
  onChange: (value: QuizAnswer) => void;
}

export interface SequenceQuestionProps {
  q: SequenceQuestionData;
  answer: QuizAnswer;
  onChange: (value: QuizAnswer) => void;
}

export interface PuzzleQuestionProps {
  q: PuzzleQuestionData;
  answer: QuizAnswer;
  onChange: (value: QuizAnswer) => void;
}

export interface MatchLeftItem {
  id: string;
  label: string;
  emoji?: string;
  image?: string;
}

export interface MatchQuestionData {
  id: number;
  question: string;
  leftItems: MatchLeftItem[];
  rightItems: string[];
}

export interface CategorizeItem {
  id: string;
  text: string;
}

export interface CategorizeQuestionData {
  id: number;
  question: string;
  itemsToCategorize: CategorizeItem[];
  categories: string[];
}

export interface MatchQuestionProps {
  q: MatchQuestionData;
  answer: Record<string, string> | null;
  onChange: (value: Record<string, string> | null) => void;
}

export interface CategorizeQuestionProps {
  q: CategorizeQuestionData;
  answer: Record<string, string[]> | null;
  onChange: (value: Record<string, string[]> | null) => void;
}
