import React, { useState } from 'react';

function Question({ question, onAnswer, questionNumber, isLastQuestion }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [numericalAnswer, setNumericalAnswer] = useState('');
  const [error, setError] = useState('');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setError('');
    onAnswer(option);
  };

  const handleNumericalChange = (e) => {
    const value = e.target.value;
    setNumericalAnswer(value);
    setError('');
    onAnswer(value ? parseFloat(value) : null);
  };

  const validateSelection = () => {
    if (question.type === 'mcq' && !selectedOption && !isLastQuestion) {
      setError('Please select an option before proceeding.');
      return false;
    }
    if (question.type === 'numerical' && !numericalAnswer && !isLastQuestion) {
      setError('Please enter a numerical answer before proceeding.');
      return false;
    }
    return true;
  };

  // Attach validateSelection to the component instance
  Question.prototype.validateSelection = validateSelection;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{questionNumber}. {question.text}</h3>
      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded-md text-sm">
          {error}
        </div>
      )}
      {question.type === 'mcq' ? (
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                selectedOption === option
                  ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } shadow-sm`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <input
            type="number"
            value={numericalAnswer}
            onChange={handleNumericalChange}
            placeholder="Enter your answer"
            className="p-4 rounded-lg border-2 border-gray-300 focus:border-blue-500 outline-none transition-all duration-200"
          />
        </div>
      )}
    </div>
  );
}

export default Question;