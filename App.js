import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Quiz from './components/Quiz';
import Result from './components/Result';

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState('Physics');
  const [sectionScores, setSectionScores] = useState({
    Physics: 0,
    Chemistry: 0,
    Maths: 0,
  });
  const [sectionAnswers, setSectionAnswers] = useState({
    Physics: [],
    Chemistry: [],
    Maths: [],
  });
  const [completedSections, setCompletedSections] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [resetTimer, setResetTimer] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const timePerSection = 600; // 10 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0 && quizStarted && !showResult) {
      handleSectionSubmit(currentSection);
    }
  }, [timeLeft, quizStarted, showResult, currentSection]);

  useEffect(() => {
    if (resetTimer) {
      const timer = setTimeout(() => {
        setResetTimer(false);
      }, 100); // Short delay to allow Timer.js to process reset
      return () => clearTimeout(timer);
    }
  }, [resetTimer]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentSection('Physics');
    setSectionScores({
      Physics: 0,
      Chemistry: 0,
      Maths: 0,
    });
    setSectionAnswers({
      Physics: [],
      Chemistry: [],
      Maths: [],
    });
    setCompletedSections([]);
    setShowResult(false);
    setTimeLeft(timePerSection);
    setResetTimer(true);
    setStopTimer(false);
  };

  const handleSectionChange = (section) => {
    if (!completedSections.includes(section) && quizStarted) {
      setCurrentSection(section);
      setTimeLeft(timePerSection);
      setResetTimer(true);
      setStopTimer(false);
    }
  };

  const handleSectionSubmit = (section, score, answers) => {
    setSectionScores((prev) => ({ ...prev, [section]: score || 0 }));
    setSectionAnswers((prev) => ({ ...prev, [section]: answers || [] }));
    setCompletedSections((prev) => [...prev, section]);
    setStopTimer(true);

    if (section === 'Maths') {
      setShowResult(true);
      setQuizStarted(false);
    } else {
      const nextSection = section === 'Physics' ? 'Chemistry' : 'Maths';
      setCurrentSection(nextSection);
      setTimeLeft(timePerSection);
      setResetTimer(true);
      setStopTimer(false);
    }
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setCurrentSection('Physics');
    setSectionScores({
      Physics: 0,
      Chemistry: 0,
      Maths: 0,
    });
    setSectionAnswers({
      Physics: [],
      Chemistry: [],
      Maths: [],
    });
    setCompletedSections([]);
    setShowResult(false);
    setTimeLeft(timePerSection);
    setResetTimer(true);
    setStopTimer(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        {!quizStarted && !showResult ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">JEE Mains Mock Test</h1>
            <p className="mb-4">Test your knowledge in Physics, Chemistry, and Maths!</p>
            <button
              onClick={startQuiz}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Start Quiz
            </button>
          </div>
        ) : showResult ? (
          <Result
            sectionScores={sectionScores}
            sectionAnswers={sectionAnswers}
            onRestart={handleRestart}
          />
        ) : (
          <Quiz
            section={currentSection}
            onSectionSubmit={handleSectionSubmit}
            timePerSection={timePerSection}
            onSectionChange={handleSectionChange}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            stopTimer={stopTimer}
            resetTimer={resetTimer}
          />
        )}
      </div>
    </div>
  );
}

export default App;