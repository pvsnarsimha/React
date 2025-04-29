import React, { useState, useEffect } from 'react';

function Result({ sectionScores, sectionAnswers, onRestart }) {
  const [questionsData, setQuestionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const module = await import('../data/question.json');
        setQuestionsData(module.default);
        setLoading(false);
      } catch (err) {
        try {
          const response = await fetch('/data/question.json');
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          setQuestionsData(data);
          setLoading(false);
        } catch (fetchErr) {
          setError(
            `Failed to load results. Please check the "../data/question.json" file (or "/data/question.json" in public folder) and try again. Errors: Import failed: ${err.message}, Fetch failed: ${fetchErr.message}`
          );
          setLoading(false);
        }
      }
    };
    loadQuestions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !questionsData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
        <div className="bg-red-100 text-red-600 p-8 rounded-xl shadow-lg">
          {error || 'Failed to load results data. Please try again.'}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-md"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const sections = ['Physics', 'Chemistry', 'Maths'];
  const totalScore = sections.reduce((sum, section) => sum + (sectionScores[section] || 0), 0);
  const totalQuestions = 75; // 25 questions per section x 3 sections
  const maxScore = totalQuestions * 4; // 75 questions, each worth 4 points max
  const percentage = ((totalScore / maxScore) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12 transform hover:scale-105 transition-transform duration-500">
          <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 animate-pulse">
            Exam Summary Report
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Total Score</h3>
              <p className="text-4xl font-bold">{totalScore} / {maxScore}</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl text-white shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Percentage</h3>
              <p className="text-4xl font-bold">{percentage}%</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Total Questions</h3>
              <p className="text-4xl font-bold">{totalQuestions}</p>
            </div>
          </div>
        </div>

        {/* Section-wise Analysis */}
        {sections.map((section, sectionIndex) => {
          const sectionScore = sectionScores[section] || 0;
          const answers = sectionAnswers[section] || [];
          const sectionNumber = sectionIndex + 1;
          const questionStart = section === 'Physics' ? 1 : section === 'Chemistry' ? 26 : 51;
          const questionEnd = section === 'Physics' ? 25 : section === 'Chemistry' ? 50 : 75;

          return (
            <div key={section} className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Section-{sectionNumber}: {section} (Questions {questionStart}-{questionEnd})
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Score: <span className="font-semibold text-blue-600">{sectionScore}</span> / {questionsData[section].length * 4}
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Answer Analysis</h3>
                {questionsData[section].map((question, index) => {
                  const ans = answers.find(a => a.question === index) || { selectedOption: null, isCorrect: false };
                  const isCorrect = ans.isCorrect;
                  const score = question.type === 'mcq'
                    ? (isCorrect ? 4 : ans.selectedOption !== null ? -1 : 0)
                    : (isCorrect ? 4 : 0);
                  const explanation = question.explanation || `Explanation: The correct answer is ${question.correctAnswer || question.answer}.`;
                  const questionNum = questionStart + index;

                  return (
                    <div key={index} className="mb-6 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <p className="text-gray-800 font-medium">
                        <strong>Q{questionNum}:</strong> {question.text}
                      </p>
                      <p className={isCorrect ? 'text-green-600' : ans.selectedOption === null ? 'text-gray-600' : 'text-red-600'}>
                        Your Answer: {ans.selectedOption === null ? 'Not Attempted' : ans.selectedOption} {isCorrect ? `(Correct, +${score})` : ans.selectedOption === null ? '' : `(Incorrect, ${score})`}
                      </p>
                      <p className="text-blue-600">
                        Correct Answer: {question.correctAnswer || question.answer}
                      </p>
                      <p className="text-gray-700 italic mt-2">{explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Restart Button */}
        <div className="text-center">
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300 shadow-lg transform hover:scale-105"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;