export type QuestionValue = string | null | undefined | string[];

export interface Values {
  [questionId: string]: QuestionValue;
}

export interface Question {
  id: string;
  hide: boolean;
}

export interface Section {
  id: string;
  name: string;
  questions: Question[];
}

export interface Form {
  id: string;
  name: string;
  sections: Section[];
}

export interface Application {
  values: Values;
  forms: Form[];
}

export interface FlatQuestion {
  questionId: string;
  formName: string;
  sectionName: string;
  formIndex: number;
  sectionIndex: number;
  questionIndex: number;
}