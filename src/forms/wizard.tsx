import React, { useEffect, useState } from 'react';
import { application } from '../mock/wizard';
import type { Values } from '../types';
import {
  flattenQuestions,
  getVisibleQuestions,
  getUnansweredQuestions,
  isQuestionAnswered,
  findNextUnansweredQuestion,
  findPreviousUnansweredQuestion,
  loadValuesFromStorage,
  saveValuesToStorage,
} from '../utils/wizard';

export const STORAGE_KEY = 'wizard';

const Wizard: React.FC = () => {
  const [values, setValues] = useState<Values>(() => {
    const stored = loadValuesFromStorage(STORAGE_KEY);
    return stored || application.values;
  });

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Persist to localStorage whenever values change
  useEffect(() => {
    saveValuesToStorage({ values, STORAGE_KEY });
  }, [values]);

  // Flatten and filter questions
  const allQuestions = flattenQuestions(application.forms);
  const visibleQuestions = getVisibleQuestions(allQuestions, application.forms);
  const unansweredQuestions = getUnansweredQuestions(visibleQuestions, values);

  // Find first unanswered question for initial state
  const initialIndex = visibleQuestions.findIndex(
    (fq) => !isQuestionAnswered(values[fq.questionId])
  );

  const [currentIndex, setCurrentIndex] = useState<number>(
    initialIndex >= 0 ? initialIndex : 0
  );

  // Check if all questions are answered
  const allAnswered = unansweredQuestions.length === 0;

  const currentQuestion = visibleQuestions[currentIndex];

  // Navigation handlers
  const handleNext = () => {
    const nextIndex = findNextUnansweredQuestion(
      currentIndex,
      visibleQuestions,
      values
    );
    if (nextIndex !== null) {
      setCurrentIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    const prevIndex = findPreviousUnansweredQuestion(
      currentIndex,
      visibleQuestions,
      values
    );
    if (prevIndex !== null) {
      setCurrentIndex(prevIndex);
    }
  };

  // Reset functionality
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all answers?')) {
      setValues(application.values);
      localStorage.removeItem(STORAGE_KEY);
      setCurrentIndex(0);
    }
  };

  // Jump to specific question
  const handleJumpToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  // Skip current question
  const handleSkip = () => {
    handleNext();
  };

  // Value update handler
  const handleValueChange = (questionId: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Navigation state
  const canGoNext =
    findNextUnansweredQuestion(currentIndex, visibleQuestions, values) !== null;

  const canGoPrevious =
    findPreviousUnansweredQuestion(currentIndex, visibleQuestions, values) !==
    null;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canGoNext) {
      handleNext();
    }
  };

  if (allAnswered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            All Complete!
          </h2>
          <p className="text-gray-600">
            All visible questions have been answered.
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No questions available</p>
      </div>
    );
  }

  const currentValue = values[currentQuestion.questionId] ?? '';
  const progress =
    ((visibleQuestions.length - unansweredQuestions.length) /
      visibleQuestions.length) *
    100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Questions</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {visibleQuestions.map((q, idx) => {
            const isAnswered = isQuestionAnswered(values[q.questionId]);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.questionId}
                onClick={() => handleJumpToQuestion(idx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  isCurrent
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : isAnswered
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{q.formName}</div>
                    <div className="text-xs opacity-75 truncate">
                      {q.sectionName}
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    {isAnswered ? (
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
          >
            Reset All Answers
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
          {/* Toggle Sidebar Button */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute top-4 left-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-t-lg overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-800">
                {currentQuestion.formName}
              </h1>
              <span className="text-sm text-gray-500">
                {visibleQuestions.length - unansweredQuestions.length} /{' '}
                {visibleQuestions.length}
              </span>
            </div>
            <p className="text-gray-600">{currentQuestion.sectionName}</p>
          </div>

          {/* Question */}
          <div className="p-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Question ID: {currentQuestion.questionId}
            </label>
            <input
              type="text"
              value={typeof currentValue === 'string' ? currentValue : ''}
              onChange={(e) =>
                handleValueChange(currentQuestion.questionId, e.target.value)
              }
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Enter your answer..."
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-500">
              Press Enter to move to the next unanswered question
            </p>
          </div>

          {/* Navigation */}
          <div className="p-6 bg-gray-50 rounded-b-lg flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSkip}
                disabled={!canGoNext}
                className="px-6 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Skip
              </button>

              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
