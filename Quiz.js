import React, { useState, useEffect } from 'react';
import Question from './Question';
import Timer from './Timer';
import questionsData from '../data/question.json';

function SectionNav({ sections, currentSection, onSectionChange }) {
  return (
    <div className="bg-white p-4 shadow-md mb-4">
      <div className="flex justify-around">
        {sections.map((section, index) => {
          const sectionNumber = index + 1;
          const questionStart = section === 'Physics' ? 1 : section === 'Chemistry' ? 26 : 51;
          const questionEnd = section === 'Physics' ? 25 : section === 'Chemistry' ? 50 : 75;
          return (
            <button
              key={section}
              onClick={() => onSectionChange(section)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentSection === section
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors duration-200`}
            >
              Section-{sectionNumber}: {section} ({questionStart}-{questionEnd})
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Quiz({ section, onSectionSubmit, timePerSection, onSectionChange, timeLeft, setTimeLeft, stopTimer, resetTimer }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const sections = ['Physics', 'Chemistry', 'Maths'];

  useEffect(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsSubmitted(false);
    setError(null);
  }, [section]);

  const questions = questionsData ? questionsData[section] : [];
  if (!questionsData || questions.length !== 25) {
    setError('Failed to load questions data or incorrect question count. Ensure "../data/question.json" has 25 questions per section.');
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-red-100 text-red-600 p-6 rounded-lg shadow-md">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const handleAnswer = (selectedOption) => {
    if (isSubmitted) return;
    const question = questions[currentQuestion];
    let isCorrect = false;
    if (question.type === 'mcq') {
      isCorrect = selectedOption === question.correctAnswer;
    } else if (question.type === 'numerical') {
      isCorrect = selectedOption !== null && Math.abs(selectedOption - question.answer) < 0.01;
    }
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = { question: currentQuestion, selectedOption, isCorrect };
    setAnswers(newAnswers);
    localStorage.setItem(`${section}_answers`, JSON.stringify(newAnswers));
  };

  const handleNext = () => {
    const questionComponent = document.querySelector('div');
    const validate = questionComponent?.__proto__.validateSelection || (() => true);
    if (validate() && currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    const finalAnswers = questions.map((question, idx) => {
      const ans = answers[idx] || { question: idx, selectedOption: null, isCorrect: false };
      const isCorrect = question.type === 'mcq'
        ? ans.selectedOption === question.correctAnswer
        : question.type === 'numerical' && ans.selectedOption !== null
          ? Math.abs(ans.selectedOption - question.answer) < 0.01
          : false;
      return { question: idx, selectedOption: ans.selectedOption, isCorrect };
    });

    let score = 0;
    finalAnswers.forEach((ans, idx) => {
      const question = questions[idx];
      if (question.type === 'mcq') {
        if (ans.isCorrect) score += 4; // Correct MCQ: +4
        else if (ans.selectedOption !== null) score -= 1; // Incorrect MCQ: -1
      } else if (question.type === 'numerical') {
        if (ans.isCorrect) score += 4; // Correct numerical: +4
      }
    });

    localStorage.removeItem(`${section}_answers`);
    onSectionSubmit(section, score, finalAnswers);
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const sectionNumber = section === 'Physics' ? 1 : section === 'Chemistry' ? 2 : 3;
  const questionStart = section === 'Physics' ? 1 : section === 'Chemistry' ? 26 : 51;
  const questionEnd = section === 'Physics' ? 25 : section === 'Chemistry' ? 50 : 75;
  const currentQuestionNumber = questionStart + currentQuestion;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Section Navigation */}
      <SectionNav sections={sections} currentSection={section} onSectionChange={onSectionChange} />

      {/* Main Quiz Content */}
      <div className="flex flex-1">
        {/* Question List (Left Panel) */}
        <div className="w-1/4 bg-white p-4 overflow-y-auto border-r">
          <h3 className="text-xl font-bold mb-4">{section} Questions</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, idx) => {
              const questionNum = questionStart + idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`h-8 w-8 flex items-center justify-center rounded-full ${
                    answers[idx] ? 'bg-green-500 text-white' : 'bg-gray-300'
                  } ${currentQuestion === idx ? 'border-2 border-blue-500' : ''}`}
                >
                  {questionNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Panel and Timer (Right Panel) */}
        <div className="w-3/4 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Section-{sectionNumber}: {section} (Questions {questionStart}-{questionEnd}) - Question {currentQuestionNumber} of {questionEnd}
            </h2>
            <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} stopTimer={stopTimer} resetTimer={resetTimer} />
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <Question
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionNumber}
            isLastQuestion={currentQuestion === questions.length - 1}
          />

          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrevious}
              className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                currentQuestion === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className={`bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 ${
                  isSubmitted ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitted}
              >
                Submit {section} Section
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;