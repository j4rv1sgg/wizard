import type { Form, FlatQuestion, QuestionValue, Values } from "../types";

/**
 * Flattens all questions from the application structure in order
 */
export function flattenQuestions(forms: Form[]): FlatQuestion[] {
  const flattened: FlatQuestion[] = [];

  forms.forEach((form, formIndex) => {
    form.sections.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        flattened.push({
          questionId: question.id,
          formName: form.name,
          sectionName: section.name,
          formIndex,
          sectionIndex,
          questionIndex
        });
      });
    });
  });

  return flattened;
}

/**
 * Filters out hidden questions
 */
export function getVisibleQuestions(
  flatQuestions: FlatQuestion[],
  forms: Form[]
): FlatQuestion[] {
  return flatQuestions.filter(fq => {
    const form = forms[fq.formIndex];
    const section = form.sections[fq.sectionIndex];
    const question = section.questions[fq.questionIndex];
    return !question.hide;
  });
}

/**
 * Checks if a question is answered
 */
export function isQuestionAnswered(value: QuestionValue): boolean {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  return true;
}

/**
 * Gets all unanswered visible questions
 */
export function getUnansweredQuestions(
  visibleQuestions: FlatQuestion[],
  values: Values
): FlatQuestion[] {
  return visibleQuestions.filter(
    fq => !isQuestionAnswered(values[fq.questionId])
  );
}

/**
 * Finds the next unanswered visible question after the current index
 */
export function findNextUnansweredQuestion(
  currentIndex: number,
  visibleQuestions: FlatQuestion[],
  values: Values
): number | null {
  for (let i = currentIndex + 1; i < visibleQuestions.length; i++) {
    if (!isQuestionAnswered(values[visibleQuestions[i].questionId])) {
      return i;
    }
  }
  return null;
}

/**
 * Finds the previous unanswered visible question before the current index
 */
export function findPreviousUnansweredQuestion(
  currentIndex: number,
  visibleQuestions: FlatQuestion[],
  values: Values
): number | null {
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (!isQuestionAnswered(values[visibleQuestions[i].questionId])) {
      return i;
    }
  }
  return null;
}


export function loadValuesFromStorage(STORAGE_KEY: string): Values | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

export function saveValuesToStorage({values, STORAGE_KEY}: {values: Values, STORAGE_KEY: string}): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}
